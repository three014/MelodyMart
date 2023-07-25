import {
  loginStart,
  loginSuccess,
  loginFailure,
  getUserStart,
  getUserSuccess,
  getUserFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} from "./userRedux";

import { publicRequest, userRequest } from "../requestMethods";

import {
  getProductFailure,
  getProductStart,
  getProductSuccess,
  deleteProductFailure,
  deleteProductStart,
  deleteProductSuccess,
  updateProductFailure,
  updateProductStart,
  updateProductSuccess,
  addProductFailure,
  addProductStart,
  addProductSuccess,
} from "./productRedux";

import {
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
} from "./discountRedux";

import{ getOrderStart, getOrderSuccess, getOrderFailure, } from "./orderRedux";

//Sets of API call functions using asynchronous Javascript to make requests to the server
//Uses Redux to dispatch actions for different stages of API calls like start, success, and failure


//Performs a login request to the server and dispatches login-related actions based on response
export const login = async (dispatch, user) => {
  dispatch(loginStart());
  try {
    const res = await publicRequest.post("/auth/login", user);
    dispatch(loginSuccess(res.data));
  } catch (err) {
    dispatch(loginFailure());
  }
};

//----------API Calls for users---------------
//All of these functions are used to interact with the backend API as they update the app's state using Redux actions based on the API responses
export const getUsers = async (dispatch) => {
  dispatch(getUserStart());
  try {
    const res = await publicRequest.get("/users");
    dispatch(getUserSuccess(res.data));
  } catch (err) {
    dispatch(getUserFailure());
  }
};

export const updateUser = async (id, user, dispatch) => {
  dispatch(updateUserStart());
  try {
    // update
    const res = await userRequest.put(`/users/${id}`, user);
    dispatch(updateUserSuccess({ res }));
  } catch (err) {
    dispatch(updateUserFailure());
  }
};

export const deleteUser = async (id, dispatch) => {
  dispatch(deleteUserStart());
  try {
    const res = await userRequest.delete(`/users/${id}`);
    dispatch(deleteUserSuccess(res));
  } catch (err) {
    dispatch(deleteUserFailure());
  }
};

//----------API Calls for products---------------

export const getProducts = async (dispatch) => {
  dispatch(getProductStart());
  try {
    const res = await publicRequest.get("/products");
    dispatch(getProductSuccess(res.data));
  } catch (err) {
    dispatch(getProductFailure());
  }
};

export const deleteProduct = async (id, dispatch) => {
  dispatch(deleteProductStart());
  try {
    const res = await userRequest.delete(`/products/${id}`);
    dispatch(deleteProductSuccess(res));
  } catch (err) {
    dispatch(deleteProductFailure());
  }
};

export const updateProduct = async (id, product, dispatch) => {
  dispatch(updateProductStart());
  try {
    // update
    const res = await userRequest.put(`/products/${id}`, product);
    dispatch(updateProductSuccess({ res }));
  } catch (err) {
    dispatch(updateProductFailure());
  }
};

export const addProduct = async (product, dispatch) => {
  dispatch(addProductStart());
  try {
    const res = await userRequest.post(`/products`, product);
    dispatch(addProductSuccess(res.data));
  } catch (err) {
    dispatch(addProductFailure());
  }
};

//-----API Calls for Discounts------

export const getDiscounts = async (dispatch) => {
  dispatch(getDiscountStart());
  try {
    const res = await publicRequest.get("/discounts");
    dispatch(getDiscountSuccess(res.data));
  } catch (err) {
    dispatch(getDiscountFailure());
  }
};

export const deleteDiscount = async (id, dispatch) => {
  dispatch(deleteDiscountStart());
  try {
    const res = await userRequest.delete(`/discounts/${id}`);
    dispatch(deleteDiscountSuccess(res));
  } catch (err) {
    dispatch(deleteDiscountFailure());
  }
};

export const updateDiscount = async (id, discount, dispatch) => {
  dispatch(updateDiscountStart());
  try {
    // update
    const res = await userRequest.put(`/discounts/${id}` , discount);
    dispatch(updateDiscountSuccess({ res }));
  } catch (err) {
    dispatch(updateDiscountFailure());
  }
};

export const addDiscount = async (discount, dispatch) => {
  dispatch(addDiscountStart());
  try {
    const res = await userRequest.post(`/discounts`, discount);
    dispatch(addDiscountSuccess(res.data));
  } catch (err) {
    dispatch(addDiscountFailure());
  }
};

//-----API Calls for Orders-----

export const getOrders = async (dispatch) => {
  dispatch(getOrderStart());
  try {
    const res = await publicRequest.get("/orders");
    dispatch(getOrderSuccess(res.data));
  } catch (err) {
    dispatch(getOrderFailure());
  }
};