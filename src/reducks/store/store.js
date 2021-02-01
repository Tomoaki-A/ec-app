import {
  createStore as reduxCreateStore,
  combineReducers,
  applyMiddleware,
} from "redux";
import { UsersReducer } from "../users/reducers";
import { connectRouter, routerMiddleware } from "connected-react-router";
import thunk from "redux-thunk";

export default function createStore(history) {
  return reduxCreateStore(
    combineReducers({
      router: connectRouter(history),
      users: UsersReducer,
    }),
    applyMiddleware(routerMiddleware(history), thunk)
  );
}
