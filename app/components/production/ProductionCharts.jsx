import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ProductionCharts = ({ filteredData }) => {
  // Calculate monthly production data
  const monthlyProductionData = useMemo(() => {
    // If no data, return empty array
    if (!filteredData || filteredData.length === 0) {
      return [];
    }

    // Group data by month
    const monthlyGroups = {};
    
    filteredData.forEach(item => {
      if (!item.Date) return;
      
      try {
        const dateParts = item.Date.split('-');
        if (dateParts.length === 3) {
          // Assuming DD-MM-YYYY format
          const month = parseInt(dateParts[1], 10);
          const year = parseInt(dateParts[2], 10);
          const monthKey = `${year}-${month.toString().padStart(2, '0')}`;
          const monthName = new Date(0, month - 1).toLocaleString('default', { month: 'long' });
          
          // Initialize the month group if it doesn't exist
          if (!monthlyGroups[monthKey]) {
            monthlyGroups[monthKey] = {
              name: monthName,
              production: 0,
              count: 0
            };
          }
          
          // Add production to the month group
          const production = parseFloat(item.Production_Units);
          if (!isNaN(production)) {
            monthlyGroups[monthKey].production += production;
            monthlyGroups[monthKey].count += 1;
          }
        }
      } catch (e) {
        console.error("Date parsing error:", e);
      }
    });
    
    // Convert grouped data to array
    return Object.values(monthlyGroups);
  }, [filteredData]);

  // Calculate daily production data
  const dailyProductionData = useMemo(() => {
    // If no data, return empty array
    if (!filteredData || filteredData.length === 0) {
      return [];
    }

    // Group data by day
    const dailyGroups = {};
    
    filteredData.forEach(item => {
      if (!item.Date) return;
      
      try {
        const date = item.Date;
        
        // Initialize the day group if it doesn't exist
        if (!dailyGroups[date]) {
          dailyGroups[date] = {
            name: date,
            production: 0,
            count: 0
          };
        }
        
        // Add production to the day group
        const production = parseFloat(item.Production_Units);
        if (!isNaN(production)) {
          dailyGroups[date].production += production;
          dailyGroups[date].count += 1;
        }
      } catch (e) {
        console.error("Date parsing error:", e);
      }
    });
    
    // Convert grouped data to array and sort by date
    return Object.values(dailyGroups).sort((a, b) => {
      const dateA = a.name.split('-').map(Number);
      const dateB = b.name.split('-').map(Number);
      
      // Compare year, then month, then day
      if (dateA[2] !== dateB[2]) return dateA[2] - dateB[2];
      if (dateA[1] !== dateB[1]) return dateA[1] - dateB[1];
      return dateA[0] - dateB[0];
    });
  }, [filteredData]);

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Production Trends</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Production Chart */}
        <div className="backdrop-blur-md bg-white/90 p-4 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Monthly Production</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyProductionData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`${value} units`, 'Total Production']}
                  labelFormatter={(label) => {
                    return <span className="text-black">{`Month: ${label}`}</span>;
                  }}
                />
                <Legend />
                <Bar dataKey="production" name="Total Production" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-sm text-gray-600">Total production grouped by month</p>
        </div>
        
        {/* Daily Production Chart */}
        <div className="backdrop-blur-md bg-white/90 p-4 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Daily Production</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dailyProductionData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`${value} units`, 'Total Production']}
                  labelFormatter={(label) => {
                    return <span className="text-black">{`Date: ${label}`}</span>;
                  }}
                />
                <Legend />
                <Bar dataKey="production" name="Total Production" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-sm text-gray-600">Total production grouped by day</p>
        </div>
      </div>
    </div>
  );
};

export default ProductionCharts;