import React, { useState } from "react";

const PaymentReceiptsPage = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [activeTab, setActiveTab] = useState("collected"); // 'collected' or 'pending'

  // Mock data for collected payments
  const collectedPayments = [
    {
      id: "RCPT-2024-001",
      residentName: "Aarav Sharma",
      unitNumber: "A-101",
      amount: 2500,
      paymentDate: "2024-01-15",
      dueDate: "2024-01-05",
      paymentMethod: "Credit Card",
      status: "completed",
      description: "Monthly Maintenance - January 2024",
      transactionId: "TXN001234567",
      category: "maintenance",
    },
    {
      id: "RCPT-2024-002",
      residentName: "Priya Patel",
      unitNumber: "B-205",
      amount: 1800,
      paymentDate: "2024-01-14",
      dueDate: "2024-01-05",
      paymentMethod: "UPI",
      status: "completed",
      description: "Monthly Maintenance - January 2024",
      transactionId: "TXN001234568",
      category: "maintenance",
    },
    {
      id: "RCPT-2024-003",
      residentName: "Rohan Mehta",
      unitNumber: "C-302",
      amount: 500,
      paymentDate: "2024-01-12",
      dueDate: "2024-01-10",
      paymentMethod: "Net Banking",
      status: "completed",
      description: "Parking Fee - January 2024",
      transactionId: "TXN001234569",
      category: "parking",
    },
    {
      id: "RCPT-2024-004",
      residentName: "Ananya Reddy",
      unitNumber: "D-104",
      amount: 300,
      paymentDate: "2024-01-10",
      dueDate: "2024-01-08",
      paymentMethod: "Debit Card",
      status: "completed",
      description: "Water Bill - December 2023",
      transactionId: "TXN001234570",
      category: "utility",
    },
  ];

  // Mock data for pending payments
  const pendingPayments = [
    {
      id: "PEND-2024-001",
      residentName: "Vikram Singh",
      unitNumber: "A-201",
      amount: 2500,
      dueDate: "2024-02-05",
      description: "Monthly Maintenance - February 2024",
      category: "maintenance",
      daysOverdue: 0,
      reminderSent: true,
    },
    {
      id: "PEND-2024-002",
      residentName: "Neha Gupta",
      unitNumber: "B-103",
      amount: 1800,
      dueDate: "2024-02-05",
      description: "Monthly Maintenance - February 2024",
      category: "maintenance",
      daysOverdue: 0,
      reminderSent: false,
    },
    {
      id: "PEND-2024-003",
      residentName: "Rajesh Kumar",
      unitNumber: "C-401",
      amount: 1200,
      dueDate: "2024-01-25",
      description: "Monthly Maintenance - January 2024",
      category: "maintenance",
      daysOverdue: 10,
      reminderSent: true,
    },
    {
      id: "PEND-2024-004",
      residentName: "Sneha Joshi",
      unitNumber: "D-205",
      amount: 600,
      dueDate: "2024-01-20",
      description: "Parking Fee - January 2024",
      category: "parking",
      daysOverdue: 15,
      reminderSent: true,
    },
    {
      id: "PEND-2024-005",
      residentName: "Alok Verma",
      unitNumber: "A-301",
      amount: 400,
      dueDate: "2024-01-15",
      description: "Water Bill - December 2023",
      category: "utility",
      daysOverdue: 20,
      reminderSent: false,
    },
  ];

  const filters = [
    {
      id: "all",
      label: "All",
      count:
        activeTab === "collected"
          ? collectedPayments.length
          : pendingPayments.length,
    },
    {
      id: "maintenance",
      label: "Maintenance",
      count: (activeTab === "collected"
        ? collectedPayments
        : pendingPayments
      ).filter((r) => r.category === "maintenance").length,
    },
    {
      id: "utility",
      label: "Utilities",
      count: (activeTab === "collected"
        ? collectedPayments
        : pendingPayments
      ).filter((r) => r.category === "utility").length,
    },
    {
      id: "parking",
      label: "Parking",
      count: (activeTab === "collected"
        ? collectedPayments
        : pendingPayments
      ).filter((r) => r.category === "parking").length,
    },
    {
      id: "amenity",
      label: "Amenities",
      count: (activeTab === "collected"
        ? collectedPayments
        : pendingPayments
      ).filter((r) => r.category === "amenity").length,
    },
  ];

  const currentData =
    activeTab === "collected" ? collectedPayments : pendingPayments;

  const filteredData = currentData.filter((item) => {
    const matchesFilter =
      activeFilter === "all" || item.category === activeFilter;
    const matchesSearch =
      item.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.unitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Calculate totals
  const totalCollected = collectedPayments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );
  const totalPending = pendingPayments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );
  const overdueAmount = pendingPayments
    .filter((payment) => payment.daysOverdue > 0)
    .reduce((sum, payment) => sum + payment.amount, 0);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusColor = (status) => {
    return status === "completed"
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800";
  };

  const getCategoryColor = (category) => {
    const colors = {
      maintenance: "bg-blue-100 text-blue-800",
      utility: "bg-yellow-100 text-yellow-800",
      parking: "bg-purple-100 text-purple-800",
      amenity: "bg-pink-100 text-pink-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const getOverdueColor = (daysOverdue) => {
    if (daysOverdue === 0) return "bg-green-100 text-green-800";
    if (daysOverdue <= 7) return "bg-yellow-100 text-yellow-800";
    if (daysOverdue <= 15) return "bg-orange-100 text-orange-800";
    return "bg-red-100 text-red-800";
  };

  const downloadReceipt = (receipt) => {
    alert(`Downloading receipt: ${receipt.id}`);
  };

  const sendReceipt = (receipt) => {
    alert(`Sending receipt ${receipt.id} to ${receipt.residentName}`);
  };

  const sendReminder = (payment) => {
    alert(`Sending reminder for ${payment.id} to ${payment.residentName}`);
  };

  const ReceiptModal = ({ receipt, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Payment Receipt
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 rounded-2xl mb-4">
              <h3 className="text-2xl font-bold">PAYMENT CONFIRMED</h3>
              <p className="opacity-90">Receipt #{receipt.id}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Resident Information
              </h4>
              <p className="text-gray-600">{receipt.residentName}</p>
              <p className="text-gray-600">Unit {receipt.unitNumber}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Payment Details
              </h4>
              <p className="text-gray-600">
                Paid: {formatDate(receipt.paymentDate)}
              </p>
              <p className="text-gray-600">
                Due: {formatDate(receipt.dueDate)}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="text-center">
              <p className="text-gray-600 text-sm">Total Amount Paid</p>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(receipt.amount)}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Description</span>
              <span className="font-semibold">{receipt.description}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-semibold">{receipt.paymentMethod}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Transaction ID</span>
              <span className="font-semibold">{receipt.transactionId}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Status</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                  receipt.status
                )}`}
              >
                {receipt.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <div className="flex space-x-3">
            <button
              onClick={() => downloadReceipt(receipt)}
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Download Receipt
            </button>
            <button
              onClick={() => sendReceipt(receipt)}
              className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
            >
              Email Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Payment Management
          </h1>
          <p className="text-gray-600 text-lg">
            Track collected and pending payments from residents
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center">
              <div className="bg-green-400/30 p-3 rounded-xl mr-4">
                <span className="text-2xl">💰</span>
              </div>
              <div>
                <p className="text-sm opacity-90">Total Collected</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(totalCollected)}
                </p>
                <p className="text-sm opacity-90 mt-1">
                  {collectedPayments.length} payments
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center">
              <div className="bg-orange-400/30 p-3 rounded-xl mr-4">
                <span className="text-2xl">⏰</span>
              </div>
              <div>
                <p className="text-sm opacity-90">Pending Payments</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(totalPending)}
                </p>
                <p className="text-sm opacity-90 mt-1">
                  {pendingPayments.length} pending
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center">
              <div className="bg-red-400/30 p-3 rounded-xl mr-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <div>
                <p className="text-sm opacity-90">Overdue Amount</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(overdueAmount)}
                </p>
                <p className="text-sm opacity-90 mt-1">
                  {pendingPayments.filter((p) => p.daysOverdue > 0).length}{" "}
                  overdue
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("collected")}
                className={`py-4 px-1 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "collected"
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Collected Payments
                <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  {collectedPayments.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab("pending")}
                className={`py-4 px-1 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "pending"
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Pending Payments
                <span className="ml-2 bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                  {pendingPayments.length}
                </span>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 mb-6">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={`Search by resident, unit, or ${
                      activeTab === "collected" ? "receipt" : "pending"
                    } ID...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    🔍
                  </div>
                </div>
              </div>

              {/* View Toggle and Actions */}
              <div className="flex items-center space-x-4">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md ${
                      viewMode === "grid"
                        ? "bg-white shadow-sm"
                        : "text-gray-600"
                    }`}
                  >
                    ▫️
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md ${
                      viewMode === "list"
                        ? "bg-white shadow-sm"
                        : "text-gray-600"
                    }`}
                  >
                    ☰
                  </button>
                </div>

                {activeTab === "collected" ? (
                  <button className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors">
                    Export Receipts
                  </button>
                ) : (
                  <button className="bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 transition-colors">
                    Send Bulk Reminders
                  </button>
                )}
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                    activeFilter === filter.id
                      ? activeTab === "collected"
                        ? "bg-green-600 text-white shadow-lg shadow-green-500/25"
                        : "bg-orange-600 text-white shadow-lg shadow-orange-500/25"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>

            {/* Collected Payments Grid */}
            {activeTab === "collected" && viewMode === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredData.map((receipt) => (
                  <div
                    key={receipt.id}
                    className="bg-white border border-green-200 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {receipt.residentName}
                          </h3>
                          <p className="text-gray-600">
                            Unit {receipt.unitNumber}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                            receipt.status
                          )}`}
                        >
                          {receipt.status}
                        </span>
                      </div>

                      <div className="bg-green-50 rounded-xl p-4 mb-4 border border-green-200">
                        <p className="text-2xl font-bold text-gray-900 text-center">
                          {formatCurrency(receipt.amount)}
                        </p>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Receipt ID:</span>
                          <span className="font-semibold">{receipt.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment Date:</span>
                          <span className="font-semibold">
                            {formatDate(receipt.paymentDate)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Method:</span>
                          <span className="font-semibold">
                            {receipt.paymentMethod}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Category:</span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(
                              receipt.category
                            )}`}
                          >
                            {receipt.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 px-6 py-4 border-t border-green-200">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => setSelectedReceipt(receipt)}
                          className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                        >
                          View Receipt
                        </button>
                        <button
                          onClick={() => downloadReceipt(receipt)}
                          className="px-4 py-2 border border-green-300 rounded-lg font-semibold text-green-700 hover:bg-green-100 transition-colors"
                        >
                          📥
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pending Payments Grid */}
            {activeTab === "pending" && viewMode === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredData.map((payment) => (
                  <div
                    key={payment.id}
                    className="bg-white border border-orange-200 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {payment.residentName}
                          </h3>
                          <p className="text-gray-600">
                            Unit {payment.unitNumber}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${getOverdueColor(
                            payment.daysOverdue
                          )}`}
                        >
                          {payment.daysOverdue === 0
                            ? "Due Soon"
                            : `${payment.daysOverdue} days overdue`}
                        </span>
                      </div>

                      <div className="bg-orange-50 rounded-xl p-4 mb-4 border border-orange-200">
                        <p className="text-2xl font-bold text-gray-900 text-center">
                          {formatCurrency(payment.amount)}
                        </p>
                        <p className="text-orange-600 text-sm text-center mt-1">
                          Due: {formatDate(payment.dueDate)}
                        </p>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Pending ID:</span>
                          <span className="font-semibold">{payment.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Description:</span>
                          <span className="font-semibold text-right">
                            {payment.description}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Category:</span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(
                              payment.category
                            )}`}
                          >
                            {payment.category}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Reminder:</span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              payment.reminderSent
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {payment.reminderSent ? "Sent" : "Not Sent"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-orange-50 px-6 py-4 border-t border-orange-200">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => sendReminder(payment)}
                          className="flex-1 bg-orange-600 text-white py-2 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                        >
                          Send Reminder
                        </button>
                        <button className="px-4 py-2 border border-orange-300 rounded-lg font-semibold text-orange-700 hover:bg-orange-100 transition-colors">
                          📞 Call
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* List Views */}
            {viewMode === "list" && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        {activeTab === "collected"
                          ? "Receipt ID"
                          : "Pending ID"}
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        Resident
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        Unit
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        {activeTab === "collected"
                          ? "Payment Date"
                          : "Due Date"}
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        Category
                      </th>
                      {activeTab === "pending" && (
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                          Status
                        </th>
                      )}
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredData.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 font-semibold text-gray-900">
                          {item.id}
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-semibold text-gray-900">
                              {item.residentName}
                            </div>
                            {activeTab === "collected" && (
                              <div className="text-sm text-gray-600">
                                {item.paymentMethod}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          {item.unitNumber}
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-900">
                          {formatCurrency(item.amount)}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {formatDate(
                            activeTab === "collected"
                              ? item.paymentDate
                              : item.dueDate
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(
                              item.category
                            )}`}
                          >
                            {item.category}
                          </span>
                        </td>
                        {activeTab === "pending" && (
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${getOverdueColor(
                                item.daysOverdue
                              )}`}
                            >
                              {item.daysOverdue === 0
                                ? "Due Soon"
                                : `${item.daysOverdue} days overdue`}
                            </span>
                          </td>
                        )}
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            {activeTab === "collected" ? (
                              <>
                                <button
                                  onClick={() => setSelectedReceipt(item)}
                                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                                >
                                  View
                                </button>
                                <button
                                  onClick={() => downloadReceipt(item)}
                                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                                >
                                  Download
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => sendReminder(item)}
                                  className="bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                                >
                                  Remind
                                </button>
                                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                                  Call
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Empty State */}
            {filteredData.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">
                  {activeTab === "collected" ? "📭" : "⏰"}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {activeTab === "collected"
                    ? "No receipts found"
                    : "No pending payments found"}
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      {selectedReceipt && (
        <ReceiptModal
          receipt={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      )}
    </div>
  );
};

export default PaymentReceiptsPage;
