const SERVICE_PLAN_ID = 'b31ae23534a344118ea31111a767922a';
const API_TOKEN = '3b6910301243479e874fba74916711ba';
const SINCH_NUMBER = '+447520651683';
const TO_NUMBER = '+923215357690';

import fetch from 'node-fetch';

const options =  {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + API_TOKEN
  },
  body: JSON.stringify({
    from: SINCH_NUMBER,
    to: [TO_NUMBER],
    body: 'Programmers are tools for converting caffeine into code. We just got a new shipment of mugs! Check them out: https://tinyurl.com/4a6fxce7!'
  })
};
fetch('https://us.sms.api.sinch.com/xms/v1/' + SERVICE_PLAN_ID + '/batches',options)
  .then(response => 
    {
     return response.json()
    })
  .then(json => {
    console.log(json)})
  .catch(err =>{ 
    
    console.error("err", JSON.stringify(err))});




















// import messagebird from 'messagebird';
// var messagebirdC = new messagebird('Q9o20f7MdQdqUh3pP3JPMWsNe');
// var params = {
//   'originator': '+923215357690',
//   'recipients': '+923215357690',
//   'body': 'This is a test message'
// }
// messagebirdC.messages.create(params, function (err, response) {
//   if (err) {
//     return console.log(err);
//   }
//   console.log(response);
// });














// import twilio from 'twilio';
// import dotenv from 'dotenv';
// // const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const accountSid="AC5fe1796666ec2ed0318d1474b9bf1319";
// // const authToken = process.env.TWILIO_AUTH_TOKEN;
// const authToken="bd6adccac5d92d6e3f657ca1de1d55dc"
// const client = new twilio(accountSid, authToken);

// client.messages
//   .create({
//      body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
//      from: '+923215357690',
//      to: '+923215357690'
//    })
//   .then(message => console.log(message.sid))
//   .catch(err=>console.log(err))
