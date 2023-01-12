import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import Message from '../components/Message';
import Meta from '../components/Meta';
import FormContainer from '../components/FormContainer';
import Axios from 'axios';
import { USER_LOGIN_ERR_RESET } from '../constants/user-constants';
import { baseUrl } from '../constants/Constants';

const Code = ({ location, history }) => {
	const [code, setCode] = useState('');
	const [email, setEmail] = useState('');
	const [err, setErr] = useState('');
	const dispatch = useDispatch();
useEffect(()=>{
	dispatch({ type: USER_LOGIN_ERR_RESET });
},[])
	const submitHandler = (e) => {
		e.preventDefault();
	    Axios
      .post(
         `${baseUrl}/api/users/verifyCode`,
        {email,code}
      )
      .then((res) => {
      if(res.isAxiosError)
     setErr("Code is not valid.");
	 else
	 alert("Account verified successfully")
	 history.push("/login")
      })
      .catch((err) => {
		if(err?.response?.data?.message)
		setErr(err.response.data.message)
        console.log(err);
      });
	};

	return (
		<FormContainer>
			<Meta title='Verify Email' />
			<h1>Verify Email</h1>
			{err && <Message variant='danger'>{err}</Message>}
			<Form onSubmit={submitHandler}>
			<Form.Group controlId='email'>
					<Form.Label>Email Address</Form.Label>
					<Form.Control
						type='email'
						placeholder='Enter email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					></Form.Control>
				</Form.Group>
				<Form.Group controlId='code'>
					<Form.Label>6-digit code</Form.Label>
					<Form.Control
						type='number'
						placeholder='Enter 6-digit code here'
						value={code}
						onChange={(e) => setCode(e.target.value)}
						required
					></Form.Control>
				</Form.Group>
				<Button type='submit' variant='primary'>
					Submit
				</Button>
			</Form>
		</FormContainer>
	);
};

export default Code;
