// pages/index.js
import React from "react";
import nookies from "nookies";
import MemberBarChart from "@/components/Barchart";
import MemberCircleChart from "@/components/MemberCircleChart";
import RecentActivities from "@/components/RecentActivities";

const IndexPage = ({
  membersThisMonth,
  membersLastMonth,
  announcementsThisMonth,
  announcementsLastMonth,
}) => {
  // ✅ Safe percentage change calculation
  const calculateChange = (thisMonth, lastMonth) => {
    if (lastMonth === 0) {
      if (thisMonth === 0) return "+0%";
      return "+100%"; // new entries this month, last month was zero
    }
    return `+${Math.round(((thisMonth - lastMonth) / lastMonth) * 100)}%`;
  };

  const statsData = [
    {
      title: "Residents This Month",
      value: membersThisMonth,
      change: calculateChange(membersThisMonth, membersLastMonth),
      icon: "👥",
      color: "bg-blue-500",
    },
    {
      title: "Residents Last Month",
      value: membersLastMonth,
      change: calculateChange(membersLastMonth, 0),
      icon: "👤",
      color: "bg-blue-300",
    },
    {
      title: "Announcements This Month",
      value: announcementsThisMonth,
      change: calculateChange(announcementsThisMonth, announcementsLastMonth),
      icon: "📝",
      color: "bg-red-500",
    },
    {
      title: "Announcements Last Month",
      value: announcementsLastMonth,
      change: calculateChange(announcementsLastMonth, 0),
      icon: "📄",
      color: "bg-red-300",
    },
  ];

  const recentActivities = [
    { user: "Rajesh Kumar", action: "Paid maintenance", time: "2 hours ago" },
    {
      user: "Meena Shah",
      action: "Submitted a complaint",
      time: "5 hours ago",
    },
    { user: "Admin", action: "Posted new notice", time: "Yesterday" },
    {
      user: "Vikram Singh",
      action: "Registered new vehicle",
      time: "2 days ago",
    },
  ];

  const paymentData = [
    { month: "Jan", amount: 40000 },
    { month: "Feb", amount: 42000 },
    { month: "Mar", amount: 38000 },
    { month: "Apr", amount: 45000 },
    { month: "May", amount: 42500 },
    { month: "Jun", amount: 48000 },
  ];

  return (
    <div className="p-6">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    {stat.title}
                  </p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                  <p
                    className={`text-sm mt-2 ${
                      stat.change.includes("+")
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {stat.change} from comparison
                  </p>
                </div>
                <div
                  className={`${stat.color} rounded-full h-12 w-12 flex items-center justify-center text-white`}
                >
                  <span className="text-xl">{stat.icon}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts & Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment History */}
          <div>
            <MemberCircleChart />
          </div>

          {/* Recent Activities */}
          <div>
            <RecentActivities />
          </div>
        </div>
        <MemberBarChart />
      </div>
    </div>
  );
};

// ✅ Server-side fetch with separate this month & last month counts
export async function getServerSideProps(ctx) {
  const cookies = nookies.get(ctx);

  if (cookies.loggedIn !== "true") {
    return { redirect: { destination: "/login", permanent: false } };
  }

  try {
    const [membersRes, announcementsRes] = await Promise.all([
      fetch(`https://society-admin-eosin.vercel.app/api/members`),
      fetch(`https://society-admin-eosin.vercel.app/api/announcements/get`),
    ]);

    const membersData = await membersRes.json();
    const announcementsData = await announcementsRes.json();

    const membersArray = Array.isArray(membersData) ? membersData : [];
    const announcementsArray = announcementsData.announcements || [];

    const now = new Date();

    // Last month range
    const startLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endLastMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
      23,
      59,
      59,
      999
    );

    // This month range
    const startThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endThisMonth = now;

    const membersLastMonth = membersArray.filter(
      (m) =>
        new Date(m.createdAt) >= startLastMonth &&
        new Date(m.createdAt) <= endLastMonth
    ).length;

    const membersThisMonth = membersArray.filter(
      (m) =>
        new Date(m.createdAt) >= startThisMonth &&
        new Date(m.createdAt) <= endThisMonth
    ).length;

    const announcementsLastMonth = announcementsArray.filter(
      (a) =>
        new Date(a.createdAt) >= startLastMonth &&
        new Date(a.createdAt) <= endLastMonth
    ).length;

    const announcementsThisMonth = announcementsArray.filter(
      (a) =>
        new Date(a.createdAt) >= startThisMonth &&
        new Date(a.createdAt) <= endThisMonth
    ).length;

    return {
      props: {
        membersThisMonth,
        membersLastMonth,
        announcementsThisMonth,
        announcementsLastMonth,
      },
    };
  } catch (err) {
    console.error("Dashboard fetch error:", err);
    return {
      props: {
        membersThisMonth: 0,
        membersLastMonth: 0,
        announcementsThisMonth: 0,
        announcementsLastMonth: 0,
      },
    };
  }
}

export default IndexPage;
