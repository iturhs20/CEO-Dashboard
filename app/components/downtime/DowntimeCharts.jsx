import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, BarChart2 } from 'lucide-react';

const DowntimeCharts = ({ filteredData }) => {
  const [chartView, setChartView] = useState('monthly');

  // Prepare monthly downtime data
  const monthlyDowntimeData = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return [];
    
    const monthlyData = {};
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    filteredData.forEach(item => {
      if (!item.Date) return;
      
      try {
        const dateParts = item.Date.split('-');
        if (dateParts.length === 3) {
          // Assuming DD-MM-YYYY format
          const month = parseInt(dateParts[1], 10) - 1; // 0-based index for months
          const monthName = monthNames[month];
          
          const downtimeMinutes = parseFloat(item.Downtime_Minutes);
          if (!isNaN(downtimeMinutes)) {
            if (!monthlyData[monthName]) {
              monthlyData[monthName] = { name: monthName, downtime: 0, order: month };
            }
            monthlyData[monthName].downtime += downtimeMinutes;
          }
        }
      } catch (e) {
        console.error("Date parsing error:", e);
      }
    });
    
    // Convert to array and sort by month order
    return Object.values(monthlyData)
      .sort((a, b) => a.order - b.order)
      .map(item => ({
        name: item.name,
        downtime: parseFloat(item.downtime.toFixed(2))
      }));
  }, [filteredData]);
  
  // Prepare daily downtime data
  const dailyDowntimeData = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return [];
    
    const dailyData = {};
    
    filteredData.forEach(item => {
      if (!item.Date) return;
      
      const date = item.Date; // Already in DD-MM-YYYY format
      const downtimeMinutes = parseFloat(item.Downtime_Minutes);
      
      if (!isNaN(downtimeMinutes)) {
        if (!dailyData[date]) {
          dailyData[date] = { name: date, downtime: 0 };
        }
        dailyData[date].downtime += downtimeMinutes;
      }
    });
    
    // Convert to array and sort by date
    return Object.values(dailyData)
      .sort((a, b) => {
        const dateA = a.name.split('-').reverse().join('-');
        const dateB = b.name.split('-').reverse().join('-');
        return new Date(dateA) - new Date(dateB);
      })
      .map(item => ({
        name: item.name,
        downtime: parseFloat(item.downtime.toFixed(2))
      }));
  }, [filteredData]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Downtime Distribution</h2>
        
        <div className="inline-flex rounded-md shadow-sm">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${
              chartView === 'monthly' 
                ? 'bg-red-500 text-white border-red-500' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => setChartView('monthly')}
          >
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>Monthly</span>
            </div>
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-r-lg border ${
              chartView === 'daily' 
                ? 'bg-red-500 text-white border-red-500' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => setChartView('daily')}
          >
            <div className="flex items-center gap-2">
              <BarChart2 size={16} />
              <span>Daily</span>
            </div>
          </button>
        </div>
      </div>
      
      <div className="h-96 w-full backdrop-blur-md bg-white/90 rounded-xl shadow-md border border-gray-200 p-4">
        {chartView === 'monthly' ? (
          <>
            <h3 className="text-lg font-medium text-gray-700 mb-4">Monthly Downtime Summary</h3>
            {monthlyDowntimeData.length > 0 ? (
              <ResponsiveContainer width="100%" height="90%">
                <BarChart
                  data={monthlyDowntimeData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 65 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end"
                    height={70}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    label={{ 
                      value: 'Downtime (minutes)', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle' }
                    }} 
                  />
                  <Tooltip 
                    formatter={(value) => [`${value} minutes`, 'Downtime']}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Bar 
                    dataKey="downtime" 
                    name="Downtime (minutes)" 
                    fill="#f87171" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">No monthly data available</p>
              </div>
            )}
          </>
        ) : (
          <>
            <h3 className="text-lg font-medium text-gray-700 mb-4">Daily Downtime Summary</h3>
            {dailyDowntimeData.length > 0 ? (
              <ResponsiveContainer width="100%" height="90%">
                <BarChart
                  data={dailyDowntimeData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 65 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end"
                    height={70}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    label={{ 
                      value: 'Downtime (minutes)', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle' }
                    }} 
                  />
                  <Tooltip 
                    formatter={(value) => [`${value} minutes`, 'Downtime']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Bar 
                    dataKey="downtime" 
                    name="Downtime (minutes)" 
                    fill="#60a5fa" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">No daily data available</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DowntimeCharts;