import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Home from "./routes/Home";

function App() {
  return <Route>
      <Switch>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
  </Route>
}

export default App;
