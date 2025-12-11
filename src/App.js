<<<<<<< HEAD
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
=======
import {BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./routes/Home";
import Detail from "./routes/Detail";
function App() {
  return <Router>
      <Switch>
        <Route path="/movie">
          <Detail />
        </Route>
>>>>>>> c43bb58 (영화리스트 css 추가)
        <Route path="/">
          <Home />
        </Route>
      </Switch>
<<<<<<< HEAD
  </Route>
=======
  </Router>
>>>>>>> c43bb58 (영화리스트 css 추가)
}

export default App;
