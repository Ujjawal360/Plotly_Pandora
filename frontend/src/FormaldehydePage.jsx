import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { Link } from "react-router-dom";

const locationColors = {
  Mcmillan: 'red',
  Goddard: 'blue',
  BeltsVille: 'green'
};

function Sidebar() {
  return (
    <nav style={{
      width: 180,
      minHeight: "100vh",
      background: "#111",
      borderRight: "1px solidrgb(0, 0, 0)",
      padding: "1.5rem 1rem",
      position: "fixed",
      left: 0,
      top: 0,
      fontFamily: "'Open Sans', Segoe UI, Arial, sans-serif",
      fontSize: "0.97rem",
      color: "#fff",
      letterSpacing: 0.1,
      zIndex: 100,
      boxSizing: "border-box"
    }}>
      <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "2.2rem", color: "#fff" }}>
        Pandora Dashboard
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        <li style={{ marginBottom: 16 }}>
          <Link to="/" style={{ textDecoration: "none", color: "#fff", opacity: 0.92 }}>Home</Link>
        </li>
        <li style={{ marginBottom: 16 }}>
          <Link to="/formaldehyde" style={{ textDecoration: "none", color: "#fff", opacity: 0.92 }}>Formaldehyde (HCHO)</Link>
        </li>
        <li>
          <Link to="/no2" style={{ textDecoration: "none", color: "#fff", opacity: 0.92 }}>Nitrogen Dioxide (NO₂)</Link>
        </li>
      </ul>
    </nav>
  );
}

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
  const plotWidth = 470 + allLocations.length * 270; // Fixed width for 3 locations

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
          margin: { l: 80, r: 50, b: 80, t: 50, pad: 10 },
        //   legend: { visible: false }
        }}
        config={{
          displayModeBar: false,
        }}
      />
      <div style={{
        position: "relative",
        right: "-600px",
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
        right: "-600px",
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
    </div>
  );
}

export default function FormaldehydePage() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#fcfcfc" }}>
      <Sidebar />
      <main 
        style={{
          marginLeft: 180,
          width: "100%",
          maxWidth: 1400, // or your preferred max width
          marginRight: "auto",
          padding: "2.5rem 2rem 2rem 2rem",
          fontFamily: "Inter, Segoe UI, Arial, sans-serif",
          boxSizing: "border-box"
        }}
      >
        <section style={{ marginBottom: "3.5rem", background: "#fff", borderRadius: 10, boxShadow: "0 2px 8px #0001", padding: "2rem" }}>
          <h2 style={{ marginTop: 0 }}>Formaldehyde Time Series - Pandora</h2>
          <p>
            This section displays the time series of formaldehyde (HCHO) total column as measured by Pandora at selected locations. 
            You can filter by location and time range.
          </p>
          <MainPlot chemical="HCHO" />
        </section>
        <section style={{ background: "#fff", borderRadius: 10, boxShadow: "0 2px 8px #0001", padding: "2rem" }}>
          <h2 style={{ marginTop: 0 }}>Comparison with Other Sites</h2>
          <p>
            This section allows you to compare monthly distributions of formaldehyde across different sites for a selected year. 
          </p>
          <ComparisonPlot chemical="HCHO" />
        </section>
        <footer style={{ marginTop: "3rem", color: "#888", fontSize: "0.95rem", textAlign: "center" }}>
          <em>Work in progress..</em>
        </footer>
      </main>
    </div>
  );
}