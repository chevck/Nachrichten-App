import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./router";
import { Provider } from "react-redux";
import { store } from "./store";
import { ToastContainer } from "react-toastify";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Provider
    store={store}
    children={
      <>
        <AppRouter />
        <ToastContainer
          aria-label={"toast-container"}
          autoClose={3500}
          position='bottom-right'
        />
      </>
    }
  />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
