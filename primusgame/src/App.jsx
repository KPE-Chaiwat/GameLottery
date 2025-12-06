import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Game1 from "./pages/game1.jsx";
import Game2 from "./pages/game2.jsx";
import Game3 from "./pages/game3.jsx";
import Game4 from "./pages/game4.jsx";
import VictorResult from "./pages/VictorResult .jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game1" element={<Game1 />} />
        <Route path="/game2" element={<Game2 />} />
        
        <Route path="/game3" element={<Game3 />} />
        <Route path="/game4" element={<Game4 />} />
        <Route path="/victor" element={<VictorResult />} />
      </Routes>
    </BrowserRouter>
  );
}
