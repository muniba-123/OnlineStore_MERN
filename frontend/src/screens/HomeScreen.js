import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';
import { listProducts } from '../actions/product-actions';
import Main from './Main';
import { categories } from '../constants/product-constants';
import arrowDown from "../assets/icons/down-arrow-white.svg";

const HomeScreen = ({ match }) => {
	const keyword = match.params.keyword;
	// if it does not have a page number, set it to 1
	const pageNumber = match.params.pageNumber || 1;
	const dispatch = useDispatch();
	const productList = useSelector((state) => state.productList);
	const { loading, error, products, page, pages } = productList;
const [showSubMenu,setShowSubMenu]=useState(false);
const categoryOptions=["All",...categories];
const [selectedCategory,setSelectedCategory]=useState(categoryOptions[0]);

	useEffect(() => {
		dispatch(listProducts(keyword, pageNumber,selectedCategory!=="All"?selectedCategory:undefined));
	}, [dispatch, keyword, pageNumber,selectedCategory]);

	return (
		<div className='home-page'>
			<Meta />
			{!keyword ? (
			 <ProductCarousel />
				//  <Main/>
			) : (
				<Link to='/' className='btn'>
					Go Back
				</Link>
			)}
			<div className='d-flex my-4 align-items-center'>
				<h1 className='m-0'>Categories</h1>
<div className="menu-items">  
              <div
                className={`menu-item`}
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
                     {categoryOptions.filter(item=>item!==selectedCategory).map((item,i)=><li key={i} onClick={()=>setSelectedCategory(item)}>{item}</li>)}
                    </ul>
                  </div>
                )}
              </div>
           
          </div>
			</div>
			
			{loading ? (
				<Loader />
			) : error ? (
				<Message variant='danger'>{error}</Message>
				

			) : (
				products?.length<1?
				<Message variant='info'>No products found</Message>:
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
						keyword={keyword ? keyword : ''}
					/>
				</>
			)}
		</div>
	);
};

export default HomeScreen;
