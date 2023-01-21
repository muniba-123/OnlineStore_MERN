import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import CategoryListScreen from './screens/CategoryListScreen';
import CategoryEditScreen from './screens/CategoryEditScreen';
import OrderListScreen from './screens/OrderListScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import Code from './screens/Code';
import { ToastContainer, Slide } from 'react-toastify';

const App = () => {
	return (
		<Router>
			<Header />
			<main className='py-3 main'>
				<Container>
					<Route path='/order/:id' component={OrderScreen} />
					<Route path='/shipping' component={ShippingScreen} />
					<Route path='/placeorder' component={PlaceOrderScreen} />
					{/* <Route path='/payment' component={PaymentScreen} /> */}
					<Route path='/login' component={LoginScreen} />
					<Route path='/code' component={Code} />
					<Route path='/register' component={RegisterScreen} />
					<Route path='/profile' component={ProfileScreen} />
					<Route path='/favorites' component={FavoritesScreen} />
					<Route path='/product/:id' component={ProductScreen} />
					<Route path='/cart/:id?' component={CartScreen} />
					<Route path='/admin/userlist' component={UserListScreen} />
					<Route path='/admin/user/:id/edit' component={UserEditScreen} />
					<Route
						path='/admin/productlist'
						component={ProductListScreen}
						exact
					/>
					<Route
						path='/admin/productlist/:pageNumber'
						component={ProductListScreen}
						exact
					/>
					
					<Route path='/admin/product/:id/edit' component={ProductEditScreen} exact/>
					<Route path='/admin/product' component={ProductEditScreen} exact/>


					<Route
						path='/admin/categorylist'
						component={CategoryListScreen}
						exact
					/>
					
					<Route path='/admin/category/:id/edit' component={CategoryEditScreen} exact/>
					<Route path='/admin/category' component={CategoryEditScreen} exact/>
					<Route path='/admin/orderlist' component={OrderListScreen} />
					<Route path='/search/:keyword' component={HomeScreen} exact />
					<Route path='/page/:pageNumber' component={HomeScreen} exact />
					<Route
						path='/search/:keyword/page/:pageNumber'
						component={HomeScreen}
						exact
					/>
					<Route path='/' component={HomeScreen} exact />
				</Container>
			</main>
			<ToastContainer draggablePercent={60} limit={3} transition={Slide} hideProgressBar={true} autoClose={2000} />
			<Footer />
		</Router>
	);
};

export default App;
