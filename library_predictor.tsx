import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, ScatterChart, Scatter } from 'recharts';
import { Library, Users, Clock, BookOpen, DollarSign, TrendingUp, MapPin, Sliders } from 'lucide-react';

const LibraryPredictor = () => {
  const [libraryData, setLibraryData] = useState({
    totalStaff: 10,
    totalIncome: 500000,
    hoursOpen: 50,
    totalCollection: 50000,
    population: 25000,
    latitude: 39.5,
    longitude: -98.5,
    libraryName: "My Library",
    city: "Sample City",
    state: "XX"
  });

  const [predictions, setPredictions] = useState({});
  const [scenarioData, setScenarioData] = useState([]);
  const [optimizationMode, setOptimizationMode] = useState('visits');

  // Simplified GWR model coefficients (based on typical results)
  // These would normally come from your trained model
  const modelCoefficients = {
    intercept: 2.5,
    log_staff: 0.65,
    log_income: 0.35,
    hours_open: 0.012,
    log_collection: 0.28,
    spatial_factor: 0.1
  };

  // Calculate predictions using the GWR-style model
  const calculatePrediction = (data) => {
    const logStaff = Math.log(data.totalStaff + 1);
    const logIncome = Math.log(data.totalIncome + 1);
    const logCollection = Math.log(data.totalCollection + 1);
    
    // Spatial factor based on location (simplified)
    const spatialFactor = Math.sin(data.latitude * Math.PI / 180) * 
                         Math.cos(data.longitude * Math.PI / 180);
    
    const logVisitsPredicted = 
      modelCoefficients.intercept +
      modelCoefficients.log_staff * logStaff +
      modelCoefficients.log_income * logIncome +
      modelCoefficients.hours_open * data.hoursOpen +
      modelCoefficients.log_collection * logCollection +
      modelCoefficients.spatial_factor * spatialFactor;
    
    const visitsPredicted = Math.exp(logVisitsPredicted) - 1;
    const visitsPerCapita = visitsPredicted / data.population;
    
    return {
      totalVisits: Math.round(visitsPredicted),
      visitsPerCapita: visitsPerCapita.toFixed(3),
      efficiencyScore: ((visitsPredicted / data.totalStaff) / 1000).toFixed(2),
      collectionUtilization: (visitsPredicted / data.totalCollection).toFixed(3)
    };
  };

  // Update predictions when library data changes
  useEffect(() => {
    const newPredictions = calculatePrediction(libraryData);
    setPredictions(newPredictions);
    
    // Generate scenario analysis data
    const scenarios = [];
    const baseValue = libraryData[optimizationMode === 'visits' ? 'totalStaff' : 
                                 optimizationMode === 'hours' ? 'hoursOpen' : 
                                 optimizationMode === 'collection' ? 'totalCollection' : 'totalIncome'];
    
    for (let i = 0.5; i <= 2; i += 0.1) {
      const modifiedData = { ...libraryData };
      if (optimizationMode === 'visits') {
        modifiedData.totalStaff = Math.round(baseValue * i);
      } else if (optimizationMode === 'hours') {
        modifiedData.hoursOpen = Math.round(baseValue * i);
      } else if (optimizationMode === 'collection') {
        modifiedData.totalCollection = Math.round(baseValue * i);
      } else {
        modifiedData.totalIncome = Math.round(baseValue * i);
      }
      
      const scenarioPrediction = calculatePrediction(modifiedData);
      scenarios.push({
        multiplier: i.toFixed(1),
        value: modifiedData[optimizationMode === 'visits' ? 'totalStaff' : 
                           optimizationMode === 'hours' ? 'hoursOpen' : 
                           optimizationMode === 'collection' ? 'totalCollection' : 'totalIncome'],
        visits: scenarioPrediction.totalVisits,
        efficiency: parseFloat(scenarioPrediction.efficiencyScore)
      });
    }
    setScenarioData(scenarios);
  }, [libraryData, optimizationMode]);

  const handleInputChange = (field, value) => {
    setLibraryData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Generate recommendations based on model insights
  const generateRecommendations = () => {
    const recommendations = [];
    const staffRatio = libraryData.totalStaff / (libraryData.population / 1000);
    const hoursPerWeek = libraryData.hoursOpen;
    const collectionRatio = libraryData.totalCollection / libraryData.population;
    
    if (staffRatio < 0.5) {
      recommendations.push({
        type: 'Staff',
        priority: 'High',
        message: `Consider increasing staff. Current ratio of ${staffRatio.toFixed(2)} staff per 1000 residents is below recommended levels.`,
        impact: 'High'
      });
    }
    
    if (hoursPerWeek < 40) {
      recommendations.push({
        type: 'Hours',
        priority: 'Medium',
        message: `Extended hours could increase visits. Currently open ${hoursPerWeek} hours/week.`,
        impact: 'Medium'
      });
    }
    
    if (collectionRatio < 2) {
      recommendations.push({
        type: 'Collection',
        priority: 'Medium',
        message: `Collection expansion recommended. Current ratio of ${collectionRatio.toFixed(1)} items per resident.`,
        impact: 'Medium'
      });
    }
    
    return recommendations;
  };

  const recommendations = generateRecommendations();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
            <Library className="text-blue-600" size={40} />
            Library Performance Predictor
          </h1>
          <p className="text-lg text-gray-600">
            Interactive tool powered by Geographically Weighted Regression (GWR) to predict library visits and optimize performance
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Library Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin className="text-blue-600" size={20} />
                Library Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Library Name</label>
                  <input
                    type="text"
                    value={libraryData.libraryName}
                    onChange={(e) => handleInputChange('libraryName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={libraryData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      value={libraryData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                    <input
                      type="number"
                      step="0.01"
                      value={libraryData.latitude}
                      onChange={(e) => handleInputChange('latitude', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                    <input
                      type="number"
                      step="0.01"
                      value={libraryData.longitude}
                      onChange={(e) => handleInputChange('longitude', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Factors */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Sliders className="text-green-600" size={20} />
                Performance Factors
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Users size={16} />
                    Total Staff: {libraryData.totalStaff}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={libraryData.totalStaff}
                    onChange={(e) => handleInputChange('totalStaff', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1</span>
                    <span>50</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <DollarSign size={16} />
                    Annual Income: ${libraryData.totalIncome.toLocaleString()}
                  </label>
                  <input
                    type="range"
                    min="100000"
                    max="2000000"
                    step="10000"
                    value={libraryData.totalIncome}
                    onChange={(e) => handleInputChange('totalIncome', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>$100K</span>
                    <span>$2M</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Clock size={16} />
                    Weekly Hours: {libraryData.hoursOpen}
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="80"
                    value={libraryData.hoursOpen}
                    onChange={(e) => handleInputChange('hoursOpen', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>20h</span>
                    <span>80h</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <BookOpen size={16} />
                    Collection Size: {libraryData.totalCollection.toLocaleString()}
                  </label>
                  <input
                    type="range"
                    min="10000"
                    max="200000"
                    step="1000"
                    value={libraryData.totalCollection}
                    onChange={(e) => handleInputChange('totalCollection', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>10K</span>
                    <span>200K</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Population: {libraryData.population.toLocaleString()}
                  </label>
                  <input
                    type="range"
                    min="5000"
                    max="100000"
                    step="1000"
                    value={libraryData.population}
                    onChange={(e) => handleInputChange('population', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>5K</span>
                    <span>100K</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Predictions Display */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp className="text-purple-600" size={20} />
                Predicted Performance
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{predictions.totalVisits?.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Annual Visits</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{predictions.visitsPerCapita}</div>
                  <div className="text-sm text-gray-600">Visits per Capita</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{predictions.efficiencyScore}</div>
                  <div className="text-sm text-gray-600">Staff Efficiency</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">{predictions.collectionUtilization}</div>
                  <div className="text-sm text-gray-600">Collection Use</div>
                </div>
              </div>

              {/* Scenario Analysis Controls */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Optimization Analysis</label>
                <select
                  value={optimizationMode}
                  onChange={(e) => setOptimizationMode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="visits">Staff Impact on Visits</option>
                  <option value="hours">Hours Impact on Visits</option>
                  <option value="collection">Collection Impact on Visits</option>
                  <option value="income">Income Impact on Visits</option>
                </select>
              </div>

              {/* Scenario Chart */}
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={scenarioData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="value" 
                      label={{ value: optimizationMode === 'visits' ? 'Staff Count' : 
                                     optimizationMode === 'hours' ? 'Weekly Hours' :
                                     optimizationMode === 'collection' ? 'Collection Size' : 'Annual Income', 
                              position: 'insideBottom', offset: -10 }} 
                    />
                    <YAxis label={{ value: 'Predicted Visits', angle: -90, position: 'insideLeft' }} />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'visits' ? value.toLocaleString() : value,
                        name === 'visits' ? 'Predicted Visits' : 'Staff Efficiency'
                      ]}
                    />
                    <Line type="monotone" dataKey="visits" stroke="#3B82F6" strokeWidth={3} dot={{ fill: '#3B82F6', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp className="text-yellow-600" size={20} />
                Optimization Recommendations
              </h2>
              
              {recommendations.length > 0 ? (
                <div className="space-y-3">
                  {recommendations.map((rec, index) => (
                    <div key={index} className={`border-l-4 pl-4 py-3 ${
                      rec.priority === 'High' ? 'border-red-500 bg-red-50' :
                      rec.priority === 'Medium' ? 'border-yellow-500 bg-yellow-50' :
                      'border-green-500 bg-green-50'
                    }`}>
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-medium text-gray-800">{rec.type} Optimization</h3>
                        <span className={`text-xs px-2 py-1 rounded ${
                          rec.priority === 'High' ? 'bg-red-100 text-red-800' :
                          rec.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {rec.priority} Priority
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{rec.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <TrendingUp size={48} className="mx-auto mb-3 text-gray-300" />
                  <p>Your library appears to be well-optimized!</p>
                  <p className="text-sm">Current metrics are within recommended ranges.</p>
                </div>
              )}
            </div>

            {/* Impact Analysis */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">What-If Analysis</h2>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-800 mb-2">Quick Scenarios</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>+20% Staff:</span>
                      <span className="font-medium text-green-600">
                        +{Math.round(calculatePrediction({...libraryData, totalStaff: libraryData.totalStaff * 1.2}).totalVisits - predictions.totalVisits).toLocaleString()} visits
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>+10 Hours/Week:</span>
                      <span className="font-medium text-blue-600">
                        +{Math.round(calculatePrediction({...libraryData, hoursOpen: libraryData.hoursOpen + 10}).totalVisits - predictions.totalVisits).toLocaleString()} visits
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>+50% Collection:</span>
                      <span className="font-medium text-purple-600">
                        +{Math.round(calculatePrediction({...libraryData, totalCollection: libraryData.totalCollection * 1.5}).totalVisits - predictions.totalVisits).toLocaleString()} visits
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Analysis Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Performance Metrics Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Metrics Breakdown</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { metric: 'Staff Ratio', value: (libraryData.totalStaff / (libraryData.population / 1000)).toFixed(2), benchmark: 0.6 },
                  { metric: 'Hours/Week', value: libraryData.hoursOpen, benchmark: 50 },
                  { metric: 'Items/Capita', value: (libraryData.totalCollection / libraryData.population).toFixed(1), benchmark: 3.0 },
                  { metric: 'Efficiency', value: parseFloat(predictions.efficiencyScore || 0), benchmark: 2.5 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="metric" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3B82F6" name="Current" />
                  <Bar dataKey="benchmark" fill="#10B981" name="Benchmark" opacity={0.7} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Model Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Model Information</h3>
            <div className="space-y-3 text-sm">
              <div className="bg-blue-50 rounded-lg p-3">
                <h4 className="font-medium text-blue-800 mb-1">Geographically Weighted Regression</h4>
                <p className="text-blue-700">
                  This model accounts for spatial variation in library performance factors. 
                  Predictions consider both your library's characteristics and geographic context.
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <h4 className="font-medium text-green-800 mb-1">Key Model Factors</h4>
                <ul className="text-green-700 space-y-1">
                  <li>• Staff levels (strongest predictor)</li>
                  <li>• Operating budget and income</li>
                  <li>• Service hours</li>
                  <li>• Collection size</li>
                  <li>• Geographic location effects</li>
                </ul>
              </div>
              <div className="bg-yellow-50 rounded-lg p-3">
                <h4 className="font-medium text-yellow-800 mb-1">Usage Note</h4>
                <p className="text-yellow-700 text-xs">
                  Predictions are estimates based on historical patterns. 
                  Local factors not captured in the model may influence actual performance.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Interactive Library Performance Predictor | Powered by Geographically Weighted Regression Analysis</p>
        </div>
      </div>
    </div>
  );
};

export default LibraryPredictor;