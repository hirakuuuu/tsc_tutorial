import { BrowserRouter, Routes, Route } from "react-router-dom";
import Marubatsu from "./Marubatsu";
import Othello from "./Othello";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={`${process.env.PUBLIC_URL}/marubatsu`}
          element={<Marubatsu />}
        />
        <Route path={`${process.env.PUBLIC_URL}/`} element={<Othello />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
