import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import MobileMenu  from './MobileMenu'
import { NavLink } from 'react-router-dom';


function ProductSideBar() {
  const { theme, toggleTheme } = useTheme();



  return (
    <>
        
        <aside className="sidebar product-sidebar sidebar-fixed right-sidebar sticky-sidebar-wrapper">
              <div className="sidebar-overlay" />
              <a className="sidebar-close" href="#">
                <i className="close-icon" />
              </a>
              <a href="#" className="sidebar-toggle d-flex d-lg-none">
                <i className="fas fa-chevron-left" />
              </a>
              <div className="sidebar-content scrollable">
                <div className="sticky-sidebar">
                  <div className="widget widget-icon-box mb-6">
                    <div className="icon-box icon-box-side">
                      <span className="icon-box-icon text-dark">
                        <i className="w-icon-truck" />
                      </span>
                      <div className="icon-box-content">
                        <h4 className="icon-box-title">
                          Free Shipping &amp; Returns
                        </h4>
                        <p>For all orders over $99</p>
                      </div>
                    </div>
                    <div className="icon-box icon-box-side">
                      <span className="icon-box-icon text-dark">
                        <i className="w-icon-bag" />
                      </span>
                      <div className="icon-box-content">
                        <h4 className="icon-box-title">Secure Payment</h4>
                        <p>We ensure secure payment</p>
                      </div>
                    </div>
                    <div className="icon-box icon-box-side">
                      <span className="icon-box-icon text-dark">
                        <i className="w-icon-money" />
                      </span>
                      <div className="icon-box-content">
                        <h4 className="icon-box-title">Money Back Guarantee</h4>
                        <p>Any back within 30 days</p>
                      </div>
                    </div>
                  </div>
                  {/* End of Widget Icon Box */}
                  <div className="widget widget-banner mb-9">
                    <div className="banner banner-fixed br-sm">
                      <figure>
                        <img
                          src="assets/images/shop/banner3.jpg"
                          alt="Banner"
                          width={266}
                          height={220}
                          style={{ backgroundColor: "#1D2D44" }}
                        />
                      </figure>
                      <div className="banner-content">
                        <div className="banner-price-info font-weight-bolder text-white lh-1 ls-25">
                          40<sup className="font-weight-bold">%</sup>
                          <sub className="font-weight-bold text-uppercase ls-25">
                            Off
                          </sub>
                        </div>
                        <h4 className="banner-subtitle text-white font-weight-bolder text-uppercase mb-0">
                          Ultimate Sale
                        </h4>
                      </div>
                    </div>
                  </div>
                  {/* End of Widget Banner */}
                  {/* <div className="widget widget-products">
                    <div className="title-link-wrapper mb-2">
                      <h4 className="title title-link font-weight-bold">
                        More Products
                      </h4>
                    </div>
                    <div className="swiper nav-top">
                      <div
                        className="swiper-container swiper-theme nav-top"
                        data-swiper-options="{
                                                'slidesPerView': 1,
                                                'spaceBetween': 20,
                                                'navigation': {
                                                    'prevEl': '.swiper-button-prev',
                                                    'nextEl': '.swiper-button-next'
                                                }
                                            }"
                      >
                        <div className="swiper-wrapper">
                          <div className="widget-col swiper-slide">
                            <div className="product product-widget">
                              <figure className="product-media">
                                <a href="#">
                                  <img
                                    src="assets/images/shop/13.jpg"
                                    alt="Product"
                                    width={100}
                                    height={113}
                                  />
                                </a>
                              </figure>
                              <div className="product-details">
                                <h4 className="product-name">
                                  <a href="#">Smart Watch</a>
                                </h4>
                                <div className="ratings-container">
                                  <div className="ratings-full">
                                    <span
                                      className="ratings"
                                      style={{ width: "100%" }}
                                    />
                                    <span className="tooltiptext tooltip-top" />
                                  </div>
                                </div>
                                <div className="product-price">$80.00 - $90.00</div>
                              </div>
                            </div>
                            <div className="product product-widget">
                              <figure className="product-media">
                                <a href="#">
                                  <img
                                    src="assets/images/shop/14.jpg"
                                    alt="Product"
                                    width={100}
                                    height={113}
                                  />
                                </a>
                              </figure>
                              <div className="product-details">
                                <h4 className="product-name">
                                  <a href="#">Sky Medical Facility</a>
                                </h4>
                                <div className="ratings-container">
                                  <div className="ratings-full">
                                    <span
                                      className="ratings"
                                      style={{ width: "80%" }}
                                    />
                                    <span className="tooltiptext tooltip-top" />
                                  </div>
                                </div>
                                <div className="product-price">$58.00</div>
                              </div>
                            </div>
                            <div className="product product-widget">
                              <figure className="product-media">
                                <a href="#">
                                  <img
                                    src="assets/images/shop/15.jpg"
                                    alt="Product"
                                    width={100}
                                    height={113}
                                  />
                                </a>
                              </figure>
                              <div className="product-details">
                                <h4 className="product-name">
                                  <a href="#">Black Stunt Motor</a>
                                </h4>
                                <div className="ratings-container">
                                  <div className="ratings-full">
                                    <span
                                      className="ratings"
                                      style={{ width: "60%" }}
                                    />
                                    <span className="tooltiptext tooltip-top" />
                                  </div>
                                </div>
                                <div className="product-price">$374.00</div>
                              </div>
                            </div>
                          </div>
                          <div className="widget-col swiper-slide">
                            <div className="product product-widget">
                              <figure className="product-media">
                                <a href="#">
                                  <img
                                    src="assets/images/shop/16.jpg"
                                    alt="Product"
                                    width={100}
                                    height={113}
                                  />
                                </a>
                              </figure>
                              <div className="product-details">
                                <h4 className="product-name">
                                  <a href="#">Skate Pan</a>
                                </h4>
                                <div className="ratings-container">
                                  <div className="ratings-full">
                                    <span
                                      className="ratings"
                                      style={{ width: "100%" }}
                                    />
                                    <span className="tooltiptext tooltip-top" />
                                  </div>
                                </div>
                                <div className="product-price">$278.00</div>
                              </div>
                            </div>
                            <div className="product product-widget">
                              <figure className="product-media">
                                <a href="#">
                                  <img
                                    src="assets/images/shop/17.jpg"
                                    alt="Product"
                                    width={100}
                                    height={113}
                                  />
                                </a>
                              </figure>
                              <div className="product-details">
                                <h4 className="product-name">
                                  <a href="#">Modern Cooker</a>
                                </h4>
                                <div className="ratings-container">
                                  <div className="ratings-full">
                                    <span
                                      className="ratings"
                                      style={{ width: "80%" }}
                                    />
                                    <span className="tooltiptext tooltip-top" />
                                  </div>
                                </div>
                                <div className="product-price">$324.00</div>
                              </div>
                            </div>
                            <div className="product product-widget">
                              <figure className="product-media">
                                <a href="#">
                                  <img
                                    src="assets/images/shop/18.jpg"
                                    alt="Product"
                                    width={100}
                                    height={113}
                                  />
                                </a>
                              </figure>
                              <div className="product-details">
                                <h4 className="product-name">
                                  <a href="#">CT Machine</a>
                                </h4>
                                <div className="ratings-container">
                                  <div className="ratings-full">
                                    <span
                                      className="ratings"
                                      style={{ width: "100%" }}
                                    />
                                    <span className="tooltiptext tooltip-top" />
                                  </div>
                                </div>
                                <div className="product-price">$236.00</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <button className="swiper-button-next" />
                        <button className="swiper-button-prev" />
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
            </aside>

    </>
  );
}

export default ProductSideBar;
