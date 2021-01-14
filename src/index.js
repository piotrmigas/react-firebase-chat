import { useEffect } from "react";
import ReactDOM from "react-dom";
import "semantic-ui-css/semantic.min.css";
import { Provider, useDispatch } from "react-redux";
import store from "./redux/store";
import App from "./components/App";
import { Switch, BrowserRouter, Route, withRouter, useHistory } from "react-router-dom";
import { setUser, clearUser } from "./redux/actions";
import { auth } from "./firebase";
import Login from "./components/Login";

const Root = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(setUser(user));
        history.push("/");
      } else {
        history.replace("/login");
        dispatch(clearUser());
      }
    });
    return () => unsubscribe();
  }, [history, dispatch]);

  return (
    <Switch>
      <Route exact path="/" component={App} />
      <Route path="/login" component={Login} />
    </Switch>
  );
};

const RootWithRouter = withRouter(Root);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <RootWithRouter />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
