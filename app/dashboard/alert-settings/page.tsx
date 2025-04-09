/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { toast, Toaster } from "sonner";
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
import AlertMask from "@/public/alertmask.png";
import { TeamsSvg } from "@/components/svgs/TeamsSvg";
import { SlackSvg } from "@/components/svgs/SlackSvg";
import { WebhookSvg } from "@/components/svgs/Webhook";
import { APISvg } from "@/components/svgs/APISvg";
import { BASE_URL } from "@/utils/baseUrl";

export default function AlertSettings() {
  const [countries, setCountries] = useState<string[]>([]);
  const [threatActors, setThreatActors] = useState<string[]>([]);
  const [frequency, setFrequency] = useState("");
  const [selectedAlertTypes, setSelectedAlertTypes] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentIntegration, setCurrentIntegration] = useState<any>(null);
  const [botToken, setBotToken] = useState("");
  const [channelName, setChannelName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isIntegrationSubmitting, setIsIntegrationSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasExistingSettings, setHasExistingSettings] = useState(false);
  const accessToken = localStorage.getItem("access_token");
  const [keywords, setKeywords] = useState<Array<{type: string, value: string}>>([]);
  const [newKeywordType, setNewKeywordType] = useState<string>("country");
  const [newKeywordValue, setNewKeywordValue] = useState<string>("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

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
      available: false,
    },
    {
      id: "slack",
      label: "Slack",
      connected: false,
      svg: <SlackSvg />,
      available: true,
    },
    {
      id: "webhook",
      label: "Webhook",
      connected: false,
      svg: <WebhookSvg />,
      available: false,
    },
    {
      id: "api",
      label: "API",
      connected: false,
      svg: <APISvg />,
      available: true,
    },
  ]);

  // Function to reset form values to defaults
  const resetToDefaults = () => {
    setKeywords([]);
    setSelectedAlertTypes([]);
    setFrequency("immediate");
    setHasExistingSettings(false);
  };

  // Fetch existing alert settings when component mounts
  useEffect(() => {
    const fetchAlertSettings = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/alerts`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = await response.json();

        if (data.status === "success" && data.data) {
          // Keywords are now already in array format
          setKeywords(data.data.keywords || []);
          
          // Get alert types
          if (data.data.alertTypes) {
            setSelectedAlertTypes(data.data.alertTypes || []);
          } else if (data.data.alert_types) {
            setSelectedAlertTypes(data.data.alert_types || []);
          } else {
            setSelectedAlertTypes([]);
          }
          
          setFrequency(data.data.frequency || "immediate");
          setHasExistingSettings(true);

          // Check if integration secrets exist and update the UI accordingly
          const updatedIntegrations = [...integrationTypes];

          if (data.data.slack_secrets) {
            const slackIndex = updatedIntegrations.findIndex(
              (integration) => integration.id === "slack"
            );
            if (slackIndex !== -1) {
              updatedIntegrations[slackIndex].connected = true;
            }
          }

          if (data.data.api_secrets) {
            const apiIndex = updatedIntegrations.findIndex(
              (integration) => integration.id === "api"
            );
            if (apiIndex !== -1) {
              updatedIntegrations[apiIndex].connected = true;
              setApiKey(data.data.api_secrets.api_key || "");
            }
          }

          setIntegrationTypes(updatedIntegrations);
        } else {
          console.log("No alert settings found, using defaults");
          resetToDefaults();
        }
      } catch (error) {
        console.error("Error fetching alert settings:", error);
        toast.error("Error loading alert settings");
        resetToDefaults();
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlertSettings();
  }, [accessToken]);

  // Fetch threat actors from the groups endpoint
  useEffect(() => {
    const fetchThreatActors = async () => {
      try {
        const response = await fetch(`${BASE_URL}/groups`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch threat actors");
        }

        const data = await response.json();
        
        if (data.groups && data.groups.length > 0) {
          // Extract unique titles from the groups
          const actorNamesSet = new Set<string>();
          data.groups.forEach((group: any) => {
            if (group.title) actorNamesSet.add(group.title);
          });
          const actorNames = Array.from(actorNamesSet).sort();
          setThreatActors(actorNames);
        }
      } catch (error) {
        console.error("Error fetching threat actors:", error);
        toast.error("Failed to load threat actors", {
          duration: 3000,
        });
      }
    };

    // Initialize the list of common countries
    const commonCountries = [
      "Afghanistan", "Albania", "Algeria", "Argentina", "Australia", 
      "Austria", "Belarus", "Belgium", "Brazil", "Bulgaria", "Cambodia", 
      "Canada", "Chile", "China", "Colombia", "Cuba", "Czech Republic", 
      "Denmark", "Egypt", "Ethiopia", "Finland", "France", "Germany", 
      "Greece", "Hungary", "Iceland", "India", "Indonesia", "Iran", 
      "Iraq", "Ireland", "Israel", "Italy", "Japan", "Kazakhstan", 
      "Kenya", "Latvia", "Lebanon", "Libya", "Malaysia", "Mexico", 
      "Morocco", "Netherlands", "New Zealand", "Nigeria", "North Korea", 
      "Norway", "Pakistan", "Philippines", "Poland", "Portugal", 
      "Romania", "Russia", "Saudi Arabia", "Serbia", "Singapore", 
      "South Africa", "South Korea", "Spain", "Sweden", "Switzerland", 
      "Syria", "Taiwan", "Thailand", "Turkey", "Ukraine", 
      "United Arab Emirates", "United Kingdom", "United States", "Vietnam"
    ];
    
    setCountries(commonCountries);
    fetchThreatActors();
  }, [accessToken]);

  const toggleAlertType = (typeId: string) => {
    setSelectedAlertTypes((prev) =>
      prev.includes(typeId)
        ? prev.filter((id) => id !== typeId)
        : [...prev, typeId]
    );
  };

  const openConnectModal = (integration: any) => {
    if (!integration.available) {
      toast.info(`${integration.label} Integration`, {
        description: `${integration.label} integration will be available soon. Currently, only Slack is supported.`,
        duration: 3000,
      });
      return;
    }

    setCurrentIntegration(integration);
    setBotToken("");
    setChannelName("");
    setIsModalOpen(true);
  };

  const openEditModal = (integration: any) => {
    if (!integration.available) {
      toast.info(`${integration.label} Integration`, {
        description: `${integration.label} integration will be available soon. Currently, only Slack is supported.`,
        duration: 3000,
      });
      return;
    }

    setCurrentIntegration(integration);
    // Fetch existing values from the API
    fetchIntegrationCredentials(integration.id);
    setIsEditModalOpen(true);
  };

  const fetchIntegrationCredentials = async (integrationId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/alerts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch integration settings");
      }

      const data = await response.json();

      if (integrationId === "slack" && data.status === "success" && data.data?.slack_secrets) {
        setBotToken(data.data.slack_secrets.bot_token || "");
        setChannelName(data.data.slack_secrets.channel_name || "");
      } else if (integrationId === "api" && data.status === "success" && data.data?.api_secrets) {
        setApiKey(data.data.api_secrets.api_key || "");
        setShowApiKey(false);
      }
    } catch (error) {
      console.error("Error fetching integration credentials:", error);
      toast.error("Error", {
        description: "Failed to fetch integration credentials. Please try again.",
        duration: 3000,
      });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setCurrentIntegration(null);
    setBotToken("");
    setChannelName("");
    setApiKey("");
    setShowApiKey(false);
    setIsCopied(false);
    setIsIntegrationSubmitting(false);
  };

  const handleGenerateApiKey = async () => {
    setIsGeneratingKey(true);
    try {
      const response = await fetch(`${BASE_URL}/alerts/generate-api-key`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to generate API key");
      }

      const data = await response.json();
      setApiKey(data.data.api_key);
      toast.success("API Key Generated", {
        description: "Your new API key has been generated successfully.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error generating API key:", error);
      toast.error("Error", {
        description: "Failed to generate API key. Please try again.",
        duration: 3000,
      });
    } finally {
      setIsGeneratingKey(false);
    }
  };

  const handleSaveIntegration = async () => {
    if (currentIntegration.id === "slack") {
      if (!botToken.trim()) {
        toast.error("Validation Error", {
          description: "Bot Token is required.",
          duration: 3000,
        });
        return;
      }

      if (!channelName.trim()) {
        toast.error("Validation Error", {
          description: "Channel Name is required.",
          duration: 3000,
        });
        return;
      }

      if (!botToken.trim().startsWith("xoxb-")) {
        toast.error("Validation Error", {
          description:
            "Invalid Bot Token format. Slack Bot Tokens should start with 'xoxb-'",
          duration: 4000,
        });
        return;
      }
    } else if (currentIntegration.id === "api") {
      if (!apiKey.trim()) {
        toast.error("Validation Error", {
          description: "Please generate an API key first.",
          duration: 3000,
        });
        return;
      }
    }

    setIsIntegrationSubmitting(true);

    try {
      const integrationData = {
        integration: currentIntegration.id,
        ...(currentIntegration.id === "slack" && {
          slack_secrets: {
            bot_token: botToken.trim(),
            channel_name: channelName.trim(),
          },
        }),
        ...(currentIntegration.id === "api" && {
          api_secrets: {
            api_key: apiKey.trim(),
          },
        }),
      };

      const response = await fetch(`${BASE_URL}/alerts/integrations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(integrationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to save integration settings");
      }

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
    } catch (error) {
      console.error("Error saving integration:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to save integration. Please try again.";

      toast.error(`${currentIntegration.label} Connection Error`, {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setIsIntegrationSubmitting(false);
    }
  };

  const handleUpdateIntegration = async () => {
    if (currentIntegration.id === "slack") {
      if (!botToken.trim()) {
        toast.error("Validation Error", {
          description: "Bot Token is required.",
          duration: 3000,
        });
        return;
      }

      if (!channelName.trim()) {
        toast.error("Validation Error", {
          description: "Channel Name is required.",
          duration: 3000,
        });
        return;
      }

      if (!botToken.trim().startsWith("xoxb-")) {
        toast.error("Validation Error", {
          description:
            "Invalid Bot Token format. Slack Bot Tokens should start with 'xoxb-'",
          duration: 4000,
        });
        return;
      }
    } else if (currentIntegration.id === "api") {
      if (!apiKey.trim()) {
        toast.error("Validation Error", {
          description: "API Key is required. Please regenerate if needed.",
          duration: 3000,
        });
        return;
      }
    }

    setIsIntegrationSubmitting(true);

    try {
      const integrationData = {
        integration: currentIntegration.id,
        ...(currentIntegration.id === "slack" && {
          slack_secrets: {
            bot_token: botToken.trim(),
            channel_name: channelName.trim(),
          },
        }),
        ...(currentIntegration.id === "api" && {
          api_secrets: {
            api_key: apiKey.trim(),
          },
        }),
      };

      const response = await fetch(`${BASE_URL}/alerts/integrations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(integrationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update integration settings");
      }

      toast.success(`${currentIntegration.label} Updated`, {
        description: `${currentIntegration.label} integration has been updated successfully.`,
        duration: 3000,
      });

      closeModal();
    } catch (error) {
      console.error("Error updating integration:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update integration. Please try again.";

      toast.error(`${currentIntegration.label} Update Error`, {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setIsIntegrationSubmitting(false);
    }
  };

  const handleDisconnectIntegration = async () => {
    setIsIntegrationSubmitting(true);

    try {
      const response = await fetch(
        `${BASE_URL}/alerts/integrations/disconnect`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ integration: currentIntegration.id }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to disconnect integration");
      }

      setIntegrationTypes((prevIntegrations) =>
        prevIntegrations.map((integration) =>
          integration.id === currentIntegration.id
            ? { ...integration, connected: false }
            : integration
        )
      );

      toast.success(`${currentIntegration.label} Disconnected`, {
        description: `${currentIntegration.label} has been disconnected.`,
        duration: 3000,
      });

      closeModal();
    } catch (error) {
      console.error("Error disconnecting integration:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to disconnect integration. Please try again.";

      toast.error("Error", {
        description: errorMessage,
        duration: 3000,
      });
    } finally {
      setIsIntegrationSubmitting(false);
    }
  };

  // Add this function to handle adding new keywords
  const handleAddKeyword = () => {
    if (newKeywordValue && newKeywordValue !== "none") {
      setKeywords([...keywords, { type: newKeywordType, value: newKeywordValue.trim() }]);
      setNewKeywordValue("");
      setHasUnsavedChanges(true);
    }
  };

  // Add this function to handle removing keywords
  const handleRemoveKeyword = (index: number) => {
    setKeywords(keywords.filter((_, i) => i !== index));
    setHasUnsavedChanges(true);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (keywords.length === 0) {
      toast.error("Please add at least one keyword.");
      return;
    }
    
    if (!frequency) {
      toast.error("Please select an alert frequency.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare the data for API request
      const alertSettingsData = {
        keywords: keywords,
        alertTypes: selectedAlertTypes,
        frequency: frequency,
      };
      
      // Send data to the API
      const response = await fetch(`${BASE_URL}/alerts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(alertSettingsData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to save alert settings");
      }

      const responseData = await response.json();

      if (responseData.status === "success") {
        setHasExistingSettings(true);
        setHasUnsavedChanges(false);
        const actionVerb = responseData.message.includes("created") ? "created" : "updated";
        toast.success(
          `Alert Settings ${actionVerb.charAt(0).toUpperCase() + actionVerb.slice(1)}`,
          {
            description: `Your alert settings have been successfully ${actionVerb}.`,
            duration: 3000,
          }
        );
      } else {
        throw new Error(responseData.message || "Failed to save alert settings");
      }
    } catch (error) {
      console.error("Error saving alert settings:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to save alert settings. Please try again.";

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

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    toast.success("API Key Copied", {
      description: "The API key has been copied to your clipboard.",
      duration: 2000,
    });
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
        <div
          className="bg-[#121229] rounded-[26px] p-6 space-y-8"
          style={{
            backgroundImage: `url(${AlertMask.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            border: "1px solid #22263C",
          }}
        >
          {error && (
            <div className="bg-red-500 text-white p-3 rounded-lg text-center">
              {error}
            </div>
          )}

          <div>
            <p className="text-base font-medium mb-2">Keywords</p>
            <div className="space-y-4">
              {/* Display existing keywords */}
              {keywords.map((keyword, index) => (
                <div key={index} className="flex items-center gap-2 bg-[#1e1e38] p-3 rounded-lg">
                  <div className="flex-1">
                    <span className="text-sm text-gray-400">{keyword.type === "country" ? "Country" : "Threat Actor"}:</span>
                    <span className="ml-2 text-white">{keyword.value}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full text-gray-400 hover:text-white"
                    onClick={() => handleRemoveKeyword(index)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
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
                  </Button>
                </div>
              ))}
              
              {/* Add new keyword form */}
              <div className="flex gap-2">
                <Select value={newKeywordType} onValueChange={setNewKeywordType}>
                  <SelectTrigger className="bg-[#1e1e38] border-none text-white py-6 w-[200px]">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1e1e38] border-[#2a2a40] text-white">
                    <SelectItem value="country">Country</SelectItem>
                    <SelectItem value="threat_actor">Threat Actor</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select 
                  value={newKeywordValue} 
                  onValueChange={setNewKeywordValue}
                >
                  <SelectTrigger className="bg-[#1e1e38] border-none text-white py-6 flex-1">
                    <SelectValue placeholder={`Select ${newKeywordType === "country" ? "country" : "threat actor"}`} />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1e1e38] border-[#2a2a40] text-white max-h-80">
                    {newKeywordType === "country" ? (
                      <>
                        <SelectItem value="none">None</SelectItem>
                        {countries.map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </>
                    ) : (
                      <>
                        <SelectItem value="none">None</SelectItem>
                        {threatActors.map((actor) => (
                          <SelectItem key={actor} value={actor}>
                            {actor}
                          </SelectItem>
                        ))}
                      </>
                    )}
                  </SelectContent>
                </Select>
                
                <Button
                  type="button"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4"
                  onClick={handleAddKeyword}
                  disabled={!newKeywordValue.trim()}
                >
                  Add
                </Button>
              </div>
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
                  <div
                    key={type.id}
                    className={`flex items-center p-2 rounded `}
                  >
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
                  <p className="text-xs text-purple-400 mt-2">
                    Note: Currently, only Slack integration is available. Other
                    integrations will be coming soon.
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
                      {!integration.available && (
                        <span className="ml-2 text-xs px-2 py-1 bg-gray-700 rounded-full">
                          Coming soon
                        </span>
                      )}
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
                          disabled={!integration.available}
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
                        className={`${
                          integration.available
                            ? "bg-transparent text-white hover:bg-[#2a2a40]"
                            : "bg-gray-800 text-gray-400 opacity-70 cursor-not-allowed"
                        }`}
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
              {isSubmitting ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </div>
              ) : hasExistingSettings ? (
                hasUnsavedChanges ? "Save Changes" : "Alert Settings Saved"
              ) : (
                "Save Alert Settings"
              )}
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
              {currentIntegration?.id === "slack" ? (
                <>
                  <div>
                    <label className="block text-sm mb-2">Channel Name</label>
                    <input
                      type="text"
                      placeholder="alerts"
                      className="w-full bg-[#1e1e38] border-none rounded-lg p-3 text-white"
                      value={channelName}
                      onChange={(e) => setChannelName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Update Bot Token</label>
                    <textarea
                      placeholder="Type Bot Token here"
                      className="w-full bg-[#1e1e38] border-none rounded-lg p-3 text-white h-32 resize-none"
                      value={botToken}
                      onChange={(e) => setBotToken(e.target.value)}
                    />
                  </div>
                </>
              ) : currentIntegration?.id === "api" ? (
                <div>
                  <label className="block text-sm mb-2">API Key</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type={showApiKey ? "text" : "password"}
                      placeholder="Your API key will appear here"
                      className="flex-1 bg-[#1e1e38] border-none rounded-lg p-3 text-white"
                      value={apiKey}
                      readOnly
                    />
                    <Button
                      type="button"
                      className="bg-[#1e1e38] hover:bg-[#2a2a40] text-white"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      )}
                    </Button>
                    <Button
                      type="button"
                      className="bg-[#1e1e38] hover:bg-[#2a2a40] text-white"
                      onClick={handleCopyApiKey}
                    >
                      {isCopied ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                      )}
                    </Button>
                  </div>
                  <Button
                    type="button"
                    className="bg-purple-600 hover:bg-purple-700 text-white mt-4"
                    onClick={handleGenerateApiKey}
                    disabled={isGeneratingKey}
                  >
                    {isGeneratingKey ? "Regenerating..." : "Regenerate API Key"}
                  </Button>
                  <p className="text-xs text-gray-400 mt-2">
                    Regenerating will create a new API key and invalidate the old one.
                  </p>
                </div>
              ) : null}

              <div className="flex justify-end mt-6">
                <Button
                  type="button"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8"
                  onClick={handleSaveIntegration}
                  disabled={isIntegrationSubmitting}
                >
                  {isIntegrationSubmitting ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </div>
                  ) : (
                    "Save"
                  )}
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
              {currentIntegration?.id === "slack" ? (
                <>
                  <div>
                    <label className="block text-sm mb-2">Channel Name</label>
                    <input
                      type="text"
                      placeholder="alerts"
                      className="w-full bg-[#1e1e38] border-none rounded-lg p-3 text-white"
                      value={channelName}
                      onChange={(e) => setChannelName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Update Bot Token</label>
                    <textarea
                      placeholder="Type Bot Token here"
                      className="w-full bg-[#1e1e38] border-none rounded-lg p-3 text-white h-32 resize-none"
                      value={botToken}
                      onChange={(e) => setBotToken(e.target.value)}
                    />
                  </div>
                </>
              ) : currentIntegration?.id === "api" ? (
                <div>
                  <label className="block text-sm mb-2">API Key</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type={showApiKey ? "text" : "password"}
                      placeholder="Your API key will appear here"
                      className="flex-1 bg-[#1e1e38] border-none rounded-lg p-3 text-white"
                      value={apiKey}
                      readOnly
                    />
                    <Button
                      type="button"
                      className="bg-[#1e1e38] hover:bg-[#2a2a40] text-white"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      )}
                    </Button>
                    <Button
                      type="button"
                      className="bg-[#1e1e38] hover:bg-[#2a2a40] text-white"
                      onClick={handleCopyApiKey}
                    >
                      {isCopied ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                      )}
                    </Button>
                  </div>
                  <Button
                    type="button"
                    className="bg-purple-600 hover:bg-purple-700 text-white mt-4"
                    onClick={handleGenerateApiKey}
                    disabled={isGeneratingKey}
                  >
                    {isGeneratingKey ? "Regenerating..." : "Regenerate API Key"}
                  </Button>
                  <p className="text-xs text-gray-400 mt-2">
                    Regenerating will create a new API key and invalidate the old one.
                  </p>
                </div>
              ) : null}

              <div className="flex justify-between mt-6">
                <Button
                  type="button"
                  className="bg-transparent hover:bg-[#2a2a40] border border-gray-600 text-white px-6"
                  onClick={handleDisconnectIntegration}
                  disabled={isIntegrationSubmitting}
                >
                  {isIntegrationSubmitting ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Disconnecting...
                    </div>
                  ) : (
                    "Disconnect"
                  )}
                </Button>
                <Button
                  type="button"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8"
                  onClick={handleUpdateIntegration}
                  disabled={isIntegrationSubmitting}
                >
                  {isIntegrationSubmitting ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Updating...
                    </div>
                  ) : (
                    "Update"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
