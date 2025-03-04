"use client";

import { useState } from "react";
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
  const [submitSuccess, setSubmitSuccess] = useState(false);

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

    closeModal();
  };

  const handleUpdateIntegration = () => {
    // In a real app, you would update the integration with new credentials
    // For now, we'll just close the modal
    closeModal();
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!keyword.trim()) {
      alert("Please enter a keyword or threat actor name");
      return;
    }
    
    if (selectedAlertTypes.length === 0) {
      alert("Please select at least one alert type");
      return;
    }
    
    if (!frequency) {
      alert("Please select an alert frequency");
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
      
      // Simulating an API call
      console.log("Submitting data to API:", alertSettingsData);
      
      // In a real application, you would use fetch or axios to send the data
      // Example:
      // const response = await fetch('/api/alert-settings', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(alertSettingsData),
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to save alert settings');
      // }
      
      // For demo purposes, we'll simulate a successful response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving alert settings:", error);
      alert("Failed to save alert settings. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Custom Alert Settings</h1>

      <form onSubmit={handleSubmit}>
        <div className="bg-[#121229] rounded-[26px] p-6 space-y-8" style={{
          backgroundImage: `url(${AlertMask.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          border: "1px solid #22263C",
        }}>
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
                          : "border-purple-600"
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
              {isSubmitting ? "Saving..." : "Save Alert Settings"}
            </Button>
          </div>
          
          {submitSuccess && (
            <div className="bg-green-600 text-white p-3 rounded-lg text-center">
              Alert settings saved successfully!
            </div>
          )}
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
                  onClick={() => {
                    // Add confirmation dialog in a real app
                    setIntegrationTypes((prevIntegrations) =>
                      prevIntegrations.map((integration) =>
                        integration.id === currentIntegration.id
                          ? { ...integration, connected: false }
                          : integration
                      )
                    );
                    closeModal();
                  }}
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