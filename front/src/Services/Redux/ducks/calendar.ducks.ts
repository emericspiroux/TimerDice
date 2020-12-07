import qs from 'qs';
import HttpService, { ERROR_SUFFIX, SUCCESS_SUFFIX } from '../../Axios/HttpService';
import { IDiceFaceTime } from './dice.ducks';

// Actions
const GET_CALENDAR = 'calendar/GET_CALENDAR';
const SET_CURRENT_DATE = 'calendar/SET_CURRENT_DATE';
const UPDATE_EVENT = 'calendar/UPDATE_EVENT';

// Types
type TEventAction = {
  type?: string;
  calendarEvents?: IEventBigCalendar[];
  startDate?: Date;
  endDate?: Date;
  diceFaceTimeElement?: IDiceFaceTime;
  error?: any;
};

export interface IEventBigCalendar {
  title: string;
  start: Date;
  hexColor: string;
  end: Date;
  allDay?: boolean;
  resource?: { id: string } & any;
}

export interface IEventBigCalendarDrop {
  event: IEventBigCalendar;
  start: Date;
  end: Date;
  resourceId?: string;
}

// Reducer
export default function reducer(state: any = {}, action: TEventAction = {}) {
  const newState = { ...state };
  switch (action.type) {
    case UPDATE_EVENT:
      newState.isUpdateLoading = true;
      return newState;
    case UPDATE_EVENT + SUCCESS_SUFFIX:
      if (Array.isArray(newState.current) && action.diceFaceTimeElement) {
        const index = state.current.findIndex(
          (element: IEventBigCalendar) =>
            // eslint-disable-next-line implicit-arrow-linebreak
            element.resource?.id === action.diceFaceTimeElement?.id,
        );

        if (index === -1) return newState;

        const diceFaceTime = action.diceFaceTimeElement;
        newState.current[index] = {
          title: diceFaceTime.face.name,
          start: diceFaceTime.start,
          end: diceFaceTime.end,
          hexColor: diceFaceTime.face.color,
          resource: {
            id: diceFaceTime.id,
          },
        } as IEventBigCalendar;
        newState.current = [...newState.current];
      }
      newState.isUpdateLoading = false;
      return newState;
    case UPDATE_EVENT + ERROR_SUFFIX:
      newState.error = action.error;
      newState.isUpdateLoading = false;
      return newState;
    case GET_CALENDAR:
      newState.isLoading = true;
      return newState;
    case GET_CALENDAR + SUCCESS_SUFFIX:
      newState.current = action.calendarEvents;
      newState.isLoading = false;
      return newState;
    case GET_CALENDAR + ERROR_SUFFIX:
      newState.error = action.error;
      newState.isLoading = false;
      return newState;
    case SET_CURRENT_DATE:
      newState.startDate = action.startDate?.toUTCString();
      newState.endDate = action.endDate?.toUTCString();
      return newState;
    default:
      return newState;
  }
}

// Action Creators
export const getCalendar = (start?: Date, end?: Date, face?: number) => ({
  type: GET_CALENDAR,
  payload: {
    request: {
      url: `/timer/calendar?${qs.stringify({ start, end, face })}`,
      method: HttpService.HttpMethods.GET,
    },
    options: {
      onSuccess: ({ action, dispatch, response }) => {
        dispatch({
          type: action.type + SUCCESS_SUFFIX,
          calendarEvents: response.data,
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

export const patchEvent = (
  id: string,
  body: { start?: Date; end?: Date; face?: number; description?: string },
) => ({
  type: UPDATE_EVENT,
  payload: {
    request: {
      url: `/timer/${id}`,
      method: HttpService.HttpMethods.PATCH,
      data: body,
    },
    options: {
      onSuccess: ({ action, dispatch, response }) => {
        dispatch({
          type: action.type + SUCCESS_SUFFIX,
          diceFaceTimeElement: response.data,
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

export function setCurrentDate(startDate: Date, endDate: Date) {
  return { type: SET_CURRENT_DATE, startDate, endDate };
}
