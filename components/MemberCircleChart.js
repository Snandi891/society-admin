import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { FiRefreshCw } from "react-icons/fi";

const TOTAL_SEATS = 100;
const YEAR_OPTIONS = [2024, 2025, 2026, 2027];

const MemberCircleChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [animateRefresh, setAnimateRefresh] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const fetchMembers = async () => {
    setAnimateRefresh(true);
    setLoading(true);
    try {
      const res = await fetch("/api/members");
      const data = await res.json();

      // Filter members by selected year
      const membersInYear = data.filter(
        (member) =>
          new Date(member.createdAt).getFullYear() === Number(selectedYear)
      );

      const occupied = membersInYear.length;
      const free = TOTAL_SEATS - occupied;

      setChartData([
        { name: "Occupied", value: occupied },
        { name: "Free", value: free > 0 ? free : 0 },
      ]);
    } catch (err) {
      console.error("Error fetching members:", err);
    }
    setLoading(false);
    setAnimateRefresh(false);
  };

  useEffect(() => {
    fetchMembers();
  }, [selectedYear]);

  const COLORS = ["#10B981", "#D1D5DB"]; // green for occupied, gray for free

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 relative">
      {/* Header: Year selector + Refresh + Reset */}
      <div className="flex flex-wrap gap-2 items-center mb-4">
        <label>Year:</label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="p-2 border rounded-lg"
        >
          {YEAR_OPTIONS.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
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
          onClick={() => setSelectedYear(new Date().getFullYear())}
          className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
        >
          Reset
        </button>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={60} // donut style
            paddingAngle={3}
            onMouseEnter={(_, index) => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            label={({ name, value }) => `${name}: ${value}`} // always show
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                style={{
                  filter:
                    hoveredIndex === index
                      ? `drop-shadow(0 0 14px ${
                          index === 0 ? "#10B981" : "#9CA3AF"
                        })`
                      : "",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
              />
            ))}
          </Pie>

          {/* Center text */}
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-gray-700 font-semibold text-lg"
          >
            Members
          </text>

          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              fontSize: "14px",
              color: "#111827",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MemberCircleChart;
