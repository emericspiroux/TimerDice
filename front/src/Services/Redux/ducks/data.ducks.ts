import qs from 'qs';
import HttpService, { SUCCESS_SUFFIX, ERROR_SUFFIX } from '../../Axios/HttpService';
import { IDiceFace, IDiceFaceTime } from './dice.ducks';

// Actions
const GET_STANDUP = 'diceTime/GET_STANDUP';

// Types

type TDataAction = {
  type?: string;
  diceFaceTimeRange?: IDiceFaceTimeRange;
  error?: any;
};

export interface IDiceFaceTimeRangeElement {
  elements: IDiceFaceTime[];
  duration: number;
  face: IDiceFace;
}

export interface IDiceFaceTimeRange {
  [diceFaceNumber: string]: IDiceFaceTimeRangeElement;
}

// Reducer
export default function reducer(state: any = {}, action: TDataAction = {}) {
  const newState = { ...state };
  switch (action.type) {
    case GET_STANDUP:
      newState.isLoading = true;
      return newState;
    case GET_STANDUP + SUCCESS_SUFFIX:
      newState.isLoading = false;
      newState.current = action.diceFaceTimeRange;
      return newState;
    case GET_STANDUP + ERROR_SUFFIX:
      newState.isLoading = false;
      newState.error = action.error;
      return newState;
    default:
      return newState;
  }
}

// Action Creators
export const getRange = (options: { start?: Date; end?: Date; face?: number }) => ({
  type: GET_STANDUP,
  payload: {
    request: {
      url: `/timer?${qs.stringify(options)}`,
      method: HttpService.HttpMethods.GET,
    },
    options: {
      onSuccess: ({ action, dispatch, response }) => {
        dispatch({
          type: action.type + SUCCESS_SUFFIX,
          diceFaceTimeRange: response.data,
          meta: { previousAction: action },
        });
      },
      /* eslint-disable-next-line no-unused-vars */
      onError: ({ action, dispatch, _, error }) => {
        dispatch({
          type: action.type + ERROR_SUFFIX,
          error,
          meta: { previousAction: action },
        });
      },
    },
  },
});
