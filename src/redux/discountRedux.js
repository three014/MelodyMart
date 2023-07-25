import { createSlice } from "@reduxjs/toolkit";

//Redux slice for discount contains action creators and reducer to handle different stages of discount-related API requests and state updates

export const discountSlice = createSlice({
  name: "discount",
  initialState: {
    discounts: [], //initial state contins empty array
    isFetching: false,
    error: false,
  },
  reducers: {
    //GET ALL DISCOUNTS
    getDiscountStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    getDiscountSuccess: (state, action) => {
      state.isFetching = false;
      state.discounts = action.payload;
    },
    getDiscountFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    //DELETE DISCOUNT
    deleteDiscountStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    deleteDiscountSuccess: (state, action) => {
      state.isFetching = false;
      state.discounts.splice(
        state.discounts.findIndex((item) => item._id === action.payload),
        1
      );
    },
    deleteDiscountFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    //UPDATE DISCOUNT
    updateDiscountStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    updateDiscountSuccess: (state, action) => {
      state.isFetching = false;
      state.discounts[
        state.discounts.findIndex((item) => item._id === action.payload.id)
      ] = action.payload.discount;
    },
    updateDiscountFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    //ADD DISCOUNT
    addDiscountStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    addDiscountSuccess: (state, action) => {
      state.isFetching = false;
      state.discounts.push(action.payload);
    },
    addDiscountFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
  },
});

export const {
  getDiscountStart,
  getDiscountSuccess,
  getDiscountFailure,
  deleteDiscountStart,
  deleteDiscountSuccess,
  deleteDiscountFailure,
  updateDiscountStart,
  updateDiscountSuccess,
  updateDiscountFailure,
  addDiscountStart,
  addDiscountSuccess,
  addDiscountFailure,
} = discountSlice.actions;

export default discountSlice.reducer;