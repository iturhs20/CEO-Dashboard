import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const OEEBarGraph = ({ filteredData }) => {
  // State to track view mode: "monthly" or "daily"
  const [viewMode, setViewMode] = useState("monthly");

  // Check if filteredData is valid and not empty
  if (!filteredData || filteredData.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">No data available to display the chart.</p>
        <p className="text-gray-500 mt-2">Try adjusting your filter criteria.</p>
      </div>
    );
  }

  // Optimized date parsing function for DD-MM-YYYY format
  const getMonthFromDate = (dateStr) => {
    if (!dateStr) return null;
    
    try {
      // For format like "01-01-2023" - directly parse DD-MM-YYYY
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return parseInt(parts[1], 10); // Month is the second part
      }
    } catch (e) {
      console.error("Date parsing error:", e);
    }
    
    return null;
  };
  
  // Function to extract day from date (DD-MM-YYYY)
  const getDayFromDate = (dateStr) => {
    if (!dateStr) return null;
    
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return {
          day: parseInt(parts[0], 10),
          month: parseInt(parts[1], 10),
          year: parseInt(parts[2], 10)
        };
      }
    } catch (e) {
      console.error("Date parsing error:", e);
    }
    
    return null;
  };

  // Calculate average OEE data based on view mode
  const chartData = useMemo(() => {
    console.log("Calculating OEE with", filteredData.length, "records");
    
    // Limit processing to at most 10000 records for performance
    const dataToProcess = filteredData.length > 10000 ? 
      filteredData.slice(0, 10000) : 
      filteredData;
    
    if (viewMode === "monthly") {
      // Monthly calculation - use object for faster lookups
      const oeeByMonth = {};
      
      dataToProcess.forEach(item => {
        if (!item.Date || !item.OEE) return;
        
        const month = getMonthFromDate(item.Date);
        if (!month) return;
        
        const oee = parseFloat(item.OEE);
        if (isNaN(oee)) return;
        
        if (!oeeByMonth[month]) {
          oeeByMonth[month] = { totalOEE: 0, count: 0 };
        }
        
        oeeByMonth[month].totalOEE += oee;
        oeeByMonth[month].count += 1;
      });

      console.log("OEE data by month:", oeeByMonth);

      // Calculate average OEE for each month
      return Object.keys(oeeByMonth)
        .map(month => {
          const monthNum = parseInt(month, 10);
          return {
            period: new Date(0, monthNum - 1).toLocaleString('default', { month: 'long' }),
            averageOEE: parseFloat((oeeByMonth[month].totalOEE / oeeByMonth[month].count).toFixed(2)),
            sortKey: monthNum // For sorting
          };
        })
        .sort((a, b) => a.sortKey - b.sortKey);
    } else {
      // Daily calculation
      const oeeByDay = {};
      
      dataToProcess.forEach(item => {
        if (!item.Date || !item.OEE) return;
        
        const dateParts = getDayFromDate(item.Date);
        if (!dateParts) return;
        
        // Create a key in format DD-MM (without year)
        const dayKey = `${dateParts.day}-${dateParts.month}`;
        // For sorting: month*100 + day to keep chronological order
        const sortValue = (dateParts.month * 100) + dateParts.day;
        
        const oee = parseFloat(item.OEE);
        if (isNaN(oee)) return;
        
        if (!oeeByDay[dayKey]) {
          oeeByDay[dayKey] = { 
            totalOEE: 0, 
            count: 0, 
            sortValue: sortValue,
            display: `${dateParts.day} ${new Date(0, dateParts.month - 1).toLocaleString('default', { month: 'short' })}`
          };
        }
        
        oeeByDay[dayKey].totalOEE += oee;
        oeeByDay[dayKey].count += 1;
      });

      console.log("OEE data by day:", oeeByDay);

      // Calculate average OEE for each day
      return Object.keys(oeeByDay)
        .map(day => {
          return {
            period: oeeByDay[day].display,
            averageOEE: parseFloat((oeeByDay[day].totalOEE / oeeByDay[day].count).toFixed(2)),
            sortKey: oeeByDay[day].sortValue
          };
        })
        .sort((a, b) => a.sortKey - b.sortKey);
    }
  }, [filteredData, viewMode]);

  // Set color based on OEE value
  const getBarColor = (value) => {
    if (value < 65) return '#ef4444'; // Red for low OEE
    if (value < 85) return '#f59e0b'; // Amber for medium OEE
    return '#10b981'; // Green for high OEE
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      let performanceLevel;
      let textColor;
      
      if (value < 65) {
        performanceLevel = 'Below Target';
        textColor = 'text-red-600';
      } else if (value < 85) {
        performanceLevel = 'Acceptable';
        textColor = 'text-amber-600';
      } else {
        performanceLevel = 'Excellent';
        textColor = 'text-green-600';
      }
      
      return (
        <div className="bg-white/90 backdrop-blur-md rounded-lg shadow-lg p-4 border border-gray-200">
          <p className="font-medium text-black">{payload[0].payload.period}</p>
          <p className={`text-lg font-bold ${textColor}`}>{`OEE: ${value}%`}</p>
          <p className="text-sm text-gray-600">{performanceLevel}</p>
        </div>
      );
    }
    return null;
  };

  // Toggle view mode handler
  const handleToggleViewMode = () => {
    setViewMode(viewMode === "monthly" ? "daily" : "monthly");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Average OEE by {viewMode === "monthly" ? "Month" : "Day"}
        </h2>
        
        {/* View mode toggle slider */}
        <div className="flex items-center space-x-2">
          <span className={`text-sm ${viewMode === "monthly" ? "text-blue-600 font-medium" : "text-gray-500"}`}>Monthly</span>
          <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
            <input
              type="checkbox"
              id="toggle"
              className="absolute w-6 h-6 opacity-0 cursor-pointer"
              checked={viewMode === "daily"}
              onChange={handleToggleViewMode}
            />
            <label
              htmlFor="toggle"
              className={`block h-6 overflow-hidden rounded-full cursor-pointer ${
                viewMode === "daily" ? "bg-blue-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ${
                  viewMode === "daily" ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </label>
          </div>
          <span className={`text-sm ${viewMode === "daily" ? "text-blue-600 font-medium" : "text-gray-500"}`}>Daily</span>
        </div>
        
        <div className="flex gap-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span className="text-sm text-gray-600">Below Target (&lt;65%)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
            <span className="text-sm text-gray-600">Acceptable (65-85%)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm text-gray-600">Excellent (&gt;85%)</span>
          </div>
        </div>
      </div>

      <div className="mt-4">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart 
              data={chartData} 
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis 
                dataKey="period" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 12 }}
                angle={viewMode === "daily" ? -45 : 0}
                textAnchor={viewMode === "daily" ? "end" : "middle"}
                height={viewMode === "daily" ? 80 : 50}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 12 }}
                domain={[0, 100]}
                label={{ 
                  value: 'OEE (%)', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fill: '#6b7280', fontSize: 14 }
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="averageOEE" 
                name="Average OEE" 
                radius={[4, 4, 0, 0]}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.averageOEE)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">No data available for the selected filters</p>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default OEEBarGraph;