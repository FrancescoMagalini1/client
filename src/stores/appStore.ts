import { create } from "zustand";
type State = {
  calendarDate: Date;
};

type Actions = {
  setCalendarDate: (date: Date) => void;
};

const useAppStore = create<State & Actions>((set) => ({
  calendarDate: new Date(),
  setCalendarDate: (date) => set(() => ({ calendarDate: date })),
}));

export default useAppStore;
