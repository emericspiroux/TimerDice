export interface TimerDiceFormError {
  status: number;
  message: string;
  details: { message: string; label: string }[];
}
