import React from 'react';
import mainImg1 from '../../assets/images/slider1.jpeg';
import mainImg2 from '../../assets/images/slider2.jpeg';
import mainImg3 from '../../assets/images/slider3.png';
import Slider from "react-slick";
import blog1 from '../../assets/images/side1.png';
import blog2 from '../../assets/images/side2.png';
import sideWhite1 from '../../assets/images/sidewhite1.png'
import sideWhite2 from '../../assets/images/sidewhite2.png'
import sideOrange1 from '../../assets/images/sideorange1.png'
import sideOrange2 from '../../assets/images/sideorange2.png'
import sideBlack1 from '../../assets/images/sideblack1.png'
import sideBlack2 from '../../assets/images/sideblack2.png'
import { Link } from 'react-router-dom';
import styles from './MainSlider.module.css';

export default function MainSlider() {
  var settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    dotsClass: `slick-dots ${styles.customDots}`,
    fade: true,
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="row g-2">
        <div className="col-lg-9 col-md-12 mb-2 mb-lg-0">
          <div className={styles.sliderWrapper}>
            <Slider {...settings}>
              {[mainImg1, mainImg2, mainImg3].map((img, i) => (
                <div key={i}>
                  <div className={styles.slide}>
                    <img src={img} className={styles.slideImg} alt={`Slide ${i + 1}`} />
                    <div className={styles.slideOverlay}>
                      <div className={styles.heroContent}>
                        <span className={styles.heroBadge}>New Arrivals</span>
                        <h1 className={styles.heroTitle}>Shop the Latest<br/>& Greatest</h1>
                        <p className={styles.heroSub}>Premium products delivered to your door.</p>
                        <Link to="/products" className={`btn-premium ${styles.heroCta}`}>
                          Shop Now <i className="fa-solid fa-arrow-right"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
  
        <div className="col-lg-3 col-md-12 d-flex flex-lg-column flex-row gap-2">
        
          <div className={styles.sideImg}>
            <Slider {...settings}>
              {[sideWhite2,sideOrange2, sideBlack2].map((img, i) => (
               <img src={img} className={styles.sideImgEl} alt={`Slide ${i + 1}`} />
              ))}
            </Slider>
           
           
          </div>
          <div className={styles.sideImg}>
             <Slider {...settings}>
              {[sideWhite1,sideOrange1, sideBlack1].map((img, i) => (
               <img src={img} className={styles.sideImgEl} alt={`Slide ${i + 1}`} />
              ))}
            </Slider>
           
          </div>
        </div>
      </div>
    </div>
  );
}