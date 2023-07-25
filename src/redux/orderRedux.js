import { createSlice } from "@reduxjs/toolkit";

//Order Redux slice contains action creators and a reducer to handle fetching orders and updating the state accordingly

export const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [], //initial state contains empty array of orders
    isFetching: false,
    error: false,
  },

  reducers: {
    //GET ALL ORDERS
    getOrderStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    getOrderSuccess: (state, action) => {
      state.isFetching = false;
      state.orders = action.payload;
    },
    getOrderFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
  },
});

export const { getOrderStart, getOrderSuccess, getOrderFailure } = orderSlice.actions;

export default orderSlice.reducer;