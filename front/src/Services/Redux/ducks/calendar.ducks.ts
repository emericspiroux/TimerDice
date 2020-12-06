import { SUCCESS_SUFFIX, ERROR_SUFFIX } from 'redux-axios-middleware';
import HttpService from '../../Axios/HttpService';

// Actions
const GET_CALENDAR = 'calendar/GET_CALENDAR';
const CALENDAR = 'calendar/CALENDAR';

// Types
type TDiceAction = {
  type?: string;
  calendarEvents?: IEventBigCalendar[];
};

export interface IEventBigCalendar {
  title: string;
  start: Date;
  hexColor: string;
  end: Date;
  allDay?: boolean;
  resource?: any;
}

// Reducer
export default function reducer(state: any = {}, action: TDiceAction = {}) {
  const newState = { ...state };
  switch (action.type) {
    case GET_CALENDAR:
      newState.current = action.calendarEvents;
      return newState;
    default:
      return newState;
  }
}

// Action Creators
export const getCalendar = (start?: Date, end?: Date, face: number) => () => ({
  type: GET_CALENDAR,
  payload: {
    request: {
      url: '/timer/calendar',
      method: HttpService.HttpMethods.GET,
    },
    options: {
      onSuccess: ({ action, dispatch, response }) => {
        dispatch({
          type: action.type + SUCCESS_SUFFIX,
          payload: response.data,
          meta: { previousAction: action },
        });
      },
      onError: ({ action, dispatch, _, error }) => {
        dispatch({
          type: CALENDAR + ERROR_SUFFIX,
          payload: error,
          meta: { previousAction: action },
        });
      },
    },
  },
});
