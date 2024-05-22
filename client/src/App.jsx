import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Query } from "./components/Query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MainPage } from "./components/MainPage";
import { Data } from "./components/Data";
import { CustomCursor } from "./components/Customize/CustomCursor";
function App() {
  return (
    <div className="App">
      <CustomCursor />
      <Router>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/queryMode" element={<Query />} />
            <Route path="/dataMode" element={<Data />} />
          </Routes>
        </Router>
    </div>
  );
}

export default App;
