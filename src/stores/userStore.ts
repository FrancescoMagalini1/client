import { create } from "zustand";
import { user } from "../typescript/types/data";

type State = user & {
  isLoggedIn: boolean;
};

type Actions = {
  logout: () => void;
  login: (info: user) => void;
};

const useUserStore = create<State & Actions>((set) => ({
  token: "",
  isLoggedIn: false,
  id: 0,
  name: "",
  surname: "",
  logout: () => set(() => ({ isLoggedIn: false })),
  login: (info) => set(() => ({ ...info, isLoggedIn: true })),
}));

export default useUserStore;
