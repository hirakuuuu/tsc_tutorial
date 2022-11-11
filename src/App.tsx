import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./Main";
import Marubatsu from "./Marubatsu";
import Othello from "./Othello";
import Yahtzee from "./Yahtzee";

const App = () => {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path={`/`} element={<Main />} />
        <Route path={`/marubatsu/`} element={<Marubatsu />} />
        <Route path={`/othello`} element={<Othello />} />
        <Route path={`/yahtzee`} element={<Yahtzee />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
