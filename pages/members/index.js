import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MemberManagement = () => {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [form, setForm] = useState({
    name: "",
    flatNumber: "",
    phone: "",
    password: "",
    familyCount: 1,
  });
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [counts, setCounts] = useState({
    totalMembers: 0,
    totalResidents: 0,
    occupiedUnits: 0,
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/members");
      const data = await res.json();
      setMembers(data);
      animateCounts(data);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching members", err);
      setIsLoading(false);
    }
  };

  const animateCounts = (data) => {
    const totalMembers = data.length;
    const totalResidents = data.reduce(
      (acc, member) => acc + (member.familyCount || 1),
      0
    );
    const occupiedUnits = new Set(data.map((m) => m.flatNumber)).size;

    // Animate counting up
    const duration = 1500; // ms
    const steps = 30;
    const stepDuration = duration / steps;

    // Animate total members
    animateValue("totalMembers", 0, totalMembers, steps, stepDuration);

    // Animate total residents
    animateValue("totalResidents", 0, totalResidents, steps, stepDuration);

    // Animate occupied units
    animateValue("occupiedUnits", 0, occupiedUnits, steps, stepDuration);
  };

  const animateValue = (key, start, end, steps, stepDuration) => {
    let current = start;
    const range = end - start;
    const increment = range / steps;
    let step = 0;

    const timer = setInterval(() => {
      current += increment;
      step++;

      setCounts((prev) => ({
        ...prev,
        [key]: Math.floor(current),
      }));

      if (step >= steps) {
        setCounts((prev) => ({
          ...prev,
          [key]: end,
        }));
        clearInterval(timer);
      }
    }, stepDuration);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("/api/members/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.error) setMessage(data.error);
      else {
        setMessage("✅ Member added successfully!");
        resetForm();
        fetchMembers();
      }
    } catch (err) {
      setMessage("❌ Failed to add member");
    }
  };

  const handleEdit = (member) => {
    setSelectedMember(member);
    setForm({
      name: member.name,
      flatNumber: member.flatNumber,
      phone: member.phone,
      password: "",
      familyCount: member.familyCount || 1,
    });
    setShowForm(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("/api/members", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedMember._id, ...form }),
      });
      const data = await res.json();
      if (data.error) setMessage(data.error);
      else {
        setMessage("✅ Member updated successfully!");
        resetForm();
        fetchMembers();
      }
    } catch (err) {
      setMessage("❌ Failed to update member");
    }
  };

  const resetForm = () => {
    setSelectedMember(null);
    setForm({
      name: "",
      flatNumber: "",
      phone: "",
      password: "",
      familyCount: 1,
    });
    setShowForm(false);
  };

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.flatNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <div className="member-management">
      <div className="header">
        <div className="header-left">
          <h1>Member Management</h1>
          <p>Manage and organize your community members</p>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-primary glow-effect"
            onClick={() => setShowForm(true)}
          >
            <span className="btn-icon">+</span> Add New Member
          </button>
          <div className="import-export">
            <button className="btn btn-outline">
              <span className="btn-icon">📥</span> Import
            </button>
            <button className="btn btn-outline">
              <span className="btn-icon">📊</span> Export
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-cards">
        <div className="card gradient-card-1">
          <div className="card-content">
            <h3>{counts.totalMembers}</h3>
            <p>Total Members</p>
          </div>
          <div className="card-icon">👥</div>
        </div>
        <div className="card gradient-card-2">
          <div className="card-content">
            <h3>{counts.totalResidents}</h3>
            <p>Total Residents</p>
          </div>
          <div className="card-icon">🏠</div>
        </div>
        <div className="card gradient-card-3">
          <div className="card-content">
            <h3>{counts.occupiedUnits}</h3>
            <p>Occupied Units</p>
          </div>
          <div className="card-icon">📋</div>
        </div>
      </div>

      <div className="content-section glass-effect">
        <div className="content-header">
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by name or flat number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          {message && (
            <div
              className={`message ${
                message.includes("✅") ? "success" : "error"
              } slide-in`}
            >
              {message}
            </div>
          )}
        </div>

        <div className="table-container">
          <table className="members-table">
            <thead>
              <tr>
                <th>Profile</th>
                <th>Member Name</th>
                <th>Mobile</th>
                <th>Family</th>
                <th>Flat No.</th>
                <th>Created At</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="8">
                    <div className="loading-state">
                      <div className="pulse-spinner"></div>
                      <p>Loading members...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan="8">
                    <div className="empty-state">
                      <div className="empty-icon">👥</div>
                      <h3>No members found</h3>
                      <p>
                        {searchQuery
                          ? "Try adjusting your search query"
                          : "Get started by adding a new member"}
                      </p>
                      {!searchQuery && (
                        <button
                          className="btn btn-primary"
                          onClick={() => setShowForm(true)}
                        >
                          Add New Member
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member._id} className="table-row">
                    <td>
                      <div className="avatar pulse">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                    </td>
                    <td>
                      <div className="member-info">
                        <span className="member-name">{member.name}</span>
                        {member.role === "admin" && (
                          <span className="member-badge admin">Admin</span>
                        )}
                      </div>
                    </td>
                    <td>{member.phone}</td>
                    <td>
                      <div className="family-count">
                        <span className="count">{member.familyCount}</span>
                        <span className="label">members</span>
                      </div>
                    </td>
                    <td>
                      <span className="flat-badge">{member.flatNumber}</span>
                    </td>
                    <td>
                      <div className="date-time">
                        <div className="date">
                          {formatDate(member.createdAt)}
                        </div>
                        <div className="time">
                          {formatTime(member.createdAt)}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="date-time">
                        <div className="date">
                          {formatDate(member.updatedAt)}
                        </div>
                        <div className="time">
                          {formatTime(member.updatedAt)}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleEdit(member)}
                          className="btn-icon hover-lift"
                          title="Edit member"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-icon hover-lift"
                          title="View details"
                        >
                          👁️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay fade-in">
          <div className="modal slide-up">
            <div className="modal-header">
              <h2>{selectedMember ? "Edit Member" : "Add New Member"}</h2>
              <button className="close-btn" onClick={resetForm}>
                ×
              </button>
            </div>
            <form onSubmit={selectedMember ? handleUpdate : handleAdd}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Flat Number *</label>
                  <input
                    type="text"
                    name="flatNumber"
                    value={form.flatNumber}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Password {!selectedMember && "*"}</label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required={!selectedMember}
                    placeholder={
                      selectedMember ? "Leave blank to keep current" : ""
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Family Count *</label>
                  <input
                    type="number"
                    name="familyCount"
                    value={form.familyCount}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary glow-effect">
                  {selectedMember ? "Update Member" : "Add Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            transform: translateX(-10px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes glow {
          0% {
            box-shadow: 0 0 5px rgba(59, 130, 246, 0.5);
          }
          50% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
          }
          100% {
            box-shadow: 0 0 5px rgba(59, 130, 246, 0.5);
          }
        }

        @keyframes pulseSpin {
          0% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: scale(1.1) rotate(180deg);
            opacity: 0.7;
          }
          100% {
            transform: scale(1) rotate(360deg);
            opacity: 1;
          }
        }

        .member-management {
          padding: 24px;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          min-height: 100vh;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, sans-serif;
          color: #334155;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 24px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.7);
        }

        .header-left h1 {
          background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0 0 8px 0;
          font-size: 32px;
          font-weight: 800;
        }

        .header-left p {
          color: #64748b;
          margin: 0;
          font-size: 14px;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .import-export {
          display: flex;
          gap: 8px;
        }

        .btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.3s ease;
          border: none;
        }

        .btn-primary {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          box-shadow: 0 4px 6px rgba(51, 102, 255, 0.2);
        }

        .btn-primary:hover {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          box-shadow: 0 8px 15px rgba(51, 102, 255, 0.3);
          transform: translateY(-2px);
        }

        .btn-outline {
          background-color: transparent;
          color: #64748b;
          border: 2px solid #e2e8f0;
          transition: all 0.3s ease;
        }

        .btn-outline:hover {
          background-color: #f8fafc;
          color: #334155;
          border-color: #cbd5e1;
          transform: translateY(-2px);
        }

        .btn-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .dashboard-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .card {
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.3s ease;
          color: white;
          position: relative;
          overflow: hidden;
        }

        .card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0.05) 100%
          );
          z-index: 1;
        }

        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
        }

        .gradient-card-1 {
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
        }

        .gradient-card-2 {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }

        .gradient-card-3 {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        }

        .card-content {
          position: relative;
          z-index: 2;
        }

        .card-content h3 {
          margin: 0 0 8px 0;
          font-size: 28px;
          font-weight: 800;
        }

        .card-content p {
          margin: 0;
          font-size: 14px;
          opacity: 0.9;
        }

        .card-icon {
          font-size: 32px;
          opacity: 0.8;
          position: relative;
          z-index: 2;
        }

        .glass-effect {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }

        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .search-container {
          position: relative;
          width: 300px;
        }

        .search-input {
          width: 100%;
          padding: 12px 16px 12px 44px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 14px;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.8);
        }

        .search-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
          background: white;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .message {
          padding: 12px 20px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 14px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .message.success {
          background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
          color: #166534;
          border: 1px solid #bbf7d0;
        }

        .message.error {
          background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
          color: #991b1b;
          border: 1px solid #fecaca;
        }

        .slide-in {
          animation: slideIn 0.3s ease-out;
        }

        .table-container {
          overflow-x: auto;
          border-radius: 12px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          background: rgba(255, 255, 255, 0.5);
        }

        .members-table {
          width: 100%;
          border-collapse: collapse;
        }

        .members-table th {
          background-color: #f1f5f9;
          color: #64748b;
          text-align: left;
          padding: 16px;
          font-weight: 600;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .members-table td {
          padding: 16px;
          border-bottom: 1px solid #e2e8f0;
          font-size: 14px;
        }

        .members-table tr:last-child td {
          border-bottom: none;
        }

        .members-table tr:hover {
          background-color: #f8fafc;
        }

        .avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 16px;
          box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
        }

        .pulse {
          animation: pulse 2s infinite;
        }

        .member-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .member-name {
          font-weight: 600;
          color: #1e293b;
        }

        .member-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          width: fit-content;
        }

        .member-badge.admin {
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
          color: #1d4ed8;
          box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
        }

        .family-count {
          display: flex;
          align-items: baseline;
          gap: 6px;
        }

        .family-count .count {
          font-weight: 700;
          color: #1e293b;
          font-size: 16px;
        }

        .family-count .label {
          font-size: 12px;
          color: #64748b;
        }

        .flat-badge {
          padding: 8px 14px;
          border-radius: 20px;
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          color: #475569;
          font-weight: 600;
          font-size: 12px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .date-time {
          display: flex;
          flex-direction: column;
        }

        .date {
          font-weight: 600;
          color: #1e293b;
        }

        .time {
          font-size: 12px;
          color: #94a3b8;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .action-buttons .btn-icon {
          background: rgba(241, 245, 249, 0.7);
          border: none;
          cursor: pointer;
          padding: 10px;
          border-radius: 10px;
          transition: all 0.3s ease;
          font-size: 16px;
        }

        .hover-lift:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px;
          gap: 20px;
        }

        .pulse-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(59, 130, 246, 0.2);
          border-top: 3px solid #3b82f6;
          border-radius: 50%;
          animation: pulseSpin 1.5s linear infinite;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px;
          text-align: center;
        }

        .empty-icon {
          font-size: 56px;
          margin-bottom: 20px;
          opacity: 0.5;
        }

        .empty-state h3 {
          margin: 0 0 12px 0;
          color: #334155;
          font-size: 20px;
        }

        .empty-state p {
          margin: 0 0 24px 0;
          color: #64748b;
          font-size: 16px;
        }

        .fade-in {
          animation: fadeIn 0.3s ease-out;
        }

        .slide-up {
          animation: slideUp 0.4s ease-out;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 16px;
          backdrop-filter: blur(5px);
        }

        .modal {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.95) 0%,
            rgba(255, 255, 255, 0.98) 100%
          );
          border-radius: 16px;
          width: 100%;
          max-width: 700px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 28px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.7);
        }

        .modal-header h2 {
          margin: 0;
          background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-size: 24px;
          font-weight: 700;
        }

        .close-btn {
          background: rgba(241, 245, 249, 0.7);
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #94a3b8;
          padding: 4px;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          transition: all 0.3s ease;
        }

        .close-btn:hover {
          background-color: #f1f5f9;
          color: #64748b;
          transform: rotate(90deg);
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          padding: 28px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          margin-bottom: 10px;
          font-weight: 600;
          color: #374151;
          font-size: 14px;
        }

        .form-group input {
          padding: 12px 14px;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 14px;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.8);
        }

        .form-group input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
          background: white;
          transform: translateY(-2px);
        }

        .form-actions {
          display: flex;
          gap: 16px;
          justify-content: flex-end;
          padding: 0 28px 28px;
        }

        .glow-effect {
          animation: glow 2s infinite;
        }

        @media (max-width: 768px) {
          .header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .header-actions {
            flex-direction: column;
            align-items: flex-start;
            width: 100%;
          }

          .import-export {
            flex-direction: column;
            width: 100%;
          }

          .btn {
            width: 100%;
            justify-content: center;
          }

          .content-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .search-container {
            width: 100%;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .dashboard-cards {
            grid-template-columns: 1fr;
          }

          .modal {
            margin: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default MemberManagement;
