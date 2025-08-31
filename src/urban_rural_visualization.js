import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const UrbanRuralDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Data based on our analysis
  const visitStats = [
    { type: 'Urban', mean: 218420, median: 85291, count: 2790, std: 518393 },
    { type: 'Rural', mean: 28243, median: 10527, count: 6090, std: 54836 }
  ];

  const gwrPerformance = [
    { type: 'Urban', r2: 0.853, rmse: 0.519 },
    { type: 'Rural', r2: 0.883, rmse: 0.487 }
  ];

  const coefficientData = [
    {
      factor: 'Staff (log_TOTSTAFF)',
      urban: 0.422,
      rural: 0.334,
      difference: 0.088,
      interpretation: 'Staff has bigger impact in urban areas'
    },
    {
      factor: 'Income (log_TOTINCM)', 
      urban: 0.344,
      rural: 0.459,
      difference: -0.115,
      interpretation: 'Community income matters more for rural libraries'
    },
    {
      factor: 'Hours (HRS_OPEN)',
      urban: -0.037,
      rural: 0.145,
      difference: -0.182,
      interpretation: 'Extended hours boost rural visits significantly'
    },
    {
      factor: 'Collection (log_TOTCOLL)',
      urban: 0.907,
      rural: 0.929,
      difference: -0.022,
      interpretation: 'Collection size important for both, slightly more for rural'
    }
  ];

  const radarData = [
    {
      factor: 'Staff Impact',
      Urban: 0.422,
      Rural: 0.334
    },
    {
      factor: 'Income Impact',
      Urban: 0.344,
      Rural: 0.459
    },
    {
      factor: 'Hours Impact',
      Urban: -0.037 + 0.2, // Adjusted for radar chart (can't show negative well)
      Rural: 0.145 + 0.2
    },
    {
      factor: 'Collection Impact',
      Urban: 0.907,
      Rural: 0.929
    }
  ];

  const TabButton = ({ id, label, active, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`px-6 py-3 font-medium rounded-lg transition-all ${
        active
          ? 'bg-blue-600 text-white shadow-lg'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );

  const StatCard = ({ title, value, subtitle, color = "blue" }) => (
    <div className={`bg-white rounded-xl p-6 shadow-lg border-l-4 border-${color}-500`}>
      <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
      <p className={`text-3xl font-bold text-${color}-600 mt-2`}>{value}</p>
      {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Urban vs Rural Library Analysis
          </h1>
          <p className="text-xl text-gray-600">
            Geographic Differences in Library Visits and Service Factors
          </p>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <TabButton
            id="overview"
            label="📊 Overview"
            active={activeTab === 'overview'}
            onClick={setActiveTab}
          />
          <TabButton
            id="visits"
            label="👥 Visit Patterns"
            active={activeTab === 'visits'}
            onClick={setActiveTab}
          />
          <TabButton
            id="coefficients"
            label="🎯 Key Factors"
            active={activeTab === 'coefficients'}
            onClick={setActiveTab}
          />
          <TabButton
            id="performance"
            label="📈 Model Performance"
            active={activeTab === 'performance'}
            onClick={setActiveTab}
          />
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard
                title="Urban Libraries"
                value="2,790"
                subtitle="31% of total"
                color="blue"
              />
              <StatCard
                title="Rural Libraries" 
                value="6,090"
                subtitle="69% of total"
                color="green"
              />
              <StatCard
                title="Visit Ratio"
                value="7.73x"
                subtitle="Urban vs Rural average"
                color="purple"
              />
              <StatCard
                title="Better Model Fit"
                value="Rural"
                subtitle="R² = 0.883 vs 0.853"
                color="orange"
              />
            </div>

            {/* Main Findings */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Key Findings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-4">🏙️ Urban Libraries</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• <strong>7.73x more visits</strong> on average (218K vs 28K)</li>
                    <li>• <strong>Staff impact</strong> is stronger (0.422 vs 0.334)</li>
                    <li>• Less sensitive to community income</li>
                    <li>• Operating hours have minimal impact</li>
                    <li>• Serve larger, more diverse populations</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-600 mb-4">🌾 Rural Libraries</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• <strong>Community income</strong> has bigger impact (0.459 vs 0.344)</li>
                    <li>• <strong>Operating hours</strong> significantly boost visits</li>
                    <li>• More consistent patterns (higher R²)</li>
                    <li>• Collection size slightly more important</li>
                    <li>• Serve smaller, more homogeneous communities</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Visit Patterns Tab */}
        {activeTab === 'visits' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Visit Statistics Comparison</h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={visitStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [value.toLocaleString(), name]} />
                  <Legend />
                  <Bar dataKey="mean" fill="#3B82F6" name="Mean Visits" />
                  <Bar dataKey="median" fill="#10B981" name="Median Visits" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Distribution Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Urban Library Distribution</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mean:</span>
                    <span className="font-semibold">218,420 visits</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Median:</span>
                    <span className="font-semibold">85,291 visits</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Std Dev:</span>
                    <span className="font-semibold">518,393</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Libraries:</span>
                    <span className="font-semibold">2,790</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Rural Library Distribution</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mean:</span>
                    <span className="font-semibold">28,243 visits</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Median:</span>
                    <span className="font-semibold">10,527 visits</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Std Dev:</span>
                    <span className="font-semibold">54,836</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Libraries:</span>
                    <span className="font-semibold">6,090</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Coefficients Tab */}
        {activeTab === 'coefficients' && (
          <div className="space-y-8">
            {/* Coefficient Comparison Chart */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Factor Impact Comparison</h2>
              <ResponsiveContainer width="100%" height={500}>
                <BarChart 
                  data={coefficientData} 
                  margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="factor" 
                    angle={-45}
                    textAnchor="end"
                    height={120}
                    fontSize={12}
                  />
                  <YAxis domain={[-0.1, 1]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="urban" fill="#3B82F6" name="Urban" />
                  <Bar dataKey="rural" fill="#10B981" name="Rural" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Radar Chart */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Factor Profile Comparison</h2>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="factor" />
                  <PolarRadiusAxis domain={[0, 1]} />
                  <Radar
                    name="Urban"
                    dataKey="Urban"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                  <Radar
                    name="Rural"
                    dataKey="Rural"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Factor Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {coefficientData.map((item, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.factor}</h3>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-blue-600 font-medium">Urban: {item.urban}</span>
                    <span className="text-green-600 font-medium">Rural: {item.rural}</span>
                  </div>
                  <p className="text-sm text-gray-600">{item.interpretation}</p>
                  <div className="mt-3 pt-3 border-t">
                    <span className={`text-sm font-medium ${item.difference > 0 ? 'text-blue-600' : 'text-green-600'}`}>
                      Difference: {item.difference > 0 ? '+' : ''}{item.difference}
                      {item.difference > 0 ? ' (favors urban)' : ' (favors rural)'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">GWR Model Performance</h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={gwrPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis domain={[0.8, 0.9]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="r2" fill="#8B5CF6" name="Local R²" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Model Insights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-purple-600 mb-4">📈 Performance Metrics</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• <strong>Rural R²:</strong> 0.883 (better fit)</li>
                    <li>• <strong>Urban R²:</strong> 0.853 (good fit)</li>
                    <li>• Both models explain >85% of variation</li>
                    <li>• Rural patterns more predictable</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-orange-600 mb-4">🎯 Implications</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Rural libraries have more consistent usage patterns</li>
                    <li>• Urban libraries show more variability</li>
                    <li>• Geographic context matters significantly</li>
                    <li>• One-size-fits-all policies won't work</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm mt-12">
          Analysis based on GWR results from 8,880 public libraries (2,790 urban, 6,090 rural)
        </div>
      </div>
    </div>
  );
};

export default UrbanRuralDashboard;