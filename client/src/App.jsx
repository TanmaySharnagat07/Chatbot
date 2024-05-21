import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Query } from "./components/Query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MainPage } from "./components/MainPage";
function App() {
  return (
    <div className="App">
      <Router>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/queryMode" element={<Query />} />
          </Routes>
        </Router>
    </div>
  );
}

export default App;
