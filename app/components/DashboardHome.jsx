"use client"

import React from 'react';
import { Activity, Clock, BarChart2, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Enhanced dashboard card with glassmorphism effect and vibrant colors - white theme
const DashboardCard = ({ title, icon, color, iconColor, route, trend, subtitle, bgGradient }) => {
  const router = useRouter();
  
  return (
    <div 
      className={`backdrop-blur-md bg-gray-50/90 rounded-xl shadow-lg p-8 cursor-pointer transition-all duration-300 hover:shadow-2xl border-l-4 ${color} hover:-translate-y-2 relative overflow-hidden w-full`}
      onClick={() => router.push(route)}
      style={{borderRadius: '1rem'}}
    >
      {bgGradient && (
        <div className="absolute inset-0 opacity-10 z-0" style={{ background: bgGradient }}></div>
      )}
      <div className="flex justify-between items-center mb-6 relative z-10">
        <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
        <div className={`p-4 rounded-full ${iconColor} shadow-lg`}>
          {icon}
        </div>
      </div>
      <div className="flex flex-col relative z-10">
        <span className="text-base text-gray-600 mt-2">{subtitle || "Click for details"}</span>
      </div>
    </div>
  );
};

const DashboardHome = () => {
  return (
    <div className="min-h-screen relative bg-gradient-to-br from-gray-100 via-blue-50 to-gray-100">
      {/* Enhanced background elements with animated patterns */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Larger, more prominent gradient blobs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-200 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-purple-200 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-200 rounded-full opacity-50 blur-3xl"></div>
        
        {/* Additional smaller gradient elements */}
        <div className="absolute top-1/3 right-1/3 w-40 h-40 bg-green-100 rounded-full opacity-40 blur-2xl"></div>
        <div className="absolute bottom-1/3 left-1/3 w-48 h-48 bg-yellow-100 rounded-full opacity-40 blur-2xl"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNDB2NDBoLTQweiIvPjxwYXRoIGQ9Ik00MCAyMGgtNDBtMjAtMjB2NDAiIHN0cm9rZT0iI2VlZSIgc3Ryb2tlLW9wYWNpdHk9Ii4yIiBzdHJva2Utd2lkdGg9Ii41Ii8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        
        {/* Subtle animated dots */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-white opacity-30"
              style={{
                width: `${Math.random() * 8 + 2}px`,
                height: `${Math.random() * 8 + 2}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 10 + 15}s infinite ease-in-out`
              }}
            ></div>
          ))}
        </div>
      </div>
      
      {/* Floating geometric shapes */}
      <div className="absolute top-20 left-1/4 w-16 h-16 border-2 border-blue-300 opacity-20 transform rotate-45"></div>
      <div className="absolute bottom-40 right-1/4 w-12 h-12 border-2 border-purple-300 opacity-20 rounded-full"></div>
      <div className="absolute top-1/2 left-20 w-10 h-10 border-2 border-pink-300 opacity-20 transform rotate-12"></div>
      
      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>
      
      <div className="p-6 relative z-10">
        {/* Header with glass effect */}
        <div className="mb-10 backdrop-blur-lg bg-white/80 p-8 rounded-2xl shadow-xl border border-gray-200 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-200 rounded-full opacity-20 blur-xl"></div>
          <div className="container mx-auto max-w-7xl">
            <div className="flex items-center">
              {/* Company Logo */}
              <div className="mr-5 bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-xl shadow-lg">
                <Zap size={36} className="text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-800">Executive Dashboard</h1>
                <p className="text-blue-600 mt-2">Performance overview and key metrics</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-8">
            <DashboardCard 
              title="OEE" 
              icon={<Activity size={30} className="text-white" />} 
              color="border-blue-500" 
              iconColor="bg-gradient-to-br from-blue-500 to-indigo-600"
              route="/OEE"
              trend={{isUp: true, value: "2.1%"}}
              subtitle="Click for detailed view"
              bgGradient="linear-gradient(135deg, rgba(37, 99, 235, 0.2) 0%, rgba(79, 70, 229, 0.2) 100%)"
            />
            
            <DashboardCard 
              title="Downtime"
              icon={<Clock size={30} className="text-white" />} 
              color="border-red-500"
              iconColor="bg-gradient-to-br from-red-500 to-pink-600" 
              route="/dashboard/downtime"
              trend={{isUp: false, value: "15%"}}
              subtitle="Click for detailed view"
              bgGradient="linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(219, 39, 119, 0.2) 100%)"
            />
            
            <DashboardCard 
              title="Production"
              icon={<BarChart2 size={30} className="text-white" />} 
              color="border-green-500" 
              iconColor="bg-gradient-to-br from-emerald-500 to-green-600"
              route="/dashboard/production"
              trend={{isUp: true, value: "8.3%"}}
              subtitle="Click for detailed view"
              bgGradient="linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.2) 100%)"
            />
            
            <DashboardCard 
              title="Energy Usage"
              icon={<Zap size={30} className="text-white" />} 
              color="border-amber-500" 
              iconColor="bg-gradient-to-br from-amber-500 to-orange-600"
              route="/dashboard/energy"
              trend={{isUp: false, value: "3.8%"}}
              subtitle="Click for detailed view"
              bgGradient="linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(234, 88, 12, 0.2) 100%)"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;