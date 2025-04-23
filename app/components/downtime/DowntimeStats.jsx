import React, { useMemo } from 'react';
import { Clock, ArrowDown, ArrowUp } from 'lucide-react';

const DowntimeStats = ({ filteredData }) => {
  // Calculate downtime statistics from filtered data
  const downtimeStats = useMemo(() => {
    // Check if data is valid
    if (!filteredData || filteredData.length === 0) {
      return {
        average: 0,
        minimum: 0,
        maximum: 0
      };
    }

    // Extract and process downtime values
    const downtimeValues = filteredData
      .map(item => {
        const downtime = parseFloat(item.Downtime_Minutes);
        return isNaN(downtime) ? null : downtime;
      })
      .filter(value => value !== null);

    // Handle case with no valid downtime values
    if (downtimeValues.length === 0) {
      return {
        average: 0,
        minimum: 0,
        maximum: 0
      };
    }

    // Calculate statistics
    const sum = downtimeValues.reduce((acc, val) => acc + val, 0);
    const average = sum / downtimeValues.length;
    const minimum = Math.min(...downtimeValues);
    const maximum = Math.max(...downtimeValues);

    return {
      average: parseFloat(average.toFixed(2)),
      minimum: parseFloat(minimum.toFixed(2)),
      maximum: parseFloat(maximum.toFixed(2))
    };
  }, [filteredData]);

  // Function to format time in hours and minutes
  const formatTime = (minutes) => {
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const mins = Math.round(minutes % 60);
      return `${hours}h ${mins}m`;
    }
  };

  // Function to get appropriate color class based on downtime value
  const getColorClass = (value, type) => {
    if (type === 'average') {
      return value > 60 ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800';
    } else if (type === 'minimum') {
      return 'bg-green-100 text-green-800';
    } else {
      return value > 120 ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800';
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Downtime Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Average Downtime Card */}
        <div className="backdrop-blur-md bg-white/90 rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="flex">
            <div className="flex-shrink-0 bg-blue-500 p-4 flex items-center justify-center">
              <Clock size={32} className="text-white" />
            </div>
            <div className="p-4 flex-1">
              <h3 className="text-lg font-medium text-gray-800">Average Downtime</h3>
              <div className="mt-2 flex items-baseline">
                <p className="text-3xl font-bold text-gray-900">{downtimeStats.average}</p>
                <p className="ml-1 text-sm text-gray-600">minutes</p>
              </div>
              <div className="mt-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColorClass(downtimeStats.average, 'average')}`}>
                  {formatTime(downtimeStats.average)}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600">Average downtime across all filtered machine entries</p>
            </div>
          </div>
        </div>

        {/* Minimum Downtime Card */}
        <div className="backdrop-blur-md bg-white/90 rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="flex">
            <div className="flex-shrink-0 bg-green-500 p-4 flex items-center justify-center">
              <ArrowDown size={32} className="text-white" />
            </div>
            <div className="p-4 flex-1">
              <h3 className="text-lg font-medium text-gray-800">Minimum Downtime</h3>
              <div className="mt-2 flex items-baseline">
                <p className="text-3xl font-bold text-gray-900">{downtimeStats.minimum}</p>
                <p className="ml-1 text-sm text-gray-600">minutes</p>
              </div>
              <div className="mt-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColorClass(downtimeStats.minimum, 'minimum')}`}>
                  {formatTime(downtimeStats.minimum)}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600">Lowest recorded downtime in the filtered dataset</p>
            </div>
          </div>
        </div>

        {/* Maximum Downtime Card */}
        <div className="backdrop-blur-md bg-white/90 rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="flex">
            <div className="flex-shrink-0 bg-red-500 p-4 flex items-center justify-center">
              <ArrowUp size={32} className="text-white" />
            </div>
            <div className="p-4 flex-1">
              <h3 className="text-lg font-medium text-gray-800">Maximum Downtime</h3>
              <div className="mt-2 flex items-baseline">
                <p className="text-3xl font-bold text-gray-900">{downtimeStats.maximum}</p>
                <p className="ml-1 text-sm text-gray-600">minutes</p>
              </div>
              <div className="mt-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColorClass(downtimeStats.maximum, 'maximum')}`}>
                  {formatTime(downtimeStats.maximum)}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600">Highest recorded downtime in the filtered dataset</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DowntimeStats;