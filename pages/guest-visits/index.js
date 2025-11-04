import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const formatIST = (utcDate) => {
  const date = new Date(utcDate);
  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const AdminGuestVisits = () => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [stats, setStats] = useState({ total: 0, monthly: 0 });

  // Calculate statistics
  useEffect(() => {
    if (visits.length > 0) {
      const total = visits.length;
      const monthly = selectedMonth
        ? visits.filter((visit) => {
            const visitDate = new Date(visit.createdAt);
            const visitMonth = `${visitDate.getFullYear()}-${String(
              visitDate.getMonth() + 1
            ).padStart(2, "0")}`;
            return visitMonth === selectedMonth;
          }).length
        : visits.filter((visit) => {
            const visitDate = new Date(visit.createdAt);
            const currentMonth = `${new Date().getFullYear()}-${String(
              new Date().getMonth() + 1
            ).padStart(2, "0")}`;
            const visitMonth = `${visitDate.getFullYear()}-${String(
              visitDate.getMonth() + 1
            ).padStart(2, "0")}`;
            return visitMonth === currentMonth;
          }).length;

      setStats({ total, monthly });
    }
  }, [visits, selectedMonth]);

  // Fetch all guest visits
  const fetchVisits = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/guest-visit");
      const data = await res.json();
      if (data.success) setVisits(data.data);
      else toast.error("❌ Failed to fetch guest visits");
    } catch (err) {
      console.error(err);
      toast.error("⚠️ Something went wrong while fetching visits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  // Delete guest visit
  const deleteVisit = async (id, toastId) => {
    try {
      const res = await fetch("/api/guest-visit", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success("✅ Guest visit deleted successfully!");
        fetchVisits();
      } else {
        toast.error(data.message || "❌ Failed to delete visit");
      }
      toast.dismiss(toastId);
    } catch (err) {
      console.error(err);
      toast.error("⚠️ Something went wrong while deleting visit");
      toast.dismiss(toastId);
    }
  };

  // Toast confirmation
  const confirmDelete = (id, guestName) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-4 p-2">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-red-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Confirm Deletion
              </h3>
              <p className="text-gray-600">
                Are you sure you want to delete{" "}
                <span className="font-semibold">{guestName}'s</span> visit
                record?
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() => deleteVisit(id, t.id)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete
            </button>
          </div>
        </div>
      ),
      {
        duration: 10000,
        position: "top-center",
        style: {
          background: "white",
          padding: "16px",
          borderRadius: "12px",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
        },
      }
    );
  };

  // Filter visits by month
  const filteredVisits = selectedMonth
    ? visits.filter((visit) => {
        const visitDate = new Date(visit.createdAt);
        const visitMonth = `${visitDate.getFullYear()}-${String(
          visitDate.getMonth() + 1
        ).padStart(2, "0")}`;
        return visitMonth === selectedMonth;
      })
    : visits;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 p-6">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Guest Visits Dashboard
          </h1>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            Manage and monitor all guest visit records with real-time statistics
            and advanced filtering
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white backdrop-blur-lg rounded-2xl p-6 border border-blue-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Total Visits
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.total}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white backdrop-blur-lg rounded-2xl p-6 border border-blue-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  {selectedMonth ? "Filtered Visits" : "This Month"}
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.monthly}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white backdrop-blur-lg rounded-2xl p-6 border border-blue-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Active Filter
                </p>
                <p className="text-lg font-semibold text-gray-900 mt-2">
                  {selectedMonth ? selectedMonth : "All Time"}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white backdrop-blur-lg rounded-2xl p-6 mb-8 border border-gray-200 shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Month
              </label>
              <div className="flex gap-3">
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <button
                  onClick={() => setSelectedMonth("")}
                  className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Visits Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          </div>
        ) : filteredVisits.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-lg">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No visits found
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {selectedMonth
                ? `No guest visits recorded for ${selectedMonth}. Try selecting a different month.`
                : "No guest visits have been recorded yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredVisits.map((visit) => (
              <div
                key={visit._id}
                className="group relative bg-white rounded-2xl p-6 border border-gray-200 hover:border-blue-300 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {/* Content */}
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">
                        {visit.guestName}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full border border-blue-200">
                          Flat {visit.flatNumber}
                        </span>
                      </div>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => confirmDelete(visit._id, visit.guestName)}
                      className="opacity-100 p-2 bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 rounded-xl text-red-500 hover:text-red-600 transition-all duration-300 transform hover:scale-105"
                      title="Delete Visit Record"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <svg
                        className="w-4 h-4 text-blue-500 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{formatIST(visit.createdAt)}</span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <svg
                        className="w-4 h-4 text-green-500 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Recorded in IST</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGuestVisits;
