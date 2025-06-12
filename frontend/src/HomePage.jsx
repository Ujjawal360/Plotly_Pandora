import React from "react";
import pandoraImg from './assets/pandora.jpeg';
import Motivation from './assets/Motivation.png';
import ricardo from './assets/ricardo.jpg';
import hu from './assets/HU.png';
import { Link } from "react-router-dom";

const navStyle = {
  width: 180,
  minHeight: "100vh",
  background: "#111",
  borderRight: "1px solid #222",
  padding: "2.5rem 1.2rem 1.2rem 2rem",
  position: "fixed",
  left: 0,
  top: 0,
  fontFamily: "Arial, sans-serif",
  fontSize: "1rem",
  color: "#fff",
  zIndex: 100,
  boxSizing: "border-box"
};

const mainStyle = {
  marginLeft: 180,
  minHeight: "100vh",
  background: "#f7f9fa",
  fontFamily: "Arial, sans-serif",
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  padding: "0 5vw", // Equal padding left and right
  width: "calc(100vw - 180px)",
  boxSizing: "border-box"
};

const sectionStyle = {
  width: "100%",
  margin: "0 auto 3.5rem auto",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "2.5rem",
  padding: "3rem 0"
};

const imgStyle = {
  width: "50%",
  maxWidth: 520,
  borderRadius: "18px",
  boxShadow: "0 4px 24px #0002",
  objectFit: "cover"
};

const textStyle = {
  flex: 1,
  fontSize: "1.25rem",
  color: "#222",
  lineHeight: 1.6,
  fontWeight: 400
};

export default function HomePage() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f7f9fa" }}>
        <img
        src={hu}
        alt="Logo"
    style={{
        position: "fixed",
        top: 24,
        right: 32,
        width: 250,         // Increased width for a bigger logo
        height: "auto",     // Maintain aspect ratio for rectangle
        zIndex: 200,
        borderRadius: "10px", // Slightly rounded corners, not a circle
        boxShadow: "0 2px 8px #0002",
        background: "#fff",
        border: "1px solid #eee", // Optional: subtle border
        objectFit: "contain"      // Ensures the whole logo is visible
    }}
        />
      <nav style={navStyle}>
        <div style={{ fontWeight: 700, fontSize: "1.08rem", marginBottom: "2.5rem", color: "#fff" }}>
          Pandora Dashboard
        </div>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          <li style={{ marginBottom: 20 }}>
            <Link to="/" style={{ textDecoration: "none", color: "#fff", opacity: 0.92, marginLeft: 6 }}>Home</Link>
          </li>
          <li style={{ marginBottom: 20 }}>
            <Link to="/formaldehyde" style={{ textDecoration: "none", color: "#fff", opacity: 0.92, marginLeft: 6 }}>Formaldehyde (HCHO)</Link>
          </li>
          <li>
            <Link to="/no2" style={{ textDecoration: "none", color: "#fff", opacity: 0.92, marginLeft: 6 }}>Nitrogen Dioxide (NO₂)</Link>
          </li>
        </ul>
      </nav>
      <main style={mainStyle}>
        {/* Project Description */}
        <div style={{ width: "100%", margin: "4rem 0 2.5rem 0" }}>
          <h1 style={{ fontSize: "2.8rem", fontWeight: 700, color: "#23395d", marginBottom: 18, letterSpacing: -1 }}>
            Pandora Air Quality Dashboard
          </h1>
          <p style={{ fontSize: "1.25rem", color: "#444", maxWidth: 700, lineHeight: 1.7 }}>
            Explore real-time and historical air quality data from NASA's Pandora spectrometer network. 
            Visualize formaldehyde and nitrogen dioxide levels, compare across sites, and gain insights into atmospheric composition and local events.
          </p>
        </div>

        {/* Pandora Photo Section */}
        <section style={sectionStyle}>
          <img
            src={pandoraImg}
            alt="NASA Pandora Instrument"
            style={imgStyle}
          />
          <div style={textStyle}>
            <h2 style={{ fontWeight: 700, fontSize: "2rem", marginBottom: 12, color: "#23395d" }}>What is Pandora?</h2>
            <p>
              <span style={{
                background: "#fffbe6",
                padding: "2px 6px",
                borderRadius: "6px",
                fontWeight: 500
              }}>
                NASA's Pandora spectrometer is a ground based remote-sensing instrument designed to measure total column of atmospheric trace gases, including formaldehyde, nitrogen dioxide, sulphur dioxide, ozone and water vapor.
              </span>
              By observing sunlight as it passes through the atmosphere, Pandora provides valuable data for air quality research, satellite validation, and understanding the impact of pollution on our environment.
            </p>
          </div>
        </section>

        {/* Motivation Section */}
        <section style={sectionStyle}>
          <img
            src={Motivation}
            alt="Motivation"
            style={imgStyle}
          />
          <div style={textStyle}>
            <h2 style={{ fontWeight: 700, fontSize: "2rem", marginBottom: 12, color: "#23395d" }}>Motivation</h2>
            <p>
              I created this dashboard to enable real-time monitoring of Pandora data and to explore how well Pandora captures local air quality events. 
              My goal was to see if the instrument could reflect changes from everyday activities and provide actionable insights for both researchers and the community.
            </p>
          </div>
        </section>

        {/* Mentor Section */}
        <section style={sectionStyle}>
          <img
            src={ricardo}
            alt="Ricardo Sakai"
            style={imgStyle}
          />
          <div style={textStyle}>
            <h2 style={{ fontWeight: 700, fontSize: "2rem", marginBottom: 12, color: "#23395d" }}>Acknowledgment</h2>
            <p>
              I am deeply grateful to my mentor, Ricardo Sakai, for his vision, encouragement, and trust in my abilities throughout this project.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}