{
  announcements.map((a) => {
    // ✅ format date & time for each announcement
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
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        layout
        className={`p-4 md:p-5 rounded-xl border transition-all duration-300 flex flex-col group
        ${
          highlightedId === a._id
            ? "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-300 shadow-blue-200 shadow-lg ring-2 ring-blue-200"
            : "bg-white border-gray-200 hover:border-blue-200 shadow-md hover:shadow-lg"
        }`}
      >
        <div className="flex-grow mb-3">
          <p className="text-gray-800 text-base md:text-lg mb-3">{a.message}</p>
        </div>

        <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-4">
            {/* Date */}
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>{date}</span>
            </div>

            {/* Time */}
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-gray-500" />
              <span>{time}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">
              {formatDateTime(a.createdAt)}
            </span>
            <button
              onClick={() => handleDelete(a._id)}
              className="opacity-70 hover:opacity-100 text-red-500 hover:text-red-700 transition p-1 rounded-lg hover:bg-red-50"
              title="Delete announcement"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </motion.li>
    );
  });
}
