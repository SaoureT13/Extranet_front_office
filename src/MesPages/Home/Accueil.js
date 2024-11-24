// src/components/Accueil.js
import React, { useState, useEffect, useContext } from "react";
import TopBar from "../../Mescomposants/Header/TopBar";
import AppMenu from "../../Mescomposants/AppMenu";
import MobileMenu from "../../Mescomposants/MobileMenu";
import Footer from "../../Mescomposants/Footer";
import ProductGallery from "../../Mescomposants/ProductGallery";
import ProductSideBar from "../../Mescomposants/ProductSideBar";
import PhotoSwipe from "../../Mescomposants/PhotoSwipe";

import { useNavigate } from "react-router-dom";
import { crudData } from "../../services/apiService"; // Importation de la fonction crudData
import { ToastContainer, toast } from "react-toastify";
import ErrorCard from "../../Mescomposants/ErrorCard";
import "react-toastify/dist/ReactToastify.css";

import ExtranetSlider from "../../Mescomposants/Slider/ExtranetSlider";
import SpecialPromoSlider from "../../Mescomposants/Slider/SpecialPromoSlider";
import ProductCarousel from "../../MesPages/Home/ProductCarousel";
import NewProduct from "../../MesPages/Home/NewProduct";

const Accueil = ({ param, defaultImage, onSuccess }) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const users = JSON.parse(localStorage.getItem("user"));
    const mode = JSON.parse(localStorage.getItem("appMode"));
    const apiEndpointe = JSON.parse(localStorage.getItem("apiEndpointe"));
    const errorImageUrl = JSON.parse(localStorage.getItem("errorImageUrl"));
    const paths = JSON.parse(localStorage.getItem("appPaths"));

    const urlBaseImage = localStorage.getItem("urlBaseImage");
    const date = JSON.parse(localStorage.getItem("appDate"));

    const navigate = useNavigate();
    const [productData, setProductData] = useState(null);
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState("product-tab-specification");
    const [quantity, setQuantity] = useState(1); // Gestion de la quantité
    const [statusCode, setStatusCode] = useState(null); // Code statut HTTP
    const [isLoading, setIsLoading] = useState(false);

    const [addedProducts, setAddedProducts] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupContent, setPopupContent] = useState({});
    const [products, setProducts] = useState([]);

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

    const fetchData = (params, url) => {
        setIsLoading(true); // Activez le statut de chargement avant la requête
        crudData(params, url)
            .then((response) => {
                setIsLoading(false); // Désactivez le statut de chargement une fois la réponse reçue
                if (response && response.status === 200) {
                    const produitVeto = response.data.products;
                    setProductData(produitVeto);
                    setStatusCode(response?.status);
                } else {
                    console.error("Erreur HTTP:", response);
                    setStatusCode(response?.status || "Unknown error");
                }
            })
            .catch((error) => {
                setIsLoading(false);
                if (error.response) {
                    setStatusCode(error.response.status);
                    console.error(
                        "Erreur de réponse serveur:",
                        error.response.status,
                        error.response.data
                    );
                } else if (error.request) {
                    setStatusCode(404);
                    console.error("Erreur de requête:", error.request);
                } else {
                    setStatusCode("Request setup error");
                    console.error("Erreur de configuration:", error.message);
                }
            });
    };

    const fetchProductsData = (params, url) => {
        setIsLoading(true); // Activez le statut de chargement avant la requête
        crudData(params, url)
            .then((response) => {
                setIsLoading(false); // Désactivez le statut de chargement une fois la réponse reçue
                if (response && response.status === 200) {
                    const produitVeto = response.data.products;
                    setProducts(produitVeto);
                    setStatusCode(response?.status);
                } else {
                    console.error("Erreur HTTP:", response);
                    setStatusCode(response?.status || "Unknown error");
                }
            })
            .catch((error) => {
                setIsLoading(false);
                if (error.response) {
                    setStatusCode(error.response.status);
                    console.error(
                        "Erreur de réponse serveur:",
                        error.response.status,
                        error.response.data
                    );
                } else if (error.request) {
                    setStatusCode(404);
                    console.error("Erreur de requête:", error.request);
                } else {
                    setStatusCode("Request setup error");
                    console.error("Erreur de configuration:", error.message);
                }
            });
    };
    
    useEffect(() => {
        const params = {
            mode: mode.listProductMode,
            LG_PROID: localStorage.getItem("selectedProductId"), // ID du produit à récupérer
        };
        fetchProductsData(params, apiEndpointe.StockManagerEndPoint);
    }, []);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const params = {
            mode: mode.getProductMode,
            LG_PROID: localStorage.getItem("selectedProductId"), // ID du produit à récupérer
        };

        fetchData(params, apiEndpointe.StockManagerEndPoint);
        if (!storedUser) {
            navigate(paths.signIn); // Redirection si l'utilisateur n'est pas connecté
        } else {
            setUser(storedUser);

            // const params = {
            //   mode: mode.getProductMode,
            //   LG_PROID: localStorage.getItem("selectedProductId"), // ID du produit à récupérer
            // };

            // fetchData(params, apiEndpointe.StockManagerEndPoint);
        }
    }, [navigate]);
   

    // if (!productData) {
    //   return <div>Chargement...</div>; // Affichage pendant le chargement
    // }

    // "ArtID": "1025",
    //           "ArtCode": "ABI101.",
    //           "ArtLib": "TRISULMYCINE 100 G",
    //           "ArtPrixBase": "2600.00",
    //           "ArtCodeBarre": "",
    //           "ArtVolume": "",
    //           "ArtGPicID": "-1",
    //           "ArtStk": "189.00",
    //           "ArtGTaxID": "-1",
    //           "ArtLongueur": "0",
    //           "ArtLargeur": "0",
    //           "ArtHauteur": "0",
    //           "ArtPoids": "",
    //           "ArtIsSleep": "-",
    //           "CmtTxt": "",
    //           "ArtLastPA": "2005.32",
    //           "ArtCategEnu": "ANTIBIOTIQUES",
    //           "ArtFamilleEnu": "ABI2",
    //           "ArtGammeEnu": "LAPROVET",
    //           "ARTFREE0": "701100",
    //           "ARTFREE1": "",
    //           "ARTFREE2": "AVIAIRE",
    //           "ARTFREE3": "LAPROVET",
    //           "ARTFREE4": "Standard",
    //           "ARTFREE5": "SACHET"

    // Fonction pour gérer l'incrémentation
    const handleIncrement = () => {
        setQuantity((prevQuantity) => prevQuantity + 1);
    };

    // Fonction pour gérer la décrémentation
    const handleDecrement = () => {
        setQuantity((prevQuantity) =>
            prevQuantity > 1 ? prevQuantity - 1 : 1
        );
    };
    console.log(param);

    return (
        <>
            <div
                className={`page-wrapper ${
                    param.userData ? "bgUserConnected" : "bgUserDisConnected"
                }`}
            >
                {/* <TopBar /> */}
                <main className="main mb-0 pb-1">
                    <AppMenu />
                    <div className="page-content">
                        <ExtranetSlider
                            ImagelBaseUrl={param.urlBaseImage}
                            defaultImage={defaultImage}
                        />

                        <div className="container mt-5">
                            <ProductCarousel
                                products={products}
                                sectionTitle="Nos produits"
                                imagelBaseUrl={param.urlBaseImage}
                            />

                            <SpecialPromoSlider ImagelBaseUrl={urlBaseImage} />

                            <NewProduct
                                products={products}
                                defaultImage={defaultImage}
                                param={param}
                                onSuccess={onSuccess}
                            />
                        </div>
                    </div>

                    {/* End of Page Content */}
                </main>
                {/* End of Main */}
                {/* Start of Footer */}
                {/* End of Footer */}
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
                                        <span className="product-quantity">
                                            1
                                        </span>
                                        <span className="product-price">
                                            $25.68
                                        </span>
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
                                <button
                                    className="btn btn-link btn-close"
                                    aria-label="button"
                                >
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
                                        <span className="product-quantity">
                                            1
                                        </span>
                                        <span className="product-price">
                                            $32.99
                                        </span>
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
                                <button
                                    className="btn btn-link btn-close"
                                    aria-label="button"
                                >
                                    <i className="fas fa-times" />
                                </button>
                            </div>
                        </div>
                        <div className="cart-total">
                            <label>Subtotal:</label>
                            <span className="price">$58.67</span>
                        </div>
                        <div className="cart-action">
                            <a
                                href="cart.html"
                                className="btn btn-dark btn-outline btn-rounded"
                            >
                                View Cart
                            </a>
                            <a
                                href="checkout.html"
                                className="btn btn-primary  btn-rounded"
                            >
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
                <svg
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 70 70"
                >
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

export default Accueil;
