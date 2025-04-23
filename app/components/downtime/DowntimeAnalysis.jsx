'use client'
import React, { useState, useEffect, useCallback } from 'react';
import Papa from 'papaparse';
import { Filter, RefreshCw } from 'lucide-react';
import DowntimeStats from './DowntimeStats';
import DowntimeCharts from './DowntimeCharts';
import MachineDowntimeChart from './MachineDowntimeChart';

function DowntimeAnalysis() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    plantID: '',
    plantName: '',
    productLine: '',
    shift: '',
    month: ''
  });
  const [uniqueValues, setUniqueValues] = useState({
    plantIDs: [],
    plantNames: [],
    productLines: [],
    shifts: [],
    months: []
  });
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Loading data...");
  const [error, setError] = useState(null);

  // Optimized function to load and parse CSV file
  const loadCSV = useCallback(() => {
    setLoading(true);
    setLoadingMessage("Loading data...");
    setError(null);
    
    // Set a timeout to prevent infinite loading
    const loadTimeout = setTimeout(() => {
      console.error("CSV loading timed out");
      setLoadingMessage("Loading timed out. Please try again.");
      setError("Loading timed out.");
      setLoading(false);
    }, 30000); // 30 seconds timeout for large files
    
    fetch('/Data2.csv')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`);
        }
        return response.text();
      })
      .then(csvText => {
        clearTimeout(loadTimeout);
        console.log("CSV loaded, first few characters:", csvText.substring(0, 100));
        
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
          complete: function(results) {
            console.log(`Successfully processed ${results.data.length} rows`);
            
            // Process data to extract unique values for filters
            const uniquePlantIDs = new Set();
            const uniquePlantNames = new Set();
            const uniqueProductLines = new Set();
            const uniqueShifts = new Set();
            const uniqueMonths = new Set();
            
            results.data.forEach(item => {
              if (item.Plant_ID) uniquePlantIDs.add(item.Plant_ID);
              if (item.Plant_Name) uniquePlantNames.add(item.Plant_Name);
              if (item.Product_Line) uniqueProductLines.add(item.Product_Line);
              if (item.Shift) uniqueShifts.add(item.Shift);
              
              if (item.Date) {
                try {
                  const dateParts = item.Date.split('-');
                  if (dateParts.length === 3) {
                    const month = parseInt(dateParts[1], 10);
                    uniqueMonths.add(month);
                  }
                } catch (e) {
                  console.error("Date parsing error:", e);
                }
              }
            });
            
            // Set state with processed data
            setData(results.data);
            setFilteredData(results.data);
            
            // Sort unique values for better UX
            setUniqueValues({
              plantIDs: Array.from(uniquePlantIDs).sort(),
              plantNames: Array.from(uniquePlantNames).sort(),
              productLines: Array.from(uniqueProductLines).sort(),
              shifts: Array.from(uniqueShifts).sort(),
              months: Array.from(uniqueMonths).sort((a, b) => a - b)
            });
            
            setLoading(false);
          },
          error: function(error) {
            console.error("Error parsing CSV:", error);
            setError(`Error parsing CSV: ${error.message}`);
            setLoading(false);
          }
        });
      })
      .catch(error => {
        clearTimeout(loadTimeout);
        console.error("Error loading CSV:", error);
        setLoadingMessage(`Error loading data: ${error.message}`);
        setError(`Failed to load CSV: ${error.message}`);
        setLoading(false);
      });
  }, []);

  // Memoized filter function to improve performance
  const filterData = useCallback(() => {
    if (data.length === 0) return;
    
    setLoadingMessage("Applying filters...");
    setLoading(true);
    
    // Defer filtering to avoid UI blocking
    setTimeout(() => {
      try {
        let tempData = [...data];
        
        // Apply filters
        if (filters.plantID) {
          tempData = tempData.filter(item => item.Plant_ID === filters.plantID);
        }

        if (filters.plantName) {
          tempData = tempData.filter(item => item.Plant_Name === filters.plantName);
        }

        if (filters.productLine) {
          tempData = tempData.filter(item => item.Product_Line === filters.productLine);
        }

        if (filters.shift) {
          tempData = tempData.filter(item => item.Shift === filters.shift);
        }

        if (filters.month) {
          tempData = tempData.filter(item => {
            if (!item.Date) return false;
            
            try {
              const dateParts = item.Date.split('-');
              if (dateParts.length === 3) {
                // Assuming DD-MM-YYYY format
                const month = parseInt(dateParts[1], 10);
                return month === parseInt(filters.month);
              }
              return false;
            } catch (e) {
              return false;
            }
          });
        }

        setFilteredData(tempData);
      } catch (error) {
        console.error("Error filtering data:", error);
        setError(`Error filtering data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }, 0);
  }, [data, filters]);

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      plantID: '',
      plantName: '',
      productLine: '',
      shift: '',
      month: ''
    });
  };

  // Hook to load data when component mounts
  useEffect(() => {
    loadCSV();
  }, [loadCSV]);

  // Hook to filter data whenever filters change
  useEffect(() => {
    if (data.length > 0) {
      filterData();
    }
  }, [filters, data, filterData]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  // Reload data function
  const handleReloadData = () => {
    loadCSV();
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-gray-100 via-blue-50 to-gray-100">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-200 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-purple-200 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-200 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute top-1/3 right-1/3 w-40 h-40 bg-green-100 rounded-full opacity-40 blur-2xl"></div>
        <div className="absolute bottom-1/3 left-1/3 w-48 h-48 bg-yellow-100 rounded-full opacity-40 blur-2xl"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNDB2NDBoLTQweiIvPjxwYXRoIGQ9Ik00MCAyMGgtNDBtMjAtMjB2NDAiIHN0cm9rZT0iI2VlZSIgc3Ryb2tlLW9wYWNpdHk9Ii4yIiBzdHJva2Utd2lkdGg9Ii41Ii8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
      </div>

      <div className="p-6 relative z-10">
        {/* Header with glass effect */}
        <div className="mb-10 backdrop-blur-lg bg-white/80 p-8 rounded-2xl shadow-xl border border-gray-200 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-200 rounded-full opacity-20 blur-xl"></div>
          <div className="container mx-auto max-w-7xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-5 bg-gradient-to-br from-red-500 to-orange-600 p-4 rounded-xl shadow-lg">
                  <Filter size={36} className="text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-800">Downtime Analysis</h1>
                  <p className="text-red-600 mt-2">Filter and visualize machine downtime metrics</p>
                </div>
              </div>
              
              {/* Reload button */}
              <button
                onClick={handleReloadData}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-all shadow-md"
                disabled={loading}
              >
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                Reload Data
              </button>
            </div>
          </div>
        </div>

        <div className="container mx-auto max-w-7xl">
          {/* Error display */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
              <p className="mt-2 text-sm">Check that your Data2.csv file is in the correct location and format.</p>
            </div>
          )}
          
          {/* Filters section with glassmorphism */}
          <div className="backdrop-blur-md bg-white/80 p-6 rounded-xl shadow-lg border border-gray-200 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Filter Options</h2>
              <button 
                onClick={resetFilters}
                className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-all"
                disabled={loading}
              >
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                Reset Filters
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <label className="block text-sm font-medium text-black mb-1">Plant ID</label>
                <select 
                  name="plantID" 
                  onChange={handleFilterChange} 
                  value={filters.plantID}
                  className="block w-full bg-gray-50 border text-black border-gray-300 rounded-lg py-2 px-3 focus:ring-red-500 focus:border-red-500"
                  disabled={loading}
                >
                  <option value="">All Plant IDs</option>
                  {uniqueValues.plantIDs.map((plantID, index) => (
                    <option key={index} value={plantID}>{plantID}</option>
                  ))}
                </select>
              </div>

              {/* <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Plant Name</label>
                <select 
                  name="plantName" 
                  onChange={handleFilterChange} 
                  value={filters.plantName}
                  className="block w-full bg-gray-50 border border-gray-300 rounded-lg py-2 px-3 focus:ring-red-500 focus:border-red-500"
                  disabled={loading}
                >
                  <option value="">All Plant Names</option>
                  {uniqueValues.plantNames.map((plantName, index) => (
                    <option key={index} value={plantName}>{plantName}</option>
                  ))}
                </select>
              </div> */}

              <div className="relative">
                <label className="block text-sm font-medium text-black mb-1">Product Line</label>
                <select 
                  name="productLine" 
                  onChange={handleFilterChange} 
                  value={filters.productLine}
                  className="block w-full bg-gray-50 border text-black border-gray-300 rounded-lg py-2 px-3 focus:ring-red-500 focus:border-red-500"
                  disabled={loading}
                >
                  <option value="">All Product Lines</option>
                  {uniqueValues.productLines.map((productLine, index) => (
                    <option key={index} value={productLine}>{productLine}</option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-black mb-1">Shift</label>
                <select 
                  name="shift" 
                  onChange={handleFilterChange} 
                  value={filters.shift}
                  className="block w-full bg-gray-50 border text-black border-gray-300 rounded-lg py-2 px-3 focus:ring-red-500 focus:border-red-500"
                  disabled={loading}
                >
                  <option value="">All Shifts</option>
                  {uniqueValues.shifts.map((shift, index) => (
                    <option key={index} value={shift}>{shift}</option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-black mb-1">Month</label>
                <select 
                  name="month" 
                  onChange={handleFilterChange} 
                  value={filters.month}
                  className="block w-full bg-gray-50 border text-black border-gray-300 rounded-lg py-2 px-3 focus:ring-red-500 focus:border-red-500"
                  disabled={loading}
                >
                  <option value="">All Months</option>
                  {uniqueValues.months.map((month, index) => (
                    <option key={index} value={month}>{new Date(0, month - 1).toLocaleString('default', { month: 'long' })}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Downtime Stats Cards */}
          {!loading && filteredData.length > 0 && (
            <div className="backdrop-blur-md bg-white/80 p-6 rounded-xl shadow-lg border border-gray-200 mb-8">
              <DowntimeStats filteredData={filteredData} />
            </div>
          )}

          {/* Downtime Charts (Monthly/Daily) */}
          {!loading && filteredData.length > 0 && (
            <div className="backdrop-blur-md bg-white/80 p-6 rounded-xl shadow-lg border border-gray-200 mb-8">
              <DowntimeCharts filteredData={filteredData} />
            </div>
          )}
          
          {/* Machine Downtime Chart (Top/Bottom 5) */}
          {!loading && filteredData.length > 0 && (
            <div className="backdrop-blur-md bg-white/80 p-6 rounded-xl shadow-lg border border-gray-200 mb-8">
              <MachineDowntimeChart filteredData={filteredData} />
            </div>
          )}
          
          {/* Data stats */}
          {!loading && filteredData.length > 0 && (
            <div className="backdrop-blur-md bg-white/80 p-4 rounded-xl shadow-lg border border-gray-200">
              <p className="text-sm text-gray-600">
                Showing data for {filteredData.length} entries
                {filteredData.length !== data.length && ` (filtered from ${data.length} total entries)`}
              </p>
            </div>
          )}
          
          {/* Loading state */}
          {loading && (
            <div className="flex flex-col justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mb-4"></div>
              <p className="text-gray-600">{loadingMessage}</p>
            </div>
          )}
          
          {/* No data state */}
          {!loading && filteredData.length === 0 && (
            <div className="flex flex-col justify-center items-center h-64 backdrop-blur-md bg-white/80 p-6 rounded-xl shadow-lg border border-gray-200">
              <p className="text-gray-600">No data available for the selected filters</p>
              <button 
                onClick={resetFilters}
                className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DowntimeAnalysis;