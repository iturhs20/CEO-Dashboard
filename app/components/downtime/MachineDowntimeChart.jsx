import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowUp, ArrowDown, BarChart3 } from 'lucide-react';

const MachineDowntimeChart = ({ filteredData }) => {
  const [chartView, setChartView] = useState('top'); // 'top' or 'bottom'

  // Calculate machine downtime totals
  const machineDowntimeData = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return [];
    
    const machineData = {};
    
    filteredData.forEach(item => {
      const machineId = item.Machine_ID;
      const machineName = `${machineId} (${item.Machine_Type})`;
      const downtimeMinutes = parseFloat(item.Downtime_Minutes);
      
      if (machineId && !isNaN(downtimeMinutes)) {
        if (!machineData[machineId]) {
          machineData[machineId] = { 
            name: machineName, 
            id: machineId,
            type: item.Machine_Type,
            downtime: 0,
            occurrences: 0
          };
        }
        machineData[machineId].downtime += downtimeMinutes;
        machineData[machineId].occurrences += 1;
      }
    });
    
    // Convert to array
    return Object.values(machineData).map(item => ({
      ...item,
      downtime: parseFloat(item.downtime.toFixed(2)),
      avgDowntime: parseFloat((item.downtime / item.occurrences).toFixed(2))
    }));
  }, [filteredData]);
  
  // Get top 5 machines by downtime
  const topMachines = useMemo(() => {
    return [...machineDowntimeData]
      .sort((a, b) => b.downtime - a.downtime)
      .slice(0, 5);
  }, [machineDowntimeData]);
  
  // Get bottom 5 machines by downtime
  const bottomMachines = useMemo(() => {
    return [...machineDowntimeData]
      .sort((a, b) => a.downtime - b.downtime)
      .slice(0, 5);
  }, [machineDowntimeData]);
  
  // Current data to display based on view
  const currentDisplayData = chartView === 'top' ? topMachines : bottomMachines;
  
  // Color based on view
  const barColor = chartView === 'top' ? '#ef4444' : '#10b981';
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Machine Downtime Analysis</h2>
        
        <div className="inline-flex rounded-md shadow-sm">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${
              chartView === 'top' 
                ? 'bg-red-500 text-white border-red-500' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => setChartView('top')}
          >
            <div className="flex items-center gap-2">
              <ArrowUp size={16} />
              <span>Top 5 Machines</span>
            </div>
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-r-lg border ${
              chartView === 'bottom' 
                ? 'bg-green-500 text-white border-green-500' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => setChartView('bottom')}
          >
            <div className="flex items-center gap-2">
              <ArrowDown size={16} />
              <span>Bottom 5 Machines</span>
            </div>
          </button>
        </div>
      </div>
      
      <div className="h-96 w-full backdrop-blur-md bg-white/90 rounded-xl shadow-md border border-gray-200 p-4">
        <h3 className="text-lg font-medium text-gray-700 mb-4">
          {chartView === 'top' ? 'Top 5 Machines with Highest Downtime' : 'Bottom 5 Machines with Lowest Downtime'}
        </h3>
        
        {currentDisplayData.length > 0 ? (
          <ResponsiveContainer width="100%" height="90%">
            <BarChart
              data={currentDisplayData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" 
                label={{ 
                  value: 'Downtime (minutes)', 
                  position: 'insideBottom',
                  offset: -5
                }} 
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                width={90}
              />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'avgDowntime') return [`${value} minutes`, 'Avg. Downtime per Occurrence'];
                  return [`${value} minutes`, 'Total Downtime'];
                }}
                labelFormatter={(label) => `Machine: ${label}`}
              />
              <Legend verticalAlign="top" height={36} />
              <Bar 
                dataKey="downtime" 
                name="Total Downtime" 
                fill={barColor} 
                radius={[0, 4, 4, 0]}
              />
              <Bar 
                dataKey="avgDowntime" 
                name="Avg. Downtime" 
                fill={chartView === 'top' ? '#f97316' : '#0ea5e9'} 
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500">No machine data available</p>
          </div>
        )}
        
        <div className="mt-2 text-sm text-gray-600">
          {currentDisplayData.length > 0 && (
            <p>
              {chartView === 'top' 
                ? 'Machines with the highest cumulative downtime periods' 
                : 'Machines with the lowest cumulative downtime periods'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MachineDowntimeChart;