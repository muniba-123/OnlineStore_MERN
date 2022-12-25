import React from 'react'
import { Carousel } from 'react-bootstrap';
function ImageSlider(props) {
    const { items, slide = true } = props;
    const [activeIndex, setActiveIndex] = React.useState(0);
    const itemLength = items.length - 1
    const previousButton = () => {
        const nextIndex = activeIndex === 0 ?
            itemLength : activeIndex - 1;
        setActiveIndex(nextIndex);
    }
    const nextButton = () => {
        const nextIndex = activeIndex === itemLength ?
            0 : activeIndex + 1;
        setActiveIndex(nextIndex);
    }
    const carouselItemData = items?.map((item, i) => {
        return (
            <Carousel.Item
                key={i}
            >
                <img alt="" src={item.image_path ? item.image_path : item} />
            </Carousel.Item>
        );
    });

    return (
        <Carousel previous={previousButton} next={nextButton} interval={5000} slide={slide}
            activeIndex={activeIndex}>
            {carouselItemData}
            {/* <Carousel.Caption className='carousel-caption'>
							<h2>
								{product.name} (Rs.{product.price} )
							</h2>
						</Carousel.Caption> */}
            {/* <Carousel.Control directionText="Prev"
                direction="prev" onClickHandler={previousButton} />
            <Carousel.Control directionText="Next"
                direction="next" onClickHandler={nextButton} /> */}
        </Carousel>



    );
}
export default ImageSlider;