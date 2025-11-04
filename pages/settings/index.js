import React, { useState } from "react";

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    // General Settings
    societyName: "Green Valley Apartments",
    address: "123 Main Street, City, State 12345",
    contactEmail: "admin@greenvalley.com",
    contactPhone: "+1-555-0123",

    // Member Settings
    allowMemberRegistration: true,
    autoApproveMembers: false,
    maxMembersPerUnit: 4,

    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    maintenanceAlerts: true,
    eventReminders: true,

    // Billing Settings
    currency: "USD",
    lateFeePercentage: 5,
    dueDate: 5, // 5th of every month

    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 30, // minutes
  });

  const [activeTab, setActiveTab] = useState("general");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Settings saved:", settings);
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Error saving settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: "general", label: "General" },
    { id: "members", label: "Members" },
    { id: "notifications", label: "Notifications" },
    { id: "billing", label: "Billing" },
    { id: "security", label: "Security" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Society Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your society's configuration and preferences
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Settings Form */}
          <form onSubmit={handleSubmit} className="p-6">
            {/* General Settings */}
            {activeTab === "general" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  General Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Society Name
                    </label>
                    <input
                      type="text"
                      name="societyName"
                      value={settings.societyName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={settings.contactEmail}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={settings.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      name="contactPhone"
                      value={settings.contactPhone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Member Settings */}
            {activeTab === "members" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Member Settings
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Allow Member Registration
                      </label>
                      <p className="text-sm text-gray-500">
                        Allow new members to register for the society
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      name="allowMemberRegistration"
                      checked={settings.allowMemberRegistration}
                      onChange={handleInputChange}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Auto-approve Members
                      </label>
                      <p className="text-sm text-gray-500">
                        Automatically approve new member registrations
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      name="autoApproveMembers"
                      checked={settings.autoApproveMembers}
                      onChange={handleInputChange}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Members Per Unit
                    </label>
                    <input
                      type="number"
                      name="maxMembersPerUnit"
                      value={settings.maxMembersPerUnit}
                      onChange={handleInputChange}
                      min="1"
                      max="10"
                      className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Notification Settings
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email Notifications
                      </label>
                      <p className="text-sm text-gray-500">
                        Receive important updates via email
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      name="emailNotifications"
                      checked={settings.emailNotifications}
                      onChange={handleInputChange}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        SMS Notifications
                      </label>
                      <p className="text-sm text-gray-500">
                        Receive important updates via SMS
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      name="smsNotifications"
                      checked={settings.smsNotifications}
                      onChange={handleInputChange}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Maintenance Alerts
                      </label>
                      <p className="text-sm text-gray-500">
                        Get notified about maintenance schedules
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      name="maintenanceAlerts"
                      checked={settings.maintenanceAlerts}
                      onChange={handleInputChange}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Event Reminders
                      </label>
                      <p className="text-sm text-gray-500">
                        Get reminders for society events
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      name="eventReminders"
                      checked={settings.eventReminders}
                      onChange={handleInputChange}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Billing Settings */}
            {activeTab === "billing" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Billing Settings
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency
                    </label>
                    <select
                      name="currency"
                      value={settings.currency}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="INR">INR (₹)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Late Fee Percentage
                    </label>
                    <input
                      type="number"
                      name="lateFeePercentage"
                      value={settings.lateFeePercentage}
                      onChange={handleInputChange}
                      min="0"
                      max="20"
                      step="0.5"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date (Day of Month)
                    </label>
                    <input
                      type="number"
                      name="dueDate"
                      value={settings.dueDate}
                      onChange={handleInputChange}
                      min="1"
                      max="28"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Security Settings
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Two-Factor Authentication
                      </label>
                      <p className="text-sm text-gray-500">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      name="twoFactorAuth"
                      checked={settings.twoFactorAuth}
                      onChange={handleInputChange}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Session Timeout (minutes)
                    </label>
                    <input
                      type="number"
                      name="sessionTimeout"
                      value={settings.sessionTimeout}
                      onChange={handleInputChange}
                      min="5"
                      max="120"
                      className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
