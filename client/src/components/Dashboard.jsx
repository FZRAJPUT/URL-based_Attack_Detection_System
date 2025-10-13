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
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

const COLORS = ["#4F46E5", "#06B6D4", "#F97316", "#EF4444", "#10B981", "#A78BFA"];

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
      const res = await axios.get("https://url-based-attack-detection-system.onrender.com/api/attacks");
      // Expecting an array of attack objects. Example fields used below:
      // { _id, type, ip, status, url, createdAt }
      setAttacks(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching attacks:", error);
      setAttacks([]);
    } finally {
      setLoading(false);
    }
  };

  // Filtered list for the table
  const filteredAttacks = useMemo(() => {
    if (!filter) return attacks;
    const q = filter.toLowerCase();
    return attacks.filter(
      (a) =>
        a.type?.toLowerCase().includes(q) ||
        a.ip?.toLowerCase().includes(q) ||
        a.status?.toLowerCase().includes(q) ||
        a.url?.toLowerCase().includes(q)
    );
  }, [attacks, filter]);

  // Chart data: counts by attack type
  const attacksByType = useMemo(() => {
    const map = new Map();
    attacks.forEach((a) => {
      const t = a.attack_type || "Unknown";
      map.set(t, (map.get(t) || 0) + 1);
    });
    return Array.from(map.entries()).map(([type, count]) => ({ type, count }));
  }, [attacks]);

  // Chart data: status distribution
  const statusDistribution = useMemo(() => {
    const map = new Map();
    attacks.forEach((a) => {
      const s = a.status || "unknown";
      map.set(s, (map.get(s) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [attacks]);

  // Time series: attacks per day (requires createdAt or timestamp)
  const attacksOverTime = useMemo(() => {
    const map = new Map();
    attacks.forEach((a) => {
      const raw = a.createdAt || a.timestamp || a.date || null;
      const d = raw ? new Date(raw) : null;
      const day = d && !isNaN(d.getTime()) ? d.toISOString().slice(0, 10) : "unknown";
      map.set(day, (map.get(day) || 0) + 1);
    });
    // Convert to sorted array, putting 'unknown' last
    const arr = Array.from(map.entries()).map(([date, count]) => ({ date, count }));
    arr.sort((x, y) => {
      if (x.date === "unknown") return 1;
      if (y.date === "unknown") return -1;
      return x.date.localeCompare(y.date);
    });
    return arr;
  }, [attacks]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-indigo-600">
        🛡️ URL-based Attack Detection Dashboard
      </h1>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="flex items-center gap-3 w-full md:w-2/3">
          <input
            type="text"
            placeholder="🔍 Filter by type, IP, status or URL..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded-lg p-2 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            onClick={fetchAttacks}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-sm"
          >
            Refresh
          </button>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <ExportButton data={filteredAttacks} filename="attacks-export.csv" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="col-span-1 lg:col-span-2 bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3">Attacks by Type</h2>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={attacksByType} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Count">
                  {attacksByType.map((_, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-1 bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3">Status Distribution</h2>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {statusDistribution.map((_, idx) => (
                    <Cell key={`cell-status-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* <div className="bg-white shadow-lg rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Attacks Over Time</h2>
        <div style={{ width: "100%", height: 220 }}>
          <ResponsiveContainer>
            <LineChart data={attacksOverTime} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#4F46E5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div> */}

      <div className="overflow-x-auto bg-white shadow-xl rounded-xl border border-gray-200">
  <table className="min-w-full table-auto divide-y divide-gray-200">
    <thead className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
      <tr>
        <th className="p-3 text-left text-sm font-medium uppercase tracking-wider">#</th>
        <th className="p-3 text-left text-sm font-medium uppercase tracking-wider">Attack Type</th>
        <th className="p-3 text-left text-sm font-medium uppercase tracking-wider">IP Address</th>
        <th className="p-3 text-left text-sm font-medium uppercase tracking-wider">Status</th>
        <th className="p-3 text-left text-sm font-medium uppercase tracking-wider">URL</th>
        <th className="p-3 text-left text-sm font-medium uppercase tracking-wider">Date</th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {loading ? (
        <tr>
          <td colSpan={6} className="text-center py-6 text-gray-500 font-medium">
            Loading...
          </td>
        </tr>
      ) : filteredAttacks.length > 0 ? (
        filteredAttacks.map((a, index) => (
          <tr
            key={a._id || index}
            className="hover:bg-gray-50 transition-colors duration-200"
          >
            <td className="p-3 text-sm">{index + 1}</td>
            <td
              className="p-3 text-sm font-semibold text-indigo-700"
              title={a.attack_type === "SSRF" ? "Server‑Side Request Forgery" : ""}
            >
              {a.attack_type}
            </td>
            <td className="p-3 text-sm text-gray-700">{a.source_ip}</td>
            <td className="p-3">
              <span
                className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                  a.status !== "Safe"
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {a.status}
              </span>
            </td>
            <td className="p-3 text-sm text-gray-600 max-w-xs break-words hover:text-indigo-600 transition-colors duration-200">
              {a.url}
            </td>
            <td className="p-3 text-sm text-gray-500">
              {a.createdAt
                ? new Date(a.createdAt).toLocaleString()
                : a.timestamp
                ? new Date(a.timestamp).toLocaleString()
                : "-"}
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={6} className="text-center py-6 text-gray-400 font-medium">
            No attack data found.
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

    </div>
  );
}
