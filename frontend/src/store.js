import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import {
	productListReducer,
	productDetailsReducer,
	productDeleteReducer,
	productCreateReducer,
	productUpdateReducer,
	productReviewCreateReducer,
	productTopRatedReducer,
} from './reducers/product-reducers';
import {
	categoryListReducer,
	categoryDetailsReducer,
	categoryDeleteReducer,
	categoryCreateReducer,
	categoryUpdateReducer,
} from './reducers/category-reducers';
import { cartReducer } from './reducers/cart-reducers';
import {
	userLoginReducer,
	userRegisterReducer,
	userDetailsReducer,
	userUpdateProfileReducer,
	userListReducer,
	userDeleteReducer,
	userUpdateReducer,
	userAddToFavoriteReducer,
	userRemoveFavoriteReducer,
	userGetFavoritesReducer,
} from './reducers/user-reducers';
import {
	orderCreateReducer,
	orderDetailsReducer,
	orderPayReducer,
	getMyOrdersReducer,
	orderListReducer,
	orderDeliverReducer,
	orderStatusReducer,
} from './reducers/order-reducers';

const reducer = combineReducers({
	productList: productListReducer,
	productDetails: productDetailsReducer,
	productDelete: productDeleteReducer,
	productCreate: productCreateReducer,
	productUpdate: productUpdateReducer,
	productReviewCreate: productReviewCreateReducer,
	productTopRated: productTopRatedReducer,
	categoryList: categoryListReducer,
	categoryDetails: categoryDetailsReducer,
	categoryDelete: categoryDeleteReducer,
	categoryCreate: categoryCreateReducer,
	categoryUpdate: categoryUpdateReducer,
	cart: cartReducer,
	userLogin: userLoginReducer,
	userRegister: userRegisterReducer,
	userDetails: userDetailsReducer,
	userUpdateProfile: userUpdateProfileReducer,
	userList: userListReducer,
	userDelete: userDeleteReducer,
	userUpdate: userUpdateReducer,
	userAddFavorites: userAddToFavoriteReducer,
	userRemoveFavorite: userRemoveFavoriteReducer,
	userGetFavorites: userGetFavoritesReducer,
	orderCreate: orderCreateReducer,
	orderDetails: orderDetailsReducer,
	orderPay: orderPayReducer,
	orderGetMyOrders: getMyOrdersReducer,
	orderList: orderListReducer,
	orderDeliver: orderDeliverReducer,
	orderStatus: orderStatusReducer,

});

// get cart items from localStorage if exists
const cartItemsFromStorage = localStorage.getItem('cartItems')
	? JSON.parse(localStorage.getItem('cartItems'))
	: [];

// get user info from localStorage if exists
const userInfoFromStorage = localStorage.getItem('userInfo')
	? JSON.parse(localStorage.getItem('userInfo'))
	: null;

// get shipping address from localStorage if exists
const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
	? JSON.parse(localStorage.getItem('shippingAddress'))
	: {};

const initialState = {
	cart: {
		cartItems: cartItemsFromStorage,
		shippingAddress: shippingAddressFromStorage,
	},
	userLogin: {
		userInfo: userInfoFromStorage,
	},
};

const middleware = [thunk];

const store = createStore(
	reducer,
	initialState,
	composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
