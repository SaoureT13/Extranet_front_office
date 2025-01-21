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

    const [lastestProducts, setLatestProducts] = useState([]);
    const [products, setProducts] = useState({});

    const fetchData = (params, url, setter) => {
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

    const fetchProductsData = (params, url, setter) => {
        setIsLoading(true); // Activez le statut de chargement avant la requête
        crudData(params, url)
            .then((response) => {
                setIsLoading(false); // Désactivez le statut de chargement une fois la réponse reçue
                if (response && response.status === 200) {
                    const produitVeto = response.data.data;
                    setter(produitVeto);
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
        let params = {
            mode: mode.listLastestItemsMode,
            LIMIT: "25",
            PAGE: "1", // ID du produit à récupérer
        };
        fetchProductsData(
            params,
            apiEndpointe.StockManagerEndPoint,
            setLatestProducts
        );

        params = {
            mode: mode.getProductByCategoryMode,
        };
        fetchProductsData(
            params,
            apiEndpointe.StockManagerEndPoint,
            setProducts
        );
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
                                products={lastestProducts}
                                sectionTitle="Nouveautés"
                                imagelBaseUrl={param.urlBaseImage}
                            />

                            <SpecialPromoSlider ImagelBaseUrl={urlBaseImage} />

                            {products &&
                                Object.keys(products).length > 0 &&
                                Object.keys(products).map((key) => (
                                    <ProductCarousel
                                        key={key}
                                        products={products[key]}
                                        sectionTitle={key}
                                        imagelBaseUrl={param.urlBaseImage}
                                    />
                                ))}
                            {/* <NewProduct
                                products={products}
                                defaultImage={defaultImage}
                                param={param}
                                onSuccess={onSuccess}
                            /> */}
                        </div>
                    </div>

                    {/* End of Page Content */}
                </main>
            </div>
            {/* End of Page Wrapper */}
            {/* Start of Sticky Footer */}
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
