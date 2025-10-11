import { useState } from "react";
import axios from "axios";

const URLCheck = () => {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!url) return alert("Please enter a URL to check");

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/attacks/analyze", { url });
      console.log(res.data)
      setResult(res.data.attack);
    } catch (error) {
      console.error("Error checking URL:", error);
      alert("Error checking URL. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-b from-indigo-100 to-white p-6">
      <h2 className="text-3xl font-bold mb-8 text-indigo-700">URL Safety Checker</h2>

      <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-lg mb-6">
        <input
          type="text"
          placeholder="Enter URL to analyze..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />
        <button
          onClick={handleCheck}
          disabled={loading}
          className={`w-full sm:w-auto px-6 py-3 rounded-lg text-white font-semibold transition-all ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
        >
          {loading ? "Checking..." : "Check"}
        </button>
      </div>

      {result && (
        <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-600">
          <h3 className="text-xl font-semibold mb-3 text-indigo-700">Result</h3>
          <p><span className="font-medium">Attack type:</span> {result.attack_type || 'N/A'}</p>
          <p><span className="font-medium">Status:</span> {result.status || 'N/A'}</p>
          <p className="break-words"><span className="font-medium">URL:</span> {result.url}</p>
        </div>
      )}
    </div>
  );
};

export default URLCheck;