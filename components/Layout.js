import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import {
  FiHome,
  FiUsers,
  FiCreditCard,
  FiFileText,
  FiBell,
  FiSettings,
  FiMenu,
  FiX,
  FiChevronDown,
  FiLogOut,
  FiUser,
  FiHelpCircle,
} from "react-icons/fi";

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("");
  const router = useRouter();

  useEffect(() => {
    setActiveNav(router.pathname);
  }, [router.pathname]);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <FiHome />, href: "/" },
    {
      id: "residents",
      label: "Residents",
      icon: <FiUsers />,
      href: "/members",
    },
    {
      id: "payments",
      label: "Payments",
      icon: <FiCreditCard />,
      href: "/payments",
    },
    {
      id: "complaints",
      label: "Complaints",
      icon: <FiFileText />,
      href: "/complaints",
    },
    {
      id: "notices",
      label: "Notices",
      icon: <FiBell />,
      href: "/annuncemet",
    },
    {
      id: "settings",
      label: "Settings",
      icon: <FiSettings />,
      href: "/settings",
    },
  ];

  const notifications = [
    {
      id: 1,
      title: "New maintenance request",
      time: "10 min ago",
      read: false,
    },
    {
      id: 2,
      title: "Payment received from Apt 302",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      title: "Meeting scheduled for Friday",
      time: "2 hours ago",
      read: true,
    },
    {
      id: 4,
      title: "New message from resident",
      time: "5 hours ago",
      read: true,
    },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      router.push("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  if (router.pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans">
      <div
        className={`bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 text-white w-64 min-h-screen fixed top-0 left-0 transition-all duration-300 shadow-2xl z-40 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-64"} 
          lg:translate-x-0`}
      >
        <div className="p-5 border-b border-blue-700 flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight flex items-center">
            <span className="bg-white text-blue-800 p-1.5 rounded-lg mr-3 shadow-md">
              🏢
            </span>
            SocietyHub
          </h1>
          <p className="text-blue-200 text-xs mt-1 font-light">
            Premium Residence Management
          </p>
        </div>

        <nav className="p-4 mt-2">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <Link href={item.href} legacyBehavior>
                  <a
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 group
                      ${
                        activeNav === item.href
                          ? "bg-white/10 text-white shadow-lg transform scale-105"
                          : "text-blue-100 hover:bg-white/5 hover:text-white"
                      }`}
                  >
                    <span className="text-lg transition-transform duration-300 group-hover:scale-110">
                      {item.icon}
                    </span>
                    <span className="transition-all duration-300">
                      {item.label}
                    </span>
                    {activeNav === item.href && (
                      <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    )}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-blue-700 bg-blue-900/50">
          <div className="flex items-center gap-3 text-blue-200 hover:text-white cursor-pointer p-2 rounded-lg hover:bg-blue-700 transition-all duration-300 group">
            <FiHelpCircle className="text-lg transition-transform duration-300 group-hover:scale-110" />
            <span className="text-sm font-medium">Help & Support</span>
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden animate-fadeIn"
        />
      )}

      <div className="flex-1 lg:ml-64 transition-all duration-300">
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-600 focus:outline-none lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-all duration-300 hover:rotate-90"
              >
                {sidebarOpen ? <FiX size={22} /> : <FiMenu size={22} />}
              </button>

              <div className="ml-4 flex items-center text-sm text-gray-500">
                <span className="capitalize font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {router.pathname.split("/").filter(Boolean).join(" / ") ||
                    "dashboard"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  className="relative p-2.5 rounded-xl text-gray-500 hover:bg-gray-100 transition-all duration-300 hover:text-blue-600"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                >
                  <FiBell size={20} />
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
                </button>
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-200 animate-fadeIn">
                    <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="font-semibold text-gray-800">
                        Notifications
                      </h3>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        4 new
                      </span>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`px-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors duration-200 ${
                            notification.read ? "" : "bg-blue-50"
                          }`}
                        >
                          <p className="text-sm font-medium text-gray-800">
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {notification.time}
                          </p>
                          {!notification.read && (
                            <div className="mt-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <div
                  className="flex items-center bg-white pl-1 pr-3 py-1 rounded-xl cursor-pointer hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-300"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                >
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 flex items-center justify-center text-white font-semibold shadow-md">
                    AM
                  </div>
                  <span className="ml-2 text-gray-700 font-medium text-sm">
                    Admin
                  </span>
                  <FiChevronDown
                    className={`ml-1 text-gray-500 transition-transform duration-300 ${
                      profileDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-200 animate-fadeIn">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-800">
                        Admin User
                      </p>
                      <p className="text-xs text-gray-500">admin@example.com</p>
                    </div>
                    <Link href="/profile" legacyBehavior>
                      <a className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-200">
                        <FiUser className="mr-2" /> Profile
                      </a>
                    </Link>
                    <Link href="/settings" legacyBehavior>
                      <a className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-200">
                        <FiSettings className="mr-2" /> Settings
                      </a>
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      <FiLogOut className="mr-2" /> Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="p-2 min-h-screen">
          <div className="bg-white rounded-2xl shadow-sm p-2 border border-gray-200 transition-all duration-300 hover:shadow-md">
            {children}
          </div>
          <footer className="mt-8 text-center text-sm text-gray-500 pb-6">
            <p>
              © {new Date().getFullYear()} SocietyHub. All rights reserved. |
              Version 2.1.0
            </p>
          </footer>
        </main>
      </div>

      {(profileDropdownOpen || notificationsOpen) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => {
            setProfileDropdownOpen(false);
            setNotificationsOpen(false);
          }}
        />
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        body {
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, sans-serif;
        }
      `}</style>
    </div>
  );
}
