import { create } from "zustand";
type State = {
  calendarDate: Date;
  patientsSearch: string;
  patientsPage: number;
};

type Actions = {
  setCalendarDate: (date: Date) => void;
  setPatientsSearch: (string: string) => void;
  setPatientsPage: (page: number) => void;
};

const useAppStore = create<State & Actions>((set) => ({
  calendarDate: new Date(),
  patientsSearch: "",
  patientsPage: 1,
  setCalendarDate: (date) => set(() => ({ calendarDate: date })),
  setPatientsSearch: (string) => set(() => ({ patientsSearch: string })),
  setPatientsPage: (page) => set(() => ({ patientsPage: page })),
}));

export default useAppStore;
