// Actions
const SET = 'diceTime/SET';
const REMOVE = 'diceTime/REMOVE';

// Types
type TDiceAction = {
  type?: string;
  diceTime?: IDiceFaceTime;
};

export interface IDiceFace {
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
