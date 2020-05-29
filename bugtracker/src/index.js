import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'semantic-ui-css/semantic.min.css';
import { createStore, applyMiddleware} from 'redux';
import { Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'
import { Provider } from 'react-redux';
import rootReducer from './reducers/rootReducer'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

const alertOptions = {
  timeout : 3000,
  position :'bottom center'
}


export const store = createStore(rootReducer,composeWithDevTools(applyMiddleware(thunk)))



ReactDOM.render(
  <Provider store={store}>
  <AlertProvider template={AlertTemplate} {...alertOptions}>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </AlertProvider>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
