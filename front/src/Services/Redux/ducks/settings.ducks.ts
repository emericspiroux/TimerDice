import HttpService, { SUCCESS_SUFFIX, ERROR_SUFFIX } from '../../Axios/HttpService';
import { IDiceFace } from './dice.ducks';

// Actions
const SET = 'settings/SET';
const REMOVE = 'settings/REMOVE';
const GET_CURRENT = 'settings/GET_CURRENT';
const UPDATE_FACE = 'settings/UPDATE_FACE';

// Types
type TDiceAction = {
  type?: string;
  diceFace?: IDiceFace;
  error?: any;
};

// Reducer
export default function reducer(state: any = {}, action: TDiceAction = {}) {
  const newState = { ...state };
  switch (action.type) {
    case SET:
      newState.current = action.diceFace;
      return newState;
    case REMOVE:
      newState.current = undefined;
      return newState;
    case GET_CURRENT:
      newState.isLoading = true;
      return newState;
    case GET_CURRENT + SUCCESS_SUFFIX:
      newState.isLoading = false;
      newState.current = action.diceFace;
      return newState;
    case GET_CURRENT + ERROR_SUFFIX:
      newState.isLoading = false;
      newState.error = action.error;
      return newState;
    case UPDATE_FACE:
      newState.isLoadingUpdate = true;
      return newState;
    case UPDATE_FACE + SUCCESS_SUFFIX:
      newState.isLoadingUpdate = false;
      newState.current = action.diceFace;
      return newState;
    case UPDATE_FACE + ERROR_SUFFIX:
      newState.isLoadingUpdate = false;
      newState.error = action.error;
      return newState;
    default:
      return newState;
  }
}

// Action Creators
export function setDiceSettings(diceFace: IDiceFace) {
  return { type: SET, diceFace };
}

export function removeDiceSettings() {
  return { type: REMOVE };
}

// Action Creators
export const getCurrentDiceFaceSettings = () => ({
  type: GET_CURRENT,
  payload: {
    request: {
      url: `/face/current`,
      method: HttpService.HttpMethods.GET,
    },
    options: {
      onSuccess: ({ action, dispatch, response }) => {
        dispatch({
          type: action.type + SUCCESS_SUFFIX,
          diceFace: response.data,
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

export const patchFace = (id: string, options: { name?: string; color?: string }) => ({
  type: UPDATE_FACE,
  payload: {
    request: {
      url: `/face/${id}`,
      method: HttpService.HttpMethods.PATCH,
      data: options,
    },
    options: {
      onSuccess: ({ action, dispatch, response }) => {
        dispatch({
          type: action.type + SUCCESS_SUFFIX,
          diceFace: response.data,
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
