import React from 'react';
import ReactDOM from 'react-dom';
import App from './Components/App';
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

import 'bootstrap/dist/css/bootstrap.min.css';


import reportWebVitals from './reportWebVitals';


// window.root = (
//     <div>
//     <h1>salam kooshan</h1>
//     <p>{ new Date().toLocaleTimeString() }</p>
//     </div>
// )

Sentry.init({
    dsn: "https://7d8b2380fc8d46649ca78add07557f47@o924427.ingest.sentry.io/5906752",
    integrations: [new Integrations.BrowserTracing()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
});

ReactDOM.render(<App /> , document.getElementById('root'))


// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
