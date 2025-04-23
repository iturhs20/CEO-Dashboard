import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MachineProductionChart = ({ filteredData }) => {
  // Calculate machine performance data
  const machineProductionData = useMemo(() => {
    // If no data, return empty object
    if (!filteredData || filteredData.length === 0) {
      return {
        topMachines: [],
        bottomMachines: []
      };
    }

    // Group production by machine
    const machineGroups = {};
    
    filteredData.forEach(item => {
      const machineId = item.Machine_ID;
      if (!machineId) return;
      
      // Initialize the machine group if it doesn't exist
      if (!machineGroups[machineId]) {
        machineGroups[machineId] = {
          id: machineId,
          name: `${machineId} (${item.Machine_Type || 'Unknown'})`,
          production: 0,
          count: 0,
          type: item.Machine_Type || 'Unknown'
        };
      }
      
      // Add production to the machine group
      const production = parseFloat(item.Production_Units);
      if (!isNaN(production)) {
        machineGroups[machineId].production += production;
        machineGroups[machineId].count += 1;
      }
    });
    
    // Convert to array and sort by production
    const machinesArray = Object.values(machineGroups);
    machinesArray.sort((a, b) => b.production - a.production);
    
    // Get top 5 and bottom 5 machines
    const topMachines = machinesArray.slice(0, 5).map(machine => ({
      ...machine,
      name: machine.id // Keep the ID as the name for chart display
    }));
    
    const bottomMachines = [...machinesArray]
      .sort((a, b) => a.production - b.production)
      .slice(0, 5)
      .map(machine => ({
        ...machine,
        name: machine.id // Keep the ID as the name for chart display
      }));
    
    return {
      topMachines,
      bottomMachines
    };
  }, [filteredData]);

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Machine Performance</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top 5 Machines Chart */}
        <div className="backdrop-blur-md bg-white/90 p-4 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Top 5 High Producing Machines</h3>
          {machineProductionData.topMachines.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={machineProductionData.topMachines}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip
                    formatter={(value) => [`${value} units`, 'Total Production']}
                    labelFormatter={(label) => {
                      return <span className="text-black">{`Machine: ${label}`}</span>;
                    }}
                  />
                  <Legend />
                  <Bar dataKey="production" name="Total Production" fill="#4ade80" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-72 flex items-center justify-center">
              <p className="text-gray-500">No machine data available</p>
            </div>
          )}
          <div className="mt-4">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left pb-2 font-medium text-gray-700">Machine ID</th>
                  <th className="text-left pb-2 font-medium text-gray-700">Type</th>
                  <th className="text-right pb-2 font-medium text-gray-700">Production</th>
                </tr>
              </thead>
              <tbody>
                {machineProductionData.topMachines.map((machine) => (
                  <tr key={machine.id}>
                    <td className="py-1 text-black">{machine.id}</td>
                    <td className="py-1 text-black">{machine.type}</td>
                    <td className="py-1 text-right text-black">{machine.production.toLocaleString()} units</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Bottom 5 Machines Chart */}
        <div className="backdrop-blur-md bg-white/90 p-4 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Bottom 5 Low Producing Machines</h3>
          {machineProductionData.bottomMachines.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={machineProductionData.bottomMachines}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip
                    formatter={(value) => [`${value} units`, 'Total Production']}
                    labelFormatter={(label) => {
                      return <span className="text-black">{`Machine: ${label}`}</span>;
                    }}
                  />
                  <Legend />
                  <Bar dataKey="production" name="Total Production" fill="#f87171" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-72 flex items-center justify-center">
              <p className="text-black">No machine data available</p>
            </div>
          )}
          <div className="mt-4">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left pb-2 font-medium text-gray-700">Machine ID</th>
                  <th className="text-left pb-2 font-medium text-gray-700">Type</th>
                  <th className="text-right pb-2 font-medium text-gray-700">Production</th>
                </tr>
              </thead>
              <tbody>
                {machineProductionData.bottomMachines.map((machine) => (
                  <tr key={machine.id}>
                    <td className="py-1 text-black">{machine.id}</td>
                    <td className="py-1 text-black">{machine.type}</td>
                    <td className="py-1 text-right text-black">{machine.production.toLocaleString()} units</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MachineProductionChart;