import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

const locationColors = {
  Mcmillan: 'red',
  Goddard: 'blue',
  BeltsVille: 'green'
};

function ComparisonPlot({ chemical }) {
  const allLocations = ["Mcmillan", "Goddard", "BeltsVille"];
  const [selectedLocations, setSelectedLocations] = useState(["Mcmillan"]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [compareData, setCompareData] = useState(null);

  useEffect(() => {
    if (selectedLocations.length === 0) return;

    // Clear compareData before fetching new data
    setCompareData(null);

    const params = new URLSearchParams();
    selectedLocations.forEach(loc => params.append("locations", loc));
    params.append("chemical", chemical);
    params.append("year", year);

    fetch(`http://localhost:8000/compare?${params.toString()}`)
      .then(res => res.json())
      .then(json => setCompareData(json));
  }, [selectedLocations, year, chemical]);

  // Set a fixed plot width for all locations
  const plotWidth = 500 + allLocations.length * 350; // Fixed width for 3 locations

  // Filter locations that have data for the selected year
  const filteredLocations = selectedLocations.filter(loc => {
    const months = compareData?.[loc] || {};
    return Object.keys(months).some(month => months[month].length > 0); // Check if there is any data for the year
  });

  // Check if at least one location has data for the selected year
  const hasDataForYear = filteredLocations.length > 0;

  // Generate the plot data
  const plotData = hasDataForYear
    ? filteredLocations.map(loc => {
        const months = compareData[loc] || {};
        const x = [];
        const y = [];
        const customdata = []; // Array to store additional data (e.g., dates)

        Object.entries(months).forEach(([month, values]) => {
          values.forEach((value, index) => {
            x.push(Number(month)); // Use the month number as x
            y.push(value.vertical_amount); // Use vertical_amount as y
            customdata.push(value.date); // Add the date to customdata
          });
        });

        return {
          y,
          x,
          customdata, // Pass the additional data
          type: "box",
          name: loc, // Location name for the legend
          marker: { color: locationColors[loc] },
          boxpoints: "outliers",
          legendgroup: loc,
          showlegend: true,
          hoverinfo: "y+name", // Default hover info
          hovertemplate: 'Date: %{customdata}<br>Value: %{y:.3f}<extra></extra>', // Include date in hover
        };
      })
    : []; // No data, return an empty array

  return (
    <div style={{ marginTop: 60 }}>
      <h2>Compare</h2>
      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
        <span>Locations:</span>
        {allLocations.map(loc => (
          <label key={loc} style={{ marginRight: 8 }}>
            <input
              type="checkbox"
              checked={selectedLocations.includes(loc)}
              onChange={e => {
                if (e.target.checked) {
                  setSelectedLocations([...selectedLocations, loc]);
                } else {
                  setSelectedLocations(selectedLocations.filter(l => l !== loc));
                }
              }}
            />
            <span style={{ color: locationColors[loc], marginLeft: 2 }}>{loc}</span>
          </label>
        ))}
        <span>Year:</span>
        <input
          type="number"
          value={year}
          min={2000}
          max={2100}
          onChange={e => setYear(Number(e.target.value))}
          style={{ width: 80 }}
        />
      </div>
      <Plot
        data={plotData}
        layout={{
          width: plotWidth,
          height: 600,
          boxmode: "group",
          boxgroupgap: 0.15,
          boxgap: 0.05,
          title: hasDataForYear ? `Monthly Distribution (${year})` : "No Data Available",
          xaxis: {
            title: "Month",
            tickvals: Array.from({ length: 12 }, (_, i) => i + 1),
            ticktext: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          },
          yaxis: {
            title: { text: "Total Column (micromole/m²)", standoff: 10 },
            automargin: true
          },
          margin: { l: 80, r: 50, b: 80, t: 50, pad: 10 }
        }}
        config={{
          displayModeBar: false,
        }}
      />
      <div style={{
        position: "relative",
        right: "-750px",
        bottom: "30px",
        fontSize: "0.85rem",
        color: "#666",
        background: "none",
        border: "none",
        padding: 0,
        zIndex: 10,
        textAlign: "left",
        lineHeight: 1.3,
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        gap: "2.5rem"
      }}>
        <span>
          <span style={{ color: "red" }}>⬤  </span> Mcmillan&nbsp;
          <span style={{ color: "blue" }}>⬤ </span> Goddard&nbsp;
          <span style={{ color: "green" }}>⬤   </span> BeltsVille
        </span>
        <em>
          * This is only high quality data (10 = not-assured high quality)<br />
        </em>
      </div>
    </div>
  );
}

function MainPlot({ chemical }) {
  const [range, setRange] = useState("all");
  const [location, setLocation] = useState("Mcmillan");
  const [data, setData] = useState({ datetime: [], vertical_amount: [] });
  const [markerColor, setMarkerColor] = useState(locationColors["Mcmillan"]);

  useEffect(() => {
    fetch(`http://localhost:8000/data?range=${range}&location=${location}&chemical=${chemical}`)
      .then(res => res.json())
      .then(json => {
        setData(json);
        setTimeout(() => {
          setMarkerColor(locationColors[location] || 'gray');
        }, 100);
      });
  }, [range, location, chemical]);

  return (
    <div style={{ padding: "10px", position: "relative" }}>
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
              color: markerColor,
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

      <div style={{
        position: "relative",
        right: "-750px",
        bottom: "30px",
        fontSize: "0.85rem",
        color: "#666",
        background: "none",
        border: "none",
        padding: 0,
        zIndex: 10,
        textAlign: "left",
        lineHeight: 1.3,
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        gap: "2.5rem"
      }}>
        <span>
          <span style={{ color: "red" }}>⬤  </span> Mcmillan&nbsp;
          <span style={{ color: "blue" }}>⬤ </span> Goddard&nbsp;
          <span style={{ color: "green" }}>⬤   </span> BeltsVille
        </span>
        <em>
          * This is only high quality data (10 = not-assured high quality)<br />
          * This is a 15 min average of the timeseries plot
        </em>
      </div>

      {/* Comparison plot below info text */}
      <ComparisonPlot chemical="NO2" />
    </div>
  );
}

export default function FormaldehydePage() {
  return (
    <div>
      <h2>Formaldehyde total column Pandora</h2>
      <MainPlot chemical="NO2" />
      {/* <ComparisonPlot chemical="NO2" /> */}
    </div>
  );
}