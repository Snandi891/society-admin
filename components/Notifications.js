import React, { useEffect, useState, useRef } from "react";
import {
  FiBell,
  FiCheck,
  FiClock,
  FiAlertCircle,
  FiChevronRight,
  FiSettings,
  FiX,
  FiUser,
  FiHome,
  FiMessageSquare,
  FiTrash2,
  FiRefreshCw,
} from "react-icons/fi";

const NotificationsDropdown = () => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [currentTime, setCurrentTime] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredNotification, setHoveredNotification] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setNotificationsOpen(false);
        setShowClearConfirm(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Function to update live current IST time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        weekday: "short",
        day: "numeric",
        month: "short",
      });
      setCurrentTime(now);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch only 2 latest complaints from API
  useEffect(() => {
    const fetchLatestNotifications = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/complaints/get");
        if (!res.ok) throw new Error("Failed to fetch complaints");
        const data = await res.json();

        // Sort by creation date (newest first) and take only 2 latest
        const sortedData = data.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 2);

        const mapped = sortedData.map((c, index) => {
          const subjectMatch = c.complaintText.match(/Subject:\s*(.*)/i);
          const subject = subjectMatch
            ? subjectMatch[1].split("\n")[0]
            : "Maintenance Request";

          const types = ["Complaint", "Maintenance", "Service", "Emergency"];
          const priorities = ["low", "medium", "high", "critical"];
          const categories = [
            "Cleaning",
            "Electrical",
            "Plumbing",
            "Security",
            "General",
          ];

          return {
            id: c._id + "-" + lastRefresh, // Add refresh timestamp to make unique
            title:
              subject.length > 50 ? subject.substring(0, 50) + "..." : subject,
            description: `${c.flatNumber} - ${c.name}`,
            createdAt: new Date(c.createdAt).toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
              hour: "2-digit",
              minute: "2-digit",
              month: "short",
              day: "numeric",
            }),
            timeAgo: getTimeAgo(new Date(c.createdAt)),
            read: c.status === "Approved",
            status: c.status,
            type: types[index % types.length],
            priority: priorities[index % priorities.length],
            category: categories[index % categories.length],
            avatar: `https://images.unsplash.com/photo-15${index}34170733-1db0b${index}1b19?w=40&h=40&fit=crop&crop=face`,
            originalId: c._id,
          };
        });

        setNotifications(mapped);
      } catch (err) {
        console.error(err);
        // Fallback to empty array if API fails
        setNotifications([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestNotifications();
  }, [lastRefresh]); // Re-fetch when lastRefresh changes

  const getTimeAgo = (date) => {
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return "1w+ ago";
  };

  const getPriorityConfig = (priority) => {
    const config = {
      critical: {
        color: "from-red-500 to-pink-500",
        bg: "bg-gradient-to-r from-red-500 to-pink-500",
        label: "Critical",
      },
      high: {
        color: "from-orange-500 to-red-500",
        bg: "bg-gradient-to-r from-orange-500 to-red-500",
        label: "High",
      },
      medium: {
        color: "from-amber-500 to-orange-500",
        bg: "bg-gradient-to-r from-amber-500 to-orange-500",
        label: "Medium",
      },
      low: {
        color: "from-blue-500 to-cyan-500",
        bg: "bg-gradient-to-r from-blue-500 to-cyan-500",
        label: "Low",
      },
    };
    return config[priority] || config.medium;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      Cleaning: <FiHome className="text-green-500" />,
      Electrical: <FiAlertCircle className="text-amber-500" />,
      Plumbing: <FiMessageSquare className="text-blue-500" />,
      Security: <FiUser className="text-purple-500" />,
      General: <FiBell className="text-gray-500" />,
    };
    return icons[category] || <FiBell className="text-gray-500" />;
  };

  // Handle Clear All functionality
  const handleClearAll = () => {
    setShowClearConfirm(true);
  };

  const confirmClearAll = () => {
    setNotifications([]);
    setShowClearConfirm(false);
  };

  const cancelClearAll = () => {
    setShowClearConfirm(false);
  };

  // Handle Mark All as Read
  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  // Handle individual notification actions
  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const handleDeleteNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  // Handle manual refresh to get latest 2 notifications
  const handleRefresh = () => {
    setLastRefresh(Date.now());
  };

  const pendingCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Premium Notification Bell Button */}
      <button
        className="relative p-3 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-500 group hover:scale-105 hover:bg-gradient-to-br hover:from-white hover:to-blue-50/70"
        onClick={() => setNotificationsOpen(!notificationsOpen)}
      >
        <div className="relative">
          <FiBell
            size={22}
            className="text-gray-600 group-hover:text-blue-600 transition-all duration-500 group-hover:rotate-12"
          />
          {pendingCount > 0 && (
            <>
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse border-2 border-white shadow-lg"></span>
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-ping border-2 border-white"></span>
            </>
          )}
        </div>
      </button>

      {/* Premium Notifications Dropdown */}
      {notificationsOpen && (
        <div className="absolute right-0 mt-3 w-[420px] bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl py-4 z-50 border border-white/20 animate-floatIn origin-top-right">
          {/* Premium Header */}
          <div className="px-6 py-4 border-b border-white/20 bg-gradient-to-r from-gray-50/50 to-blue-50/50 rounded-t-3xl">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold  text-xl bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                  Latest Notifications
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Showing 2 most recent alerts
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold px-3 py-1.5 rounded-full shadow-lg">
                    {pendingCount} new
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur-sm opacity-50"></div>
                </div>
                <button
                  onClick={handleRefresh}
                  className="p-2 rounded-xl hover:bg-white/50 transition-all duration-300 hover:scale-110 hover:rotate-180"
                  title="Refresh notifications"
                >
                  <FiRefreshCw
                    className="text-gray-400 hover:text-blue-600"
                    size={18}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Live Time & Actions */}
          <div className="px-6 py-3 border-b border-white/20 bg-white/60 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse shadow-sm"></div>
              <span className="text-xs font-medium text-gray-600">
                {currentTime} IST
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-all duration-300 hover:scale-105 px-2 py-1 rounded-lg hover:bg-blue-50"
              >
                Mark all read
              </button>
              {notifications.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-xs text-gray-500 hover:text-red-600 font-medium transition-all duration-300 hover:scale-105 px-2 py-1 rounded-lg hover:bg-red-50 flex items-center space-x-1"
                >
                  <FiTrash2 size={12} />
                  <span>Clear all</span>
                </button>
              )}
            </div>
          </div>

          {/* Clear All Confirmation Dialog */}
          {showClearConfirm && (
            <div className="px-6 py-4 border-b border-white/20 bg-orange-50/80 backdrop-blur-sm animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <FiAlertCircle className="text-orange-600" size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-orange-800">
                      Clear all notifications?
                    </p>
                    <p className="text-xs text-orange-600">
                      This action cannot be undone
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={cancelClearAll}
                    className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-800 bg-white rounded-lg border border-gray-200 transition-all duration-200 hover:scale-105"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmClearAll}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-red-500 to-orange-500 rounded-lg shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Premium Notifications List - Only 2 Latest */}
          <div className="max-h-96 overflow-y-auto premium-scrollbar">
            {isLoading ? (
              // Premium Loading Skeleton - Only 2 items
              [...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="px-6 py-4 border-b border-white/20 animate-pulse"
                >
                  <div className="flex space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl animate-shimmer"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4 animate-shimmer"></div>
                      <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2 animate-shimmer"></div>
                      <div className="flex space-x-2">
                        <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20 animate-shimmer"></div>
                        <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16 animate-shimmer"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : notifications.length > 0 ? (
              // Show only the 2 latest notifications
              notifications.slice(0, 2).map((notification, index) => {
                const priorityConfig = getPriorityConfig(notification.priority);
                return (
                  <div
                    key={notification.id}
                    className={`px-6 py-4 border-b border-white/20 transition-all duration-500 transform hover:scale-[1.02] group cursor-pointer relative overflow-hidden ${
                      !notification.read
                        ? "bg-gradient-to-r from-blue-50/30 to-indigo-50/20"
                        : "hover:bg-gray-50/50"
                    }`}
                    onMouseEnter={() => setHoveredNotification(notification.id)}
                    onMouseLeave={() => setHoveredNotification(null)}
                  >
                    {/* Latest Badge for newest notification */}
                    {index === 0 && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
                          LATEST
                        </span>
                      </div>
                    )}

                    {/* Priority Indicator */}
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${priorityConfig.color}`}
                    ></div>

                    {/* Notification Content */}
                    <div className="flex items-start space-x-4">
                      {/* Avatar with Category Icon */}
                      <div className="relative">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-sm">
                          {getCategoryIcon(notification.category)}
                        </div>
                        <div
                          className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${priorityConfig.bg} flex items-center justify-center`}
                        ></div>
                      </div>

                      {/* Text Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <p
                            className={`font-semibold text-sm leading-5 transition-all duration-300 ${
                              notification.read
                                ? "text-gray-700"
                                : "text-gray-900"
                            } group-hover:text-gray-900`}
                          >
                            {notification.title}
                          </p>
                          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {!notification.read && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkAsRead(notification.id);
                                }}
                                className="p-1 rounded-lg hover:bg-white shadow-sm transition-all duration-300 hover:scale-110"
                                title="Mark as read"
                              >
                                <FiCheck size={14} className="text-green-500" />
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteNotification(notification.id);
                              }}
                              className="p-1 rounded-lg hover:bg-white shadow-sm transition-all duration-300 hover:scale-110"
                              title="Delete notification"
                            >
                              <FiX
                                size={14}
                                className="text-gray-400 hover:text-red-500"
                              />
                            </button>
                          </div>
                        </div>

                        <p className="text-xs text-gray-500 mt-1 font-medium">
                          {notification.description}
                        </p>

                        {/* Meta Information */}
                        <div className="flex items-center space-x-3 mt-3">
                          <span className="text-xs text-gray-400 flex items-center space-x-1">
                            <FiClock size={12} />
                            <span>{notification.timeAgo}</span>
                          </span>

                          {/* Status Badge */}
                          <span
                            className={`px-2.5 py-1 text-xs font-semibold rounded-full inline-flex items-center space-x-1 transition-all duration-300 ${
                              notification.status === "Pending"
                                ? "bg-amber-100 text-amber-800 border border-amber-200"
                                : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            }`}
                          >
                            {notification.status === "Pending" ? (
                              <FiClock size={10} />
                            ) : (
                              <FiCheck size={10} />
                            )}
                            <span>{notification.status}</span>
                          </span>

                          {/* Category Badge */}
                          <span className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full border border-gray-200">
                            {notification.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Hover Action Arrow */}
                    <div
                      className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-all duration-500 ${
                        hoveredNotification === notification.id
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 translate-x-2"
                      }`}
                    >
                      <div className="bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg border border-white/20">
                        <FiChevronRight className="text-blue-600" size={16} />
                      </div>
                    </div>

                    {/* Unread Indicator */}
                    {!notification.read && (
                      <div className="absolute top-4 right-12 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                );
              })
            ) : (
              // Premium Empty State
              <div className="px-6 py-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <FiBell className="text-gray-300" size={32} />
                </div>
                <h4 className="font-bold text-gray-700 text-lg mb-2">
                  All clear! 🎉
                </h4>
                <p className="text-gray-500 text-sm max-w-xs mx-auto">
                  No new notifications. You're all caught up!
                </p>
                <button
                  onClick={handleRefresh}
                  className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center space-x-2 mx-auto"
                >
                  <FiRefreshCw size={14} />
                  <span>Check for new alerts</span>
                </button>
              </div>
            )}
          </div>

          {/* Refresh Footer */}
          <div className="px-6 py-4 border-t border-white/20 bg-gradient-to-r from-gray-50/50 to-blue-50/50 rounded-b-3xl">
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-2">
                Showing {notifications.length} of 2 latest notifications
              </p>
              <button
                onClick={handleRefresh}
                className="w-full text-center font-semibold text-gray-700 hover:text-gray-900 transition-all duration-300 py-3 rounded-xl hover:bg-white/50 border border-transparent hover:border-white/30 flex items-center justify-center space-x-2 group"
              >
                <FiRefreshCw className="transform group-hover:rotate-180 transition-transform duration-500" />
                <span>Refresh for latest alerts</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Advanced CSS Animations */}
      <style jsx>{`
        .premium-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .premium-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 10px;
        }
        .premium-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #cbd5e1, #94a3b8);
          border-radius: 10px;
        }
        .premium-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #94a3b8, #64748b);
        }
        @keyframes floatIn {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(20px) rotateX(-10deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0) rotateX(0);
          }
        }
        @keyframes shimmer {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: 200px 0;
          }
        }
        .animate-floatIn {
          animation: floatIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .animate-shimmer {
          background: linear-gradient(
            90deg,
            #f0f0f0 25%,
            #e0e0e0 50%,
            #f0f0f0 75%
          );
          background-size: 200px 100%;
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default NotificationsDropdown;
