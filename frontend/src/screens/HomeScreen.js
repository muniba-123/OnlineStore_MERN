import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";
import Meta from "../components/Meta";
import { listProducts } from "../actions/product-actions";
import Main from "./Main";
import arrowDown from "../assets/icons/down-arrow-white.svg";
import { listCategories } from "../actions/category-actions";

const HomeScreen = ({ match }) => {
  const keyword = match.params.keyword;
  const pageNumber = match.params.pageNumber || 1;
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const categoryList = useSelector((state) => state.categoryList);

  const { loading, error, products, page, pages } = productList;
  const { categories } = categoryList;
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  useEffect(() => {
    dispatch(
      listProducts(
        keyword,
        pageNumber,
        selectedCategory !== "All" ? selectedCategory : undefined
      )
    );
  
  }, [dispatch, keyword, pageNumber, selectedCategory]);
  useEffect(()=>{
	dispatch(listCategories());
  },[])
  useEffect(()=>{
	if (categories?.length) {
		setSelectedCategory(categories[0].name);
	  }
  },[categories])
  const getFilteredCategories=()=>{
	return categories?.map(item=>item.name).filter(item=>item!=selectedCategory)
  }
  return (
    <div className="home-page">
      <Meta />
      {!keyword ? (
        <ProductCarousel />
      ) : (
        //  <Main/>
        <Link to="/" className="btn">
          Go Back
        </Link>
      )}
      <div className="d-flex my-4 align-items-center top-bar">
        <h1 className="m-0">Categories</h1>
        <div className="menu-items">
          <div
            className={`menu-item w-100`}
            onMouseEnter={() => {
             setShowSubMenu(true)
            }}
            onMouseLeave={() => {
            	setShowSubMenu(false)
            }}
          >
            {selectedCategory}
            <img className="sub-menu-icon" src={arrowDown} />
            {showSubMenu && (
              <div className="sub-menu">
                <ul>
                  {getFilteredCategories()?.map((item, i) => (
                    <li key={i} onClick={() => setSelectedCategory(item)}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : products?.length < 1 ? (
        <Message variant="info">No products found</Message>
      ) : (
        <>
          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={pages}
            page={page}
            keyword={keyword ? keyword : ""}
          />
        </>
      )}
    </div>
  );
};

export default HomeScreen;
