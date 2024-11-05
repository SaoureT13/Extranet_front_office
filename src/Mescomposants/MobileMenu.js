// src/components/Accueil.js
import React, { useState, useEffect, useContext } from 'react'; // Importation de React et des hooks useState et useEffect


const MobileMenu = () => {
  
  return (
    <>
    {/* Start of Mobile Menu */}
  <div className="mobile-menu-wrapper">
    <div className="mobile-menu-overlay" />
    {/* End of .mobile-menu-overlay */}
    <a href="#" className="mobile-menu-close">
      <i className="close-icon" />
    </a>
    {/* End of .mobile-menu-close */}
    <div className="mobile-menu-container scrollable">
      <form action="#" method="get" className="input-wrapper">
        <input
          type="text"
          className="form-control"
          name="search"
          autoComplete="off"
          placeholder="Search"
          required=""
        />
        <button className="btn btn-search" type="submit">
          <i className="w-icon-search" />
        </button>
      </form>
      {/* End of Search Form */}
      <div className="tab">
        <ul className="nav nav-tabs" role="tablist">
          <li className="nav-item">
            <a href="#main-menu" className="nav-link active">
              Main Menu
            </a>
          </li>
          <li className="nav-item">
            <a href="#categories" className="nav-link">
              Categories
            </a>
          </li>
        </ul>
      </div>
      <div className="tab-content">
        <div className="tab-pane active" id="main-menu">
          <ul className="mobile-menu">
            <li>
              <a href="demo1.html">Home</a>
            </li>
            <li>
              <a href="shop-banner-sidebar.html">Shop</a>
              <ul>
                <li>
                  <a href="#">Shop Pages</a>
                  <ul>
                    <li>
                      <a href="shop-banner-sidebar.html">Banner With Sidebar</a>
                    </li>
                    <li>
                      <a href="shop-boxed-banner.html">Boxed Banner</a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">Full Width Banner</a>
                    </li>
                    <li>
                      <a href="shop-horizontal-filter.html">
                        Horizontal Filter
                        <span className="tip tip-hot">Hot</span>
                      </a>
                    </li>
                    <li>
                      <a href="shop-off-canvas.html">
                        Off Canvas Sidebar
                        <span className="tip tip-new">New</span>
                      </a>
                    </li>
                    <li>
                      <a href="shop-infinite-scroll.html">
                        Infinite Ajax Scroll
                      </a>
                    </li>
                    <li>
                      <a href="shop-right-sidebar.html">Right Sidebar</a>
                    </li>
                    <li>
                      <a href="shop-both-sidebar.html">Both Sidebar</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#">Shop Layouts</a>
                  <ul>
                    <li>
                      <a href="shop-grid-3cols.html">3 Columns Mode</a>
                    </li>
                    <li>
                      <a href="shop-grid-4cols.html">4 Columns Mode</a>
                    </li>
                    <li>
                      <a href="shop-grid-5cols.html">5 Columns Mode</a>
                    </li>
                    <li>
                      <a href="shop-grid-6cols.html">6 Columns Mode</a>
                    </li>
                    <li>
                      <a href="shop-grid-7cols.html">7 Columns Mode</a>
                    </li>
                    <li>
                      <a href="shop-grid-8cols.html">8 Columns Mode</a>
                    </li>
                    <li>
                      <a href="shop-list.html">List Mode</a>
                    </li>
                    <li>
                      <a href="shop-list-sidebar.html">
                        List Mode With Sidebar
                      </a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#">Product Pages</a>
                  <ul>
                    <li>
                      <a href="product-variable.html">Variable Product</a>
                    </li>
                    <li>
                      <a href="product-featured.html">Featured &amp; Sale</a>
                    </li>
                    <li>
                      <a href="product-accordion.html">Data In Accordion</a>
                    </li>
                    <li>
                      <a href="product-section.html">Data In Sections</a>
                    </li>
                    <li>
                      <a href="product-swatch.html">Image Swatch</a>
                    </li>
                    <li>
                      <a href="product-extended.html">Extended Info</a>
                    </li>
                    <li>
                      <a href="product-without-sidebar.html">Without Sidebar</a>
                    </li>
                    <li>
                      <a href="product-video.html">
                        360<sup>o</sup> &amp; Video
                        <span className="tip tip-new">New</span>
                      </a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#">Product Layouts</a>
                  <ul>
                    <li>
                      <a href="product-default.html">
                        Default<span className="tip tip-hot">Hot</span>
                      </a>
                    </li>
                    <li>
                      <a href="product-vertical.html">Vertical Thumbs</a>
                    </li>
                    <li>
                      <a href="product-grid.html">Grid Images</a>
                    </li>
                    <li>
                      <a href="product-masonry.html">Masonry</a>
                    </li>
                    <li>
                      <a href="product-gallery.html">Gallery</a>
                    </li>
                    <li>
                      <a href="product-sticky-info.html">Sticky Info</a>
                    </li>
                    <li>
                      <a href="product-sticky-thumb.html">Sticky Thumbs</a>
                    </li>
                    <li>
                      <a href="product-sticky-both.html">Sticky Both</a>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>
              <a href="vendor-dokan-store.html">Vendor</a>
              <ul>
                <li>
                  <a href="#">Store Listing</a>
                  <ul>
                    <li>
                      <a href="vendor-dokan-store-list.html">Store listing 1</a>
                    </li>
                    <li>
                      <a href="vendor-wcfm-store-list.html">Store listing 2</a>
                    </li>
                    <li>
                      <a href="vendor-wcmp-store-list.html">Store listing 3</a>
                    </li>
                    <li>
                      <a href="vendor-wc-store-list.html">Store listing 4</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#">Vendor Store</a>
                  <ul>
                    <li>
                      <a href="vendor-dokan-store.html">Vendor Store 1</a>
                    </li>
                    <li>
                      <a href="vendor-wcfm-store-product-grid.html">
                        Vendor Store 2
                      </a>
                    </li>
                    <li>
                      <a href="vendor-wcmp-store-product-grid.html">
                        Vendor Store 3
                      </a>
                    </li>
                    <li>
                      <a href="vendor-wc-store-product-grid.html">
                        Vendor Store 4
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>
              <a href="blog.html">Blog</a>
              <ul>
                <li>
                  <a href="blog.html">Classic</a>
                </li>
                <li>
                  <a href="blog-listing.html">Listing</a>
                </li>
                <li>
                  <a href="https://www.portotheme.com/html/wolmart/blog-grid.html">
                    Grid
                  </a>
                  <ul>
                    <li>
                      <a href="blog-grid-2cols.html">Grid 2 columns</a>
                    </li>
                    <li>
                      <a href="blog-grid-3cols.html">Grid 3 columns</a>
                    </li>
                    <li>
                      <a href="blog-grid-4cols.html">Grid 4 columns</a>
                    </li>
                    <li>
                      <a href="blog-grid-sidebar.html">Grid sidebar</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#">Masonry</a>
                  <ul>
                    <li>
                      <a href="blog-masonry-2cols.html">Masonry 2 columns</a>
                    </li>
                    <li>
                      <a href="blog-masonry-3cols.html">Masonry 3 columns</a>
                    </li>
                    <li>
                      <a href="blog-masonry-4cols.html">Masonry 4 columns</a>
                    </li>
                    <li>
                      <a href="blog-masonry-sidebar.html">Masonry sidebar</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#">Mask</a>
                  <ul>
                    <li>
                      <a href="blog-mask-grid.html">Blog mask grid</a>
                    </li>
                    <li>
                      <a href="blog-mask-masonry.html">Blog mask masonry</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="post-single.html">Single Post</a>
                </li>
              </ul>
            </li>
            <li>
              <a href="about-us.html">Pages</a>
              <ul>
                <li>
                  <a href="about-us.html">About Us</a>
                </li>
                <li>
                  <a href="become-a-vendor.html">Become A Vendor</a>
                </li>
                <li>
                  <a href="contact-us.html">Contact Us</a>
                </li>
                <li>
                  <a href="login.html">Login</a>
                </li>
                <li>
                  <a href="faq.html">FAQs</a>
                </li>
                <li>
                  <a href="error-404.html">Error 404</a>
                </li>
                <li>
                  <a href="coming-soon.html">Coming Soon</a>
                </li>
                <li>
                  <a href="wishlist.html">Wishlist</a>
                </li>
                <li>
                  <a href="cart.html">Cart</a>
                </li>
                <li>
                  <a href="checkout.html">Checkout</a>
                </li>
                <li>
                  <a href="my-account.html">My Account</a>
                </li>
              </ul>
            </li>
            <li>
              <a href="elements.html">Elements</a>
              <ul>
                <li>
                  <a href="element-products.html">Products</a>
                </li>
                <li>
                  <a href="element-titles.html">Titles</a>
                </li>
                <li>
                  <a href="element-typography.html">Typography</a>
                </li>
                <li>
                  <a href="element-categories.html">Product Category</a>
                </li>
                <li>
                  <a href="element-buttons.html">Buttons</a>
                </li>
                <li>
                  <a href="element-accordions.html">Accordions</a>
                </li>
                <li>
                  <a href="element-alerts.html">Alert &amp; Notification</a>
                </li>
                <li>
                  <a href="element-tabs.html">Tabs</a>
                </li>
                <li>
                  <a href="element-testimonials.html">Testimonials</a>
                </li>
                <li>
                  <a href="element-blog-posts.html">Blog Posts</a>
                </li>
                <li>
                  <a href="element-instagrams.html">Instagrams</a>
                </li>
                <li>
                  <a href="element-cta.html">Call to Action</a>
                </li>
                <li>
                  <a href="element-vendors.html">Vendors</a>
                </li>
                <li>
                  <a href="element-icon-boxes.html">Icon Boxes</a>
                </li>
                <li>
                  <a href="element-icons.html">Icons</a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div className="tab-pane" id="categories">
          <ul className="mobile-menu">
            <li>
              <a href="shop-fullwidth-banner.html">
                <i className="w-icon-tshirt2" />
                Fashion
              </a>
              <ul>
                <li>
                  <a href="#">Women</a>
                  <ul>
                    <li>
                      <a href="shop-fullwidth-banner.html">New Arrivals</a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">Best Sellers</a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">Trending</a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">Clothing</a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">Shoes</a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">Bags</a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">Accessories</a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">
                        Jewlery &amp; Watches
                      </a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">Sale</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#">Men</a>
                  <ul>
                    <li>
                      <a href="shop-fullwidth-banner.html">New Arrivals</a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">Best Sellers</a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">Trending</a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">Clothing</a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">Shoes</a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">Bags</a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">Accessories</a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">
                        Jewlery &amp; Watches
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>
              <a href="shop-fullwidth-banner.html">
                <i className="w-icon-home" />
                Home &amp; Garden
              </a>
              <ul>
                <li>
                  <a href="#">Bedroom</a>
                  <ul>
                    <li>
                      <a href="shop-fullwidth-banner.html">
                        Beds, Frames &amp; Bases
                      </a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">Dressers</a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">Nightstands</a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">
                        Kid's Beds &amp; Headboards
                      </a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">Armoires</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#">Living Room</a>
                  <ul>
                    <li>
                      <a href="shop-fullwidth-banner.html">Coffee Tables</a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">Chairs</a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">Tables</a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">
                        Futons &amp; Sofa Beds
                      </a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">
                        Cabinets &amp; Chests
                      </a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#">Office</a>
                  <ul>
                    <li>
                      <a href="shop-fullwidth-banner.html">Office Chairs</a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">Desks</a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">Bookcases</a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">File Cabinets</a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">Breakroom Tables</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#">Kitchen &amp; Dining</a>
                  <ul>
                    <li>
                      <a href="shop-fullwidth-banner.html">Dining Sets</a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">
                        Kitchen Storage Cabinets
                      </a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">Bashers Racks</a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">Dining Chairs</a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">
                        Dining Room Tables
                      </a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">Bar Stools</a>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>
              <a href="shop-fullwidth-banner.html">
                <i className="w-icon-electronics" />
                Electronics
              </a>
              <ul>
                <li>
                  <a href="#">Laptops &amp; Computers</a>
                  <ul>
                    <li>
                      <a href="shop-fullwidth-banner.html">Desktop Computers</a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">Monitors</a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">Laptops</a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">
                        Hard Drives &amp; Storage
                      </a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">
                        Computer Accessories
                      </a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#">TV &amp; Video</a>
                  <ul>
                    <li>
                      <a href="shop-fullwidth-banner.html">TVs</a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">
                        Home Audio Speakers
                      </a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">Projectors</a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">
                        Media Streaming Devices
                      </a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#">Digital Cameras</a>
                  <ul>
                    <li>
                      <a href="shop-fullwidth-banner.html">
                        Digital SLR Cameras
                      </a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">
                        Sports &amp; Action Cameras
                      </a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">Camera Lenses</a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">Photo Printer</a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">
                        Digital Memory Cards
                      </a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#">Cell Phones</a>
                  <ul>
                    <li>
                      <a href="shop-fullwidth-banner.html">Carrier Phones</a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">Unlocked Phones</a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">
                        Phone &amp; Cellphone Cases
                      </a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">
                        Cellphone Chargers
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>
              <a href="shop-fullwidth-banner.html">
                <i className="w-icon-furniture" />
                Furniture
              </a>
              <ul>
                <li>
                  <a href="#">Furniture</a>
                  <ul>
                    <li>
                      <a href="shop-fullwidth-banner.html">
                        Sofas &amp; Couches
                      </a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">Armchairs</a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">Bed Frames</a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">Beside Tables</a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">Dressing Tables</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#">Lighting</a>
                  <ul>
                    <li>
                      <a href="shop-fullwidth-banner.html">Light Bulbs</a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">Lamps</a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">Celling Lights</a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">Wall Lights</a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">Bathroom Lighting</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#">Home Accessories</a>
                  <ul>
                    <li>
                      <a href="shop-fullwidth-banner.html">
                        Decorative Accessories
                      </a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">
                        Candals &amp; Holders
                      </a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">Home Fragrance</a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">Mirrors</a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">Clocks</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#">Garden &amp; Outdoors</a>
                  <ul>
                    <li>
                      <a href="shop-fullwidth-banner.html">Garden Furniture</a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">Lawn Mowers</a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">Pressure Washers</a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">All Garden Tools</a>
                    </li>
                    <li>
                      <a href="shop-fullwidth-banner.html">Outdoor Dining</a>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>
              <a href="shop-fullwidth-banner.html">
                <i className="w-icon-heartbeat" />
                Healthy &amp; Beauty
              </a>
            </li>
            <li>
              <a href="shop-fullwidth-banner.html">
                <i className="w-icon-gift" />
                Gift Ideas
              </a>
            </li>
            <li>
              <a href="shop-fullwidth-banner.html">
                <i className="w-icon-gamepad" />
                Toy &amp; Games
              </a>
            </li>
            <li>
              <a href="shop-fullwidth-banner.html">
                <i className="w-icon-ice-cream" />
                Cooking
              </a>
            </li>
            <li>
              <a href="shop-fullwidth-banner.html">
                <i className="w-icon-ios" />
                Smart Phones
              </a>
            </li>
            <li>
              <a href="shop-fullwidth-banner.html">
                <i className="w-icon-camera" />
                Cameras &amp; Photo
              </a>
            </li>
            <li>
              <a href="shop-fullwidth-banner.html">
                <i className="w-icon-ruby" />
                Accessories
              </a>
            </li>
            <li>
              <a
                href="shop-banner-sidebar.html"
                className="font-weight-bold text-primary text-uppercase ls-25"
              >
                View All Categories
                <i className="w-icon-angle-right" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  {/* End of Mobile Menu */}
    </>

  );
};

export default MobileMenu;
