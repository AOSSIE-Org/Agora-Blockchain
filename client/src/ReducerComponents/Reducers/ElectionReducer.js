import * as ActionTypes from "../ActionTypes";

const ElectionReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.ELECTION_STATE_NEWELECTION:
      return (
        [...state],
        {
          name: action.payload.name,
          algorithm: action.payload.algorithm,
          description: action.payload.description,
          start_date: action.payload.start_date,
          end_date: action.payload.end_date,
          candidates: {},
        }
      );
    default:
      return state;
  }
};
export default ElectionReducer;
