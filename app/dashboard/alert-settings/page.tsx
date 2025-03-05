"use client";

import { useState, useEffect } from "react";
import { toast, Toaster } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Pencil from "@/public/pencil.png";
import Image from "next/image";
import AlertMask from "@/public/alertmask.png"
import { TeamsSvg } from "@/components/svgs/TeamsSvg";
import { SlackSvg } from "@/components/svgs/SlackSvg";
import { WebhookSvg } from "@/components/svgs/Webhook";
import { APISvg } from "@/components/svgs/APISvg";
import { BASE_URL } from "@/utils/baseUrl";

export default function AlertSettings() {
  const [keyword, setKeyword] = useState("");
  const [frequency, setFrequency] = useState("");
  const [selectedAlertTypes, setSelectedAlertTypes] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentIntegration, setCurrentIntegration] = useState<any>(null);
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasExistingSettings, setHasExistingSettings] = useState(false);
  const accessToken = localStorage.getItem("access_token");

  const alertTypes = [
    { id: "ransomware", label: "Ransomware" },
    { id: "phishing", label: "Phishing" },
    { id: "data-breach", label: "Data Breach" },
    { id: "malware", label: "Malware" },
  ];

  const [integrationTypes, setIntegrationTypes] = useState([
    {
      id: "teams",
      label: "Microsoft teams",
      connected: false,
      svg: <TeamsSvg />,
    },
    {
      id: "slack",
      label: "Slack",
      connected: false,
      svg: <SlackSvg />,
    },
    {
      id: "webhook",
      label: "Webhook",
      connected: false,
      svg: <WebhookSvg />,
    },
    {
      id: "api",
      label: "API",
      connected: false,
      svg: <APISvg />,
    },
  ]);

  // Fetch existing alert settings when component mounts
  useEffect(() => {
    const fetchAlertSettings = async () => {
      try {
        const response = await fetch(`${BASE_URL}/alerts`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch alert settings');
        }

        const data = await response.json();

        // If alert settings exist, populate the form and set flag
        if (data.status === 'success' && data.data) {
          setKeyword(data.data.keyword || '');
          setSelectedAlertTypes(data.data.alert_types || []);
          setFrequency(data.data.frequency || '');
          setHasExistingSettings(true);
        }
      } catch (error) {
        console.error('Error fetching alert settings:', error);
        // Don't show error to user as this might be their first time setting up alerts
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlertSettings();
  }, [accessToken]);

  const toggleAlertType = (typeId: string) => {
    setSelectedAlertTypes((prev) =>
      prev.includes(typeId)
        ? prev.filter((id) => id !== typeId)
        : [...prev, typeId]
    );
  };

  const openConnectModal = (integration: any) => {
    setCurrentIntegration(integration);
    setApiKey("");
    setApiSecret("");
    setIsModalOpen(true);
  };

  const openEditModal = (integration: any) => {
    setCurrentIntegration(integration);
    // In a real app, you might fetch existing values from an API
    // For now, we'll just use placeholder values
    setApiKey("existing-api-key");
    setApiSecret("existing-api-secret");
    setIsEditModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setCurrentIntegration(null);
  };

  const handleSaveIntegration = () => {
    setIntegrationTypes((prevIntegrations) =>
      prevIntegrations.map((integration) =>
        integration.id === currentIntegration.id
          ? { ...integration, connected: true }
          : integration
      )
    );

    toast.success(`${currentIntegration.label} Connected`, {
      description: `${currentIntegration.label} has been successfully connected.`,
      duration: 3000,
    });

    closeModal();
  };

  const handleUpdateIntegration = () => {
    // In a real app, you would update the integration with new credentials
    
    toast.success(`${currentIntegration.label} Updated`, {
      description: `${currentIntegration.label} credentials have been updated.`,
      duration: 3000,
    });
    
    closeModal();
  };

  const handleDisconnectIntegration = () => {
    setIntegrationTypes((prevIntegrations) =>
      prevIntegrations.map((integration) =>
        integration.id === currentIntegration.id
          ? { ...integration, connected: false }
          : integration
      )
    );

    toast.error(`${currentIntegration.label} Disconnected`, {
      description: `${currentIntegration.label} has been disconnected.`,
      duration: 3000,
    });
    
    closeModal();
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!keyword.trim()) {
      setError("Please enter a keyword or threat actor name");
      return;
    }
    
    if (selectedAlertTypes.length === 0) {
      setError("Please select at least one alert type");
      return;
    }
    
    if (!frequency) {
      setError("Please select an alert frequency");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare the data for API request
      const alertSettingsData = {
        keyword: keyword.trim(),
        alertTypes: selectedAlertTypes,
        frequency,
      };
      
      // Send data to the API
      const response = await fetch(`${BASE_URL}/alerts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(alertSettingsData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to save alert settings');
      }
      
      const responseData = await response.json();
      
      if (responseData.status === 'success') {
        // Update the flag to indicate user now has settings
        setHasExistingSettings(true);
        
        // Show success message based on create/update
        const actionVerb = responseData.message.includes("created") ? "created" : "updated";
        
        toast.success(`Alert Settings ${actionVerb.charAt(0).toUpperCase() + actionVerb.slice(1)}`, {
          description: `Your alert settings have been successfully ${actionVerb}.`,
          duration: 3000,
        });
      } else {
        throw new Error(responseData.message || 'Failed to save alert settings');
      }
    } catch (error) {
      console.error("Error saving alert settings:", error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save alert settings. Please try again.';
      
      toast.error("Error", {
        description: errorMessage,
        action: {
          label: "Try Again",
          onClick: () => handleSubmit(e),
        },
      });
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-white min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading alert settings...</div>
      </div>
    );
  }

  return (
    <div className="text-white min-h-screen">
      {/* Add the Sonner Toaster component */}
      <Toaster position="top-right" richColors />
      
      <h1 className="text-3xl font-bold mb-6">Custom Alert Settings</h1>

      <form onSubmit={handleSubmit}>
        <div className="bg-[#121229] rounded-[26px] p-6 space-y-8" style={{
          backgroundImage: `url(${AlertMask.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          border: "1px solid #22263C",
        }}>
          {error && (
            <div className="bg-red-500 text-white p-3 rounded-lg text-center">
              {error}
            </div>
          )}

          <div>
            <p className="text-base font-medium mb-2">
              Search Keyword or threat actor
            </p>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center">
                <svg
                  className="h-5 w-5 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <Input
                className="pl-10 py-6 text-white w-full"
                style={{
                  borderRadius: "136.083px",
                  border: "1.389px solid rgba(255, 255, 255, 0.15)",
                  background: "rgba(255, 255, 255, 0.11)",
                }}
                placeholder="Enter keyword or threat actor name"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="border-t border-[#2a2a40] pt-6">
            <div className="flex justify-between items-start">
              <div className="w-1/2">
                <p className="text-base font-medium">Alert Type:</p>
                <p className="text-sm text-gray-400">
                  Choose on which type of attack you need to get alerted
                </p>
              </div>
              <div className="flex flex-col space-y-4 w-1/2">
                {alertTypes.map((type) => (
                  <div key={type.id} className={`flex items-center p-2 rounded `}>
                    <Checkbox
                      id={type.id}
                      checked={selectedAlertTypes.includes(type.id)}
                      className={
                        selectedAlertTypes.includes(type.id)
                          ? "bg-purple-600 border-purple-600"
                          : ""
                      }
                      onCheckedChange={() => toggleAlertType(type.id)}
                    />
                    <label
                      htmlFor={type.id}
                      className="ml-2 text-sm cursor-pointer"
                      onClick={() => toggleAlertType(type.id)}
                    >
                      {type.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-[#2a2a40] pt-6">
            <div className="flex justify-between items-start">
              <div className="flex justify-between items-start mb-4 w-1/2">
                <div>
                  <p className="text-base font-medium">Integration Type:</p>
                  <p className="text-sm text-gray-400">
                    Choose on which platform the attack need to get alerted
                  </p>
                </div>
              </div>
              <div className="space-y-3 w-1/2">
                {integrationTypes.map((integration) => (
                  <div
                    key={integration.id}
                    className="flex items-center justify-between bg-[#1e1e38] p-3 rounded-lg"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 flex items-center justify-center mr-3">
                        {integration.svg}
                      </div>
                      <span>{integration.label}</span>
                    </div>
                    {integration.connected ? (
                      <div className="flex items-center">
                        <span className="bg-purple-900 text-white text-xs px-3 py-1 rounded-full mr-2">
                          Connected
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full text-gray-400 hover:text-white"
                          onClick={() => openEditModal(integration)}
                        >
                          <Image
                            src={Pencil}
                            alt="pencil"
                            width={20}
                            height={20}
                          />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        className="bg-transparent text-white hover:bg-[#2a2a40]"
                        style={{
                          borderRadius: "91px",
                          border: "1px solid rgba(255, 255, 255, 0.60)",
                        }}
                        onClick={() => openConnectModal(integration)}
                      >
                        Connect +
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-[#2a2a40] pt-6 flex justify-between items-start">
            <div className="w-1/2">
              <p className="text-base font-medium">Alert Frequency:</p>
              <p className="text-sm text-gray-400">
                Choose how often you want to receive alerts
              </p>
            </div>
            <div className="w-1/2">
              <Select value={frequency} onValueChange={setFrequency} required>
                <SelectTrigger className="bg-[#1e1e38] border-none text-white mt-2 py-6">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent className="bg-[#1e1e38] border-[#2a2a40] text-white">
                  <SelectItem value="immediate">Immediately</SelectItem>
                  <SelectItem value="daily">Daily Digest</SelectItem>
                  <SelectItem value="weekly">Weekly Summary</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border-t border-[#2a2a40] pt-6 flex justify-end">
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : hasExistingSettings ? "Update Alert Settings" : "Save Alert Settings"}
            </Button>
          </div>
        </div>
      </form>

      {/* Integration Connection Modal */}
      {isModalOpen && currentIntegration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#121229] rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className="flex items-center mb-6">
              <div className="w-10 h-10 flex items-center justify-center mr-3">
                {currentIntegration.svg}
              </div>
              <h2 className="text-xl font-semibold">
                {currentIntegration.label} Integration
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Add API Key</label>
                <input
                  type="text"
                  placeholder="Type API key here"
                  className="w-full bg-[#1e1e38] border-none rounded-lg p-3 text-white"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Add API Secret</label>
                <textarea
                  placeholder="Type API secret here"
                  className="w-full bg-[#1e1e38] border-none rounded-lg p-3 text-white h-32 resize-none"
                  value={apiSecret}
                  onChange={(e) => setApiSecret(e.target.value)}
                />
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  type="button"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8"
                  onClick={handleSaveIntegration}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Integration Edit Modal */}
      {isEditModalOpen && currentIntegration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#121229] rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className="flex items-center mb-6">
              <div className="w-10 h-10 flex items-center justify-center mr-3">
                {currentIntegration.svg}
              </div>
              <h2 className="text-xl font-semibold">
                Edit {currentIntegration.label} Integration
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Update API Key</label>
                <input
                  type="text"
                  placeholder="Type API key here"
                  className="w-full bg-[#1e1e38] border-none rounded-lg p-3 text-white"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Update API Secret</label>
                <textarea
                  placeholder="Type API secret here"
                  className="w-full bg-[#1e1e38] border-none rounded-lg p-3 text-white h-32 resize-none"
                  value={apiSecret}
                  onChange={(e) => setApiSecret(e.target.value)}
                />
              </div>

              <div className="flex justify-between mt-6">
                <Button
                  type="button"
                  className="bg-transparent hover:bg-[#2a2a40] border border-gray-600 text-white px-6"
                  onClick={handleDisconnectIntegration}
                >
                  Disconnect
                </Button>
                <Button
                  type="button"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8"
                  onClick={handleUpdateIntegration}
                >
                  Update
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}