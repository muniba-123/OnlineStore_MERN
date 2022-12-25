import React, { useState } from 'react'
import sImg1 from "../assets/images/basketball-gacd50b643_1280.png";
import sImg2 from "../assets/images/building-blocks-4913375_1920.jpg";
import sImg3 from "../assets/images/football-g731032e15_1280.png";
import { useNavigate } from 'react-router-dom';
import {
  Row,
  Col
} from "react-bootstrap";
import ImageSlider from '../components/ImageSlider';
const imagesArr = [sImg2, sImg2, sImg2];
export default function Main(props) {
  return (
    <div className='main-section'>
      <Row className='main-section-inner'>
        <Col xl={6} lg={6} md={6} sm={12} className='text-block'>
          <div className='title-1'>
            translations.EnjoyCeleberations
          </div>
          <h2 className='title-2'>
            translations.FindVenues
          </h2>
          <div className='title-3'>
            translations.FindSpaces
          </div>
        </Col>
        <Col xl={6} lg={6} md={6} sm={12} className="image-block">
          <ImageSlider items={imagesArr} />
        </Col>
      </Row>
    
    </div>
  )
}
