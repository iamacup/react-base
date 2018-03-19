import _ from 'lodash';

export const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'GLOBAL_STORE_SINGLE_UPDATE': {
      const modifiedStatePart = {};


      modifiedStatePart[action.mainID] = _.assign(
        {},
        state[action.mainID],
        action.data,
      );


      return _.assign({}, state, modifiedStatePart);
    }
    case 'LOGIN_FINISHED':
    case 'LOGOUT_FINISHED':
      return _.assign({}, initialState);
    default:
      return state;
  }
};
