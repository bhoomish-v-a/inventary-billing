// import React from "react";
// import axios from "axios";
// import { FaDownload, FaFileExcel } from "react-icons/fa";
// import AdminPanel from "./AdminPanel";

// const ReportPage = () => {
//   const handleDownload = async () => {
//     try {
//       const response = await axios.get("http://localhost:3001/report/download", {
//         responseType: "blob",
//       });

//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", "Sales_Report.xlsx");
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (error) {
//       console.error("Download failed", error);
//       alert("Failed to download report.");
//     }
//   };

//   return (
//     <AdminPanel>
//       <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
//         <div className="bg-white p-10 rounded-2xl shadow-2xl text-center w-full max-w-md animate-fadeIn">
//           <div className="flex justify-center mb-5">
//             <FaFileExcel className="text-teal-500 text-5xl" />
//           </div>

//           <h2 className="text-3xl font-bold text-gray-800 mb-2">📈 Sales Report</h2>
//           <p className="text-gray-600 mb-6">Get insights by downloading your Excel report.</p>

//           <button
//             onClick={handleDownload}
//             className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-lg shadow hover:from-teal-600 hover:to-teal-700 transition-all duration-300 ease-in-out transform hover:scale-105"
//           >
//             <FaDownload className="text-lg" />
//             Download Report
//           </button>
//         </div>
//       </div>
//     </AdminPanel>
//   );
// };

// export default ReportPage;




import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaDownload, FaFileExcel } from "react-icons/fa";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import AdminPanel from "./AdminPanel";

const ReportPage = () => {
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3001/report/sales");
        setSalesData(res.data.sales);
        setCategoryData(res.data.categories);
      } catch (error) {
        console.error("Error fetching sales data", error);
      }
    };
    fetchData();
  }, []);

  const handleDownload = async () => {
    try {
      const response = await axios.get("http://localhost:3001/report/download", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Sales_Report.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download failed", error);
      alert("Failed to download report.");
    }
  };

  return (
    <AdminPanel>
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="bg-white p-10 rounded-2xl shadow-2xl text-center w-full max-w-md animate-fadeIn">
          <div className="flex justify-center mb-5">
            <FaFileExcel className="text-teal-500 text-5xl" />
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-2">📈 Sales Report</h2>
          <p className="text-gray-600 mb-6">Get insights by downloading your Excel report.</p>

          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-black font-semibold rounded-lg shadow hover:from-teal-600 hover:to-teal-700 transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            <FaDownload className="text-lg" />
            Download Report
          </button>
        </div>
      </div>

      {/* Charts Section */}
      <div className="px-6 py-10 bg-white shadow-lg rounded-xl mx-8 md:mx-16 mt-10">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">Sales Insights</h3>

        {/* BarChart for Sales over Time */}
        <div className="mb-8">
          <h4 className="text-xl font-semibold mb-4">Sales Over Time</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalAmount" fill="#3182CE" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PieChart for Sales by Category */}
        <div>
          <h4 className="text-xl font-semibold mb-4">Sales by Category</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" outerRadius={100}>
                {categoryData.map((_, index) => (
                  <Cell key={index} fill={["#0088FE", "#00C49F", "#FFBB28", "#FF8042"][index % 4]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AdminPanel>
  );
};

export default ReportPage;
