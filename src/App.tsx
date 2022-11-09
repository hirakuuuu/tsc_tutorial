import { BrowserRouter, Routes, Route } from "react-router-dom";
import Marubatsu from "./Marubatsu";
import Othello from "./Othello";
import Yahtzee from "./Yahtzee";

const App = () => {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path={`/marubatsu/`} element={<Marubatsu />} />
        <Route path={`/Othello`} element={<Othello />} />
        <Route path={`/`} element={<Yahtzee />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
