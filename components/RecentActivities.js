import { useEffect, useState } from "react";
import { FiRefreshCw, FiClock } from "react-icons/fi";

const RecentActivities = () => {
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [spin, setSpin] = useState(false);
  const [glow, setGlow] = useState(false);

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
        .slice(0, 4);

      setRecentActivities([]);
      setTimeout(() => setRecentActivities(combined), 50);
    } catch (error) {
      console.error("Failed to fetch recent activities:", error);
    } finally {
      setLoading(false);
      setTimeout(() => setSpin(false), 500);
      setTimeout(() => setGlow(false), 1000);
    }
  };

  useEffect(() => {
    fetchRecentActivities();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 relative overflow-hidden">
      <h3 className="text-xl font-semibold mb-4 flex items-center justify-between">
        Recent Activities
        <button
          onClick={fetchRecentActivities}
          className={`text-blue-500 p-2 rounded-full transition-all duration-500 ${
            spin
              ? "animate-spin text-green-500 scale-110"
              : "hover:scale-110 hover:text-green-500 hover:shadow-lg"
          } ${glow ? "shadow-[0_0_20px_3px_rgba(34,197,94,0.7)]" : ""}`}
          title="Refresh"
        >
          <FiRefreshCw size={20} />
        </button>
      </h3>

      <div className="space-y-4">
        {recentActivities.length === 0 ? (
          <p className="text-gray-500 text-sm">No recent activities</p>
        ) : (
          recentActivities.map((activity, index) => (
            <div
              key={activity.id}
              className={`flex items-center border-b pb-4 last:border-0 last:pb-0 transition-all duration-700 p-2 rounded-lg opacity-0 translate-y-4 animate-fade-in ${
                index === 0
                  ? "bg-green-100 border-green-300 shadow-md"
                  : "hover:bg-gray-50"
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={`rounded-full h-10 w-10 flex items-center justify-center mr-4 ${
                  activity.type === "member" ? "bg-blue-100" : "bg-yellow-100"
                }`}
              >
                <span>{activity.type === "member" ? "👤" : "📢"}</span>
              </div>
              <div className="flex-1">
                <p className="font-medium line-clamp-2">{activity.user}</p>

                <p className="font-normal text-gray-700 flex items-center gap-2">
                  {activity.action}
                  <span className="text-gray-500 text-sm flex items-center gap-1">
                    <FiClock size={14} /> {activity.displayTime}
                  </span>
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {loading && (
        <div className="absolute top-0 left-0 w-full h-full bg-white/70 flex items-center justify-center rounded-2xl">
          <p className="text-gray-500 text-lg animate-pulse">Refreshing...</p>
        </div>
      )}

      <style jsx>{`
        .animate-fade-in {
          animation: fadeInSlide 0.5s forwards;
        }
        @keyframes fadeInSlide {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default RecentActivities;
