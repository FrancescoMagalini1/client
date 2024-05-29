import { create } from "zustand";

type calendarView = "day" | "week" | "month";

type State = {
  calendarDate: Date;
  calendarView: calendarView;
  patientsSearch: string;
  patientsPage: number;
};

type Actions = {
  setCalendarDate: (date: Date) => void;
  setCalendarView: (view: calendarView) => void;
  setPatientsSearch: (string: string) => void;
  setPatientsPage: (page: number) => void;
};

const useAppStore = create<State & Actions>((set) => ({
  calendarDate: new Date(),
  calendarView: "day",
  patientsSearch: "",
  patientsPage: 1,
  setCalendarDate: (date) => set(() => ({ calendarDate: date })),
  setCalendarView: (view) => set(() => ({ calendarView: view })),
  setPatientsSearch: (string) => set(() => ({ patientsSearch: string })),
  setPatientsPage: (page) => set(() => ({ patientsPage: page })),
}));

export default useAppStore;
