import React, { useEffect, useState } from "react";

const ComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await fetch("/api/complaints/get");
        if (!res.ok) throw new Error("Failed to fetch complaints");
        const json = await res.json();
        setComplaints(Array.isArray(json.data) ? json.data : []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const handleApprove = async (complaint) => {
    if (complaint.status === "Approved") return;

    const confirmApprove = window.confirm(
      "Are you sure you want to approve this complaint?"
    );
    if (!confirmApprove) return;

    try {
      const res = await fetch(`/api/complaints/update/${complaint._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Approved" }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update status");

      setComplaints((prev) =>
        prev.map((c) =>
          c._id === complaint._id ? { ...c, status: "Approved" } : c
        )
      );

      if (selectedComplaint && selectedComplaint._id === complaint._id) {
        setSelectedComplaint({ ...selectedComplaint, status: "Approved" });
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const formatIST = (dateString) =>
    new Date(dateString).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });

  const getStatusBadge = (status) => {
    const statusConfig = {
      Pending: {
        color: "bg-amber-100 text-amber-800 border-amber-300",
        icon: "⏳",
      },
      Approved: {
        color: "bg-emerald-100 text-emerald-800 border-emerald-300",
        icon: "✅",
      },
      Resolved: {
        color: "bg-blue-100 text-blue-800 border-blue-300",
        icon: "✓",
      },
    };

    const config = statusConfig[status] || statusConfig.Pending;
    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-medium ${config.color}`}
      >
        <span>{config.icon}</span>
        {status}
      </span>
    );
  };

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.flatNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.complaintText?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || complaint.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 font-medium">Loading complaints...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-red-500 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Error Loading Complaints
            </h3>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Complaints Management
              </h1>
              <p className="text-gray-600">
                Manage and review resident complaints efficiently
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>{filteredComplaints.length} complaints</span>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search complaints by name, flat, or content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 transition-all duration-200"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 transition-all duration-200"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>

        {/* Complaints Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {filteredComplaints.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-3xl text-gray-400">📝</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No complaints found
              </h3>
              <p className="text-gray-600 max-w-sm mx-auto">
                {complaints.length === 0
                  ? "No complaints have been submitted yet."
                  : "No complaints match your current filters."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Resident
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Complaint
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredComplaints.map((complaint) => (
                    <tr
                      key={complaint._id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {complaint.name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <span>🏠</span>
                            Flat {complaint.flatNumber}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <p className="text-sm text-gray-900 line-clamp-2">
                            {complaint.complaintText}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(complaint.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatIST(complaint.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setSelectedComplaint(complaint)}
                            className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 text-sm font-medium"
                          >
                            <span>👁️</span>
                            View
                          </button>
                          {complaint.status === "Pending" && (
                            <button
                              onClick={() => handleApprove(complaint)}
                              className="inline-flex items-center gap-1 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 text-sm font-medium"
                            >
                              <span>✓</span>
                              Approve
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal */}
        {selectedComplaint && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4 backdrop-blur-sm transition-opacity duration-300">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden transform transition-transform duration-300 scale-100">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Complaint Details</h2>
                    <p className="text-blue-100 mt-1">
                      Complete complaint information
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedComplaint(null)}
                    className="p-2 hover:bg-blue-500 rounded-xl transition-colors duration-200"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">
                      Flat Number
                    </label>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                      <span>🏠</span>
                      <span className="font-medium text-gray-900">
                        {selectedComplaint.flatNumber}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">
                      Resident Name
                    </label>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                      <span>👤</span>
                      <span className="font-medium text-gray-900">
                        {selectedComplaint.name}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">
                    Complaint Details
                  </label>
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                      {selectedComplaint.complaintText}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">
                      Status
                    </label>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(selectedComplaint.status)}
                      {selectedComplaint.status === "Pending" && (
                        <button
                          onClick={() => handleApprove(selectedComplaint)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 text-sm font-medium"
                        >
                          <span>✓</span>
                          Approve Complaint
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">
                      Submitted On
                    </label>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                      <span>📅</span>
                      <span className="font-medium text-gray-900">
                        {formatIST(selectedComplaint.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                <div className="flex justify-end">
                  <button
                    onClick={() => setSelectedComplaint(null)}
                    className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
                  >
                    Close Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintsPage;
