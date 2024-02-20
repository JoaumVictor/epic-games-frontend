import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import RedirectHome from "./pages/redirectHome";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RedirectHome />} />
        <Route path="/pt-br" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
