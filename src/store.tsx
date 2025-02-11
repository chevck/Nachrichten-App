import { createStore } from "@reduxjs/toolkit";
import newsSaga from "./redux/sagas";
import { composeWithDevTools } from "@redux-devtools/extension";
import createSagaMiddleware from "redux-saga";
import { applyMiddleware, combineReducers } from "redux";
import newsReducer from "./redux/reducer";

const rootReducer = combineReducers({ news: newsReducer });

const sagaMiddleware = createSagaMiddleware();

function configureAppStore(preloadedState) {
  const middlewares = [sagaMiddleware];
  const middlewareEnhancer = applyMiddleware(...middlewares);

  const enhancers = [middlewareEnhancer];
  const composedEnhancers = composeWithDevTools(...enhancers);

  const store = createStore(rootReducer, preloadedState, composedEnhancers);

  if (process.env.NODE_ENV !== "production" && module.hot) {
    module.hot.accept("./redux/reducer.tsx", () =>
      store.replaceReducer(rootReducer)
    );
  }

  return store;
}

export const store = configureAppStore({});

sagaMiddleware.run(newsSaga);

// Infer types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
