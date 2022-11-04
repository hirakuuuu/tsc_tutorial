import { BrowserRouter, Routes, Route } from "react-router-dom";
import Marubatsu from "./Marubatsu";
import Osero from "./Osero";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={`/marubatsu`} element={<Marubatsu />} />
        <Route path={`/`} element={<Osero />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
