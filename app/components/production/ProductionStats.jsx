import React, { useMemo } from 'react';
import { TrendingUp, ArrowDown, ArrowUp } from 'lucide-react';

const ProductionStats = ({ filteredData }) => {
  // Calculate production statistics from filtered data
  const productionStats = useMemo(() => {
    // Check if data is valid
    if (!filteredData || filteredData.length === 0) {
      return {
        average: 0,
        minimum: 0,
        maximum: 0
      };
    }

    // Extract and process production values
    const productionValues = filteredData
      .map(item => {
        const production = parseFloat(item.Production_Units);
        return isNaN(production) ? null : production;
      })
      .filter(value => value !== null);

    // Handle case with no valid production values
    if (productionValues.length === 0) {
      return {
        average: 0,
        minimum: 0,
        maximum: 0
      };
    }

    // Calculate statistics
    const sum = productionValues.reduce((acc, val) => acc + val, 0);
    const average = sum / productionValues.length;
    const minimum = Math.min(...productionValues);
    const maximum = Math.max(...productionValues);

    return {
      average: parseFloat(average.toFixed(2)),
      minimum: parseFloat(minimum.toFixed(2)),
      maximum: parseFloat(maximum.toFixed(2))
    };
  }, [filteredData]);

  // Function to get appropriate color class based on production value and target
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