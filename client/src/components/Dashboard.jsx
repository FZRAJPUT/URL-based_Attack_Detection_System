import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import ExportButton from "./ExportButton";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";

const COLORS = ["#4F46E5", "#06B6D4", "#10B981", "#F97316", "#A78BFA"];

export default function Dashboard() {
  const [attacks, setAttacks] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAttacks();
  }, []);

  const fetchAttacks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(import.meta.env.VITE_MY_API + "/attacks", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setAttacks(Array.isArray(res.data.attacks) ? res.data.attacks : []);
    } catch (error) {
      console.error("Error fetching attacks:", error);
      setAttacks([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredAttacks = useMemo(() => {
    if (!filter) return attacks;
    const q = filter.toLowerCase();
    return attacks.filter(
      (a) =>
        a.attack_type?.toLowerCase().includes(q) ||
        a.status?.toLowerCase().includes(q) ||
        a.url?.toLowerCase().includes(q)
    );
  }, [attacks, filter]);

  const attacksByType = useMemo(() => {
    const map = new Map();
    attacks.forEach((a) => {
      const t = a.attack_type || "Unknown";
      map.set(t, (map.get(t) || 0) + 1);
    });
    return Array.from(map.entries()).map(([type, count]) => ({ type, count }));
  }, [attacks]);

  return (
    <div className="min-h-screen pt-[70px] bg-gradient-to-b from-slate-100 via-slate-50 to-white p-6 flex flex-col items-center">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full max-w-6xl mb-8">
       
        <div className="flex items-center gap-3">
          <button
            onClick={fetchAttacks}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium shadow hover:bg-indigo-700 transition"
          >
            Refresh
          </button>
          <ExportButton data={filteredAttacks} filename="attacks-export.csv" />
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-6 w-full max-w-6xl mb-8">
        <h2 className="text-lg font-semibold mb-3 text-slate-800">
          Attack Distribution by Type
        </h2>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={attacksByType}
              margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
              barCategoryGap="20%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="type" angle={-20} textAnchor="end" tick={{ fill: "#475569" }} />
              <YAxis tick={{ fill: "#475569" }} />
              <Tooltip />
              <Bar dataKey="count" name="Count">
                {attacksByType.map((_, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      

      <div className="bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden w-full max-w-6xl">
  <div className="p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
    <input
      type="text"
      placeholder="Filter by attack type, status, or URL..."
      value={filter}
      onChange={(e) => setFilter(e.target.value)}
      className="border border-slate-200 rounded-xl p-2.5 w-full sm:w-1/2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
    />
  </div>

  {/* Responsive Table Wrapper */}
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-slate-200 text-sm sm:text-base">
      <thead className="bg-indigo-50">
        <tr>
          <th className="p-3 text-left font-semibold text-slate-600 whitespace-nowrap">#</th>
          <th className="p-3 text-left font-semibold text-slate-600 whitespace-nowrap">Attack Type</th>
          <th className="p-3 text-left font-semibold text-slate-600 whitespace-nowrap">Status</th>
          <th className="p-3 text-left font-semibold text-slate-600 whitespace-nowrap">URL</th>
          <th className="p-3 text-left font-semibold text-slate-600 whitespace-nowrap">Date</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {loading ? (
          <tr>
            <td colSpan={5} className="text-center py-6 text-slate-500">
              Loading data...
            </td>
          </tr>
        ) : filteredAttacks.length > 0 ? (
          filteredAttacks.map((a, index) => (
            <tr
              key={a._id || index}
              className="hover:bg-slate-50 transition-colors duration-200"
            >
              <td className="p-3 text-slate-600">{index + 1}</td>
              <td className="p-3 font-medium text-indigo-600">{a.attack_type}</td>
              <td className="p-3">
                <span
                  className={`px-3 py-1 text-xs sm:text-sm font-semibold rounded-full ${
                    a.status !== "Safe"
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {a.status}
                </span>
              </td>
              <td className="p-3 text-slate-600 max-w-[180px] sm:max-w-xs break-words">
                {a.url}
              </td>
             <td className="p-3 text-sm text-slate-500">
  {a.createdAt || a.timestamps || a.date || a.time
    ? new Date(a.createdAt || a.timestamps || a.date || a.time).toLocaleString()
    : "-"}
</td>

            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={5} className="text-center py-6 text-slate-400">
              No attack data found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>

    </div>
  );
}
