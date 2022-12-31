import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Meta from "../components/Meta";
import FormContainer from "../components/FormContainer";
import {
  listCategoryDetails,
  updateCategory,
  createCategory,
} from "../actions/category-actions";
import {
  categories,
  CATEGORY_UPDATE_RESET,
} from "../constants/category-constants";
const CategoryEditScreen = ({ match, history }) => {
  const categoryId = match.params.id;
  const [name, setName] = useState("");
  const dispatch = useDispatch();

  const categoryDetails = useSelector((state) => state.categoryDetails);
  const { loading, error, category } = categoryDetails;

  const categoryUpdate = useSelector((state) => state.categoryUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = categoryUpdate;

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: CATEGORY_UPDATE_RESET });
      history.push("/admin/categorylist");
    } else {
      if (!categoryId) return;
      if (!category.name || category._id !== categoryId) {
        dispatch(listCategoryDetails(categoryId));
      } else {
        setName(category.name);
      }
    }
  }, [dispatch, history, categoryId, category, successUpdate]);
  const submitHandler = (e) => {
	e.preventDefault();
    if (!categoryId) {
      dispatch(
        createCategory({
          name,
        })
      );
      return;
    }
    
    dispatch(
      updateCategory({
        _id: categoryId,
        name
      })
    );
  };

  return (
    <>
      <Link to="/admin/categorylist" className="btn my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>{categoryId ? "Edit" : "Create"} Category</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <>
            <Meta title={categoryId? `Edit | ${name}`:"Create"} />
            <Form onSubmit={submitHandler}>
              <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="name"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Button type="submit" variant="primary">
                {categoryId ? "Update" : "Create"}
              </Button>
            </Form>
          </>
        )}
      </FormContainer>
    </>
  );
};

export default CategoryEditScreen;
