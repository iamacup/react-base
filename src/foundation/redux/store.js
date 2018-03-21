import { routerMiddleware } from 'react-router-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from '../../foundation/redux/reducers';
import axiosWrapper from '../../foundation/axiosWrapper';

// we provide a slightly custom axios instance that has some utility stuff for us built in
const axiosInstance = axiosWrapper();

export default (history, initialState = {}) => {
  const middlewares = [
    thunk,
    routerMiddleware(history),
    thunk.withExtraArgument(axiosInstance)
    // Add other middlewares here
  ];
  const composeEnhancers =
    (typeof window === 'object' &&
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
    compose;
  const enhancers = composeEnhancers(
    applyMiddleware(...middlewares)
    // Add other enhancers here
  );
  const store = createStore(rootReducer, initialState, enhancers);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../../foundation/redux/reducers', () => {
      try {
        const nextReducer = require('../../foundation/redux/reducers').default;

        store.replaceReducer(nextReducer);
      } catch (error) {
        console.error(`==> 😭  Reducer hot reloading error ${error}`);
      }
    });
  }

  return store;
};
