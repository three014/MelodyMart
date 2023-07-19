import { loginFailure, loginStart, loginSuccess } from "./userRedux";
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

export const login = async (dispatch, user) => {
  dispatch(loginStart());
  try {
    const res = await publicRequest.post("/auth/login", user);
    dispatch(loginSuccess(res.data));
  } catch (err) {
    dispatch(loginFailure());
  }
};

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
    // const res = await userRequest.delete(`/products/${id}`);
    dispatch(deleteProductSuccess(id));
  } catch (err) {
    dispatch(deleteProductFailure());
  }
};

export const updateProduct = async (id, product, dispatch) => {
  dispatch(updateProductStart());
  try {
    // update
    dispatch(updateProductSuccess({ id, product }));
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
    // const res = await userRequest.delete(`/products/${id}`);
    dispatch(deleteDiscountSuccess(id));
  } catch (err) {
    dispatch(deleteDiscountFailure());
  }
};

export const updateDiscount = async (id, discount, dispatch) => {
  dispatch(updateDiscountStart());
  try {
    // update
    dispatch(updateDiscountSuccess({ id, discount }));
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
