import { combineReducers, createStore } from "redux";
import { userReducer, roomReducer } from "./reducers";

const reducers = combineReducers({ user: userReducer, room: roomReducer });

const store = createStore(
  reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : (f) => f
);

export default store;
