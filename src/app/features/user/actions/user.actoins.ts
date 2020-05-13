import { createAction, props } from '@ngrx/store';
import { User } from '../../../core/models/user.model';
import { Product } from '../../../core/models/product.model';

export const login = createAction(
  '[User] Login',
  props<{ email: string, password: string }>()
);

export const loginSucceeded = createAction(
  '[User] Login Succeeded',
  props<{ user: User, wishlist: Array<Product> }>()
);

export const loginFailed = createAction(
  '[User] Login Failed',
  props<{ message: string }>()
);

export const logout = createAction(
  '[User] Logout'
);

export const createNewUser = createAction(
  '[User] Create New User',
  props<{ user: any }>()
);

export const createNewUserSucceeded = createAction(
  '[User] Create New User Succeeded',
  props<{ user: User, wishlist: Array<Product> }>()
);

export const createNewUserFailed = createAction(
  '[User] Create New User Failed',
  props<{ message: string }>()
);

export const addProductToWishlist = createAction(
  '[User] Add Product To Wishlist',
  props<{ userId: string, productId: string }>()
);

export const addProductToWishlistSucceeded = createAction(
  '[User] Add Product To Wishlist Succeeded',
  props<{ wishlist: Array<Product> }>()
);

export const addProductToWishlistFailed = createAction(
  '[User] Add Product To Wishlist Failed'
);

export const removeProductFromWishlist = createAction(
  '[User] Remove Product From Wishlist',
  props<{ userId: string, productId: string }>()
);

export const removeProductFromWishlistSucceeded = createAction(
  '[User] Remove Product From Wishlist Succeeded',
  props<{ wishlist: Array<Product> }>()
);

export const removeProductFromWishlistFailed = createAction(
  '[User] Remove Product From Wishlist Failed'
);