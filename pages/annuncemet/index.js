// pages/admin/announcement.js
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Megaphone,
  RotateCw,
  Trash2,
  Send,
  Clock,
  AlertCircle,
  CheckCircle2,
  Calendar,
  User,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function AnnouncementPage() {
  const [announcement, setAnnouncement] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [highlightedId, setHighlightedId] = useState(null);
  const textareaRef = useRef(null);

  // Fetch all announcements
  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/announcements/get");
      const data = await res.json();
      if (data.success) {
        const sorted = (data.announcements || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setAnnouncements(sorted);

        // Highlight newest announcement
        if (
          sorted.length > 0 &&
          sorted[0]?.createdAt !== announcements[0]?.createdAt
        ) {
          setHighlightedId(sorted[0]._id);
          setTimeout(() => setHighlightedId(null), 3500);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // ✅ Fetch announcements only once when page loads
    fetchAnnouncements();
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [announcement]);

  // Send announcement
  const handleSendAnnouncement = async () => {
    if (!announcement.trim()) {
      toast.error("Please enter an announcement message");
      return;
    }

    try {
      setSending(true);
      const res = await fetch("/api/announcements/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: announcement }),
      });
      const data = await res.json();
      if (data.success) {
        setAnnouncement("");
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
        }
        fetchAnnouncements();
        toast.success("Announcement sent successfully!");
      } else {
        toast.error(data.error || "Failed to send announcement");
      }
    } catch {
      toast.error("Network error - please try again");
    } finally {
      setSending(false);
    }
  };

  // Delete announcement with confirmation
  const handleDelete = async (id) => {
    const announcementToDelete = announcements.find((a) => a._id === id);
    if (!announcementToDelete) return;

    // Show confirmation toast
    toast(
      (t) => (
        <div className="flex flex-col items-start p-2">
          <div className="flex items-center gap-2 text-gray-700 mb-3">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            <span className="font-medium">Delete this announcement?</span>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            This action cannot be undone.
          </p>
          <div className="flex gap-2 self-end">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id);

                // Remove locally first for instant UI feedback
                setAnnouncements((prev) => prev.filter((a) => a._id !== id));

                // Call API to delete in backend
                try {
                  const res = await fetch("/api/announcements/get", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id }),
                  });
                  const data = await res.json();
                  if (!data.success) {
                    toast.error(data.error || "Failed to delete announcement");
                    // Restore locally if delete failed
                    setAnnouncements((prev) => [announcementToDelete, ...prev]);
                  } else {
                    toast.success("Announcement deleted successfully");
                  }
                } catch {
                  toast.error("Network error - please try again");
                  setAnnouncements((prev) => [announcementToDelete, ...prev]);
                }
              }}
              className="px-3 py-1 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      {
        duration: 10000,
      }
    );
  };

  // Format date and time with proper formatting
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

    // If less than 24 hours, show relative time
    if (diffInHours < 24) {
      if (diffInHours < 1) {
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        if (diffInMinutes < 1) return "Just now";
        return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
      }
      return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
    }

    // Otherwise, show full date and time
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format time in 12-hour format with AM/PM
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 md:p-8 relative">
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          className: "border border-gray-200 shadow-lg",
          duration: 4000,
          success: {
            iconTheme: {
              primary: "#2563eb",
              secondary: "#fff",
            },
          },
        }}
      />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-6 md:mb-8"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600 rounded-xl shadow-md">
            <Megaphone className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Announcement Manager
            </h1>
            <p className="text-sm text-gray-600">
              Broadcast important updates to your team
            </p>
          </div>
        </div>
        <button
          onClick={fetchAnnouncements}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-white text-blue-600 hover:bg-blue-50 rounded-xl border border-blue-200 transition-all shadow-sm hover:shadow-md disabled:opacity-50"
        >
          <RotateCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </motion.header>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Announcements List */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-full lg:w-3/5 bg-white p-4 rounded-2xl shadow-xl border border-blue-100 overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4 pb-1 border-b border-blue-50">
            <h2 className="text-lg font-semibold flex items-center text-gray-800">
              <Megaphone className="mr-2 text-blue-600" size={18} />
              Recent Announcements
            </h2>
            <span className="text-xs font-medium px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
              {announcements.length} total
            </span>
          </div>

          {/* No Announcements */}
          {announcements.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="p-3 bg-blue-100 rounded-full mb-3">
                <Megaphone className="text-blue-600" size={28} />
              </div>
              <h3 className="text-base font-medium text-gray-700 mb-1">
                No announcements yet
              </h3>
              <p className="text-gray-500 text-xs">
                Create your first announcement to get started
              </p>
            </div>
          ) : (
            // Announcements List
            <div className="overflow-y-auto flex-grow pr-1 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-50 max-h-96">
              <ul className="space-y-2">
                <AnimatePresence>
                  {announcements.map((a) => {
                    const dateObj = new Date(a.createdAtIST);
                    const date = dateObj.toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    });
                    const time = dateObj.toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    return (
                      <motion.li
                        key={a._id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        layout
                        className={`p-3 rounded-lg border transition-all duration-200 flex flex-col group
                  ${
                    highlightedId === a._id
                      ? "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-300 shadow-blue-200 shadow-md ring-1 ring-blue-200"
                      : "bg-white border-gray-200 hover:border-blue-200 shadow-sm hover:shadow-md"
                  }`}
                      >
                        {/* Announcement Message */}
                        <div className="flex-grow mb-2">
                          <p className="text-gray-800 text-sm break-words whitespace-pre-wrap">
                            {a.message}
                          </p>
                        </div>

                        {/* Date & Time */}
                        <div className="flex justify-between items-center text-xs text-gray-500 pt-1 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-gray-500" />
                              <span>{date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-gray-500" />
                              <span>{time}</span>
                            </div>
                          </div>

                          {/* Delete Button */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(a._id)}
                              className="opacity-70 hover:opacity-100 text-red-500 hover:text-red-700 transition p-1 rounded"
                              title="Delete announcement"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </ul>
            </div>
          )}
        </motion.div>

        {/* Right: Create Announcement */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full lg:w-3/5 bg-white p-5 md:p-6 rounded-2xl shadow-xl border border-blue-100"
        >
          <h2 className="text-xl font-semibold mb-6 flex items-center text-gray-800">
            <Send className="mr-2 text-blue-600" size={20} />
            Create New Announcement
          </h2>

          <div className="mb-6">
            <label
              htmlFor="announcement"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Your Message
            </label>
            <textarea
              ref={textareaRef}
              id="announcement"
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              placeholder="Type your important announcement here..."
              className="w-full p-4 border border-gray-300 rounded-xl mb-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none resize-none text-gray-700 placeholder-gray-400 transition"
              rows={4}
            />
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Markdown is supported</span>
              <span className={announcement.length > 500 ? "text-red-500" : ""}>
                {announcement.length}/500 characters
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSendAnnouncement}
              disabled={
                !announcement.trim() || sending || announcement.length > 500
              }
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-blue-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? (
                <>
                  <RotateCw className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Announcement
                </>
              )}
            </motion.button>

            <button
              onClick={() => setAnnouncement("")}
              disabled={!announcement}
              className="px-4 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear
            </button>
          </div>

          {/* Tips */}
          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <h3 className="text-sm font-medium text-blue-800 flex items-center mb-2">
              <CheckCircle2 className="w-4 h-4 mr-1" />
              Best Practices
            </h3>
            <ul className="text-xs text-blue-600 space-y-1">
              <li>• Keep announcements concise and to the point</li>
              <li>• Use clear language that everyone can understand</li>
              <li>
                • Important announcements should be sent during working hours
              </li>
              <li>• Double-check for typos before sending</li>
            </ul>
          </div>
        </motion.div>
      </div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-blue-50/80 flex justify-center items-center rounded-xl z-10"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
              />
              <p className="text-blue-800 font-medium">
                Loading announcements...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
