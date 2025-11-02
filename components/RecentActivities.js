import { useEffect, useState } from "react";
import {
  FiRefreshCw,
  FiClock,
  FiUser,
  FiMegaphone,
  FiZap,
  FiActivity,
} from "react-icons/fi";

const RecentActivities = () => {
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [spin, setSpin] = useState(false);
  const [glow, setGlow] = useState(false);
  const [pulse, setPulse] = useState(false);

  const formatIndiaTime = (utcTime) => {
    return new Date(utcTime).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const fetchRecentActivities = async () => {
    try {
      setLoading(true);
      setSpin(true);
      setGlow(true);
      setPulse(true);

      const membersRes = await fetch("/api/members");
      const membersData = await membersRes.json();
      const membersArray = Array.isArray(membersData)
        ? membersData
        : membersData.data || [];
      const membersActivities = membersArray.map((member) => ({
        user: member.name,
        action: "joined the society",
        time: new Date(member.createdAt).toISOString(),
        displayTime: formatIndiaTime(member.createdAt),
        type: "member",
        id: member._id,
      }));

      const announcementsRes = await fetch("/api/announcements/get");
      const announcementsData = await announcementsRes.json();
      const announcementsArray = announcementsData.announcements || [];
      const announcementsActivities = announcementsArray.map(
        (announcement) => ({
          user: announcement.message,
          action: `posted by ${announcement.createdBy}`,
          time: new Date(announcement.createdAt).toISOString(),
          displayTime: formatIndiaTime(announcement.createdAt),
          type: "announcement",
          id: announcement._id,
        })
      );

      const combined = [...membersActivities, ...announcementsActivities]
        .sort((a, b) => new Date(b.time) - new Date(a.time))
        .slice(0, 11);

      setRecentActivities([]);
      setTimeout(() => setRecentActivities(combined), 50);
    } catch (error) {
      console.error("Failed to fetch recent activities:", error);
    } finally {
      setLoading(false);
      setTimeout(() => setSpin(false), 500);
      setTimeout(() => setGlow(false), 1000);
      setTimeout(() => setPulse(false), 1500);
    }
  };

  useEffect(() => {
    fetchRecentActivities();
  }, []);

  // Safe icon component to handle undefined imports
  const SafeIcon = ({ icon: IconComponent, size = 20, className = "" }) => {
    if (!IconComponent || typeof IconComponent === "undefined") {
      return <span className={className}>•</span>;
    }
    return <IconComponent size={size} className={className} />;
  };

  return (
    <div className="relative bg-gradient-to-br from-white via-blue-50 to-emerald-50 rounded-3xl shadow-2xl p-6 overflow-hidden border border-white/60 transform transition-all duration-500 hover:shadow-3xl">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-r from-emerald-200/30 to-cyan-200/30 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      {/* Header Section */}
      <div className="relative z-10 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-2 bg-white rounded-2xl border border-white shadow-lg transform transition-transform duration-300 group-hover:scale-110">
                <img
                  src="https://i.pinimg.com/1200x/db/11/33/db1133556694d54dbf06618abc6e783e.jpg"
                  alt="Activity Icon"
                  className="w-8 h-8 rounded-xl object-cover"
                />
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent flex items-center gap-2">
                <FiActivity className="text-emerald-500" /> Recent Activities
              </h3>
              <p className="text-gray-600 text-sm flex items-center gap-1">
                <SafeIcon icon={FiClock} size={14} />
                Live updates from your community
              </p>
            </div>
          </div>

          <button
            onClick={fetchRecentActivities}
            className={`relative group flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-500 transform hover:scale-105 shadow-lg ${
              spin
                ? "animate-pulse bg-gradient-to-r from-emerald-500 to-cyan-500"
                : "bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500"
            } text-white ${
              glow ? "shadow-[0_0_25px_5px_rgba(34,197,94,0.4)]" : ""
            }`}
            title="Refresh Activities"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            <SafeIcon
              icon={FiRefreshCw}
              className={`w-4 h-4 transition-transform duration-700 z-10 ${
                loading ? "animate-spin" : spin ? "rotate-180" : ""
              }`}
            />
            <span className="z-10">Refresh</span>
          </button>
        </div>
      </div>

      {/* Activities List */}
      <div className="relative z-10 space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {recentActivities.length === 0 && !loading ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl mb-3">
              <SafeIcon icon={FiClock} className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium">
              No recent activities
            </p>
            <p className="text-gray-400 text-sm">Activities will appear here</p>
          </div>
        ) : (
          recentActivities.map((activity, index) => (
            <div
              key={activity.id || index}
              className={`group relative overflow-hidden rounded-2xl border border-white/80 bg-white/60 backdrop-blur-sm p-4 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-xl ${
                index === 0
                  ? "ring-2 ring-emerald-200/60 bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200 shadow-lg"
                  : "hover:border-emerald-100/60"
              } animate-fade-in-slide`}
              style={{
                animationDelay: `${index * 80}ms`,
              }}
            >
              {/* Highlight bar for latest activity */}
              {index === 0 && (
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-400 to-cyan-400"></div>
              )}

              <div className="flex items-start gap-4">
                {/* Icon Container */}
                <div
                  className={`relative group-hover:scale-110 transition-transform duration-300 ${
                    activity.type === "member"
                      ? "bg-gradient-to-br from-blue-100 to-cyan-100"
                      : "bg-gradient-to-br from-amber-100 to-yellow-100"
                  } rounded-2xl p-3 shadow-sm`}
                >
                  <div
                    className={`relative z-10 ${
                      activity.type === "member"
                        ? "text-blue-600"
                        : "text-amber-600"
                    }`}
                  >
                    <SafeIcon
                      icon={activity.type === "member" ? FiUser : FiMegaphone}
                      size={20}
                    />
                  </div>
                  {/* Pulsing dot for new activities */}
                  {index < 3 && (
                    <div
                      className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                        activity.type === "member"
                          ? "bg-blue-400"
                          : "bg-amber-400"
                      } animate-pulse`}
                    ></div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-semibold text-gray-800 line-clamp-2 group-hover:text-gray-900 transition-colors ${
                      index === 0 ? "text-lg" : "text-base"
                    }`}
                  >
                    {activity.user}
                  </p>

                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        activity.type === "member"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {activity.type === "member"
                        ? "Membership"
                        : "Announcement"}
                    </span>

                    <span className="text-gray-600 text-sm font-medium">
                      {activity.action}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-2 text-gray-500 text-sm">
                    <SafeIcon icon={FiClock} size={14} />
                    <span className="font-medium">{activity.displayTime}</span>
                    {index === 0 && (
                      <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                        NEW
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/0 group-hover:from-white/20 group-hover:to-emerald-50/20 transition-all duration-300 rounded-2xl"></div>
            </div>
          ))
        )}
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-md rounded-3xl flex items-center justify-center z-20">
          <div className="text-center space-y-4">
            <div className="relative inline-block">
              <div className="w-20 h-20 border-4 border-emerald-100/50 rounded-3xl"></div>
              <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-emerald-500 rounded-3xl animate-spin"></div>
              <div
                className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-r-cyan-500 rounded-3xl animate-spin"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-b-blue-500 rounded-3xl animate-spin"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <SafeIcon
                icon={FiZap}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-emerald-500 animate-pulse"
              />
            </div>
            <div className="space-y-2">
              <p className="text-gray-700 font-bold text-lg animate-pulse">
                Updating Activities...
              </p>
              <p className="text-gray-500 text-sm">
                Fetching the latest community updates
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer Stats */}
      {recentActivities.length > 0 && (
        <div className="relative z-10 mt-4 pt-4 border-t border-white/60">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="font-medium">
                {recentActivities.length} activities
              </span>
            </span>
            <span className="flex items-center gap-1">
              <SafeIcon icon={FiClock} size={14} />
              Updated just now
            </span>
          </div>
        </div>
      )}

      {/* Custom CSS for enhanced animations */}
      <style jsx>{`
        .animate-fade-in-slide {
          animation: fadeInSlideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)
            forwards;
        }

        @keyframes fadeInSlideUp {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .shadow-3xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15),
            0 0 0 1px rgba(255, 255, 255, 0.9);
        }

        /* Custom scrollbar */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #10b981, #06b6d4);
          border-radius: 10px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #059669, #0891b2);
        }
      `}</style>
    </div>
  );
};

export default RecentActivities;
