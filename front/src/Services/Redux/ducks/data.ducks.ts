import qs from 'qs';
import HttpService, { SUCCESS_SUFFIX, ERROR_SUFFIX } from '../../Axios/HttpService';
import { IDiceFace, IDiceFaceTime } from './dice.ducks';

// Actions
const GET_STANDUP = 'diceTime/GET_STANDUP';
const DELETE_EVENT_RANGE = 'diceTime/DELETE_EVENT_RANGE';

// Types
type TDataAction = {
  type?: string;
  diceFaceTimeRange?: IDiceFaceTimeRangeElement[];
  deletedElement?: IDiceFaceTime;
  error?: any;
};

export interface IDiceFaceTimeRangeElement {
  elements: IDiceFaceTime[];
  duration: number;
  face: IDiceFace;
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
    case DELETE_EVENT_RANGE:
      newState.isLoading = true;
      return newState;
    case DELETE_EVENT_RANGE + SUCCESS_SUFFIX:
      newState.isLoading = false;
      if (action.deletedElement) {
        const deletedFaceIdIndex = newState.current.findIndex(
          (e: IDiceFaceTimeRangeElement) => e.face.faceId === action.deletedElement?.faceId,
        );
        if (deletedFaceIdIndex < 0) return newState;
        const newStateCurrentRow = newState.current[deletedFaceIdIndex] as IDiceFaceTimeRangeElement;
        newStateCurrentRow.elements = newStateCurrentRow.elements.filter(
          (e: IDiceFaceTime) => e.id !== action.deletedElement?.id,
        );
        if (newStateCurrentRow.elements.length) {
          newState.current[deletedFaceIdIndex] = newStateCurrentRow;
        } else {
          newState.current = newState.current.filter((e: IDiceFaceTimeRangeElement) => e.elements.length);
        }
        newState.current = [...newState.current];
      }
      return newState;
    case DELETE_EVENT_RANGE + ERROR_SUFFIX:
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

export const deleteEventRange = (element: IDiceFaceTime) => ({
  type: DELETE_EVENT_RANGE,
  payload: {
    request: {
      url: `/timer/${element.id}`,
      method: HttpService.HttpMethods.DELETE,
    },
    options: {
      onSuccess: ({ action, dispatch }) => {
        dispatch({
          type: action.type + SUCCESS_SUFFIX,
          deletedElement: element,
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
