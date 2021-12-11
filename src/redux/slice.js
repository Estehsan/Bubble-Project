import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Logged: null,
};

const slice = createSlice({
  Logged: sliceName,
  initialState,
  reducers: {},
});

export const {} = slice.actions;
export default slice.reducer;
