import HttpService, { SUCCESS_SUFFIX, ERROR_SUFFIX } from '../../Axios/HttpService';

// Actions
const SET = 'diceTime/SET';
const REMOVE = 'diceTime/REMOVE';
const GET_CURRENT = 'diceTime/GET_CURRENT';
const STOP_CURRENT = 'diceTime/STOP_CURRENT';
const GET_ALL_FACES = 'diceTime/GET_ALL_FACES';

// Types
type TDiceAction = {
  type?: string;
  diceTime?: IDiceFaceTime;
  faces?: IDiceFace[];
  error?: any;
};

export interface IDiceFace {
  id: string;
  enabled: boolean;
  faceId: number;
  name: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDiceFaceTime {
  id: string;
  current: boolean;
  face: IDiceFace;
  faceId: number;
  start: Date;
  end?: Date;
  duration: number;
  description?: string;
}

// Reducer
export default function reducer(state: any = {}, action: TDiceAction = {}) {
  const newState = { ...state };
  switch (action.type) {
    case SET:
      newState.current = action.diceTime;
      return newState;
    case REMOVE:
      newState.current = undefined;
      return newState;
    case GET_CURRENT:
      newState.isLoading = true;
      return newState;
    case GET_CURRENT + SUCCESS_SUFFIX:
      newState.isLoading = false;
      newState.current = action.diceTime;
      return newState;
    case GET_CURRENT + ERROR_SUFFIX:
      newState.isLoading = false;
      newState.error = action.error;
      return newState;
    case STOP_CURRENT:
      newState.isLoading = true;
      return newState;
    case STOP_CURRENT + SUCCESS_SUFFIX:
      newState.isLoading = false;
      newState.current = undefined;
      return newState;
    case STOP_CURRENT + ERROR_SUFFIX:
      newState.isLoading = false;
      newState.errorStop = action.error;
      return newState;
    case GET_ALL_FACES:
      newState.isLoadingFaces = true;
      return newState;
    case GET_ALL_FACES + SUCCESS_SUFFIX:
      newState.isLoadingFaces = false;
      newState.faces = action.faces;
      return newState;
    case GET_ALL_FACES + ERROR_SUFFIX:
      newState.isLoadingFaces = false;
      newState.errorFaces = action.error;
      return newState;
    default:
      return newState;
  }
}

// Action Creators
export function setDice(diceTime: IDiceFaceTime) {
  return { type: SET, diceTime };
}

export function removeDice() {
  return { type: REMOVE };
}

// Action Creators
export const getCurrentDiceFaceTime = () => ({
  type: GET_CURRENT,
  payload: {
    request: {
      url: `/timer/current`,
      method: HttpService.HttpMethods.GET,
    },
    options: {
      onSuccess: ({ action, dispatch, response }) => {
        dispatch({
          type: action.type + SUCCESS_SUFFIX,
          diceTime: response.data,
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

// Action Creators
export const stopCurrentDiceFaceTime = () => ({
  type: STOP_CURRENT,
  payload: {
    request: {
      url: `/timer/current`,
      method: HttpService.HttpMethods.DELETE,
    },
    options: {
      onSuccess: ({ action, dispatch }) => {
        dispatch({
          type: action.type + SUCCESS_SUFFIX,
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

// Action Creators
export const getAllFaces = () => ({
  type: GET_ALL_FACES,
  payload: {
    request: {
      url: `/face`,
      method: HttpService.HttpMethods.GET,
    },
    options: {
      onSuccess: ({ action, dispatch, response }) => {
        dispatch({
          type: action.type + SUCCESS_SUFFIX,
          faces: response.data,
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
