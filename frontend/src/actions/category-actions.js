import axios from 'axios';

// actions
import {
	CATEGORY_LIST_REQUEST,
	CATEGORY_LIST_SUCCESS,
	CATEGORY_LIST_FAIL,
	CATEGORY_DETAILS_REQUEST,
	CATEGORY_DETAILS_SUCCESS,
	CATEGORY_DETAILS_FAIL,
	CATEGORY_DELETE_REQUEST,
	CATEGORY_DELETE_SUCCESS,
	CATEGORY_DELETE_FAIL,
	CATEGORY_CREATE_REQUEST,
	CATEGORY_CREATE_SUCCESS,
	CATEGORY_CREATE_FAIL,
	CATEGORY_UPDATE_REQUEST,
	CATEGORY_UPDATE_SUCCESS,
	CATEGORY_UPDATE_FAIL,
} from '../constants/category-constants';

// action creators
export const listCategories = () => async (
	dispatch
) => {
	try {
		dispatch({
			type: CATEGORY_LIST_REQUEST,
		});

		let { data } = await axios.get(
			`/api/categories`
		);
		if(data?.categories)
   data.categories.unshift({_id:0,name:"All"});
		dispatch({
			type: CATEGORY_LIST_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: CATEGORY_LIST_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

export const listCategoryDetails = (id) => async (dispatch) => {
	try {
		dispatch({
			type: CATEGORY_DETAILS_REQUEST,
		});

		const { data } = await axios.get(`/api/categories/${id}`);

		dispatch({
			type: CATEGORY_DETAILS_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: CATEGORY_DETAILS_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

export const deleteCategory = (id) => async (dispatch, getState) => {
	try {
		dispatch({
			type: CATEGORY_DELETE_REQUEST,
		});

		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				ContentType: 'application/json',
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		await axios.delete(`/api/categories/${id}`, config);

		dispatch({
			type: CATEGORY_DELETE_SUCCESS,
		});
	} catch (error) {
		dispatch({
			type: CATEGORY_DELETE_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

export const createCategory = (Category) => async (dispatch, getState) => {
	try {
		dispatch({
			type: CATEGORY_UPDATE_REQUEST,
		});

		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		const { data } = await axios.post(`/api/categories`, Category, config);

		dispatch({
			type: CATEGORY_UPDATE_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: CATEGORY_UPDATE_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

export const updateCategory = (Category) => async (dispatch, getState) => {
	try {
		dispatch({
			type: CATEGORY_UPDATE_REQUEST,
		});

		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				ContentType: 'application/json',
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		const { data } = await axios.put(
			`/api/categories/${Category._id}`,
			Category,
			config
		);

		dispatch({
			type: CATEGORY_UPDATE_SUCCESS,
			payload: data,
		});
		dispatch({
			type: CATEGORY_DETAILS_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: CATEGORY_UPDATE_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

