import { BrowserRouter } from "react-router-dom";
import Router from "./router/Router";

const App = () => {
  return (
    <>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Router />
      </BrowserRouter>
    </>
  );
};

export default App;
