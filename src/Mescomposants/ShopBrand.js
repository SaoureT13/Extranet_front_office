import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import MobileMenu  from './MobileMenu'
import { NavLink } from 'react-router-dom';


function ShopBrand() {
  const { theme, toggleTheme } = useTheme();



  return (
    <>
<div className="shop-default-brands mb-5">
                <div
                    className="brands-swiper swiper-container swiper-theme "
                    data-swiper-options="{
                                    'slidesPerView': 2,
                                    'breakpoints': {
                                        '576': {
                                            'slidesPerView': 3
                                        },
                                        '768': {
                                            'slidesPerView': 4
                                        },
                                        '992': {
                                            'slidesPerView': 6
                                        },
                                        '1200': {
                                            'slidesPerView': 7
                                        }
                                    },
                                    'autoplay': {
                                        'delay': 4000,
                                        'disableOnInteraction': false
                                    }
                                }"
                >
                    <div className="swiper-wrapper row gutter-no cols-xl-7 cols-lg-6 cols-md-4 cols-sm-3 cols-2">
                    <div className="swiper-slide">
                        <figure>
                        <img
                            src="assets/images/brands/category/1.png"
                            alt="Brand"
                            width={160}
                            height={90}
                        />
                        </figure>
                    </div>
                    <div className="swiper-slide">
                        <figure>
                        <img
                            src="assets/images/brands/category/2.png"
                            alt="Brand"
                            width={160}
                            height={90}
                        />
                        </figure>
                    </div>
                    <div className="swiper-slide">
                        <figure>
                        <img
                            src="assets/images/brands/category/3.png"
                            alt="Brand"
                            width={160}
                            height={90}
                        />
                        </figure>
                    </div>
                    <div className="swiper-slide">
                        <figure>
                        <img
                            src="assets/images/brands/category/4.png"
                            alt="Brand"
                            width={160}
                            height={90}
                        />
                        </figure>
                    </div>
                    <div className="swiper-slide">
                        <figure>
                        <img
                            src="assets/images/brands/category/5.png"
                            alt="Brand"
                            width={160}
                            height={90}
                        />
                        </figure>
                    </div>
                    <div className="swiper-slide">
                        <figure>
                        <img
                            src="assets/images/brands/category/6.png"
                            alt="Brand"
                            width={160}
                            height={90}
                        />
                        </figure>
                    </div>
                    <div className="swiper-slide">
                        <figure>
                        <img
                            src="assets/images/brands/category/7.png"
                            alt="Brand"
                            width={160}
                            height={90}
                        />
                        </figure>
                    </div>
                    </div>
                    <div className="swiper-pagination" />
                </div>
            </div>
</>

);
}

export default ShopBrand;
