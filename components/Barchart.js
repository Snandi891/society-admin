import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { FiRefreshCw } from "react-icons/fi";

const MemberBarChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [animateRefresh, setAnimateRefresh] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [aggregation, setAggregation] = useState("month"); // day, month, year
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchMembers = async () => {
    setAnimateRefresh(true);
    setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/members");
        const data = await res.json();

        const counts = {};

        data.forEach((member) => {
          if (!member.createdAt) return;
          const date = new Date(member.createdAt);

          // Skip out-of-range dates
          if (startDate && new Date(startDate) > date) return;
          if (endDate && new Date(endDate) < date) return;

          let key, label;

          if (aggregation === "day") {
            key = date.toISOString().slice(0, 10);
            label = key.split("-").reverse().join("/");
          } else if (aggregation === "month") {
            key = `${date.getFullYear()}-${date.getMonth()}`;
            label = `${date.toLocaleString("default", {
              month: "short",
            })} ${date.getFullYear()}`;
          } else if (aggregation === "year") {
            key = `${date.getFullYear()}`;
            label = `${date.getFullYear()}`;
          }

          counts[key] = counts[key] || { count: 0, label };
          counts[key].count += 1;
        });

        const chartItems = [];
        let current = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : new Date();

        if (!current) {
          // Default ranges
          const now = new Date();
          if (aggregation === "month") {
            for (let i = 11; i >= 0; i--) {
              const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
              const key = `${date.getFullYear()}-${date.getMonth()}`;
              const item = counts[key] || {
                count: 0,
                label: `${date.toLocaleString("default", {
                  month: "short",
                })} ${date.getFullYear()}`,
              };
              chartItems.push({
                month: item.label,
                count: item.count,
                isCurrent: key === `${now.getFullYear()}-${now.getMonth()}`,
              });
            }
          } else if (aggregation === "year") {
            const currentYear = now.getFullYear();
            for (let i = 4; i >= 0; i--) {
              const year = currentYear - i;
              const item = counts[year] || { count: 0, label: `${year}` };
              chartItems.push({
                month: item.label,
                count: item.count,
                isCurrent: year === currentYear,
              });
            }
          } else if (aggregation === "day") {
            for (let i = 29; i >= 0; i--) {
              const date = new Date();
              date.setDate(date.getDate() - i);
              const key = date.toISOString().slice(0, 10);
              const item = counts[key] || {
                count: 0,
                label: key.split("-").reverse().join("/"),
              };
              chartItems.push({
                month: item.label,
                count: item.count,
                isCurrent: key === new Date().toISOString().slice(0, 10),
              });
            }
          }
        } else {
          // Custom date range
          while (current <= end) {
            let key, label;
            if (aggregation === "day") {
              key = current.toISOString().slice(0, 10);
              label = key.split("-").reverse().join("/");
            } else if (aggregation === "month") {
              key = `${current.getFullYear()}-${current.getMonth()}`;
              label = `${current.toLocaleString("default", {
                month: "short",
              })} ${current.getFullYear()}`;
            } else if (aggregation === "year") {
              key = `${current.getFullYear()}`;
              label = `${current.getFullYear()}`;
            }

            const item = counts[key] || { count: 0, label };
            chartItems.push({
              month: item.label,
              count: item.count,
              isCurrent:
                aggregation === "day"
                  ? key === new Date().toISOString().slice(0, 10)
                  : aggregation === "month"
                  ? key ===
                    `${new Date().getFullYear()}-${new Date().getMonth()}`
                  : key === `${new Date().getFullYear()}`,
            });

            // Increment
            if (aggregation === "day") current.setDate(current.getDate() + 1);
            if (aggregation === "month")
              current.setMonth(current.getMonth() + 1);
            if (aggregation === "year")
              current.setFullYear(current.getFullYear() + 1);
          }
        }

        setChartData(chartItems);
        setRefreshKey((prev) => prev + 1);
      } catch (err) {
        console.error("Error fetching members:", err);
      }
      setLoading(false);
      setAnimateRefresh(false);
    }, 500);
  };

  useEffect(() => {
    fetchMembers();
  }, [aggregation, startDate, endDate]);

  const yTicks = Array.from({ length: 11 }, (_, i) => i * 3);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 relative">
      {/* Header: Date Range + Aggregation + Reset */}
      <div className="flex flex-wrap gap-2 items-center mb-4">
        <label>From:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-2 border rounded-lg"
        />
        <label>To:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 border rounded-lg"
        />
        <select
          value={aggregation}
          onChange={(e) => setAggregation(e.target.value)}
          className="p-2 border rounded-lg"
        >
          <option value="day">Day</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>
        <button
          onClick={fetchMembers}
          className={`flex items-center justify-center p-2 rounded-full shadow-lg transition-all duration-300
            ${
              animateRefresh
                ? "animate-pulse bg-indigo-500/80"
                : "bg-indigo-500 hover:bg-indigo-600"
            }`}
        >
          <FiRefreshCw
            className={`w-5 h-5 text-white transition-transform duration-500 ${
              loading ? "animate-spin" : animateRefresh ? "rotate-[360deg]" : ""
            }`}
          />
        </button>
        <button
          onClick={() => {
            setStartDate("");
            setEndDate("");
            setAggregation("month");
            fetchMembers();
          }}
          className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
        >
          Reset
        </button>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart key={refreshKey} data={chartData}>
          <defs>
            <linearGradient id="neonGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7F00FF" />
              <stop offset="100%" stopColor="#4F46E5" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#4B5563" }} />
          <YAxis
            ticks={yTicks}
            domain={[0, 30]}
            allowDecimals={false}
            tick={{ fontSize: 12, fill: "#4B5563" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              fontSize: "14px",
              color: "#111827",
            }}
          />
          <Bar
            dataKey="count"
            radius={[6, 6, 0, 0]}
            barSize={28}
            isAnimationActive={true}
            animationDuration={800}
            onMouseEnter={(_, index) => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.isCurrent ? "#10B981" : "url(#neonGradient)"}
                style={{
                  filter:
                    hoveredIndex === index
                      ? `drop-shadow(0 0 14px ${
                          entry.isCurrent ? "#10B981" : "#7F00FF"
                        })`
                      : "",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MemberBarChart;
