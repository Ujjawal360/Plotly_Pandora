import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./HomePage";
import FormaldehydePage from "./FormaldehydePage";
import NitrogenDioxidePage from "./NitrogenDioxidePage";

function App() {
  return (
    <Router>
      <nav style={{ marginBottom: 20 }}>
        <Link to="/" style={{ marginRight: 20 }}>Home</Link>
        <Link to="/formaldehyde" style={{ marginRight: 20 }}>Formaldehyde (HCHO)</Link>
        <Link to="/no2">Nitrogen Dioxide (NO₂)</Link>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/formaldehyde" element={<FormaldehydePage />} />
        <Route path="/no2" element={<NitrogenDioxidePage />} />
      </Routes>
    </Router>
  );
}

export default App;