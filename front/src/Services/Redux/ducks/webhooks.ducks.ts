import HttpService, { ERROR_SUFFIX, SUCCESS_SUFFIX } from '../../Axios/HttpService';

// Actions
const GET_WEBHOOKS_LIST = 'webhooks/GET_WEBHOOKS_LIST';
const DELETE_WEBHOOK = 'webhooks/DELETE_WEBHOOK';
const ADD_WEBHOOK = 'webhooks/ADD_WEBHOOK';

// Types
export interface IWebhook {
  id: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

type TWebhookAction = {
  type?: string;
  webhooks?: IWebhook[];
  webhook?: IWebhook;
  deletedId?: string;
  error?: any;
  formInput?: HTMLTextAreaElement | null;
};

// Reducer
export default function reducer(state: any = {}, action: TWebhookAction = {}) {
  const newState = { ...state, list: { ...state.list }, add: { ...state.add }, delete: { ...state.delete } };
  switch (action.type) {
    case GET_WEBHOOKS_LIST:
      newState.list.isLoading = true;
      return newState;
    case GET_WEBHOOKS_LIST + SUCCESS_SUFFIX:
      newState.list.data = action.webhooks;
      newState.list.isLoading = false;
      return newState;
    case GET_WEBHOOKS_LIST + ERROR_SUFFIX:
      newState.list.error = action.error;
      newState.list.isLoading = false;
      return newState;

    case DELETE_WEBHOOK:
      newState.delete.isLoading = true;
      return newState;
    case DELETE_WEBHOOK + SUCCESS_SUFFIX:
      if (action.deletedId && newState.list.data) {
        newState.list.data = newState.list.data.filter((e) => e.id !== action.deletedId);
      }
      newState.delete.isLoading = false;
      return newState;
    case DELETE_WEBHOOK + ERROR_SUFFIX:
      newState.delete.error = action.error;
      newState.delete.isLoading = false;
      return newState;

    case ADD_WEBHOOK:
      newState.add.isLoading = true;
      return newState;
    case ADD_WEBHOOK + SUCCESS_SUFFIX:
      if (action.webhook) {
        newState.list.data = Array.isArray(newState.list.data) ? newState.list.data : [];
        newState.list.data.push(action.webhook);
      }
      newState.add.error = undefined;
      newState.add.isLoading = false;
      return newState;
    case ADD_WEBHOOK + ERROR_SUFFIX:
      newState.add.error = action.error;
      newState.add.isLoading = false;
      return newState;

    default:
      return newState;
  }
}

// Action Creators
export const getWebhooks = () => ({
  type: GET_WEBHOOKS_LIST,
  payload: {
    request: {
      url: `/webhooks`,
      method: HttpService.HttpMethods.GET,
    },
    options: {
      onSuccess: ({ action, dispatch, response }) => {
        dispatch({
          type: action.type + SUCCESS_SUFFIX,
          webhooks: response.data,
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

export const deleteWebhook = (id: string) => ({
  type: DELETE_WEBHOOK,
  payload: {
    request: {
      url: `/webhooks/${id}`,
      method: HttpService.HttpMethods.DELETE,
    },
    options: {
      onSuccess: ({ action, dispatch }) => {
        dispatch({
          type: action.type + SUCCESS_SUFFIX,
          deletedId: id,
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

export const addWebhook = (uri: string) => ({
  type: ADD_WEBHOOK,
  payload: {
    request: {
      url: `/webhooks`,
      method: HttpService.HttpMethods.POST,
      data: {
        uri,
      },
    },
    options: {
      onSuccess: ({ action, dispatch, response }) => {
        dispatch({
          type: action.type + SUCCESS_SUFFIX,
          webhook: response.data,
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
