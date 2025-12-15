import { BrowserRouter as Router, Switch, Route, useLocation } from "react-router-dom";
import Home from "./routes/Home";
import Detail from "./routes/Detail";
import Popular from "./routes/Popular";
import Series from "./routes/Series";

function App() {
  return (
    <Router basename="/movie">
      <ModalSwitch />
    </Router>
  );
}

function ModalSwitch() {
  const location = useLocation();
  
  const background = location.state?.background;

  return (
    <>
      <Switch location={background || location}>
        <Route path="/popular" exact>
          <Popular />
        </Route>
        <Route path="/series" exact>
          <Series />
        </Route>
        <Route path="/" exact>
          <Home />
        </Route>
      </Switch>

      {background && (
        <Switch>
          <Route path="/:id">
            <Detail />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;