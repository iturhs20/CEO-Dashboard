import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

const MachinePerformanceChart = ({ filteredData }) => {
  // Check if filteredData is valid and not empty
  if (!filteredData || filteredData.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 text-lg">No data available to display machine performance.</p>
        <p className="text-gray-500 mt-2">Try adjusting your filter criteria.</p>
      </div>
    );
  }

  // Process and calculate average OEE by Machine ID
  const machinePerformanceData = useMemo(() => {
    console.log("Calculating Machine OEE with", filteredData.length, "records");
    
    // Limit processing to at most 10000 records for performance
    const dataToProcess = filteredData.length > 10000 ? 
      filteredData.slice(0, 10000) : 
      filteredData;
    
    // Group by Machine ID and calculate average OEE
    const oeeByMachine = {};
    
    dataToProcess.forEach(item => {
      if (!item.Machine_ID || !item.OEE) return;
      
      const machineID = item.Machine_ID;
      const oee = parseFloat(item.OEE);
      
      if (isNaN(oee)) return;
      
      if (!oeeByMachine[machineID]) {
        oeeByMachine[machineID] = { totalOEE: 0, count: 0 };
      }
      
      oeeByMachine[machineID].totalOEE += oee;
      oeeByMachine[machineID].count += 1;
    });

    // Calculate average OEE for each machine and create an array
    const machineData = Object.keys(oeeByMachine).map(machineID => {
      return {
        machineID,
        averageOEE: parseFloat((oeeByMachine[machineID].totalOEE / oeeByMachine[machineID].count).toFixed(2)),
        dataCount: oeeByMachine[machineID].count
      };
    });

    // Filter out machines with less than 3 data points for statistical relevance
    const relevantMachines = machineData.filter(machine => machine.dataCount >= 3);
    
    // Sort by average OEE
    const sortedMachines = [...relevantMachines].sort((a, b) => b.averageOEE - a.averageOEE);
    
    // Get top 5 and bottom 5
    const top5 = sortedMachines.slice(0, 5).map(machine => ({
      ...machine,
      category: 'Top Performers'
    }));
    
    const bottom5 = sortedMachines.slice(-5).reverse().map(machine => ({
      ...machine,
      category: 'Needs Improvement'
    }));
    
    return { top5, bottom5 };
  }, [filteredData]);

  // Set color based on performance category
  const getBarColor = (category) => {
    return category === 'Top Performers' ? '#10b981' : '#ef4444';
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const category = data.category;
      const textColor = category === 'Top Performers' ? 'text-green-600' : 'text-red-600';
      
      return (
        <div className="bg-white/90 backdrop-blur-md rounded-lg shadow-lg p-4 border border-gray-200">
          <p className="font-medium">Machine ID: {data.machineID}</p>
          <p className={`text-lg font-bold ${textColor}`}>{`OEE: ${data.averageOEE}%`}</p>
          <p className="text-sm text-gray-600">Based on {data.dataCount} data points</p>
        </div>
      );
    }
    return null;
  };

  // Top 5 chart
  const TopPerformersChart = () => {
    if (machinePerformanceData.top5.length === 0) {
      return <p className="text-center text-gray-500 py-4">Not enough data for top performers</p>;
    }
    
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart 
          data={machinePerformanceData.top5} 
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          layout="vertical"
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
          <XAxis 
            type="number"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 12 }}
            domain={[0, 100]}
          />
          <YAxis 
            type="category"
            dataKey="machineID"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 12 }}
            width={80}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="averageOEE" 
            name="Average OEE" 
            radius={[0, 4, 4, 0]}
          >
            {machinePerformanceData.top5.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.category)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  };

  // Bottom 5 chart
  const NeedsImprovementChart = () => {
    if (machinePerformanceData.bottom5.length === 0) {
      return <p className="text-center text-gray-500 py-4">Not enough data for underperforming machines</p>;
    }
    
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart 
          data={machinePerformanceData.bottom5} 
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          layout="vertical"
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
          <XAxis 
            type="number"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 12 }}
            domain={[0, 100]}
          />
          <YAxis 
            type="category"
            dataKey="machineID"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 12 }}
            width={80}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="averageOEE" 
            name="Average OEE" 
            radius={[0, 4, 4, 0]}
          >
            {machinePerformanceData.bottom5.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.category)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Machine Performance Analysis</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 */}
        <div className="backdrop-blur-md bg-white/80 p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center mb-2">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <h3 className="text-lg font-medium text-gray-800">Top 5 Performing Machines</h3>
          </div>
          <TopPerformersChart />
        </div>
        
        {/* Bottom 5 */}
        <div className="backdrop-blur-md bg-white/80 p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center mb-2">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <h3 className="text-lg font-medium text-gray-800">Bottom 5 Performing Machines</h3>
          </div>
          <NeedsImprovementChart />
        </div>
      </div>
    </div>
  );
};

export default MachinePerformanceChart;