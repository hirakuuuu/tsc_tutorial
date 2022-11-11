import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./Main";
import Marubatsu from "./Marubatsu";
import Othello from "./Othello";

const App = () => {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path={`/`} element={<Main />} />
        <Route path={`/marubatsu/`} element={<Marubatsu />} />
        <Route path={`/Othello`} element={<Othello />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
