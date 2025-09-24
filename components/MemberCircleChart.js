import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { FiRefreshCw, FiUsers, FiCalendar } from "react-icons/fi";

const TOTAL_SEATS = 100;
const YEAR_OPTIONS = [2024, 2025, 2026, 2027];

const MemberCircleChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [animateRefresh, setAnimateRefresh] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [chartAnimation, setChartAnimation] = useState(false);

  const fetchMembers = async () => {
    setAnimateRefresh(true);
    setLoading(true);
    setChartAnimation(false);

    try {
      const res = await fetch("/api/members");
      const data = await res.json();

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

      setTimeout(() => setChartAnimation(true), 100);
    } catch (err) {
      console.error("Error fetching members:", err);
    }
    setLoading(false);
    setAnimateRefresh(false);
  };

  useEffect(() => {
    fetchMembers();
  }, [selectedYear]);

  const COLORS = ["url(#occupiedGradient)", "#F3F4F6"];
  const HOVER_COLORS = ["#059669", "#E5E7EB"];

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-8 relative overflow-hidden border border-gray-100 transform transition-all duration-500 hover:shadow-2xl">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-indigo-500"></div>
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-100 rounded-full opacity-20"></div>
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-100 rounded-full opacity-20"></div>

      <div className="relative z-10 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl shadow-lg">
            <FiUsers className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Membership Overview
          </h2>
        </div>
        <p className="text-gray-600 ml-1">
          Visual representation of seat occupancy
        </p>
      </div>

      <div className="relative z-10 flex flex-wrap gap-4 items-center mb-8 p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100">
        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
          <FiCalendar className="w-4 h-4 text-gray-500" />
          <label className="text-sm font-medium text-gray-700">Year:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-transparent border-0 focus:ring-0 text-gray-800 font-medium cursor-pointer"
          >
            {YEAR_OPTIONS.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={fetchMembers}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-500 transform hover:scale-105 shadow-lg
            ${
              animateRefresh
                ? "animate-pulse bg-gradient-to-r from-indigo-600 to-purple-600"
                : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
            } text-white`}
        >
          <FiRefreshCw
            className={`w-4 h-4 transition-transform duration-700 ${
              loading ? "animate-spin" : animateRefresh ? "rotate-180" : ""
            }`}
          />
          Refresh Data
        </button>

        <button
          onClick={() => setSelectedYear(new Date().getFullYear())}
          className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-md border border-gray-200"
        >
          Reset to Current
        </button>
      </div>

      <div className="relative">
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <defs>
              <linearGradient
                id="occupiedGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#10B981" stopOpacity={1} />
                <stop offset="100%" stopColor="#059669" stopOpacity={1} />
              </linearGradient>
            </defs>

            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={chartAnimation ? 120 : 0}
              innerRadius={80}
              paddingAngle={2}
              onMouseEnter={(_, index) => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              labelLine={false}
              label={({ name, value, percent }) =>
                `${name}: ${value} (${(percent * 100).toFixed(1)}%)`
              }
              startAngle={90}
              endAngle={chartAnimation ? 450 : 90}
              animationDuration={800}
              animationEasing="ease-out"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    hoveredIndex === index
                      ? HOVER_COLORS[index % HOVER_COLORS.length]
                      : COLORS[index % COLORS.length]
                  }
                  stroke="white"
                  strokeWidth={3}
                  style={{
                    filter:
                      hoveredIndex === index
                        ? "drop-shadow(0 8px 16px rgba(0,0,0,0.2))"
                        : "none",
                    transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    transform:
                      hoveredIndex === index ? "scale(1.05)" : "scale(1)",
                    cursor: "pointer",
                  }}
                />
              ))}
            </Pie>

            <text
              x="50%"
              y="45%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent transition-all duration-500"
              style={{ opacity: chartAnimation ? 1 : 0 }}
            >
              {chartData[0]?.value || 0}
            </text>
            <text
              x="50%"
              y="55%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-sm font-medium text-gray-500 transition-all duration-500"
              style={{ opacity: chartAnimation ? 1 : 0 }}
            >
              Occupied Seats
            </text>

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-2xl border border-gray-200 transform transition-all duration-300">
                      <p className="font-bold text-gray-800">
                        {payload[0].name}
                      </p>
                      <p className="text-lg font-semibold text-emerald-600">
                        {payload[0].value} Seats
                      </p>
                      <p className="text-sm text-gray-600">
                        {((payload[0].value / TOTAL_SEATS) * 100).toFixed(1)}%
                        of total
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {loading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
              <p className="text-gray-600 font-medium">Loading data...</p>
            </div>
          </div>
        )}
      </div>

      <div className="relative z-10 mt-6 grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-2xl border border-emerald-100 transform transition-all duration-300 hover:scale-105">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-600">Occupied</span>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-1">
            {chartData[0]?.value || 0}{" "}
            <span className="text-sm text-gray-500">seats</span>
          </p>
        </div>

        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-2xl border border-gray-200 transform transition-all duration-300 hover:scale-105">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span className="text-sm font-medium text-gray-600">Available</span>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-1">
            {chartData[1]?.value || TOTAL_SEATS}{" "}
            <span className="text-sm text-gray-500">seats</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MemberCircleChart;
