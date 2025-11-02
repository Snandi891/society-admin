import { useEffect, useState, useRef } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import {
  FiRefreshCw,
  FiUsers,
  FiCalendar,
  FiStar,
  FiAward,
  FiTrendingUp,
  FiZap,
} from "react-icons/fi";

const TOTAL_SEATS = 100;
const YEAR_OPTIONS = [2023, 2024, 2025, 2026, 2027];

const MemberCircleChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [animateRefresh, setAnimateRefresh] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [chartAnimation, setChartAnimation] = useState(false);
  const [stats, setStats] = useState({
    growth: 12.5,
    efficiency: 94.2,
    rank: 1,
  });
  const [particleAnimation, setParticleAnimation] = useState(false);
  const containerRef = useRef(null);

  const fetchMembers = async () => {
    setAnimateRefresh(true);
    setLoading(true);
    setChartAnimation(false);
    setParticleAnimation(false);

    try {
      // Trigger particle animation
      setParticleAnimation(true);

      await new Promise((resolve) => setTimeout(resolve, 800));

      const res = await fetch("/api/members");
      const data = await res.json();

      const membersInYear = data.filter(
        (member) =>
          new Date(member.createdAt).getFullYear() === Number(selectedYear)
      );

      const occupied = membersInYear.length;
      const free = TOTAL_SEATS - occupied;

      setChartData([
        { name: "Occupied", value: occupied, color: "#10B981" },
        { name: "Available", value: free > 0 ? free : 0, color: "#F0F4F8" },
      ]);

      setStats({
        growth: Math.random() * 20 + 5,
        efficiency: Math.random() * 10 + 90,
        rank: 1,
      });

      setTimeout(() => {
        setChartAnimation(true);
        setTimeout(() => setParticleAnimation(false), 1000);
      }, 300);
    } catch (err) {
      console.error("Error fetching members:", err);
    }
    setLoading(false);
    setTimeout(() => setAnimateRefresh(false), 500);
  };

  useEffect(() => {
    fetchMembers();
  }, [selectedYear]);

  // Light theme gradients
  const COLORS = ["url(#lightGradient)", "url(#availableLightGradient)"];
  const GLOW_COLORS = ["#10B981", "#6EE7B7", "#34D399", "#10B981"];

  return (
    <div
      ref={containerRef}
      className="relative bg-gradient-to-br from-white via-blue-50 to-emerald-50 rounded-3xl shadow-2xl p-8 overflow-hidden border border-white/60 transform transition-all duration-700 hover:shadow-3xl"
      style={{
        background: `linear-gradient(135deg, #ffffff 0%, #f0f9ff 30%, #f0fdf4 70%, #ffffff 100%)`,
        boxShadow:
          "0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.8)",
      }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-emerald-200/40 to-cyan-200/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-200/40 to-purple-200/40 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)"></div>

        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(16, 185, 129, 0.2) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(16, 185, 129, 0.2) 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
              animation: "gridMove 20s linear infinite",
            }}
          ></div>
        </div>
      </div>

      {/* Floating Particles for Light Theme */}
      {particleAnimation && (
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full opacity-70"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `floatUp ${
                  1.5 + Math.random() * 2
                }s ease-out forwards`,
                transform: "translateY(100vh)",
              }}
            />
          ))}
        </div>
      )}

      {/* Header Section */}
      <div className="relative z-10 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-3 bg-white rounded-2xl border border-white shadow-2xl transform transition-transform duration-300 group-hover:scale-110"></div>
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Membership Analytics
              </h2>
              <p className="text-gray-600 mt-1 flex items-center gap-2">
                <FiZap className="w-4 h-4 text-amber-500 animate-pulse" />
                Real-time occupancy intelligence dashboard
              </p>
            </div>
          </div>

          {/* Rank Badge */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative px-4 py-2 bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-200 shadow-lg transform transition-transform duration-300 group-hover:scale-105">
              <div className="flex items-center gap-2">
                <FiAward className="w-5 h-5 text-amber-600" />
                <span className="text-amber-600 font-bold">#1</span>
                <span className="text-gray-700 text-sm">Global Rank</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/80 shadow-lg hover:shadow-xl transition-all duration-300 group hover:border-emerald-300">
            <div className="flex items-center gap-2 text-gray-600 group-hover:text-emerald-600 transition-colors">
              <FiTrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">Growth Rate</span>
            </div>
            <div className="flex items-end gap-1 mt-1">
              <span className="text-2xl font-bold text-gray-800">
                {stats.growth.toFixed(1)}%
              </span>
              <span className="text-emerald-600 text-sm mb-1 animate-bounce">
                ↑
              </span>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/80 shadow-lg hover:shadow-xl transition-all duration-300 group hover:border-cyan-300">
            <div className="text-gray-600 group-hover:text-cyan-600 transition-colors text-sm font-medium">
              System Efficiency
            </div>
            <div className="text-2xl font-bold text-gray-800 mt-1">
              {stats.efficiency.toFixed(1)}%
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/80 shadow-lg hover:shadow-xl transition-all duration-300 group hover:border-purple-300">
            <div className="text-gray-600 group-hover:text-purple-600 transition-colors text-sm font-medium">
              Total Capacity
            </div>
            <div className="text-2xl font-bold text-gray-800 mt-1">
              {TOTAL_SEATS}
            </div>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="relative z-10 flex flex-wrap gap-3 items-center mb-8 p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/90 shadow-2xl transform transition-all duration-300 hover:scale-[1.01]">
        <div className="flex items-center gap-2 bg-white/90 px-4 py-2 rounded-xl border border-gray-200/80 shadow-sm">
          <FiCalendar className="w-4 h-4 text-cyan-600" />
          <label className="text-sm font-medium text-gray-700">
            Analysis Year
          </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-transparent border-0 focus:ring-0 text-gray-800 font-medium cursor-pointer"
          >
            {YEAR_OPTIONS.map((year) => (
              <option key={year} value={year} className="bg-white">
                {year}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={fetchMembers}
          className={`flex items-center gap-3 px-5 py-2.5 rounded-xl font-semibold transition-all duration-500 transform hover:scale-105 shadow-2xl relative overflow-hidden group
            ${
              animateRefresh
                ? "animate-pulse bg-gradient-to-r from-cyan-500 to-emerald-500"
                : "bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500"
            } text-white`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <FiRefreshCw
            className={`w-4 h-4 transition-transform duration-700 z-10 ${
              loading ? "animate-spin" : animateRefresh ? "rotate-180" : ""
            }`}
          />
          <span className="z-10">Sync Data</span>
        </button>

        <button
          onClick={() => setSelectedYear(new Date().getFullYear())}
          className="px-5 py-2.5 bg-white/90 hover:bg-white text-gray-700 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg border border-gray-200/80 backdrop-blur-sm"
        >
          Reset View
        </button>
      </div>

      {/* Main Chart Container */}
      <div className="relative">
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <defs>
              {/* Light Theme Gradient for Occupied */}
              <linearGradient
                id="lightGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#10B981" stopOpacity={1} />
                <stop offset="50%" stopColor="#34D399" stopOpacity={1} />
                <stop offset="100%" stopColor="#6EE7B7" stopOpacity={1} />
              </linearGradient>

              {/* Available Gradient for Light Theme */}
              <linearGradient
                id="availableLightGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#F0F4F8" stopOpacity={1} />
                <stop offset="100%" stopColor="#E5E9F0" stopOpacity={1} />
              </linearGradient>

              {/* Glow Effect for Light Theme */}
              <filter
                id="lightGlow"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={chartAnimation ? 140 : 0}
              innerRadius={90}
              paddingAngle={3}
              onMouseEnter={(_, index) => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              labelLine={false}
              startAngle={90}
              endAngle={chartAnimation ? 450 : 90}
              animationDuration={1200}
              animationEasing="ease-out"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="white"
                  strokeWidth={4}
                  style={{
                    filter: hoveredIndex === index ? "url(#lightGlow)" : "none",
                    transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    transform:
                      hoveredIndex === index ? "scale(1.08)" : "scale(1)",
                    cursor: "pointer",
                    opacity: chartAnimation ? 1 : 0,
                  }}
                />
              ))}
            </Pie>

            {/* Animated Center Text */}
            <text
              x="50%"
              y="45%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent transition-all duration-700"
              style={{
                opacity: chartAnimation ? 1 : 0,
                filter: "drop-shadow(0 2px 4px rgba(16, 185, 129, 0.2))",
              }}
            >
              {chartData[0]?.value || 0}
            </text>
            <text
              x="50%"
              y="58%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-sm font-semibold text-gray-600 transition-all duration-700"
              style={{ opacity: chartAnimation ? 1 : 0 }}
            >
              Seats Occupied
            </text>
            <text
              x="50%"
              y="65%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs text-gray-500 transition-all duration-700"
              style={{ opacity: chartAnimation ? 1 : 0 }}
            >
              {((chartData[0]?.value / TOTAL_SEATS) * 100 || 0).toFixed(1)}%
              Utilization
            </text>

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-2xl border border-gray-200/80 transform transition-all duration-300">
                      <p className="font-bold text-gray-800 text-lg">
                        {payload[0].name}
                      </p>
                      <p className="text-xl font-semibold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                        {payload[0].value} Seats
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {((payload[0].value / TOTAL_SEATS) * 100).toFixed(1)}%
                        of total capacity
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Enhanced Loading Overlay for Light Theme */}
        {loading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-emerald-100 rounded-full"></div>
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-emerald-500 rounded-full animate-spin"></div>
                <div
                  className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-r-cyan-500 rounded-full animate-spin"
                  style={{ animationDelay: "0.1s" }}
                ></div>
              </div>
              <p className="text-gray-600 font-medium">
                Loading premium analytics...
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Stats Footer for Light Theme */}
      <div className="relative z-10 mt-8 grid grid-cols-2 gap-4">
        <div className="group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-green-400/10 group-hover:from-emerald-400/20 group-hover:to-green-400/20 transition-all duration-500"></div>
          <div className="relative bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-emerald-200/80 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">
                    Occupied Seats
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-800 mt-2">
                  {chartData[0]?.value || 0}
                  <span className="text-sm text-gray-500 ml-2">
                    / {TOTAL_SEATS}
                  </span>
                </p>
              </div>
              <div className="text-right">
                <div className="text-emerald-600 text-lg font-bold animate-pulse">
                  +{stats.growth.toFixed(1)}%
                </div>
                <div className="text-gray-500 text-xs">YoY Growth</div>
              </div>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 group-hover:from-blue-400/20 group-hover:to-cyan-400/20 transition-all duration-500"></div>
          <div className="relative bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-cyan-200/80 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">
                    Available Seats
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-800 mt-2">
                  {chartData[1]?.value || TOTAL_SEATS}
                  <span className="text-sm text-gray-500 ml-2">remaining</span>
                </p>
              </div>
              <div className="text-right">
                <div className="text-cyan-600 text-lg font-bold">
                  {stats.efficiency.toFixed(1)}%
                </div>
                <div className="text-gray-500 text-xs">System Efficiency</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes floatUp {
          0% {
            transform: translateY(100vh) scale(0);
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(-100px) scale(1);
            opacity: 0;
          }
        }

        @keyframes gridMove {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(-50px, -50px);
          }
        }

        .shadow-3xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15),
            0 0 0 1px rgba(255, 255, 255, 0.9);
        }

        .bg-radial-gradient {
          background-image: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
};

export default MemberCircleChart;
