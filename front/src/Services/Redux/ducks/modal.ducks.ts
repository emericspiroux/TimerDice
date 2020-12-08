import { ReactNode } from 'react';

// Actions
const DISPLAY = 'modal/DISPLAY';
const HIDE = 'modal/HIDE';

// Types
type TDiceAction = {
  type?: string;
  content?: ReactNode;
};

// Reducer
export default function reducer(state: any = {}, action: TDiceAction = {}) {
  const newState = { ...state };
  switch (action.type) {
    case DISPLAY:
      newState.content = action.content;
      newState.isDiplayed = true;
      return newState;
    case HIDE:
      newState.isDiplayed = false;
      return newState;
    default:
      return newState;
  }
}

// Action Creators
export function showModal(content: ReactNode) {
  return { type: DISPLAY, content };
}

export function hideModal() {
  return { type: HIDE };
}
