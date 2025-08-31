import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

const GWRAnalysisDashboard = () => {
  const [data, setData] = useState([]);
  const [selectedCoefficient, setSelectedCoefficient] = useState('gwr_coef_log_TOTSTAFF');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // CSS styles as a string
  const styles = `
    .dashboard-container {
      padding: 1.5rem;
      background-color: #f9fafb;
      min-height: 100vh;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
    }

    .dashboard-title {
      font-size: 1.875rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      color: #1f2937;
      text-align: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .info-banner {
      margin-bottom: 1.5rem;
      font-size: 0.875rem;
      color: #4b5563;
      background-color: white;
      padding: 0.75rem;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      border-left: 4px solid #3b82f6;
    }

    .coord-info {
      margin-top: 0.5rem;
      font-size: 0.75rem;
      color: #6b7280;
    }

    .grid-container {
      display: grid;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .grid-two-cols {
      grid-template-columns: 1fr;
    }

    @media (min-width: 1024px) {
      .grid-two-cols {
        grid-template-columns: 1fr 1fr;
      }
    }

    .card {
      background-color: white;
      padding: 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.15);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .card-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
    }

    .controls-container {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .select-input {
      padding: 0.5rem 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      background-color: white;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .select-input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .map-container {
      position: relative;
      background: linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%);
      height: 20rem;
      border-radius: 0.5rem;
      border: 1px solid #e5e7eb;
      overflow: hidden;
    }

    .map-point {
      position: absolute;
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
      border: 1px solid white;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      cursor: pointer;
      transition: transform 0.2s ease;
    }

    .map-point:hover {
      transform: scale(1.5);
      z-index: 10;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    }

    .legend {
      position: absolute;
      bottom: 0.75rem;
      right: 0.75rem;
      background-color: white;
      padding: 0.75rem;
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      font-size: 0.75rem;
    }

    .legend-title {
      text-align: center;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }

    .legend-gradient {
      width: 5rem;
      height: 0.75rem;
      border-radius: 0.125rem;
    }

    .coefficient-gradient {
      background: linear-gradient(to right, #ef4444, #eab308, #3b82f6);
    }

    .r2-gradient {
      background: linear-gradient(to right, #fde047, #fb923c, #a855f7);
    }

    .legend-labels {
      display: flex;
      justify-content: space-between;
      margin-top: 0.25rem;
      font-size: 0.75rem;
    }

    .chart-container {
      background-color: white;
      padding: 1rem;
      border-radius: 0.5rem;
      border: 1px solid #e5e7eb;
    }

    .chart-title {
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
      margin-bottom: 0.5rem;
    }

    .scatter-container {
      display: flex;
      justify-content: center;
    }

    .chart-description {
      font-size: 0.875rem;
      color: #4b5563;
      margin-top: 1rem;
      text-align: center;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }

    @media (min-width: 768px) {
      .stats-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    .stat-card {
      text-align: center;
      padding: 1rem;
      border-radius: 0.5rem;
    }

    .stat-card-blue {
      background-color: #eff6ff;
    }

    .stat-card-green {
      background-color: #f0fdf4;
    }

    .stat-card-purple {
      background-color: #faf5ff;
    }

    .stat-card-orange {
      background-color: #fff7ed;
    }

    .stat-value {
      font-size: 1.875rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .stat-value-blue {
      color: #2563eb;
    }

    .stat-value-green {
      color: #16a34a;
    }

    .stat-value-purple {
      color: #9333ea;
    }

    .stat-value-orange {
      color: #ea580c;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #374151;
      font-weight: 500;
    }

    .stat-description {
      font-size: 0.75rem;
      color: #6b7280;
      margin-top: 0.25rem;
    }

    .interpretation-section {
      margin-top: 1.5rem;
      padding: 1rem;
      background-color: #f9fafb;
      border-radius: 0.5rem;
    }

    .interpretation-title {
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 0.5rem;
    }

    .interpretation-text {
      font-size: 0.875rem;
      color: #4b5563;
      line-height: 1.5;
    }

    .loading-container {
      padding: 1.5rem;
      background-color: #f9fafb;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .loading-content {
      text-align: center;
    }

    .spinner {
      animation: spin 1s linear infinite;
      border-radius: 50%;
      height: 8rem;
      width: 8rem;
      border: 0.5rem solid transparent;
      border-top-color: #3b82f6;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .loading-text {
      font-size: 1.125rem;
      color: #4b5563;
    }

    .error-container {
      padding: 1.5rem;
      background-color: #f9fafb;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .error-content {
      text-align: center;
      background-color: white;
      padding: 2rem;
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      max-width: 28rem;
    }

    .error-icon {
      color: #ef4444;
      font-size: 3.75rem;
      margin-bottom: 1rem;
    }

    .error-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 0.5rem;
    }

    .error-message {
      color: #4b5563;
      margin-bottom: 1rem;
    }

    .error-help {
      font-size: 0.875rem;
      color: #6b7280;
    }

    .no-data-message {
      background-color: white;
      padding: 1rem;
      border-radius: 0.5rem;
      border: 1px solid #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #6b7280;
    }
  `;

  // Initialize by automatically loading gwr.csv
  useEffect(() => {
    const loadGWRData = async () => {
      try {
        const response = await fetch('/gwr.csv');
        if (!response.ok) {
          throw new Error('Failed to load gwr.csv file');
        }
        
        const csvData = await response.text();
        
        Papa.parse(csvData, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          transformHeader: (header) => header.trim(),
          complete: (results) => {
            if (results.errors.length > 0) {
              console.warn('CSV parsing warnings:', results.errors);
            }
            
            // Filter out rows with missing essential data
            const validData = results.data.filter(row => 
              row.LATITUDE && 
              row.LONGITUD && 
              row.log_VISITS !== null && 
              row.log_VISITS !== undefined
            );
            
            console.log(`Loaded ${validData.length} valid records from gwr.csv`);
            setData(validData);
            setLoading(false);
          },
          error: (error) => {
            console.error('CSV parsing error:', error);
            setError(`Failed to parse CSV: ${error.message}`);
            setLoading(false);
          }
        });
      } catch (error) {
        console.error('Error loading gwr.csv:', error);
        setError(`Failed to load gwr.csv: ${error.message}`);
        setLoading(false);
      }
    };
    
    loadGWRData();
  }, []);

  // Color function for coefficient visualization
  const getColorForValue = (value, min, max) => {
    if (value === null || value === undefined || isNaN(value)) {
      return '#cccccc'; // Gray for missing values
    }
    
    const normalized = Math.max(0, Math.min(1, (value - min) / (max - min)));
    if (normalized < 0.5) {
      const r = Math.floor(255 * (1 - normalized * 2));
      const g = Math.floor(255 * normalized * 2);
      return `rgb(${r}, ${g}, 255)`;
    } else {
      const g = Math.floor(255 * (2 - normalized * 2));
      const r = 255;
      return `rgb(${r}, ${g}, 0)`;
    }
  };

  const coefficientOptions = [
    { value: 'gwr_coef_log_TOTSTAFF', label: 'log_TOTSTAFF' },
    { value: 'gwr_coef_log_TOTINCM', label: 'log_TOTINCM' },
    { value: 'gwr_coef_HRS_OPEN', label: 'HRS_OPEN' },
    { value: 'gwr_coef_log_TOTCOLL', label: 'log_TOTCOLL' },
    { value: 'gwr_coef_intercept', label: 'Intercept' }
  ];

  // Simple SVG Chart Components
  const ScatterPlot = ({ data, width = 400, height = 300 }) => {
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    
    const validData = data.filter(d => d.actual !== null && d.predicted !== null && !isNaN(d.actual) && !isNaN(d.predicted));
    
    if (validData.length === 0) {
      return (
        <div className="no-data-message" style={{ width, height }}>
          <p>No valid data for scatter plot</p>
        </div>
      );
    }
    
    const xValues = validData.map(d => d.actual);
    const yValues = validData.map(d => d.predicted);
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);
    
    const xScale = (value) => ((value - minX) / (maxX - minX)) * chartWidth;
    const yScale = (value) => chartHeight - ((value - minY) / (maxY - minY)) * chartHeight;
    
    return (
      <div className="chart-container">
        <svg width={width} height={height} style={{ border: '1px solid #e5e7eb' }}>
          <g transform={`translate(${margin.left},${margin.top})`}>
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map(ratio => (
              <g key={ratio}>
                <line
                  x1={ratio * chartWidth}
                  y1={0}
                  x2={ratio * chartWidth}
                  y2={chartHeight}
                  stroke="#e5e7eb"
                  strokeDasharray="2,2"
                />
                <line
                  x1={0}
                  y1={ratio * chartHeight}
                  x2={chartWidth}
                  y2={ratio * chartHeight}
                  stroke="#e5e7eb"
                  strokeDasharray="2,2"
                />
              </g>
            ))}
            
            {/* Perfect prediction line */}
            <line
              x1={0}
              y1={chartHeight}
              x2={chartWidth}
              y2={0}
              stroke="#ef4444"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            
            {/* Data points */}
            {validData.map((point, i) => (
              <circle
                key={i}
                cx={xScale(point.actual)}
                cy={yScale(point.predicted)}
                r="3"
                fill="#3b82f6"
                fillOpacity="0.7"
                stroke="white"
                strokeWidth="1"
              >
                <title>{`${point.library}: Actual: ${point.actual.toFixed(3)}, Predicted: ${point.predicted.toFixed(3)}`}</title>
              </circle>
            ))}
            
            {/* Axes */}
            <line x1={0} y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#374151" strokeWidth="2"/>
            <line x1={0} y1={0} x2={0} y2={chartHeight} stroke="#374151" strokeWidth="2"/>
            
            {/* Axis labels */}
            <text x={chartWidth/2} y={chartHeight + 35} textAnchor="middle" style={{ fontSize: '14px', fill: '#4b5563' }}>
              Actual log(Visits)
            </text>
            <text x={-chartHeight/2} y={-25} textAnchor="middle" style={{ fontSize: '14px', fill: '#4b5563' }} transform="rotate(-90)">
              Predicted log(Visits)
            </text>
          </g>
        </svg>
      </div>
    );
  };

  const Histogram = ({ data, width = 400, height = 250, color = "#3b82f6", title = "Histogram" }) => {
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    
    if (!data || data.length === 0) {
      return (
        <div className="no-data-message" style={{ width, height }}>
          <p>No data available</p>
        </div>
      );
    }
    
    const maxCount = Math.max(...data.map(d => d.count));
    const barWidth = chartWidth / data.length;
    
    return (
      <div className="chart-container">
        <h4 className="chart-title">{title}</h4>
        <svg width={width} height={height} style={{ border: '1px solid #e5e7eb' }}>
          <g transform={`translate(${margin.left},${margin.top})`}>
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map(ratio => (
              <line
                key={ratio}
                x1={0}
                y1={ratio * chartHeight}
                x2={chartWidth}
                y2={ratio * chartHeight}
                stroke="#e5e7eb"
                strokeDasharray="2,2"
              />
            ))}
            
            {/* Bars with labels */}
            {data.map((bar, i) => {
              const barHeight = maxCount > 0 ? (bar.count / maxCount) * chartHeight : 0;
              const barX = i * barWidth + 2;
              const barY = chartHeight - barHeight;
              
              return (
                <g key={i}>
                  <rect
                    x={barX}
                    y={barY}
                    width={barWidth - 4}
                    height={barHeight}
                    fill={color}
                    fillOpacity="0.8"
                    rx="2"
                  >
                    <title>{`${bar.bin}: ${bar.count} items`}</title>
                  </rect>
                  
                  {/* Value labels on bars */}
                  {bar.count > 0 && (
                    <text
                      x={barX + (barWidth - 4) / 2}
                      y={barY - 5}
                      textAnchor="middle"
                      style={{ 
                        fontSize: '11px', 
                        fill: '#374151',
                        fontWeight: '500'
                      }}
                    >
                      {bar.count}
                    </text>
                  )}
                  
                  {/* Bin labels on x-axis */}
                  <text
                    x={barX + (barWidth - 4) / 2}
                    y={chartHeight + 15}
                    textAnchor="middle"
                    style={{ 
                      fontSize: '10px', 
                      fill: '#6b7280'
                    }}
                  >
                    {parseFloat(bar.bin).toFixed(1)}
                  </text>
                </g>
              );
            })}
            
            {/* Y-axis labels */}
            {[0, 0.25, 0.5, 0.75, 1].map(ratio => (
              <text
                key={ratio}
                x={-10}
                y={chartHeight - (ratio * chartHeight) + 4}
                textAnchor="end"
                style={{ 
                  fontSize: '10px', 
                  fill: '#6b7280'
                }}
              >
                {Math.round(maxCount * ratio)}
              </text>
            ))}
            
            {/* Axes */}
            <line x1={0} y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#374151" strokeWidth="2"/>
            <line x1={0} y1={0} x2={0} y2={chartHeight} stroke="#374151" strokeWidth="2"/>
            
            {/* Axis labels */}
            <text
              x={chartWidth / 2}
              y={chartHeight + 35}
              textAnchor="middle"
              style={{ fontSize: '12px', fill: '#4b5563', fontWeight: '500' }}
            >
              {title === 'Residuals' ? 'Residual Value' : 'R² Value'}
            </text>
            <text
              x={-chartHeight / 2}
              y={-25}
              textAnchor="middle"
              transform="rotate(-90)"
              style={{ fontSize: '12px', fill: '#4b5563', fontWeight: '500' }}
            >
              Count
            </text>
          </g>
        </svg>
      </div>
    );
  };

  if (loading) {
    return (
      <div>
        <style>{styles}</style>
        <div className="loading-container">
          <div className="loading-content">
            <div className="spinner"></div>
            <p className="loading-text">Loading GWR analysis data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <style>{styles}</style>
        <div className="error-container">
          <div className="error-content">
            <div className="error-icon">⚠️</div>
            <h2 className="error-title">Error Loading Data</h2>
            <p className="error-message">{error}</p>
            <p className="error-help">Please ensure the gwr.csv file is available in the public folder.</p>
          </div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div>
        <style>{styles}</style>
        <div className="error-container">
          <div className="error-content">
            <div className="error-icon">📊</div>
            <h2 className="error-title">No Data Available</h2>
            <p className="error-message">The GWR data could not be loaded.</p>
            <p className="error-help">Please ensure the gwr.csv file is properly formatted and accessible.</p>
          </div>
        </div>
      </div>
    );
  }

  // Filter out null/undefined values for calculations
  const validCoeffValues = data
    .map(d => d[selectedCoefficient])
    .filter(val => val !== null && val !== undefined && !isNaN(val));
  
  const minCoeff = validCoeffValues.length > 0 ? Math.min(...validCoeffValues) : 0;
  const maxCoeff = validCoeffValues.length > 0 ? Math.max(...validCoeffValues) : 1;

  // Create histogram data for residuals
  const residualHist = [];
  const residuals = data
    .map(d => d.gwr_residuals)
    .filter(val => val !== null && val !== undefined && !isNaN(val));
  
  if (residuals.length > 0) {
    const minRes = Math.min(...residuals);
    const maxRes = Math.max(...residuals);
    const bins = 10;
    const binWidth = (maxRes - minRes) / bins;

    for (let i = 0; i < bins; i++) {
      const binStart = minRes + i * binWidth;
      const binEnd = binStart + binWidth;
      const count = residuals.filter(r => r >= binStart && r < binEnd).length;
      residualHist.push({ bin: binStart.toFixed(2), count });
    }
  }

  // Create histogram data for local R²
  const r2Hist = [];
  const r2Values = data
    .map(d => d.gwr_local_r2)
    .filter(val => val !== null && val !== undefined && !isNaN(val));
  
  if (r2Values.length > 0) {
    const minR2 = Math.min(...r2Values);
    const maxR2 = Math.max(...r2Values);
    const bins = 10;
    const r2BinWidth = (maxR2 - minR2) / bins;

    for (let i = 0; i < bins; i++) {
      const binStart = minR2 + i * r2BinWidth;
      const binEnd = binStart + r2BinWidth;
      const count = r2Values.filter(r => r >= binStart && r < binEnd).length;
      r2Hist.push({ bin: binStart.toFixed(2), count });
    }
  }

  // Create data for scatter plot
  const scatterData = data
    .filter(d => d.log_VISITS !== null && d.gwr_predictions !== null)
    .map(d => ({
      actual: d.log_VISITS,
      predicted: d.gwr_predictions,
      library: d.LIBNAME || d.CITY || 'Unknown'
    }));

  // Calculate coordinate ranges from actual data
  const allLongitudes = data.filter(d => d.LONGITUD).map(d => d.LONGITUD);
  const allLatitudes = data.filter(d => d.LATITUDE).map(d => d.LATITUDE);
  const minLong = allLongitudes.length > 0 ? Math.min(...allLongitudes) : 0;
  const maxLong = allLongitudes.length > 0 ? Math.max(...allLongitudes) : 0;
  const minLat = allLatitudes.length > 0 ? Math.min(...allLatitudes) : 0;
  const maxLat = allLatitudes.length > 0 ? Math.max(...allLatitudes) : 0;

  return (
    <div>
      <style>{styles}</style>
      <div className="dashboard-container">
        <h1 className="dashboard-title">GWR Analysis Dashboard</h1>
        
        {/* Info Banner */}
        <div className="info-banner">
          <strong>Dataset Overview:</strong> Loaded {data.length} library observations with spatially varying coefficients
          <div className="coord-info">
            Coordinate bounds: Longitude [{minLong.toFixed(3)}, {maxLong.toFixed(3)}], 
            Latitude [{minLat.toFixed(3)}, {maxLat.toFixed(3)}]
          </div>
        </div>

        {/* Top Row - Spatial Visualizations */}
        <div className="grid-container grid-two-cols">
          {/* Coefficient Map */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Spatial Distribution of Coefficients</h3>
              <div className="controls-container">
                <select
                  value={selectedCoefficient}
                  onChange={(e) => setSelectedCoefficient(e.target.value)}
                  className="select-input"
                >
                  {coefficientOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="map-container">
              {data.filter(point => 
                point.LATITUDE && point.LONGITUD && 
                point[selectedCoefficient] !== null && 
                point[selectedCoefficient] !== undefined
              ).map((point, idx) => {
                const x = ((point.LONGITUD - minLong) / (maxLong - minLong)) * 100;
                const y = (1 - (point.LATITUDE - minLat) / (maxLat - minLat)) * 100;
                const color = getColorForValue(point[selectedCoefficient], minCoeff, maxCoeff);
                
                return (
                  <div
                    key={idx}
                    className="map-point"
                    style={{
                      left: `${Math.max(1, Math.min(97, x))}%`,
                      top: `${Math.max(1, Math.min(97, y))}%`,
                      backgroundColor: color,
                    }}
                    title={`${point.LIBNAME || point.CITY}: ${point[selectedCoefficient]?.toFixed(3)}`}
                  />
                );
              })}
              
              {/* Legend for Coefficients */}
              <div className="legend">
                <div className="legend-title">Coefficient Value</div>
                <div className="legend-gradient coefficient-gradient"></div>
                <div className="legend-labels">
                  <span>{minCoeff.toFixed(2)}</span>
                  <span>{maxCoeff.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Local R² Map */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Local R² Distribution</h3>
            </div>
            <div className="map-container">
              {data.filter(point => 
                point.LATITUDE && point.LONGITUD && 
                point.gwr_local_r2 !== null && 
                point.gwr_local_r2 !== undefined
              ).map((point, idx) => {
                const x = ((point.LONGITUD - minLong) / (maxLong - minLong)) * 100;
                const y = (1 - (point.LATITUDE - minLat) / (maxLat - minLat)) * 100;
                
                // Calculate color based on actual R² range in your data
                const minR2 = Math.min(...r2Values);
                const maxR2 = Math.max(...r2Values);
                const normalizedR2 = (point.gwr_local_r2 - minR2) / (maxR2 - minR2);
                
                // Better color scale: yellow (low) -> orange (medium) -> purple (high)
                let color;
                if (normalizedR2 < 0.5) {
                  // Yellow to orange
                  const t = normalizedR2 * 2;
                  const r = 253;
                  const g = Math.floor(224 - t * (224 - 159));
                  const b = Math.floor(71 - t * 71);
                  color = `rgb(${r}, ${g}, ${b})`;
                } else {
                  // Orange to purple
                  const t = (normalizedR2 - 0.5) * 2;
                  const r = Math.floor(251 - t * (251 - 168));
                  const g = Math.floor(146 - t * 146);
                  const b = Math.floor(59 + t * (168 - 59));
                  color = `rgb(${r}, ${g}, ${b})`;
                }
                
                return (
                  <div
                    key={idx}
                    className="map-point"
                    style={{
                      left: `${Math.max(1, Math.min(97, x))}%`,
                      top: `${Math.max(1, Math.min(97, y))}%`,
                      backgroundColor: color,
                    }}
                    title={`${point.LIBNAME || point.CITY}: R² = ${point.gwr_local_r2.toFixed(3)}`}
                  />
                );
              })}
              
              {/* Legend for R² */}
              <div className="legend">
                <div className="legend-title">Local R²</div>
                <div className="legend-gradient r2-gradient"></div>
                <div className="legend-labels">
                  <span>{r2Values.length > 0 ? Math.min(...r2Values).toFixed(2) : '0.0'}</span>
                  <span>{r2Values.length > 0 ? Math.max(...r2Values).toFixed(2) : '1.0'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Row - Predictions vs Actual */}
        <div className="grid-container">
          <div className="card">
            <h3 className="card-title">Model Predictions vs Actual Values</h3>
            <div className="scatter-container">
              <ScatterPlot data={scatterData} width={600} height={400} />
            </div>
            <p className="chart-description">
              Points closer to the red diagonal line indicate better model predictions. The red line represents perfect predictions.
            </p>
          </div>
        </div>

        {/* Bottom Row - Distributions */}
        <div className="grid-container grid-two-cols">
          {/* Residual Distribution */}
          <div className="card">
            <h3 className="card-title">Residual Distribution</h3>
            <div className="scatter-container">
              <Histogram data={residualHist} color="#60A5FA" title="Residuals" width={400} height={300} />
            </div>
            <p className="chart-description">
              A normal distribution centered around zero indicates good model fit.
            </p>
          </div>

          {/* Local R² Distribution */}
          <div className="card">
            <h3 className="card-title">Local R² Distribution</h3>
            <div className="scatter-container">
              <Histogram data={r2Hist} color="#34D399" title="Local R²" width={400} height={300} />
            </div>
            <p className="chart-description">
              Higher R² values indicate better local model fit. Values closer to 1.0 are better.
            </p>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="card">
          <h3 className="card-title">Model Performance Summary</h3>
          <div className="stats-grid">
            <div className="stat-card stat-card-blue">
              <div className="stat-value stat-value-blue">
                {(data.reduce((sum, d) => sum + (d.gwr_local_r2 || 0), 0) / data.length).toFixed(3)}
              </div>
              <div className="stat-label">Mean Local R²</div>
              <div className="stat-description">Average model fit</div>
            </div>
            <div className="stat-card stat-card-green">
              <div className="stat-value stat-value-green">
                {Math.sqrt(data.reduce((sum, d) => sum + (d.gwr_residuals || 0) ** 2, 0) / data.length).toFixed(3)}
              </div>
              <div className="stat-label">RMSE</div>
              <div className="stat-description">Prediction error</div>
            </div>
            <div className="stat-card stat-card-purple">
              <div className="stat-value stat-value-purple">
                {data.length}
              </div>
              <div className="stat-label">Observations</div>
              <div className="stat-description">Total libraries</div>
            </div>
            <div className="stat-card stat-card-orange">
              <div className="stat-value stat-value-orange">
                {Math.max(...data.map(d => d.gwr_local_r2 || 0)).toFixed(3)}
              </div>
              <div className="stat-label">Max Local R²</div>
              <div className="stat-description">Best local fit</div>
            </div>
          </div>
          
          <div className="interpretation-section">
            <h4 className="interpretation-title">Model Interpretation</h4>
            <p className="interpretation-text">
              This GWR analysis shows how library characteristics (staff, income, hours, collection) relate to visit patterns 
              across different geographic locations. The spatially varying coefficients reveal local relationships that 
              traditional global regression models would miss.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GWRAnalysisDashboard;