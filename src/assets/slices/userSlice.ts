import { createSlice } from "@reduxjs/toolkit";

type userPayload = {
  name: string;
  surname: string;
  id: number;
  token: string;
};

export const userSlice = createSlice({
  name: "user",
  initialState: {
    name: "",
    surname: "",
    id: 0,
    token: "",
    isLoggedIn: false,
  },
  reducers: {
    logOut: (state) => {
      state.isLoggedIn = false;
    },
    logIn: (state, action) => {
      state.isLoggedIn = true;
      let payload: userPayload = action.payload;
      state.name = payload.name;
      state.surname = payload.surname;
      state.id = payload.id;
      state.token = payload.token;
    },
  },
});

export const { logOut, logIn } = userSlice.actions;

export default userSlice.reducer;
