import React from "react";
import nookies from "nookies";

const IndexPage = () => {
  // Sample data
  const statsData = [
    {
      title: "Total Residents",
      value: "248",
      change: "+12%",
      icon: "👥",
      color: "bg-blue-500",
    },
    {
      title: "Maintenance Due",
      value: "₹42,580",
      change: "-3%",
      icon: "💰",
      color: "bg-green-500",
    },
    {
      title: "Complaints",
      value: "18",
      change: "+5%",
      icon: "📝",
      color: "bg-red-500",
    },
    {
      title: "Events",
      value: "4",
      change: "+2",
      icon: "📅",
      color: "bg-purple-500",
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
    <div>
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
                    {stat.change} from last month
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
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Payment History</h3>
            <div className="h-64 flex items-end space-x-2">
              {paymentData.map((item, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className="bg-blue-500 rounded-t w-full transition-all duration-500 ease-out"
                    style={{ height: `${(item.amount / 50000) * 100}%` }}
                  ></div>
                  <span className="text-xs mt-2">{item.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Recent Activities</h3>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center border-b pb-4 last:border-0 last:pb-0 transition-all duration-300 hover:bg-gray-50 p-2 rounded-lg"
                >
                  <div className="bg-blue-100 rounded-full h-10 w-10 flex items-center justify-center mr-4">
                    <span>📋</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">
                      {activity.user}{" "}
                      <span className="font-normal text-gray-700">
                        {activity.action}
                      </span>
                    </p>
                    <p className="text-gray-500 text-sm">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ✅ Protect with cookie check
export async function getServerSideProps(ctx) {
  const cookies = nookies.get(ctx);

  if (cookies.loggedIn !== "true") {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return { props: {} };
}

export default IndexPage;
