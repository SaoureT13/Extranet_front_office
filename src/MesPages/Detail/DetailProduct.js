// src/components/Accueil.js
import React, { useState, useEffect, useContext } from 'react'; // Importation de React et des hooks useState et useEffect
import AppMenu from '../../Mescomposants/AppMenu'
import MobileMenu from '../../Mescomposants/MobileMenu'
import Footer from '../../Mescomposants/Footer'
import ProductGallery from '../../Mescomposants/ProductGallery'
import ProductSideBar from '../../Mescomposants/ProductSideBar'
import PhotoSwipe from '../../Mescomposants/PhotoSwipe'

import { useNavigate } from 'react-router-dom';
import { crudData } from '../../services/apiService'; // Importation de la fonction crudData
import { ToastContainer, toast } from 'react-toastify';
import ErrorCard from '../../Mescomposants/ErrorCard';
import ProductCarousel from '../Home/ProductCarousel'
import 'react-toastify/dist/ReactToastify.css';


const DetailProduct = ({param = {},onSuccess, defaultImage, imageRuptureStock}) => {
  const errorImageUrl = JSON.parse(localStorage.getItem("errorImageUrl"));
  const paths = JSON.parse(localStorage.getItem("appPaths"));
  const urlBaseImage = localStorage.getItem("urlBaseImage");
  const date = JSON.parse(localStorage.getItem("appDate"));

  const [productData, setProductData] = useState(null);
  const [activeTab, setActiveTab] = useState('product-tab-specification');
  const [quantity, setQuantity] = useState(1); // Gestion de la quantité
  const [statusCode, setStatusCode] = useState(null);     // Code statut HTTP
  const [isLoading, setIsLoading] = useState(false);  

  const [addedProducts, setAddedProducts] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupContent, setPopupContent] = useState({});
  const [isLoadingSpinner, setIsLoadingSpinner] = useState(false)



   



  // Fonction pour récupérer les données depuis l'API
  // const fetchData = (params, apiEndpointe) => {
  //   crudData(params, apiEndpointe)
  //     .then(response => {
  //       const products = response.data.products;
  //       setProductData(products[0]); // Assuming the first product is the one we want
  //     })
  //     .catch(error => {
  //       console.error('Erreur lors de la récupération des données:', error);
  //     });
  // };



  const fetchData = (params, url, setProcutData) => {
    setIsLoading(true); // Activez le statut de chargement avant la requête
    crudData(params, url)
      .then(response => {
        setIsLoading(false); // Désactivez le statut de chargement une fois la réponse reçue
        if (response && response.status === 200) {
          const produitVeto = response.data.products;
          setProductData(produitVeto[0]);
          setStatusCode(response?.status);
        } else {
          console.error('Erreur HTTP:', response);
          setStatusCode(response?.status || 'Unknown error');
        }
      })
      .catch(error => {
        setIsLoading(false);
        if (error.response) {
          setStatusCode(error.response.status);
          console.error('Erreur de réponse serveur:', error.response.status, error.response.data);
        } else if (error.request) {
          setStatusCode(404);
          console.error('Erreur de requête:', error.request);
        } else {
          setStatusCode('Request setup error');
          console.error('Erreur de configuration:', error.message);
        //   alert('Erreur: ' + error.message);
        }
      });
  };


  useEffect(() => {
    const params = {
      mode: param.mode.getProductMode,
      LG_PROID: localStorage.getItem("selectedProductId"), // ID du produit à récupérer
    };
    fetchData(params, param.apiEndpointe.StockManagerEndPoint);

  }, []);

    // Fonction pour gérer l'incrémentation
    const handleIncrement = () => {
      setQuantity(prevQuantity => prevQuantity + 1);
    };
  
    // Fonction pour gérer la décrémentation
    const handleDecrement = () => {
      setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
    };



    const handleAddToCart = (product) => {

    // Check if the product requires options
    if (product.options && product.options.length > 0) {
      alert("Please select some product options before adding this product to your cart.");
      return;
    }

    if(quantity <= parseInt(productData.ArtStk) && quantity > 0){
      
        // Simulate loading state
        setIsLoadingSpinner(true)
       
          // Update added products
          setAddedProducts([...addedProducts, product]);

          // Open popup with product details
          setPopupContent({
            name: product.name,
            imageSrc: product.imageSrc,
            message: "has been added to cart.",
          });

          const payload = {
            mode: param.mode.createCommproduittMode,
            LG_AGEID : param.userData.LG_AGEID,
            STR_COMMNAME :'',
            STR_COMMADRESSE :'Plateau, Pullman',
            STR_LIVADRESSE :'Zone 4, marcory',
            LG_PROID : productData.ArtID,
            STR_UTITOKEN :param.userData.STR_UTITOKEN,
            INT_CPRQUANTITY :quantity,
          };
      
          // Envoyer les données vers l'API
          crudData(payload, param.apiEndpointe.CommandeManagerEndPoint)
            .then(response => {
              if (response && response.status === 200){
                if (response.data.code_statut === "1") {
                  localStorage.setItem('LG_COMMID', response.data.LG_COMMID)
                  onSuccess();
                } else {
                  toast.error("Erreur : " + response.data.desc_statut);  // Notification d'erreur
                }
              }else {
                toast.error("Erreur survenu");
              }
              
            })
            .catch(error => {
              console.error('Erreur lors de l\'ajout au panier:', error);
            }).finally(()=>{
              setIsLoadingSpinner(false)
            })

          // Close popup after a delay
          setTimeout(() => {
            setIsPopupOpen(false);
          }, 3000);
    }else{
      // toast.error("Stock insuffisante");
    }

  };
  


  const products = [
      {
          "ArtID": "1009",
          "ArtCode": "ABI144.",
          "ArtLib": "OXYTETRACYCLINE 50 %  100 G",
          "ArtPrixBase": "2950.00",
          "ArtCodeBarre": "",
          "ArtVolume": "",
          "ArtGPicID": "-1",
          "ArtStk": "157.00",
          "ArtGTaxID": "-1",
          "ArtLongueur": "0",
          "ArtLargeur": "0",
          "ArtHauteur": "0",
          "ArtPoids": "",
          "ArtIsSleep": "-",
          "CmtTxt": "",
          "ArtLastPA": "2092.50",
          "ArtCategEnu": "ANTIBIOTIQUES",
          "ArtFamilleEnu": "ABI1",
          "ArtGammeEnu": "LAPROVET",
          "ARTFREE0": "701100",
          "ARTFREE1": "",
          "ARTFREE2": "AVIAIRE",
          "ARTFREE3": "LAPROVET",
          "ARTFREE4": "Standard",
          "ARTFREE5": "SACHET"
      },
      {
          "ArtID": "1010",
          "ArtCode": "ABI017.",
          "ArtLib": "OXYTETRACYCLINE 50% ORAL 1 KG",
          "ArtPrixBase": "27000.00",
          "ArtCodeBarre": "",
          "ArtVolume": "",
          "ArtGPicID": "-1",
          "ArtStk": "42.00",
          "ArtGTaxID": "-1",
          "ArtLongueur": "0",
          "ArtLargeur": "0",
          "ArtHauteur": "0",
          "ArtPoids": "",
          "ArtIsSleep": "-",
          "CmtTxt": "\r\r\r",
          "ArtLastPA": "19022.75",
          "ArtCategEnu": "ANTIBIOTIQUES",
          "ArtFamilleEnu": "ABI1",
          "ArtGammeEnu": "LAPROVET",
          "ARTFREE0": "701100",
          "ARTFREE1": "",
          "ARTFREE2": "AVIAIRE",
          "ARTFREE3": "LAPROVET",
          "ARTFREE4": "Standard",
          "ARTFREE5": "POT"
      },
      {
          "ArtID": "1011",
          "ArtCode": "ABI029.",
          "ArtLib": "PENI STREPTO INJ 100 ML",
          "ArtPrixBase": "5850.00",
          "ArtCodeBarre": "",
          "ArtVolume": "",
          "ArtGPicID": "-1",
          "ArtStk": "4162.00",
          "ArtGTaxID": "-1",
          "ArtLongueur": "0",
          "ArtLargeur": "0",
          "ArtHauteur": "0",
          "ArtPoids": "",
          "ArtIsSleep": "-",
          "CmtTxt": "",
          "ArtLastPA": "3870.15",
          "ArtCategEnu": "ANTIBIOTIQUES",
          "ArtFamilleEnu": "ABI1",
          "ArtGammeEnu": "LAPROVET",
          "ARTFREE0": "701100",
          "ARTFREE1": "",
          "ARTFREE2": "BOVIN/OVIN/CAPRIN/PORCIN/EQUIN",
          "ARTFREE3": "LAPROVET",
          "ARTFREE4": "Standard",
          "ARTFREE5": "FLACON"
      },
      {
          "ArtID": "1025",
          "ArtCode": "ABI101.",
          "ArtLib": "TRISULMYCINE 100 G",
          "ArtPrixBase": "2600.00",
          "ArtCodeBarre": "",
          "ArtVolume": "",
          "ArtGPicID": "-1",
          "ArtStk": "189.00",
          "ArtGTaxID": "-1",
          "ArtLongueur": "0",
          "ArtLargeur": "0",
          "ArtHauteur": "0",
          "ArtPoids": "",
          "ArtIsSleep": "-",
          "CmtTxt": "",
          "ArtLastPA": "2005.32",
          "ArtCategEnu": "ANTIBIOTIQUES",
          "ArtFamilleEnu": "ABI2",
          "ArtGammeEnu": "LAPROVET",
          "ARTFREE0": "701100",
          "ARTFREE1": "",
          "ARTFREE2": "AVIAIRE",
          "ARTFREE3": "LAPROVET",
          "ARTFREE4": "Standard",
          "ARTFREE5": "SACHET"
      },
  ]


  
  return (
    <>
      <div className={`page-wrapper ${param.userData ? 'bgUserConnected' : 'bgUserDisConnected'}`}>
        <main className="main mb-0 pb-1">
          <AppMenu />
          <div className="page-content">
            <div className="container">

              {isLoading ? (
                <div className="text-center">
                  <p>Chargement des produits...</p>
                  <div className="spinner-border" role="status">
                    <span className="sr-only">Chargement...</span>
                  </div>
                </div>
              ) : statusCode === 200 ? (
              <>
                {productData && (
                  <div className="row gutter-lg">
                    <div className="main-content">
                    {/* {isPopupOpen && (
                        <div className="alert alert-success alert-cart-product mb-2">
                        {" "}
                        <a href="cart.html" className="btn btn-success btn-rounded">
                          View Carts
                        </a>{" "}
                        <p className="mb-0 ls-normal">
                          “Fashion Table Sound Marker” has been added to your cart.
                        </p>{" "}
                        <a href="#" className="btn btn-link btn-close" aria-label="button">
                          <i className="close-icon" />
                        </a>{" "}
                      </div>
                          
                      )} */}
                      <div className="product product-single row">
            
                        <ProductGallery ArtStk={productData.ArtStk} param={param} imageRuptureStock={imageRuptureStock} galerieImage={productData.gallerie} defaultImage={defaultImage} />
                        <div className="col-md-6 mb-6 mb-md-8 bg-white remove-padding">
                          <div className="product-details important-padding" data-sticky-options="{'minWidth': 767}">
                            <h1 className="product-title">{productData.ArtLib}</h1>
                            {/* <div className="product-bm-wrapper">
                              <figure className="brand">
                                <img
                                  src="assets/images/products/brand/brand-6.jpg"
                                  alt="Brand"
                                  width={85}
                                  height={48}
                                />
                              </figure>
                              <div className="product-meta">
                                <div className="product-categories">
                                  Category:
                                  <span className="product-category">
                                    <a href="#">Electronics</a>
                                  </span>
                                </div>
                                <div className="product-sku">
                                  Stock: <span>{parseInt(productData.ArtStk)}</span>
                                </div>
                              </div>
                            </div> */}
                            <hr className="product-divider" />
                            {param.userData != null && (<>  <div className="product-price">{parseInt(productData.ArtPrixBase)} FCFA</div> <hr className="product-divider" /></>)}

                            
                            {/* <div className="ratings-container">
                              <div className="ratings-full">
                                <span className="ratings" style={{ width: "80%" }} />
                                <span className="tooltiptext tooltip-top" />
                              </div>
                              <a href="#product-tab-reviews" className="rating-reviews">
                                (3 Reviews)
                              </a>
                            </div> */}
                            {/* <div className="product-short-desc">
                              <ul className="list-type-check list-style-none">
                                <li>Ultrices eros in cursus turpis massa cursus mattis.</li>
                                <li>Volutpat ac tincidunt vitae semper quis lectus.</li>
                                <li>Aliquam id diam maecenas ultricies mi eget mauris.</li>
                              </ul>
                            </div> */}
                            
                            {/* <div className="product-form product-variation-form product-image-swatch">
                              <label>Color:</label>
                              <div className="d-flex align-items-center product-variations">
                                <a href="#" className="image">
                                  <img
                                    src="assets/images/products/swatch/1-800x900.jpg"
                                    alt="Product Swatch"
                                    width={24}
                                    height={24}
                                  />
                                </a>
                                <a href="#" className="image">
                                  <img
                                    src="assets/images/products/swatch/7-800x900.jpg"
                                    alt="Product Swatch"
                                    width={24}
                                    height={24}
                                  />
                                </a>
                                <a href="#" className="image">
                                  <img
                                    src="assets/images/products/swatch/8-800x900.jpg"
                                    alt="Product Swatch"
                                    width={24}
                                    height={24}
                                  />
                                </a>
                                <a href="#" className="image">
                                  <img
                                    src="assets/images/products/swatch/14-800x900.jpg"
                                    alt="Product Swatch"
                                    width={24}
                                    height={24}
                                  />
                                </a>
                              </div>
                            </div> */}
                            {/* <div className="product-form product-variation-form product-size-swatch">
                              <label className="mb-1">Size:</label>
                              <div className="flex-wrap d-flex align-items-center product-variations">
                                <a href="#" className="size">
                                  Small
                                </a>
                                <a href="#" className="size">
                                  Medium
                                </a>
                                <a href="#" className="size">
                                  Large
                                </a>
                                <a href="#" className="size">
                                  Extra Large
                                </a>
                              </div>
                              <a href="#" className="product-variation-clean">
                                Clean All
                              </a>
                            </div> */}
                            <div className="product-variation-price">
                              <span />
                            </div>
                            {param.userData != null && (
                              <div className="fix-bottom product-sticky-content sticky-content">
                                <div className="product-form container">
                                  <div className="product-qty-form mb-0">
                                    <div className="input-group">
                                      <input
                                        className="quantity form-control"
                                        type="number"
                                        min={1}
                                        value={quantity}
                                        max={10000000}
                                        onChange={(e) => setQuantity(e.target.value)} // Gestion du changement de quantité
                                      />
                                      <button onClick={handleIncrement} className="quantity-plus w-icon-plus">
                                        {/* Contenu du bouton */}
                                      </button>
                                      <button onClick={handleDecrement} className="quantity-minus w-icon-minus">
                                        {/* Contenu du bouton */}
                                      </button>
                                    </div>
                                  </div>
                                  <button
                                    type="submit"
                                    className={`d-flex align-items-center btn ${parseInt(productData.ArtStk) > 0 ? 'btn-primary' : 'btn-cart disabled'}`}
                                    onClick={handleAddToCart}
                                  >
                                    <i className="w-icon-cart mr-2" />
                                    <span>Ajoutez au panier</span>
                                    {isLoadingSpinner && <div class="loader ml-4"></div>}
                                  </button>
                                </div>
                              </div>
                            )}

                            
                            <div className="social-links-wrapper">
                              {/* <div className="social-links">
                                <div className="social-icons social-no-color border-thin">
                                  <a href="#" className="social-icon social-facebook w-icon-facebook"
                                  />
                                  <a href="#" className="social-icon social-twitter w-icon-twitter"
                                  />
                                  <a href="#" className="social-icon social-pinterest fab fa-pinterest-p"
                                  />
                                  <a href="#" className="social-icon social-whatsapp fab fa-whatsapp"
                                  />
                                  <a href="#" className="social-icon social-youtube fab fa-linkedin-in"
                                  />
                                </div>
                              </div> */}
                              {/* <span className="divider d-xs-show" />
                              <div className="product-link-wrapper d-flex">
                                <a
                                  href="#"
                                  className="btn-product-icon btn-wishlist w-icon-heart"
                                >
                                  <span />
                                </a>
                                <a
                                  href="#"
                                  className="btn-product-icon btn-compare btn-icon-left w-icon-compare"
                                >
                                  <span />
                                </a>
                              </div> */}
                            </div>

                            <div className="tab tab-nav-boxed tab-nav-underline product-tabs">
                        <ul className="nav nav-tabs" role="tablist">
                          <li className="nav-item">
                            <a href="#product-tab-description" className="nav-link active">
                              Description
                            </a>
                          </li>
                          <li className="nav-item">
                            <a href="#product-tab-specification" className="nav-link">
                              Specification
                            </a>
                          </li>
                          {/* <li className="nav-item">
                            <a href="#product-tab-vendor" className="nav-link">
                              Vendor Info
                            </a>
                          </li>
                          <li className="nav-item">
                            <a href="#product-tab-reviews" className="nav-link">
                              Customer Reviews (3)
                            </a>
                          </li> */}
                        </ul>
                        <div className="tab-content">
                          <div className="tab-pane active pane-padding" id="product-tab-description">
                            <div className="row mb-4">
                              <div className="col-md-12 mb-5">
                                <h4 className="title tab-pane-title font-weight-bold mb-2">
                                  Detail
                                </h4>
                                <p className="mb-4">
                                  {productData.CmtTxt}
                                </p>
                              </div>
                              {/* <div className="col-md-6 mb-5">
                                <div className="banner banner-video product-video br-xs">
                                  <figure className="banner-media">
                                    <a href="#">
                                      <img
                                        src="assets/images/products/video-banner-610x300.jpg"
                                        alt="banner"
                                        width={610}
                                        height={300}
                                        style={{ backgroundColor: "#bebebe" }}
                                      />
                                    </a>
                                    <a
                                      className="btn-play-video btn-iframe"
                                      href="assets/video/memory-of-a-woman.mp4"
                                    />
                                  </figure>
                                </div>
                              </div> */}
                            </div>
                          </div>
                          <div className="tab-pane pane-padding" id="product-tab-specification">
                            <ul className="list-none">
                              <li>
                                <label>Model</label>
                                <p>Skysuite 320</p>
                              </li>
                              <li>
                                <label>Color</label>
                                <p>Black</p>
                              </li>
                              <li>
                                <label>Size</label>
                                <p>Large, Small</p>
                              </li>
                              <li>
                                <label>Guarantee Time</label>
                                <p>3 Months</p>
                              </li>
                            </ul>
                          </div>
                          <div className="tab-pane" id="product-tab-vendor">
                            <div className="row mb-3">
                              <div className="col-md-6 mb-4">
                                <figure className="vendor-banner br-sm">
                                  <img
                                    src="assets/images/products/vendor-banner.jpg"
                                    alt="Vendor Banner"
                                    width={610}
                                    height={295}
                                    style={{ backgroundColor: "#353B55" }}
                                  />
                                </figure>
                              </div>
                              {/* <div className="col-md-6 pl-2 pl-md-6 mb-4">
                                <div className="vendor-user">
                                  <figure className="vendor-logo mr-4">
                                    <a href="#">
                                      <img
                                        src="assets/images/products/vendor-logo.jpg"
                                        alt="Vendor Logo"
                                        width={80}
                                        height={80}
                                      />
                                    </a>
                                  </figure>
                                  <div>
                                    <div className="vendor-name">
                                      <a href="#">Jone Doe</a>
                                    </div>
                                    <div className="ratings-container">
                                      <div className="ratings-full">
                                        <span className="ratings" style={{ width: "90%" }} />
                                        <span className="tooltiptext tooltip-top" />
                                      </div>
                                      <a href="#" className="rating-reviews">
                                        (32 Reviews)
                                      </a>
                                    </div>
                                  </div>
                                </div>
                                <ul className="vendor-info list-style-none">
                                  <li className="store-name">
                                    <label>Store Name:</label>
                                    <span className="detail">OAIO Store</span>
                                  </li>
                                  <li className="store-address">
                                    <label>Address:</label>
                                    <span className="detail">
                                      Steven Street, El Carjon, CA 92020, United States (US)
                                    </span>
                                  </li>
                                  <li className="store-phone">
                                    <label>Phone:</label>
                                    <a href="#tel:">1234567890</a>
                                  </li>
                                </ul>
                                <a
                                  href="vendor-dokan-store.html"
                                  className="btn btn-dark btn-link btn-underline btn-icon-right"
                                >
                                  Visit Store
                                  <i className="w-icon-long-arrow-right" />
                                </a>
                              </div> */}
                            </div>
                            {/* <p className="mb-5">
                              <strong className="text-dark">L</strong>orem ipsum dolor sit
                              amet, consectetur adipiscing elit, sed do eiusmod tempor
                              incididunt ut labore et dolore magna aliqua. Venenatis tellus in
                              metus vulputate eu scelerisque felis. Vel pretium lectus quam id
                              leo in vitae turpis massa. Nunc id cursus metus aliquam. Libero
                              id faucibus nisl tincidunt eget. Aliquam id diam maecenas
                              ultricies mi eget mauris. Volutpat ac tincidunt vitae semper
                              quis lectus. Vestibulum mattis ullamcorper velit sed. A arcu
                              cursus vitae congue mauris.
                            </p> */}
                            {/* <p className="mb-2">
                              <strong className="text-dark">A</strong> arcu cursus vitae
                              congue mauris. Sagittis id consectetur purus ut. Tellus rutrum
                              tellus pellentesque eu tincidunt tortor aliquam nulla. Diam in
                              arcu cursus euismod quis. Eget sit amet tellus cras adipiscing
                              enim eu. In fermentum et sollicitudin ac orci phasellus. A
                              condimentum vitae sapien pellentesque habitant morbi tristique
                              senectus et. In dictum non consectetur a erat. Nunc scelerisque
                              viverra mauris in aliquam sem fringilla.
                            </p> */}
                          </div>
                          <div className="tab-pane" id="product-tab-reviews">
                            <div className="row mb-4">
                              <div className="col-xl-4 col-lg-5 mb-4">
                                <div className="ratings-wrapper">
                                  <div className="avg-rating-container">
                                    <h4 className="avg-mark font-weight-bolder ls-50">3.3</h4>
                                    {/* <div className="avg-rating">
                                      <p className="text-dark mb-1">Average Rating</p>
                                      <div className="ratings-container">
                                        <div className="ratings-full">
                                          <span
                                            className="ratings"
                                            style={{ width: "60%" }}
                                          />
                                          <span className="tooltiptext tooltip-top" />
                                        </div>
                                        <a href="#" className="rating-reviews">
                                          (3 Reviews)
                                        </a>
                                      </div>
                                    </div> */}
                                  </div>
                                  <div className="ratings-value d-flex align-items-center text-dark ls-25">
                                    <span className="text-dark font-weight-bold">66.7%</span>
                                    Recommended<span className="count">(2 of 3)</span>
                                  </div>
                                  <div className="ratings-list">
                                    <div className="ratings-container">
                                      <div className="ratings-full">
                                        <span className="ratings" style={{ width: "100%" }} />
                                        <span className="tooltiptext tooltip-top" />
                                      </div>
                                      <div className="progress-bar progress-bar-sm ">
                                        <span />
                                      </div>
                                      <div className="progress-value">
                                        <mark>70%</mark>
                                      </div>
                                    </div>
                                    <div className="ratings-container">
                                      <div className="ratings-full">
                                        <span className="ratings" style={{ width: "80%" }} />
                                        <span className="tooltiptext tooltip-top" />
                                      </div>
                                      <div className="progress-bar progress-bar-sm ">
                                        <span />
                                      </div>
                                      <div className="progress-value">
                                        <mark>30%</mark>
                                      </div>
                                    </div>
                                    <div className="ratings-container">
                                      <div className="ratings-full">
                                        <span className="ratings" style={{ width: "60%" }} />
                                        <span className="tooltiptext tooltip-top" />
                                      </div>
                                      <div className="progress-bar progress-bar-sm ">
                                        <span />
                                      </div>
                                      <div className="progress-value">
                                        <mark>40%</mark>
                                      </div>
                                    </div>
                                    <div className="ratings-container">
                                      <div className="ratings-full">
                                        <span className="ratings" style={{ width: "40%" }} />
                                        <span className="tooltiptext tooltip-top" />
                                      </div>
                                      <div className="progress-bar progress-bar-sm ">
                                        <span />
                                      </div>
                                      <div className="progress-value">
                                        <mark>0%</mark>
                                      </div>
                                    </div>
                                    <div className="ratings-container">
                                      <div className="ratings-full">
                                        <span className="ratings" style={{ width: "20%" }} />
                                        <span className="tooltiptext tooltip-top" />
                                      </div>
                                      <div className="progress-bar progress-bar-sm ">
                                        <span />
                                      </div>
                                      <div className="progress-value">
                                        <mark>0%</mark>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-xl-8 col-lg-7 mb-4">
                                <div className="review-form-wrapper">
                                  <h3 className="title tab-pane-title font-weight-bold mb-1">
                                    Submit Your Review
                                  </h3>
                                  <p className="mb-3">
                                    Your email address will not be published. Required fields
                                    are marked *
                                  </p>
                                  <form action="#" method="POST" className="review-form">
                                    <div className="rating-form">
                                      <label htmlFor="rating">
                                        Your Rating Of This Product :
                                      </label>
                                      <span className="rating-stars">
                                        <a className="star-1" href="#">
                                          1
                                        </a>
                                        <a className="star-2" href="#">
                                          2
                                        </a>
                                        <a className="star-3" href="#">
                                          3
                                        </a>
                                        <a className="star-4" href="#">
                                          4
                                        </a>
                                        <a className="star-5" href="#">
                                          5
                                        </a>
                                      </span>
                                      <select
                                        name="rating"
                                        id="rating"
                                        required=""
                                        style={{ display: "none" }}
                                      >
                                        <option value="">Rate…</option>
                                        <option value={5}>Perfect</option>
                                        <option value={4}>Good</option>
                                        <option value={3}>Average</option>
                                        <option value={2}>Not that bad</option>
                                        <option value={1}>Very poor</option>
                                      </select>
                                    </div>
                                    <textarea
                                      cols={30}
                                      rows={6}
                                      placeholder="Write Your Review Here..."
                                      className="form-control"
                                      id="review"
                                      defaultValue={""}
                                    />
                                    <div className="row gutter-md">
                                      <div className="col-md-6">
                                        <input
                                          type="text"
                                          className="form-control"
                                          placeholder="Your Name"
                                          id="author"
                                        />
                                      </div>
                                      <div className="col-md-6">
                                        <input
                                          type="text"
                                          className="form-control"
                                          placeholder="Your Email"
                                          id="email_1"
                                        />
                                      </div>
                                    </div>
                                    <div className="form-group">
                                      <input
                                        type="checkbox"
                                        className="custom-checkbox"
                                        id="save-checkbox"
                                      />
                                      <label htmlFor="save-checkbox">
                                        Save my name, email, and website in this browser for
                                        the next time I comment.
                                      </label>
                                    </div>
                                    <button type="submit" className="btn btn-dark">
                                      Submit Review
                                    </button>
                                  </form>
                                </div>
                              </div>
                            </div>
                            <div className="tab tab-nav-boxed tab-nav-outline tab-nav-center">
                              <ul className="nav nav-tabs" role="tablist">
                                <li className="nav-item">
                                  <a href="#show-all" className="nav-link active">
                                    Show All
                                  </a>
                                </li>
                                <li className="nav-item">
                                  <a href="#helpful-positive" className="nav-link">
                                    Most Helpful Positive
                                  </a>
                                </li>
                                <li className="nav-item">
                                  <a href="#helpful-negative" className="nav-link">
                                    Most Helpful Negative
                                  </a>
                                </li>
                                <li className="nav-item">
                                  <a href="#highest-rating" className="nav-link">
                                    Highest Rating
                                  </a>
                                </li>
                                <li className="nav-item">
                                  <a href="#lowest-rating" className="nav-link">
                                    Lowest Rating
                                  </a>
                                </li>
                              </ul>
                              <div className="tab-content">
                                <div className="tab-pane active" id="show-all">
                                  <ul className="comments list-style-none">
                                    <li className="comment">
                                      <div className="comment-body">
                                        <figure className="comment-avatar">
                                          <img
                                            src="assets/images/agents/1-100x100.png"
                                            alt="Commenter Avatar"
                                            width={90}
                                            height={90}
                                          />
                                        </figure>
                                        <div className="comment-content">
                                          <h4 className="comment-author">
                                            <a href="#">John Doe</a>
                                            <span className="comment-date">
                                              March 22, 2021 at 1:54 pm
                                            </span>
                                          </h4>
                                          <div className="ratings-container comment-rating">
                                            <div className="ratings-full">
                                              <span
                                                className="ratings"
                                                style={{ width: "60%" }}
                                              />
                                              <span className="tooltiptext tooltip-top" />
                                            </div>
                                          </div>
                                          <p>
                                            pellentesque habitant morbi tristique senectus et.
                                            In dictum non consectetur a erat. Nunc ultrices
                                            eros in cursus turpis massa tincidunt ante in nibh
                                            mauris cursus mattis. Cras ornare arcu dui vivamus
                                            arcu felis bibendum ut tristique.
                                          </p>
                                          <div className="comment-action">
                                            <a
                                              href="#"
                                              className="btn btn-secondary btn-link btn-underline sm btn-icon-left font-weight-normal text-capitalize"
                                            >
                                              <i className="far fa-thumbs-up" />
                                              Helpful (1)
                                            </a>
                                            <a
                                              href="#"
                                              className="btn btn-dark btn-link btn-underline sm btn-icon-left font-weight-normal text-capitalize"
                                            >
                                              <i className="far fa-thumbs-down" />
                                              Unhelpful (0)
                                            </a>
                                            <div className="review-image">
                                              <a href="#">
                                                <figure>
                                                  <img
                                                    src="assets/images/products/default/review-img-1.jpg"
                                                    width={60}
                                                    height={60}
                                                    alt="Attachment image of John Doe's review on Electronics Black Wrist Watch"
                                                    data-zoom-image="assets/images/products/default/review-img-1-800x900.jpg"
                                                  />
                                                </figure>
                                              </a>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </li>
                                    <li className="comment">
                                      <div className="comment-body">
                                        <figure className="comment-avatar">
                                          <img
                                            src="assets/images/agents/2-100x100.png"
                                            alt="Commenter Avatar"
                                            width={90}
                                            height={90}
                                          />
                                        </figure>
                                        <div className="comment-content">
                                          <h4 className="comment-author">
                                            <a href="#">John Doe</a>
                                            <span className="comment-date">
                                              March 22, 2021 at 1:52 pm
                                            </span>
                                          </h4>
                                          <div className="ratings-container comment-rating">
                                            <div className="ratings-full">
                                              <span
                                                className="ratings"
                                                style={{ width: "80%" }}
                                              />
                                              <span className="tooltiptext tooltip-top" />
                                            </div>
                                          </div>
                                          <p>
                                            Nullam a magna porttitor, dictum risus nec,
                                            faucibus sapien. Ultrices eros in cursus turpis
                                            massa tincidunt ante in nibh mauris cursus mattis.
                                            Cras ornare arcu dui vivamus arcu felis bibendum
                                            ut tristique.
                                          </p>
                                          <div className="comment-action">
                                            <a
                                              href="#"
                                              className="btn btn-secondary btn-link btn-underline sm btn-icon-left font-weight-normal text-capitalize"
                                            >
                                              <i className="far fa-thumbs-up" />
                                              Helpful (1)
                                            </a>
                                            <a
                                              href="#"
                                              className="btn btn-dark btn-link btn-underline sm btn-icon-left font-weight-normal text-capitalize"
                                            >
                                              <i className="far fa-thumbs-down" />
                                              Unhelpful (0)
                                            </a>
                                            <div className="review-image">
                                              <a href="#">
                                                <figure>
                                                  <img
                                                    src="assets/images/products/default/review-img-2.jpg"
                                                    width={60}
                                                    height={60}
                                                    alt="Attachment image of John Doe's review on Electronics Black Wrist Watch"
                                                    data-zoom-image="assets/images/products/default/review-img-2.jpg"
                                                  />
                                                </figure>
                                              </a>
                                              <a href="#">
                                                <figure>
                                                  <img
                                                    src="assets/images/products/default/review-img-3.jpg"
                                                    width={60}
                                                    height={60}
                                                    alt="Attachment image of John Doe's review on Electronics Black Wrist Watch"
                                                    data-zoom-image="assets/images/products/default/review-img-3.jpg"
                                                  />
                                                </figure>
                                              </a>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </li>
                                    <li className="comment">
                                      <div className="comment-body">
                                        <figure className="comment-avatar">
                                          <img
                                            src="assets/images/agents/3-100x100.png"
                                            alt="Commenter Avatar"
                                            width={90}
                                            height={90}
                                          />
                                        </figure>
                                        <div className="comment-content">
                                          <h4 className="comment-author">
                                            <a href="#">John Doe</a>
                                            <span className="comment-date">
                                              March 22, 2021 at 1:21 pm
                                            </span>
                                          </h4>
                                          <div className="ratings-container comment-rating">
                                            <div className="ratings-full">
                                              <span
                                                className="ratings"
                                                style={{ width: "60%" }}
                                              />
                                              <span className="tooltiptext tooltip-top" />
                                            </div>
                                          </div>
                                          <p>
                                            In fermentum et sollicitudin ac orci phasellus. A
                                            condimentum vitae sapien pellentesque habitant
                                            morbi tristique senectus et. In dictum non
                                            consectetur a erat. Nunc scelerisque viverra
                                            mauris in aliquam sem fringilla.
                                          </p>
                                          <div className="comment-action">
                                            <a
                                              href="#"
                                              className="btn btn-secondary btn-link btn-underline sm btn-icon-left font-weight-normal text-capitalize"
                                            >
                                              <i className="far fa-thumbs-up" />
                                              Helpful (0)
                                            </a>
                                            <a
                                              href="#"
                                              className="btn btn-dark btn-link btn-underline sm btn-icon-left font-weight-normal text-capitalize"
                                            >
                                              <i className="far fa-thumbs-down" />
                                              Unhelpful (1)
                                            </a>
                                          </div>
                                        </div>
                                      </div>
                                    </li>
                                  </ul>
                                </div>
                                <div className="tab-pane" id="helpful-positive">
                                  <ul className="comments list-style-none">
                                    <li className="comment">
                                      <div className="comment-body">
                                        <figure className="comment-avatar">
                                          <img
                                            src="assets/images/agents/1-100x100.png"
                                            alt="Commenter Avatar"
                                            width={90}
                                            height={90}
                                          />
                                        </figure>
                                        <div className="comment-content">
                                          <h4 className="comment-author">
                                            <a href="#">John Doe</a>
                                            <span className="comment-date">
                                              March 22, 2021 at 1:54 pm
                                            </span>
                                          </h4>
                                          <div className="ratings-container comment-rating">
                                            <div className="ratings-full">
                                              <span
                                                className="ratings"
                                                style={{ width: "60%" }}
                                              />
                                              <span className="tooltiptext tooltip-top" />
                                            </div>
                                          </div>
                                          <p>
                                            pellentesque habitant morbi tristique senectus et.
                                            In dictum non consectetur a erat. Nunc ultrices
                                            eros in cursus turpis massa tincidunt ante in nibh
                                            mauris cursus mattis. Cras ornare arcu dui vivamus
                                            arcu felis bibendum ut tristique.
                                          </p>
                                          <div className="comment-action">
                                            <a
                                              href="#"
                                              className="btn btn-secondary btn-link btn-underline sm btn-icon-left font-weight-normal text-capitalize"
                                            >
                                              <i className="far fa-thumbs-up" />
                                              Helpful (1)
                                            </a>
                                            <a
                                              href="#"
                                              className="btn btn-dark btn-link btn-underline sm btn-icon-left font-weight-normal text-capitalize"
                                            >
                                              <i className="far fa-thumbs-down" />
                                              Unhelpful (0)
                                            </a>
                                            <div className="review-image">
                                              <a href="#">
                                                <figure>
                                                  <img
                                                    src="assets/images/products/default/review-img-1.jpg"
                                                    width={60}
                                                    height={60}
                                                    alt="Attachment image of John Doe's review on Electronics Black Wrist Watch"
                                                    data-zoom-image="assets/images/products/default/review-img-1.jpg"
                                                  />
                                                </figure>
                                              </a>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </li>
                                    <li className="comment">
                                      <div className="comment-body">
                                        <figure className="comment-avatar">
                                          <img
                                            src="assets/images/agents/2-100x100.png"
                                            alt="Commenter Avatar"
                                            width={90}
                                            height={90}
                                          />
                                        </figure>
                                        <div className="comment-content">
                                          <h4 className="comment-author">
                                            <a href="#">John Doe</a>
                                            <span className="comment-date">
                                              March 22, 2021 at 1:52 pm
                                            </span>
                                          </h4>
                                          <div className="ratings-container comment-rating">
                                            <div className="ratings-full">
                                              <span
                                                className="ratings"
                                                style={{ width: "80%" }}
                                              />
                                              <span className="tooltiptext tooltip-top" />
                                            </div>
                                          </div>
                                          <p>
                                            Nullam a magna porttitor, dictum risus nec,
                                            faucibus sapien. Ultrices eros in cursus turpis
                                            massa tincidunt ante in nibh mauris cursus mattis.
                                            Cras ornare arcu dui vivamus arcu felis bibendum
                                            ut tristique.
                                          </p>
                                          <div className="comment-action">
                                            <a
                                              href="#"
                                              className="btn btn-secondary btn-link btn-underline sm btn-icon-left font-weight-normal text-capitalize"
                                            >
                                              <i className="far fa-thumbs-up" />
                                              Helpful (1)
                                            </a>
                                            <a
                                              href="#"
                                              className="btn btn-dark btn-link btn-underline sm btn-icon-left font-weight-normal text-capitalize"
                                            >
                                              <i className="far fa-thumbs-down" />
                                              Unhelpful (0)
                                            </a>
                                            <div className="review-image">
                                              <a href="#">
                                                <figure>
                                                  <img
                                                    src="assets/images/products/default/review-img-2.jpg"
                                                    width={60}
                                                    height={60}
                                                    alt="Attachment image of John Doe's review on Electronics Black Wrist Watch"
                                                    data-zoom-image="assets/images/products/default/review-img-2-800x900.jpg"
                                                  />
                                                </figure>
                                              </a>
                                              <a href="#">
                                                <figure>
                                                  <img
                                                    src="assets/images/products/default/review-img-3.jpg"
                                                    width={60}
                                                    height={60}
                                                    alt="Attachment image of John Doe's review on Electronics Black Wrist Watch"
                                                    data-zoom-image="assets/images/products/default/review-img-3-800x900.jpg"
                                                  />
                                                </figure>
                                              </a>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </li>
                                  </ul>
                                </div>
                                <div className="tab-pane" id="helpful-negative">
                                  <ul className="comments list-style-none">
                                    <li className="comment">
                                      <div className="comment-body">
                                        <figure className="comment-avatar">
                                          <img
                                            src="assets/images/agents/3-100x100.png"
                                            alt="Commenter Avatar"
                                            width={90}
                                            height={90}
                                          />
                                        </figure>
                                        <div className="comment-content">
                                          <h4 className="comment-author">
                                            <a href="#">John Doe</a>
                                            <span className="comment-date">
                                              March 22, 2021 at 1:21 pm
                                            </span>
                                          </h4>
                                          <div className="ratings-container comment-rating">
                                            <div className="ratings-full">
                                              <span
                                                className="ratings"
                                                style={{ width: "60%" }}
                                              />
                                              <span className="tooltiptext tooltip-top" />
                                            </div>
                                          </div>
                                          <p>
                                            In fermentum et sollicitudin ac orci phasellus. A
                                            condimentum vitae sapien pellentesque habitant
                                            morbi tristique senectus et. In dictum non
                                            consectetur a erat. Nunc scelerisque viverra
                                            mauris in aliquam sem fringilla.
                                          </p>
                                          <div className="comment-action">
                                            <a
                                              href="#"
                                              className="btn btn-secondary btn-link btn-underline sm btn-icon-left font-weight-normal text-capitalize"
                                            >
                                              <i className="far fa-thumbs-up" />
                                              Helpful (0)
                                            </a>
                                            <a
                                              href="#"
                                              className="btn btn-dark btn-link btn-underline sm btn-icon-left font-weight-normal text-capitalize"
                                            >
                                              <i className="far fa-thumbs-down" />
                                              Unhelpful (1)
                                            </a>
                                          </div>
                                        </div>
                                      </div>
                                    </li>
                                  </ul>
                                </div>
                                <div className="tab-pane" id="highest-rating">
                                  <ul className="comments list-style-none">
                                    <li className="comment">
                                      <div className="comment-body">
                                        <figure className="comment-avatar">
                                          <img
                                            src="assets/images/agents/2-100x100.png"
                                            alt="Commenter Avatar"
                                            width={90}
                                            height={90}
                                          />
                                        </figure>
                                        <div className="comment-content">
                                          <h4 className="comment-author">
                                            <a href="#">John Doe</a>
                                            <span className="comment-date">
                                              March 22, 2021 at 1:52 pm
                                            </span>
                                          </h4>
                                          <div className="ratings-container comment-rating">
                                            <div className="ratings-full">
                                              <span
                                                className="ratings"
                                                style={{ width: "80%" }}
                                              />
                                              <span className="tooltiptext tooltip-top" />
                                            </div>
                                          </div>
                                          <p>
                                            Nullam a magna porttitor, dictum risus nec,
                                            faucibus sapien. Ultrices eros in cursus turpis
                                            massa tincidunt ante in nibh mauris cursus mattis.
                                            Cras ornare arcu dui vivamus arcu felis bibendum
                                            ut tristique.
                                          </p>
                                          <div className="comment-action">
                                            <a
                                              href="#"
                                              className="btn btn-secondary btn-link btn-underline sm btn-icon-left font-weight-normal text-capitalize"
                                            >
                                              <i className="far fa-thumbs-up" />
                                              Helpful (1)
                                            </a>
                                            <a
                                              href="#"
                                              className="btn btn-dark btn-link btn-underline sm btn-icon-left font-weight-normal text-capitalize"
                                            >
                                              <i className="far fa-thumbs-down" />
                                              Unhelpful (0)
                                            </a>
                                            <div className="review-image">
                                              <a href="#">
                                                <figure>
                                                  <img
                                                    src="assets/images/products/default/review-img-2.jpg"
                                                    width={60}
                                                    height={60}
                                                    alt="Attachment image of John Doe's review on Electronics Black Wrist Watch"
                                                    data-zoom-image="assets/images/products/default/review-img-2-800x900.jpg"
                                                  />
                                                </figure>
                                              </a>
                                              <a href="#">
                                                <figure>
                                                  <img
                                                    src="assets/images/products/default/review-img-3.jpg"
                                                    width={60}
                                                    height={60}
                                                    alt="Attachment image of John Doe's review on Electronics Black Wrist Watch"
                                                    data-zoom-image="assets/images/products/default/review-img-3-800x900.jpg"
                                                  />
                                                </figure>
                                              </a>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </li>
                                  </ul>
                                </div>
                                <div className="tab-pane" id="lowest-rating">
                                  <ul className="comments list-style-none">
                                    <li className="comment">
                                      <div className="comment-body">
                                        <figure className="comment-avatar">
                                          <img
                                            src="assets/images/agents/1-100x100.png"
                                            alt="Commenter Avatar"
                                            width={90}
                                            height={90}
                                          />
                                        </figure>
                                        <div className="comment-content">
                                          <h4 className="comment-author">
                                            <a href="#">John Doe</a>
                                            <span className="comment-date">
                                              March 22, 2021 at 1:54 pm
                                            </span>
                                          </h4>
                                          <div className="ratings-container comment-rating">
                                            <div className="ratings-full">
                                              <span
                                                className="ratings"
                                                style={{ width: "60%" }}
                                              />
                                              <span className="tooltiptext tooltip-top" />
                                            </div>
                                          </div>
                                          <p>
                                            pellentesque habitant morbi tristique senectus et.
                                            In dictum non consectetur a erat. Nunc ultrices
                                            eros in cursus turpis massa tincidunt ante in nibh
                                            mauris cursus mattis. Cras ornare arcu dui vivamus
                                            arcu felis bibendum ut tristique.
                                          </p>
                                          <div className="comment-action">
                                            <a
                                              href="#"
                                              className="btn btn-secondary btn-link btn-underline sm btn-icon-left font-weight-normal text-capitalize"
                                            >
                                              <i className="far fa-thumbs-up" />
                                              Helpful (1)
                                            </a>
                                            <a
                                              href="#"
                                              className="btn btn-dark btn-link btn-underline sm btn-icon-left font-weight-normal text-capitalize"
                                            >
                                              <i className="far fa-thumbs-down" />
                                              Unhelpful (0)
                                            </a>
                                            <div className="review-image">
                                              <a href="#">
                                                <figure>
                                                  <img
                                                    src="assets/images/products/default/review-img-3.jpg"
                                                    width={60}
                                                    height={60}
                                                    alt="Attachment image of John Doe's review on Electronics Black Wrist Watch"
                                                    data-zoom-image="assets/images/products/default/review-img-3-800x900.jpg"
                                                  />
                                                </figure>
                                              </a>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                          </div>
                        </div>
                      </div>
                      {
                        productData?.products.length > 0 && 
                      <ProductCarousel products={ productData?.products} sectionTitle="Produits de substitutions"/>

                      }

                      
                      {/* <section className="vendor-product-section">
                        <div className="title-link-wrapper mb-4">
                          <h4 className="title text-left">More Products From This Vendor</h4>
                          <a
                            href="#"
                            className="btn btn-dark btn-link btn-slide-right btn-icon-right"
                          >
                            More Products
                            <i className="w-icon-long-arrow-right" />
                          </a>
                        </div>
                        <div
                          className="swiper-container swiper-theme"
                          data-swiper-options="{
                                            'spaceBetween': 20,
                                            'slidesPerView': 2,
                                            'breakpoints': {
                                                '576': {
                                                    'slidesPerView': 3
                                                },
                                                '768': {
                                                    'slidesPerView': 4
                                                },
                                                '992': {
                                                    'slidesPerView': 3
                                                }
                                            }
                                        }"
                        >
                          <div className="swiper-wrapper row cols-lg-3 cols-md-4 cols-sm-3 cols-2">
                            <div className="swiper-slide product">
                              <figure className="product-media">
                                <a href="product-default.html">
                                  <img
                                    src="assets/images/products/default/1-1.jpg"
                                    alt="Product"
                                    width={300}
                                    height={338}
                                  />
                                  <img
                                    src="assets/images/products/default/1-2.jpg"
                                    alt="Product"
                                    width={300}
                                    height={338}
                                  />
                                </a>
                                <div className="product-action-vertical">
                                  <a
                                    href="#"
                                    className="btn-product-icon btn-cart w-icon-cart"
                                    title="Add to cart"
                                  />
                                  <a
                                    href="#"
                                    className="btn-product-icon btn-wishlist w-icon-heart"
                                    title="Add to wishlist"
                                  />
                                  <a
                                    href="#"
                                    className="btn-product-icon btn-compare w-icon-compare"
                                    title="Add to Compare"
                                  />
                                </div>
                                <div className="product-action">
                                  <a
                                    href="#"
                                    className="btn-product btn-quickview"
                                    title="Quick View"
                                  >
                                    Quick View
                                  </a>
                                </div>
                              </figure>
                              <div className="product-details">
                                <div className="product-cat">
                                  <a href="shop-banner-sidebar.html">Accessories</a>
                                </div>
                                <h4 className="product-name">
                                  <a href="product-default.html">Sticky Pencil</a>
                                </h4>
                                <div className="ratings-container">
                                  <div className="ratings-full">
                                    <span className="ratings" style={{ width: "100%" }} />
                                    <span className="tooltiptext tooltip-top" />
                                  </div>
                                  <a href="product-default.html" className="rating-reviews">
                                    (3 reviews)
                                  </a>
                                </div>
                                <div className="product-pa-wrapper">
                                  <div className="product-price">$20.00</div>
                                </div>
                              </div>
                            </div>
                            <div className="swiper-slide product">
                              <figure className="product-media">
                                <a href="product-default.html">
                                  <img
                                    src="assets/images/products/default/2.jpg"
                                    alt="Product"
                                    width={300}
                                    height={338}
                                  />
                                </a>
                                <div className="product-action-vertical">
                                  <a
                                    href="#"
                                    className="btn-product-icon btn-cart w-icon-cart"
                                    title="Add to cart"
                                  />
                                  <a
                                    href="#"
                                    className="btn-product-icon btn-wishlist w-icon-heart"
                                    title="Add to wishlist"
                                  />
                                  <a
                                    href="#"
                                    className="btn-product-icon btn-compare w-icon-compare"
                                    title="Add to Compare"
                                  />
                                </div>
                                <div className="product-action">
                                  <a
                                    href="#"
                                    className="btn-product btn-quickview"
                                    title="Quick View"
                                  >
                                    Quick View
                                  </a>
                                </div>
                              </figure>
                              <div className="product-details">
                                <div className="product-cat">
                                  <a href="shop-banner-sidebar.html">Electronics</a>
                                </div>
                                <h4 className="product-name">
                                  <a href="product-default.html">
                                    Mini Multi-Functional Cooker
                                  </a>
                                </h4>
                                <div className="ratings-container">
                                  <div className="ratings-full">
                                    <span className="ratings" style={{ width: "80%" }} />
                                    <span className="tooltiptext tooltip-top" />
                                  </div>
                                  <a href="product-default.html" className="rating-reviews">
                                    (5 reviews)
                                  </a>
                                </div>
                                <div className="product-pa-wrapper">
                                  <div className="product-price">
                                    <ins className="new-price">$480.00</ins>
                                    <del className="old-price">$534.00</del>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="swiper-slide product">
                              <figure className="product-media">
                                <a href="product-default.html">
                                  <img
                                    src="assets/images/products/default/3.jpg"
                                    alt="Product"
                                    width={300}
                                    height={338}
                                  />
                                </a>
                                <div className="product-action-vertical">
                                  <a
                                    href="#"
                                    className="btn-product-icon btn-cart w-icon-cart"
                                    title="Add to cart"
                                  />
                                  <a
                                    href="#"
                                    className="btn-product-icon btn-wishlist w-icon-heart"
                                    title="Add to wishlist"
                                  />
                                  <a
                                    href="#"
                                    className="btn-product-icon btn-compare w-icon-compare"
                                    title="Add to Compare"
                                  />
                                </div>
                                <div className="product-action">
                                  <a
                                    href="#"
                                    className="btn-product btn-quickview"
                                    title="Quick View"
                                  >
                                    Quick View
                                  </a>
                                </div>
                              </figure>
                              <div className="product-details">
                                <div className="product-cat">
                                  <a href="shop-banner-sidebar.html">Sports</a>
                                </div>
                                <h4 className="product-name">
                                  <a href="product-default.html">Skate Pan</a>
                                </h4>
                                <div className="ratings-container">
                                  <div className="ratings-full">
                                    <span className="ratings" style={{ width: "100%" }} />
                                    <span className="tooltiptext tooltip-top" />
                                  </div>
                                  <a href="product-default.html" className="rating-reviews">
                                    (3 reviews)
                                  </a>
                                </div>
                                <div className="product-pa-wrapper">
                                  <div className="product-price">
                                    <ins className="new-price">$278.00</ins>
                                    <del className="old-price">$310.00</del>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="swiper-slide product">
                              <figure className="product-media">
                                <a href="product-default.html">
                                  <img
                                    src="assets/images/products/default/4-1.jpg"
                                    alt="Product"
                                    width={300}
                                    height={338}
                                  />
                                  <img
                                    src="assets/images/products/default/4-2.jpg"
                                    alt="Product"
                                    width={300}
                                    height={338}
                                  />
                                </a>
                                <div className="product-action-vertical">
                                  <a
                                    href="#"
                                    className="btn-product-icon btn-cart w-icon-cart"
                                    title="Add to cart"
                                  />
                                  <a
                                    href="#"
                                    className="btn-product-icon btn-wishlist w-icon-heart"
                                    title="Add to wishlist"
                                  />
                                  <a
                                    href="#"
                                    className="btn-product-icon btn-compare w-icon-compare"
                                    title="Add to Compare"
                                  />
                                </div>
                                <div className="product-action">
                                  <a
                                    href="#"
                                    className="btn-product btn-quickview"
                                    title="Quick View"
                                  >
                                    Quick View
                                  </a>
                                </div>
                              </figure>
                              <div className="product-details">
                                <div className="product-cat">
                                  <a href="shop-banner-sidebar.html">Accessories</a>
                                </div>
                                <h4 className="product-name">
                                  <a href="product-default.html">Clip Attachment</a>
                                </h4>
                                <div className="ratings-container">
                                  <div className="ratings-full">
                                    <span className="ratings" style={{ width: "100%" }} />
                                    <span className="tooltiptext tooltip-top" />
                                  </div>
                                  <a href="product-default.html" className="rating-reviews">
                                    (5 reviews)
                                  </a>
                                </div>
                                <div className="product-pa-wrapper">
                                  <div className="product-price">$40.00</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </section> */}
                      
                    </div>
                    {/* End of Main Content */}
                    {/* <ProductSideBar /> */}
                    {/* End of Sidebar */}
                  </div>
                )}
              </>
            ) : statusCode === 404 ? (
              <ErrorCard statusCode={404} imagePath={errorImageUrl.imagePath_404}
                message="Quelque chose s'est mal passé! Veuillez réessayer plus tard."
                buttonText="Retour à l'accueil" buttonLink="/"
              />
            ) :  (
              // Affichage d'un message d'erreur
              <ErrorCard statusCode={500} imagePath={errorImageUrl.imagePath_500}
                message="Quelque chose s'est mal passé! Veuillez réessayer plus tard."
                buttonText="Retour à l'accueil" buttonLink="/"
              />
            )}
            </div>
          </div>

          {/* End of Page Content */}
        </main>
      </div>
      {/* End of Page Wrapper */}
      {/* Start of Sticky Footer */}
      <div className="sticky-footer sticky-content fix-bottom">
        <a href="demo1.html" className="sticky-link active">
          <i className="w-icon-home" />
          <p>Home</p>
        </a>
        <a href="shop-banner-sidebar.html" className="sticky-link">
          <i className="w-icon-category" />
          <p>Shop</p>
        </a>
        <a href="my-account.html" className="sticky-link">
          <i className="w-icon-account" />
          <p>Account</p>
        </a>
        <div className="cart-dropdown dir-up">
          <a href="cart.html" className="sticky-link">
            <i className="w-icon-cart" />
            <p>Cart</p>
          </a>
          <div className="dropdown-box">
            <div className="products">
              <div className="product product-cart">
                <div className="product-detail">
                  <h3 className="product-name">
                    <a href="product-default.html">
                      Beige knitted elas
                      <br />
                      tic runner shoes
                    </a>
                  </h3>
                  <div className="price-box">
                    <span className="product-quantity">1</span>
                    <span className="product-price">$25.68</span>
                  </div>
                </div>
                <figure className="product-media">
                  <a href="#">
                    <img
                      src="assets/images/cart/product-1.jpg"
                      alt="product"
                      height={84}
                      width={94}
                    />
                  </a>
                </figure>
                <button className="btn btn-link btn-close" aria-label="button">
                  <i className="fas fa-times" />
                </button>
              </div>
              <div className="product product-cart">
                <div className="product-detail">
                  <h3 className="product-name">
                    <a href="https://www.portotheme.com/html/wolmart/product.html">
                      Blue utility pina
                      <br />
                      fore denim dress
                    </a>
                  </h3>
                  <div className="price-box">
                    <span className="product-quantity">1</span>
                    <span className="product-price">$32.99</span>
                  </div>
                </div>
                <figure className="product-media">
                  <a href="#">
                    <img
                      src="assets/images/cart/product-2.jpg"
                      alt="product"
                      width={84}
                      height={94}
                    />
                  </a>
                </figure>
                <button className="btn btn-link btn-close" aria-label="button">
                  <i className="fas fa-times" />
                </button>
              </div>
            </div>
            <div className="cart-total">
              <label>Subtotal:</label>
              <span className="price">$58.67</span>
            </div>
            <div className="cart-action">
              <a href="cart.html" className="btn btn-dark btn-outline btn-rounded">
                View Cart
              </a>
              <a href="checkout.html" className="btn btn-primary  btn-rounded">
                Checkout
              </a>
            </div>
          </div>
          {/* End of Dropdown Box */}
        </div>
        <div className="header-search hs-toggle dir-up">
          <a href="#" className="search-toggle sticky-link">
            <i className="w-icon-search" />
            <p>Search</p>
          </a>
          <form action="#" className="input-wrapper">
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
        </div>
      </div>
      {/* Start of Scroll Top */}
      <a
        id="scroll-top"
        className="scroll-top"
        href="#top"
        title="Top"
        role="button"
      >
        {" "}
        <i className="w-icon-angle-up" />{" "}
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 70">
          {" "}
          <circle
            id="progress-indicator"
            fill="transparent"
            stroke="#000000"
            strokeMiterlimit={10}
            cx={35}
            cy={35}
            r={34}
            style={{ strokeDasharray: "16.4198, 400" }}
          />{" "}
        </svg>{" "}
      </a>
      {/* Root element of PhotoSwipe. Must have class pswp */}
      <PhotoSwipe />
    </>
  );
};

export default DetailProduct;
