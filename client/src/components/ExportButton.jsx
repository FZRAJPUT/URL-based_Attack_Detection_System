import { useState } from "react";
import axios from "axios";

const ExportButton = () => {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    try {
      setLoading(true);

      const response = await axios.get(import.meta.env.VITE_MY_API+"/attacks/export", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "attacks.csv");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error exporting file:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className={`${loading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-indigo-500 hover:opacity-90"
        } text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 shadow-md`}
    >
      {loading ? "Exporting..." : "Export Attacks (CSV)"}
    </button>
  );
};

export default ExportButton;
