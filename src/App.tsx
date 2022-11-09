import { BrowserRouter, Routes, Route } from "react-router-dom";
import Marubatsu from "./Marubatsu";
import Othello from "./Othello";

const App = () => {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path={`/marubatsu/`} element={<Marubatsu />} />
        <Route path={`/`} element={<Othello />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
