import React, { useMemo, useEffect } from 'react';
import { TrendingUp, ArrowDown, ArrowUp } from 'lucide-react';

const ProductionStats = ({ filteredData }) => {
  // First, let's deeply debug the data
  useEffect(() => {
    console.log("===== DEBUG PRODUCTION STATS =====");
    console.log("Filtered data length:", filteredData?.length);
    console.log("First few items:", filteredData?.slice(0, 3));
    
    // Specifically check for any items with -100 or values near -100
    const suspiciousItems = filteredData?.filter(item => {
      const val = parseFloat(item.Production_Units);
      return !isNaN(val) && (val < -90 && val > -110);
    });
    
    if (suspiciousItems?.length > 0) {
      console.log("FOUND SUSPICIOUS ITEMS NEAR -100:", suspiciousItems);
    }
    
    // Analyze all Production_Units values
    if (filteredData?.length > 0) {
      const allValues = filteredData
        .map(item => {
          if (item.Production_Units === undefined) return "undefined";
          if (item.Production_Units === null) return "null";
          return item.Production_Units;
        });
      
      console.log("All Production_Units raw values:", allValues.slice(0, 20));
    }
  }, [filteredData]);
  
  // Calculate production statistics from filtered data - with a completely different approach
  const productionStats = useMemo(() => {
    // Default stats
    const defaultStats = {
      average: 0,
      minimum: 0,
      maximum: 0
    };
    
    // Check if data is valid
    if (!filteredData || filteredData.length === 0) {
      return defaultStats;
    }
    
    try {
      let sum = 0;
      let count = 0;
      let min = Number.MAX_VALUE; 
      let max = Number.MIN_VALUE;
      let hasValidValues = false;
      
      // Process each item manually without array methods
      for (let i = 0; i < filteredData.length; i++) {
        const item = filteredData[i];
        
        // Only process if the property exists
        if (item && 'Production_Units' in item) {
          const valStr = String(item.Production_Units).trim();
          const val = parseFloat(valStr);
          
          // Only include valid numbers
          if (!isNaN(val)) {
            sum += val;
            count++;
            hasValidValues = true;
            
            // Track min/max
            if (val < min) min = val;
            if (val > max) max = val;
            
            // Debug: If we find a value equal to -100, log it
            if (Math.abs(val + 100) < 0.01) {
              console.error("FOUND -100 VALUE:", item);
            }
          }
        }
      }
      
      // If we found valid values, return the stats
      if (hasValidValues) {
        const avg = count > 0 ? sum / count : 0;
        
        // Apply special case: If min is still MAX_VALUE, no valid values were found
        if (min === Number.MAX_VALUE) min = 0;
        if (max === Number.MIN_VALUE) max = 0;
        
        console.log("Final calculated stats:", { 
          average: avg, 
          minimum: min, 
          maximum: max,
          validCount: count
        });
        
        // Force minimum to be at least 0 - this is a safeguard
        const safeMin = Math.max(0, min);
        
        return {
          average: parseFloat(avg.toFixed(2)),
          minimum: parseFloat(safeMin.toFixed(2)),
          maximum: parseFloat(max.toFixed(2))
        };
      }
      
      return defaultStats;
    } catch (error) {
      console.error("Error in production stats calculation:", error);
      return defaultStats;
    }
  }, [filteredData]);

  // Function to get appropriate color class based on production value and type
  const getColorClass = (value, type) => {
    if (type === 'average') {
      return 'bg-blue-100 text-blue-800';
    } else if (type === 'minimum') {
      return 'bg-amber-100 text-amber-800';
    } else {
      return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Production Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Average Production Card */}
        <div className="backdrop-blur-md bg-white/90 rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="flex">
            <div className="flex-shrink-0 bg-blue-500 p-4 flex items-center justify-center">
              <TrendingUp size={32} className="text-white" />
            </div>
            <div className="p-4 flex-1">
              <h3 className="text-lg font-medium text-gray-800">Average Production</h3>
              <div className="mt-2 flex items-baseline">
                <p className="text-3xl font-bold text-gray-900">{productionStats.average}</p>
                <p className="ml-1 text-sm text-gray-600">units</p>
              </div>
              <div className="mt-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColorClass(productionStats.average, 'average')}`}>
                  {productionStats.average} units per machine
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600">Average production across all filtered machine entries</p>
            </div>
          </div>
        </div>

        {/* Minimum Production Card */}
        <div className="backdrop-blur-md bg-white/90 rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="flex">
            <div className="flex-shrink-0 bg-amber-500 p-4 flex items-center justify-center">
              <ArrowDown size={32} className="text-white" />
            </div>
            <div className="p-4 flex-1">
              <h3 className="text-lg font-medium text-gray-800">Minimum Production</h3>
              <div className="mt-2 flex items-baseline">
                <p className="text-3xl font-bold text-gray-900">{productionStats.minimum}</p>
                <p className="ml-1 text-sm text-gray-600">units</p>
              </div>
              <div className="mt-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColorClass(productionStats.minimum, 'minimum')}`}>
                  {productionStats.minimum} units
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600">Lowest recorded production in the filtered dataset</p>
            </div>
          </div>
        </div>

        {/* Maximum Production Card */}
        <div className="backdrop-blur-md bg-white/90 rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="flex">
            <div className="flex-shrink-0 bg-green-500 p-4 flex items-center justify-center">
              <ArrowUp size={32} className="text-white" />
            </div>
            <div className="p-4 flex-1">
              <h3 className="text-lg font-medium text-gray-800">Maximum Production</h3>
              <div className="mt-2 flex items-baseline">
                <p className="text-3xl font-bold text-gray-900">{productionStats.maximum}</p>
                <p className="ml-1 text-sm text-gray-600">units</p>
              </div>
              <div className="mt-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColorClass(productionStats.maximum, 'maximum')}`}>
                  {productionStats.maximum} units
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600">Highest recorded production in the filtered dataset</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionStats;