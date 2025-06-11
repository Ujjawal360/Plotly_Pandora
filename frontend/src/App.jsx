import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

function App() {
  const [range, setRange] = useState("3d");
  const [location, setLocation] = useState("Mcmillan");
  const [data, setData] = useState({ datetime: [], vertical_amount: [] });

  useEffect(() => {
    fetch(`http://localhost:8000/data?range=${range}&location=${location}`)
      .then(res => res.json())
      .then(json => setData(json));
  }, [range, location]);

  return (
    <div style={{ padding: "10px" }}>
      <h2>Formaldehyde total column Pandora</h2>

      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <select value={location} onChange={e => setLocation(e.target.value)}>
          <option value="Mcmillan">Mcmillan</option>
          <option value="Goddard">Goddard</option>
          <option value="BeltsVille">BeltsVille</option>
        </select>
        <select value={range} onChange={e => setRange(e.target.value)}>
          <option value="3d">Last 3 Days</option>
          <option value="7d">Last 7 Days</option>
          <option value="1m">Last 1 Month</option>
          <option value="all">All Time</option>
        </select>
      </div>

      <Plot
        data={[
          {
            x: data.datetime,
            y: data.vertical_amount,
            type: 'scatter',
            mode: 'markers',
            name: location,
            marker: {
              color: 'red',
              line: {
                color: 'white',
                width: 0.1
              }
            },
            customdata: data.datetime,
            hovertemplate:
              'Date: %{customdata}<br>' +
              'Total Column: %{y:.3f}<extra></extra>',
          }
        ]}
        layout={{
          width: 1200,
          height: 650,
          title: `Vertical Amount (${range.toUpperCase()})`,
          xaxis: {
            title: { text: 'EST Time', standoff: 10 },
            automargin: true
          },
          yaxis: {
            title: { text: 'Total Column (micromole/m²)', standoff: 10 },
            automargin: true
          },
          margin: { l: 80, r: 50, b: 80, t: 50, pad: 10 }
        }}
      />
    </div>
  );
}

export default App;
