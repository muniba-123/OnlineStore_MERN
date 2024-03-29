import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  Button,
  Form,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
// import { Elements } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';
import Message from "../components/Message";
import Loader from "../components/Loader";
import Meta from "../components/Meta";
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
  changeOrderStatus
} from "../actions/order-actions";
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
  ORDER_STATUS_RESET,
  orderStatuses,
} from "../constants/order-constants";
import { baseUrl } from '../constants/Constants';
import { toast } from "react-toastify";

// import CheckoutForm from "../components/CheckoutForm";

// const stripePromise = axios
// 	.get(`${baseUrl}/api/payments/config/stripe-pk`)
// 	.then((res) => res.data)
// 	.then((data) => loadStripe(data.public_key));

const OrderScreen = ({ match, history }) => {
  const orderId = match.params.id;

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;
  const [status, setStatus ] = useState("Pending");

  // const orderPay = useSelector((state) => state.orderPay);
  // const { loading: loadingPay, success: successPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;
  const orderStatus = useSelector((state) => state.orderStatus);
  const { loading: loadingStatus, success: successStatus } = orderStatus;
  if (!loading) {

    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2);
    };
    if(order)
    order.itemsPrice = addDecimals(
      order?.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );
  }

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    }
    if (successStatus) {
		dispatch({ type: ORDER_STATUS_RESET });
		// alert("Status changed")
    toast.success("Order status changed successfully"
    , {
        autoClose: 3000
    });
    
	} else { 
		if (!order || order._id !== orderId || successDeliver) {
      dispatch({ type: ORDER_PAY_RESET }); // to prevent keep refreshing after payment
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(orderId));
    }
	else setStatus(order.orderStatus)
}
  }, [dispatch, order, orderId, successDeliver,successStatus]);

  // call pay order
  const successPaymentHandler = (paymentResult) => {
    console.log(paymentResult);
    dispatch(payOrder(orderId, paymentResult));
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };
  const changeStatus = () => {
    dispatch(changeOrderStatus({ status }, order));
  };
  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <>
      <Meta title="Order Details" />
      <h1 className="h1">Order {orderId}</h1>
      <Row>
        <Col md={7}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>{" "}
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Address:</strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>
             
              {/* {order.isDelivered ? (
								<Message variant='success'>
									Delivered on {order.deliveredAt.substring(0, 10)}
								</Message>
							) : (
								<Message variant='danger'>Not Delivered</Message>
							)} */}
            </ListGroup.Item>
            {/* <ListGroup.Item>
							<h2>Payment Method</h2>
							<p>
								<strong>Method: </strong>
								{order.paymentMethod}
							</p>
							{order.isPaid ? (
								<Message variant='success'>
									Paid on {order.paidAt.substring(0, 10)}
								</Message>
							) : (
								<Message variant='danger'>Not Paid</Message>
							)}
						</ListGroup.Item> */}
            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x Rs. {item.price} = Rs.
                          {Number(item.qty * item.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={5}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>Rs. {order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>Rs. {order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>Rs. {order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>Rs. {order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {/* {!order.isPaid && (
								<ListGroup.Item>
									{loadingPay && <Loader />}
									<Elements stripe={stripePromise}>
										<CheckoutForm
											totalPrice={order.totalPrice}
											paymentHandler={successPaymentHandler}
										/>
									</Elements>
								</ListGroup.Item>
							)} */}
              {/* {loadingDeliver && <Loader />}
              {userInfo &&
                userInfo.isAdmin &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn btn-block"
                      onClick={deliverHandler}
                    >
                      Mark As Delivered
                    </Button>
                  </ListGroup.Item>
                )} */}



{loadingStatus && <Loader />}
              {userInfo &&
                
                (
					<>
					<ListGroup.Item>

					<p className="order_status_change_block">
                <strong >Order status: </strong>{" "}
                {userInfo.isAdmin ? (
                  <Form.Control
                    as="select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
					className="mx-3"
					style={{width:'65%'}}
                  >
                    {orderStatuses.map((x) => (
                      <option key={x + 1} value={x}>
                        {x}
                      </option>
                    ))}
                  </Form.Control>
                ) : (
                  <>{order.orderStatus}</>
                )}
				 
              </p>
					</ListGroup.Item>
                {userInfo.isAdmin &&
				  <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn btn-block"
                      onClick={changeStatus}
                    >
                      Change status
                    </Button>
                  </ListGroup.Item>}
				  </>
                )}



            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
