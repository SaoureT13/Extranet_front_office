// src/components/Accueil.js
import React, { useState, useEffect } from "react"; // Importation de React et des hooks useState et useEffect
import TopBar from "../../Mescomposants/TopBar";
import AppMenu from "../../Mescomposants/AppMenu";
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

const Accueil = () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
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
            .then((response) => {
                setIsLoading(false); // Désactivez le statut de chargement une fois la réponse reçue
                if (response && response.status === 200) {
                    const produitVeto = response.data.products;
                    setProductData(produitVeto[0]);
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
                    // alert('Erreur: ' + error.message);
                }
            });
    };

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

    const handleAddToCart = (product) => {
        // Check if the product requires options
        if (product.options && product.options.length > 0) {
            // alert("Please select some product options before adding this product to your cart.");
            return;
        }

        if (quantity <= parseInt(productData.ArtStk) && quantity > 0) {
            // Simulate loading state
            setTimeout(() => {
                // Update added products
                setAddedProducts([...addedProducts, product]);

                // Open popup with product details
                setPopupContent({
                    name: product.name,
                    imageSrc: product.imageSrc,
                    message: "has been added to cart.",
                });

                const payload = {
                    mode: mode.createCommproduittMode,
                    LG_AGEID: userData.LG_AGEID,
                    STR_COMMNAME: "",
                    STR_COMMADRESSE: "Plateau, Pullman",
                    STR_LIVADRESSE: "Zone 4, marcory",
                    LG_PROID: productData.ArtID,
                    STR_UTITOKEN: userData.STR_UTITOKEN,
                    INT_CPRQUANTITY: quantity,
                };

                // Envoyer les données vers l'API
                crudData(payload, apiEndpointe.CommandeManagerEndPoint)
                    .then((response) => {
                        if (response.data.code_statut === "1") {
                            setIsPopupOpen(true);
                            localStorage.setItem(
                                "LG_COMMID",
                                response.data.LG_COMMID
                            );
                            // toast.success(response.data.desc_statut);  // Notification de succès
                        } else if (response.data.code_statut === "0") {
                            // toast.error("Erreur : " + response.data.desc_statut);  // Notification d'erreur
                        }
                    })
                    .catch((error) => {
                        console.error(
                            "Erreur lors de l'ajout au panier:",
                            error
                        );
                    });

                // Close popup after a delay
                setTimeout(() => {
                    setIsPopupOpen(false);
                }, 3000);
            }, 500);
        } else {
            // toast.error("Stock insuffisante");
        }
    };

    // Fonction pour ajouter au panier
    const handleAddToCarts = () => {
        const productId = productData.LG_PROID; // Récupérer l'ID du produit

        if (quantity <= parseInt(productData.ArtStk)) {
            const payload = {
                mode: mode.createCommproduittMode,
                quantity: quantity,
                LG_AGEID: "1",
                STR_COMMNAME: "",
                STR_COMMADRESSE: "Plateau, Pullman",
                STR_LIVADRESSE: "Zone 4, marcory",
                LG_PROID: "productId",
                STR_UTITOKEN: "c4cd488e9ebde9552879",
                INT_CPRQUANTITY: quantity,
            };

            // Envoyer les données vers l'API
            crudData(payload, apiEndpointe.CommandeManagerEndPoint)
                .then((response) => {
                    if (response.data.code_statut === "1") {
                        toast.success(response.data.desc_statut); // Notification de succès
                    } else if (response.data.code_statut === "0") {
                        toast.error("Erreur : " + response.data.desc_statut); // Notification d'erreur
                    }
                })
                .catch((error) => {
                    console.error("Erreur lors de l'ajout au panier:", error);
                });
        } else {
            toast.error("Stock insuffisante");
        }
    };

    return (
        <>
            <div className="page-wrapper">
                {/* Start of Header */}
                <TopBar />
                {/* End of Header */}
                {/* Start of Main */}
                <main className="main mb-0 pb-1">
                    {/* Start of Breadcrumb */}
                    <AppMenu />
                    {/* End of Breadcrumb */}
                    <ExtranetSlider ImagelBaseUrl={urlBaseImage} />
                    {/* Start of Page Content */}
                    <div className="page-content">
                        <div className="container">
                            {/* Afficher le chargement si nécessaire */}
                            {isLoading ? (
                                <div className="text-center">
                                    <p>Chargement des produits...</p>
                                    <div
                                        className="spinner-border"
                                        role="status"
                                    >
                                        <span className="sr-only">
                                            Chargement...
                                        </span>
                                    </div>
                                </div>
                            ) : statusCode === 200 ? (
                                // Affichage des produits en cas de succès
                                <>
                                    {productData && (
                                        <div className="row gutter-lg">
                                            <div className="main-content">
                                                {isPopupOpen && (
                                                    <div className="alert alert-success alert-cart-product mb-2">
                                                        {" "}
                                                        <a
                                                            href="cart.html"
                                                            className="btn btn-success btn-rounded"
                                                        >
                                                            View Carts
                                                        </a>{" "}
                                                        <p className="mb-0 ls-normal">
                                                            “Fashion Table Sound
                                                            Marker” has been
                                                            added to your cart.
                                                        </p>{" "}
                                                        <a
                                                            href="#"
                                                            className="btn btn-link btn-close"
                                                            aria-label="button"
                                                        >
                                                            <i className="close-icon" />
                                                        </a>{" "}
                                                    </div>
                                                )}
                                                <div className="product product-single row">
                                                    {/* Popup for added products */}

                                                    <ProductGallery />

                                                    <div className="col-md-6 mb-6 mb-md-8">
                                                        <div
                                                            className="product-details"
                                                            data-sticky-options="{'minWidth': 767}"
                                                        >
                                                            <h1 className="product-title">
                                                                {
                                                                    productData.ArtLib
                                                                }
                                                            </h1>
                                                            <div className="product-bm-wrapper">
                                                                <figure className="brand">
                                                                    <img
                                                                        src="assets/images/products/brand/brand-6.jpg"
                                                                        alt="Brand"
                                                                        width={
                                                                            85
                                                                        }
                                                                        height={
                                                                            48
                                                                        }
                                                                    />
                                                                </figure>
                                                                <div className="product-meta">
                                                                    <div className="product-categories">
                                                                        Category:
                                                                        <span className="product-category">
                                                                            <a href="#">
                                                                                Electronics
                                                                            </a>
                                                                        </span>
                                                                    </div>
                                                                    <div className="product-sku">
                                                                        Stock:{" "}
                                                                        <span>
                                                                            {parseInt(
                                                                                productData.ArtStk
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <hr className="product-divider" />
                                                            <div className="product-price">
                                                                {parseInt(
                                                                    productData.ArtPrixBase
                                                                )}{" "}
                                                                FCFA
                                                            </div>
                                                            <div className="ratings-container">
                                                                <div className="ratings-full">
                                                                    <span
                                                                        className="ratings"
                                                                        style={{
                                                                            width: "80%",
                                                                        }}
                                                                    />
                                                                    <span className="tooltiptext tooltip-top" />
                                                                </div>
                                                                <a
                                                                    href="#product-tab-reviews"
                                                                    className="rating-reviews"
                                                                >
                                                                    (3 Reviews)
                                                                </a>
                                                            </div>
                                                            <div className="product-short-desc">
                                                                <ul className="list-type-check list-style-none">
                                                                    <li>
                                                                        Ultrices
                                                                        eros in
                                                                        cursus
                                                                        turpis
                                                                        massa
                                                                        cursus
                                                                        mattis.
                                                                    </li>
                                                                    <li>
                                                                        Volutpat
                                                                        ac
                                                                        tincidunt
                                                                        vitae
                                                                        semper
                                                                        quis
                                                                        lectus.
                                                                    </li>
                                                                    <li>
                                                                        Aliquam
                                                                        id diam
                                                                        maecenas
                                                                        ultricies
                                                                        mi eget
                                                                        mauris.
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                            <hr className="product-divider" />
                                                            <div className="product-form product-variation-form product-image-swatch">
                                                                <label>
                                                                    Color:
                                                                </label>
                                                                <div className="d-flex align-items-center product-variations">
                                                                    <a
                                                                        href="#"
                                                                        className="image"
                                                                    >
                                                                        <img
                                                                            src="assets/images/products/swatch/1-800x900.jpg"
                                                                            alt="Product Swatch"
                                                                            width={
                                                                                24
                                                                            }
                                                                            height={
                                                                                24
                                                                            }
                                                                        />
                                                                    </a>
                                                                    <a
                                                                        href="#"
                                                                        className="image"
                                                                    >
                                                                        <img
                                                                            src="assets/images/products/swatch/7-800x900.jpg"
                                                                            alt="Product Swatch"
                                                                            width={
                                                                                24
                                                                            }
                                                                            height={
                                                                                24
                                                                            }
                                                                        />
                                                                    </a>
                                                                    <a
                                                                        href="#"
                                                                        className="image"
                                                                    >
                                                                        <img
                                                                            src="assets/images/products/swatch/8-800x900.jpg"
                                                                            alt="Product Swatch"
                                                                            width={
                                                                                24
                                                                            }
                                                                            height={
                                                                                24
                                                                            }
                                                                        />
                                                                    </a>
                                                                    <a
                                                                        href="#"
                                                                        className="image"
                                                                    >
                                                                        <img
                                                                            src="assets/images/products/swatch/14-800x900.jpg"
                                                                            alt="Product Swatch"
                                                                            width={
                                                                                24
                                                                            }
                                                                            height={
                                                                                24
                                                                            }
                                                                        />
                                                                    </a>
                                                                </div>
                                                            </div>
                                                            <div className="product-form product-variation-form product-size-swatch">
                                                                <label className="mb-1">
                                                                    Size:
                                                                </label>
                                                                <div className="flex-wrap d-flex align-items-center product-variations">
                                                                    <a
                                                                        href="#"
                                                                        className="size"
                                                                    >
                                                                        Small
                                                                    </a>
                                                                    <a
                                                                        href="#"
                                                                        className="size"
                                                                    >
                                                                        Medium
                                                                    </a>
                                                                    <a
                                                                        href="#"
                                                                        className="size"
                                                                    >
                                                                        Large
                                                                    </a>
                                                                    <a
                                                                        href="#"
                                                                        className="size"
                                                                    >
                                                                        Extra
                                                                        Large
                                                                    </a>
                                                                </div>
                                                                <a
                                                                    href="#"
                                                                    className="product-variation-clean"
                                                                >
                                                                    Clean All
                                                                </a>
                                                            </div>
                                                            <div className="product-variation-price">
                                                                <span />
                                                            </div>
                                                            <div className="fix-bottom product-sticky-content sticky-content">
                                                                <div className="product-form container">
                                                                    <div className="product-qty-form mb-0">
                                                                        <div className="input-group">
                                                                            <input
                                                                                className="quantity form-control"
                                                                                type="number"
                                                                                min={
                                                                                    1
                                                                                }
                                                                                value={
                                                                                    quantity
                                                                                }
                                                                                max={
                                                                                    10000000
                                                                                }
                                                                            />
                                                                            <button
                                                                                onClick={
                                                                                    handleIncrement
                                                                                }
                                                                                className="quantity-plus w-icon-plus"
                                                                            />
                                                                            <button
                                                                                onClick={
                                                                                    handleDecrement
                                                                                }
                                                                                className="quantity-minus w-icon-minus"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <button
                                                                        type="submit"
                                                                        className={`btn ${
                                                                            parseInt(
                                                                                productData.ArtStk
                                                                            ) >
                                                                            0
                                                                                ? "btn-primary"
                                                                                : "btn-cart disabled"
                                                                        }`}
                                                                        onClick={
                                                                            handleAddToCart
                                                                        }
                                                                    >
                                                                        <i className="w-icon-cart mr-2" />
                                                                        <span>
                                                                            J'achète
                                                                        </span>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <div className="social-links-wrapper">
                                                                <div className="social-links">
                                                                    <div className="social-icons social-no-color border-thin">
                                                                        <a
                                                                            href="#"
                                                                            className="social-icon social-facebook w-icon-facebook"
                                                                        />
                                                                        <a
                                                                            href="#"
                                                                            className="social-icon social-twitter w-icon-twitter"
                                                                        />
                                                                        <a
                                                                            href="#"
                                                                            className="social-icon social-pinterest fab fa-pinterest-p"
                                                                        />
                                                                        <a
                                                                            href="#"
                                                                            className="social-icon social-whatsapp fab fa-whatsapp"
                                                                        />
                                                                        <a
                                                                            href="#"
                                                                            className="social-icon social-youtube fab fa-linkedin-in"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <span className="divider d-xs-show" />
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
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="tab tab-nav-boxed tab-nav-underline product-tabs">
                                                    <ul
                                                        className="nav nav-tabs"
                                                        role="tablist"
                                                    >
                                                        <li className="nav-item">
                                                            <a
                                                                href="#product-tab-description"
                                                                className="nav-link active"
                                                            >
                                                                Description
                                                            </a>
                                                        </li>
                                                        <li className="nav-item">
                                                            <a
                                                                href="#product-tab-specification"
                                                                className="nav-link"
                                                            >
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
                                                        <div
                                                            className="tab-pane active"
                                                            id="product-tab-description"
                                                        >
                                                            <div className="row mb-4">
                                                                <div className="col-md-6 mb-5">
                                                                    <h4 className="title tab-pane-title font-weight-bold mb-2">
                                                                        Detail
                                                                    </h4>
                                                                    <p className="mb-4">
                                                                        Lorem
                                                                        ipsum
                                                                        dolor
                                                                        sit
                                                                        amet,
                                                                        consectetur
                                                                        adipiscing
                                                                        elit,
                                                                        sed do
                                                                        eiusmod
                                                                        tempor
                                                                        incididunt
                                                                        arcu
                                                                        cursus
                                                                        vitae
                                                                        congue
                                                                        mauris.
                                                                        Sagittis
                                                                        id
                                                                        consectetur
                                                                        purus
                                                                        ut.
                                                                        Tellus
                                                                        rutrum
                                                                        tellus
                                                                        pelle
                                                                        Vel
                                                                        pretium
                                                                        lectus
                                                                        quam id
                                                                        leo in
                                                                        vitae
                                                                        turpis
                                                                        massa.
                                                                    </p>
                                                                    <ul className="list-type-check">
                                                                        <li>
                                                                            Nunc
                                                                            nec
                                                                            porttitor
                                                                            turpis.
                                                                            In
                                                                            eu
                                                                            risus
                                                                            enim.
                                                                            In
                                                                            vitae
                                                                            mollis
                                                                            elit.
                                                                        </li>
                                                                        <li>
                                                                            Vivamus
                                                                            finibus
                                                                            vel
                                                                            mauris
                                                                            ut
                                                                            vehicula.
                                                                        </li>
                                                                        <li>
                                                                            Nullam
                                                                            a
                                                                            magna
                                                                            porttitor,
                                                                            dictum
                                                                            risus
                                                                            nec,
                                                                            faucibus
                                                                            sapien.
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                                <div className="col-md-6 mb-5">
                                                                    <div className="banner banner-video product-video br-xs">
                                                                        <figure className="banner-media">
                                                                            <a href="#">
                                                                                <img
                                                                                    src="assets/images/products/video-banner-610x300.jpg"
                                                                                    alt="banner"
                                                                                    width={
                                                                                        610
                                                                                    }
                                                                                    height={
                                                                                        300
                                                                                    }
                                                                                    style={{
                                                                                        backgroundColor:
                                                                                            "#bebebe",
                                                                                    }}
                                                                                />
                                                                            </a>
                                                                            <a
                                                                                className="btn-play-video btn-iframe"
                                                                                href="assets/video/memory-of-a-woman.mp4"
                                                                            />
                                                                        </figure>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="row cols-md-3">
                                                                <div className="mb-3">
                                                                    <h5 className="sub-title font-weight-bold">
                                                                        <span className="mr-3">
                                                                            1.
                                                                        </span>
                                                                        Free
                                                                        Shipping
                                                                        &amp;
                                                                        Return
                                                                    </h5>
                                                                    <p className="detail pl-5">
                                                                        We offer
                                                                        free
                                                                        shipping
                                                                        for
                                                                        products
                                                                        on
                                                                        orders
                                                                        above
                                                                        50$ and
                                                                        offer
                                                                        free
                                                                        delivery
                                                                        for all
                                                                        orders
                                                                        in US.
                                                                    </p>
                                                                </div>
                                                                <div className="mb-3">
                                                                    <h5 className="sub-title font-weight-bold">
                                                                        <span>
                                                                            2.
                                                                        </span>
                                                                        Free and
                                                                        Easy
                                                                        Returns
                                                                    </h5>
                                                                    <p className="detail pl-5">
                                                                        We
                                                                        guarantee
                                                                        our
                                                                        products
                                                                        and you
                                                                        could
                                                                        get back
                                                                        all of
                                                                        your
                                                                        money
                                                                        anytime
                                                                        you want
                                                                        in 30
                                                                        days.
                                                                    </p>
                                                                </div>
                                                                <div className="mb-3">
                                                                    <h5 className="sub-title font-weight-bold">
                                                                        <span>
                                                                            3.
                                                                        </span>
                                                                        Special
                                                                        Financing
                                                                    </h5>
                                                                    <p className="detail pl-5">
                                                                        Get
                                                                        20%-50%
                                                                        off
                                                                        items
                                                                        over 50$
                                                                        for a
                                                                        month or
                                                                        over
                                                                        250$ for
                                                                        a year
                                                                        with our
                                                                        special
                                                                        credit
                                                                        card.
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="tab-pane"
                                                            id="product-tab-specification"
                                                        >
                                                            <ul className="list-none">
                                                                <li>
                                                                    <label>
                                                                        Model
                                                                    </label>
                                                                    <p>
                                                                        Skysuite
                                                                        320
                                                                    </p>
                                                                </li>
                                                                <li>
                                                                    <label>
                                                                        Color
                                                                    </label>
                                                                    <p>Black</p>
                                                                </li>
                                                                <li>
                                                                    <label>
                                                                        Size
                                                                    </label>
                                                                    <p>
                                                                        Large,
                                                                        Small
                                                                    </p>
                                                                </li>
                                                                <li>
                                                                    <label>
                                                                        Guarantee
                                                                        Time
                                                                    </label>
                                                                    <p>
                                                                        3 Months
                                                                    </p>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                        <div
                                                            className="tab-pane"
                                                            id="product-tab-vendor"
                                                        >
                                                            <div className="row mb-3">
                                                                <div className="col-md-6 mb-4">
                                                                    <figure className="vendor-banner br-sm">
                                                                        <img
                                                                            src="assets/images/products/vendor-banner.jpg"
                                                                            alt="Vendor Banner"
                                                                            width={
                                                                                610
                                                                            }
                                                                            height={
                                                                                295
                                                                            }
                                                                            style={{
                                                                                backgroundColor:
                                                                                    "#353B55",
                                                                            }}
                                                                        />
                                                                    </figure>
                                                                </div>
                                                                <div className="col-md-6 pl-2 pl-md-6 mb-4">
                                                                    <div className="vendor-user">
                                                                        <figure className="vendor-logo mr-4">
                                                                            <a href="#">
                                                                                <img
                                                                                    src="assets/images/products/vendor-logo.jpg"
                                                                                    alt="Vendor Logo"
                                                                                    width={
                                                                                        80
                                                                                    }
                                                                                    height={
                                                                                        80
                                                                                    }
                                                                                />
                                                                            </a>
                                                                        </figure>
                                                                        <div>
                                                                            <div className="vendor-name">
                                                                                <a href="#">
                                                                                    Jone
                                                                                    Doe
                                                                                </a>
                                                                            </div>
                                                                            <div className="ratings-container">
                                                                                <div className="ratings-full">
                                                                                    <span
                                                                                        className="ratings"
                                                                                        style={{
                                                                                            width: "90%",
                                                                                        }}
                                                                                    />
                                                                                    <span className="tooltiptext tooltip-top" />
                                                                                </div>
                                                                                <a
                                                                                    href="#"
                                                                                    className="rating-reviews"
                                                                                >
                                                                                    (32
                                                                                    Reviews)
                                                                                </a>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <ul className="vendor-info list-style-none">
                                                                        <li className="store-name">
                                                                            <label>
                                                                                Store
                                                                                Name:
                                                                            </label>
                                                                            <span className="detail">
                                                                                OAIO
                                                                                Store
                                                                            </span>
                                                                        </li>
                                                                        <li className="store-address">
                                                                            <label>
                                                                                Address:
                                                                            </label>
                                                                            <span className="detail">
                                                                                Steven
                                                                                Street,
                                                                                El
                                                                                Carjon,
                                                                                CA
                                                                                92020,
                                                                                United
                                                                                States
                                                                                (US)
                                                                            </span>
                                                                        </li>
                                                                        <li className="store-phone">
                                                                            <label>
                                                                                Phone:
                                                                            </label>
                                                                            <a href="#tel:">
                                                                                1234567890
                                                                            </a>
                                                                        </li>
                                                                    </ul>
                                                                    <a
                                                                        href="vendor-dokan-store.html"
                                                                        className="btn btn-dark btn-link btn-underline btn-icon-right"
                                                                    >
                                                                        Visit
                                                                        Store
                                                                        <i className="w-icon-long-arrow-right" />
                                                                    </a>
                                                                </div>
                                                            </div>
                                                            <p className="mb-5">
                                                                <strong className="text-dark">
                                                                    L
                                                                </strong>
                                                                orem ipsum dolor
                                                                sit amet,
                                                                consectetur
                                                                adipiscing elit,
                                                                sed do eiusmod
                                                                tempor
                                                                incididunt ut
                                                                labore et dolore
                                                                magna aliqua.
                                                                Venenatis tellus
                                                                in metus
                                                                vulputate eu
                                                                scelerisque
                                                                felis. Vel
                                                                pretium lectus
                                                                quam id leo in
                                                                vitae turpis
                                                                massa. Nunc id
                                                                cursus metus
                                                                aliquam. Libero
                                                                id faucibus nisl
                                                                tincidunt eget.
                                                                Aliquam id diam
                                                                maecenas
                                                                ultricies mi
                                                                eget mauris.
                                                                Volutpat ac
                                                                tincidunt vitae
                                                                semper quis
                                                                lectus.
                                                                Vestibulum
                                                                mattis
                                                                ullamcorper
                                                                velit sed. A
                                                                arcu cursus
                                                                vitae congue
                                                                mauris.
                                                            </p>
                                                            <p className="mb-2">
                                                                <strong className="text-dark">
                                                                    A
                                                                </strong>{" "}
                                                                arcu cursus
                                                                vitae congue
                                                                mauris. Sagittis
                                                                id consectetur
                                                                purus ut. Tellus
                                                                rutrum tellus
                                                                pellentesque eu
                                                                tincidunt tortor
                                                                aliquam nulla.
                                                                Diam in arcu
                                                                cursus euismod
                                                                quis. Eget sit
                                                                amet tellus cras
                                                                adipiscing enim
                                                                eu. In fermentum
                                                                et sollicitudin
                                                                ac orci
                                                                phasellus. A
                                                                condimentum
                                                                vitae sapien
                                                                pellentesque
                                                                habitant morbi
                                                                tristique
                                                                senectus et. In
                                                                dictum non
                                                                consectetur a
                                                                erat. Nunc
                                                                scelerisque
                                                                viverra mauris
                                                                in aliquam sem
                                                                fringilla.
                                                            </p>
                                                        </div>
                                                        <div
                                                            className="tab-pane"
                                                            id="product-tab-reviews"
                                                        >
                                                            <div className="row mb-4">
                                                                <div className="col-xl-4 col-lg-5 mb-4">
                                                                    <div className="ratings-wrapper">
                                                                        <div className="avg-rating-container">
                                                                            <h4 className="avg-mark font-weight-bolder ls-50">
                                                                                3.3
                                                                            </h4>
                                                                            <div className="avg-rating">
                                                                                <p className="text-dark mb-1">
                                                                                    Average
                                                                                    Rating
                                                                                </p>
                                                                                <div className="ratings-container">
                                                                                    <div className="ratings-full">
                                                                                        <span
                                                                                            className="ratings"
                                                                                            style={{
                                                                                                width: "60%",
                                                                                            }}
                                                                                        />
                                                                                        <span className="tooltiptext tooltip-top" />
                                                                                    </div>
                                                                                    <a
                                                                                        href="#"
                                                                                        className="rating-reviews"
                                                                                    >
                                                                                        (3
                                                                                        Reviews)
                                                                                    </a>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="ratings-value d-flex align-items-center text-dark ls-25">
                                                                            <span className="text-dark font-weight-bold">
                                                                                66.7%
                                                                            </span>
                                                                            Recommended
                                                                            <span className="count">
                                                                                (2
                                                                                of
                                                                                3)
                                                                            </span>
                                                                        </div>
                                                                        <div className="ratings-list">
                                                                            <div className="ratings-container">
                                                                                <div className="ratings-full">
                                                                                    <span
                                                                                        className="ratings"
                                                                                        style={{
                                                                                            width: "100%",
                                                                                        }}
                                                                                    />
                                                                                    <span className="tooltiptext tooltip-top" />
                                                                                </div>
                                                                                <div className="progress-bar progress-bar-sm ">
                                                                                    <span />
                                                                                </div>
                                                                                <div className="progress-value">
                                                                                    <mark>
                                                                                        70%
                                                                                    </mark>
                                                                                </div>
                                                                            </div>
                                                                            <div className="ratings-container">
                                                                                <div className="ratings-full">
                                                                                    <span
                                                                                        className="ratings"
                                                                                        style={{
                                                                                            width: "80%",
                                                                                        }}
                                                                                    />
                                                                                    <span className="tooltiptext tooltip-top" />
                                                                                </div>
                                                                                <div className="progress-bar progress-bar-sm ">
                                                                                    <span />
                                                                                </div>
                                                                                <div className="progress-value">
                                                                                    <mark>
                                                                                        30%
                                                                                    </mark>
                                                                                </div>
                                                                            </div>
                                                                            <div className="ratings-container">
                                                                                <div className="ratings-full">
                                                                                    <span
                                                                                        className="ratings"
                                                                                        style={{
                                                                                            width: "60%",
                                                                                        }}
                                                                                    />
                                                                                    <span className="tooltiptext tooltip-top" />
                                                                                </div>
                                                                                <div className="progress-bar progress-bar-sm ">
                                                                                    <span />
                                                                                </div>
                                                                                <div className="progress-value">
                                                                                    <mark>
                                                                                        40%
                                                                                    </mark>
                                                                                </div>
                                                                            </div>
                                                                            <div className="ratings-container">
                                                                                <div className="ratings-full">
                                                                                    <span
                                                                                        className="ratings"
                                                                                        style={{
                                                                                            width: "40%",
                                                                                        }}
                                                                                    />
                                                                                    <span className="tooltiptext tooltip-top" />
                                                                                </div>
                                                                                <div className="progress-bar progress-bar-sm ">
                                                                                    <span />
                                                                                </div>
                                                                                <div className="progress-value">
                                                                                    <mark>
                                                                                        0%
                                                                                    </mark>
                                                                                </div>
                                                                            </div>
                                                                            <div className="ratings-container">
                                                                                <div className="ratings-full">
                                                                                    <span
                                                                                        className="ratings"
                                                                                        style={{
                                                                                            width: "20%",
                                                                                        }}
                                                                                    />
                                                                                    <span className="tooltiptext tooltip-top" />
                                                                                </div>
                                                                                <div className="progress-bar progress-bar-sm ">
                                                                                    <span />
                                                                                </div>
                                                                                <div className="progress-value">
                                                                                    <mark>
                                                                                        0%
                                                                                    </mark>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-xl-8 col-lg-7 mb-4">
                                                                    <div className="review-form-wrapper">
                                                                        <h3 className="title tab-pane-title font-weight-bold mb-1">
                                                                            Submit
                                                                            Your
                                                                            Review
                                                                        </h3>
                                                                        <p className="mb-3">
                                                                            Your
                                                                            email
                                                                            address
                                                                            will
                                                                            not
                                                                            be
                                                                            published.
                                                                            Required
                                                                            fields
                                                                            are
                                                                            marked
                                                                            *
                                                                        </p>
                                                                        <form
                                                                            action="#"
                                                                            method="POST"
                                                                            className="review-form"
                                                                        >
                                                                            <div className="rating-form">
                                                                                <label htmlFor="rating">
                                                                                    Your
                                                                                    Rating
                                                                                    Of
                                                                                    This
                                                                                    Product
                                                                                    :
                                                                                </label>
                                                                                <span className="rating-stars">
                                                                                    <a
                                                                                        className="star-1"
                                                                                        href="#"
                                                                                    >
                                                                                        1
                                                                                    </a>
                                                                                    <a
                                                                                        className="star-2"
                                                                                        href="#"
                                                                                    >
                                                                                        2
                                                                                    </a>
                                                                                    <a
                                                                                        className="star-3"
                                                                                        href="#"
                                                                                    >
                                                                                        3
                                                                                    </a>
                                                                                    <a
                                                                                        className="star-4"
                                                                                        href="#"
                                                                                    >
                                                                                        4
                                                                                    </a>
                                                                                    <a
                                                                                        className="star-5"
                                                                                        href="#"
                                                                                    >
                                                                                        5
                                                                                    </a>
                                                                                </span>
                                                                                <select
                                                                                    name="rating"
                                                                                    id="rating"
                                                                                    required=""
                                                                                    style={{
                                                                                        display:
                                                                                            "none",
                                                                                    }}
                                                                                >
                                                                                    <option value="">
                                                                                        Rate…
                                                                                    </option>
                                                                                    <option
                                                                                        value={
                                                                                            5
                                                                                        }
                                                                                    >
                                                                                        Perfect
                                                                                    </option>
                                                                                    <option
                                                                                        value={
                                                                                            4
                                                                                        }
                                                                                    >
                                                                                        Good
                                                                                    </option>
                                                                                    <option
                                                                                        value={
                                                                                            3
                                                                                        }
                                                                                    >
                                                                                        Average
                                                                                    </option>
                                                                                    <option
                                                                                        value={
                                                                                            2
                                                                                        }
                                                                                    >
                                                                                        Not
                                                                                        that
                                                                                        bad
                                                                                    </option>
                                                                                    <option
                                                                                        value={
                                                                                            1
                                                                                        }
                                                                                    >
                                                                                        Very
                                                                                        poor
                                                                                    </option>
                                                                                </select>
                                                                            </div>
                                                                            <textarea
                                                                                cols={
                                                                                    30
                                                                                }
                                                                                rows={
                                                                                    6
                                                                                }
                                                                                placeholder="Write Your Review Here..."
                                                                                className="form-control"
                                                                                id="review"
                                                                                defaultValue={
                                                                                    ""
                                                                                }
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
                                                                                    Save
                                                                                    my
                                                                                    name,
                                                                                    email,
                                                                                    and
                                                                                    website
                                                                                    in
                                                                                    this
                                                                                    browser
                                                                                    for
                                                                                    the
                                                                                    next
                                                                                    time
                                                                                    I
                                                                                    comment.
                                                                                </label>
                                                                            </div>
                                                                            <button
                                                                                type="submit"
                                                                                className="btn btn-dark"
                                                                            >
                                                                                Submit
                                                                                Review
                                                                            </button>
                                                                        </form>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="tab tab-nav-boxed tab-nav-outline tab-nav-center">
                                                                <ul
                                                                    className="nav nav-tabs"
                                                                    role="tablist"
                                                                >
                                                                    <li className="nav-item">
                                                                        <a
                                                                            href="#show-all"
                                                                            className="nav-link active"
                                                                        >
                                                                            Show
                                                                            All
                                                                        </a>
                                                                    </li>
                                                                    <li className="nav-item">
                                                                        <a
                                                                            href="#helpful-positive"
                                                                            className="nav-link"
                                                                        >
                                                                            Most
                                                                            Helpful
                                                                            Positive
                                                                        </a>
                                                                    </li>
                                                                    <li className="nav-item">
                                                                        <a
                                                                            href="#helpful-negative"
                                                                            className="nav-link"
                                                                        >
                                                                            Most
                                                                            Helpful
                                                                            Negative
                                                                        </a>
                                                                    </li>
                                                                    <li className="nav-item">
                                                                        <a
                                                                            href="#highest-rating"
                                                                            className="nav-link"
                                                                        >
                                                                            Highest
                                                                            Rating
                                                                        </a>
                                                                    </li>
                                                                    <li className="nav-item">
                                                                        <a
                                                                            href="#lowest-rating"
                                                                            className="nav-link"
                                                                        >
                                                                            Lowest
                                                                            Rating
                                                                        </a>
                                                                    </li>
                                                                </ul>
                                                                <div className="tab-content">
                                                                    <div
                                                                        className="tab-pane active"
                                                                        id="show-all"
                                                                    >
                                                                        <ul className="comments list-style-none">
                                                                            <li className="comment">
                                                                                <div className="comment-body">
                                                                                    <figure className="comment-avatar">
                                                                                        <img
                                                                                            src="assets/images/agents/1-100x100.png"
                                                                                            alt="Commenter Avatar"
                                                                                            width={
                                                                                                90
                                                                                            }
                                                                                            height={
                                                                                                90
                                                                                            }
                                                                                        />
                                                                                    </figure>
                                                                                    <div className="comment-content">
                                                                                        <h4 className="comment-author">
                                                                                            <a href="#">
                                                                                                John
                                                                                                Doe
                                                                                            </a>
                                                                                            <span className="comment-date">
                                                                                                March
                                                                                                22,
                                                                                                2021
                                                                                                at
                                                                                                1:54
                                                                                                pm
                                                                                            </span>
                                                                                        </h4>
                                                                                        <div className="ratings-container comment-rating">
                                                                                            <div className="ratings-full">
                                                                                                <span
                                                                                                    className="ratings"
                                                                                                    style={{
                                                                                                        width: "60%",
                                                                                                    }}
                                                                                                />
                                                                                                <span className="tooltiptext tooltip-top" />
                                                                                            </div>
                                                                                        </div>
                                                                                        <p>
                                                                                            pellentesque
                                                                                            habitant
                                                                                            morbi
                                                                                            tristique
                                                                                            senectus
                                                                                            et.
                                                                                            In
                                                                                            dictum
                                                                                            non
                                                                                            consectetur
                                                                                            a
                                                                                            erat.
                                                                                            Nunc
                                                                                            ultrices
                                                                                            eros
                                                                                            in
                                                                                            cursus
                                                                                            turpis
                                                                                            massa
                                                                                            tincidunt
                                                                                            ante
                                                                                            in
                                                                                            nibh
                                                                                            mauris
                                                                                            cursus
                                                                                            mattis.
                                                                                            Cras
                                                                                            ornare
                                                                                            arcu
                                                                                            dui
                                                                                            vivamus
                                                                                            arcu
                                                                                            felis
                                                                                            bibendum
                                                                                            ut
                                                                                            tristique.
                                                                                        </p>
                                                                                        <div className="comment-action">
                                                                                            <a
                                                                                                href="#"
                                                                                                className="btn btn-secondary btn-link btn-underline sm btn-icon-left font-weight-normal text-capitalize"
                                                                                            >
                                                                                                <i className="far fa-thumbs-up" />
                                                                                                Helpful
                                                                                                (1)
                                                                                            </a>
                                                                                            <a
                                                                                                href="#"
                                                                                                className="btn btn-dark btn-link btn-underline sm btn-icon-left font-weight-normal text-capitalize"
                                                                                            >
                                                                                                <i className="far fa-thumbs-down" />
                                                                                                Unhelpful
                                                                                                (0)
                                                                                            </a>
                                                                                            <div className="review-image">
                                                                                                <a href="#">
                                                                                                    <figure>
                                                                                                        <img
                                                                                                            src="assets/images/products/default/review-img-1.jpg"
                                                                                                            width={
                                                                                                                60
                                                                                                            }
                                                                                                            height={
                                                                                                                60
                                                                                                            }
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
                                                                                            width={
                                                                                                90
                                                                                            }
                                                                                            height={
                                                                                                90
                                                                                            }
                                                                                        />
                                                                                    </figure>
                                                                                    <div className="comment-content">
                                                                                        <h4 className="comment-author">
                                                                                            <a href="#">
                                                                                                John
                                                                                                Doe
                                                                                            </a>
                                                                                            <span className="comment-date">
                                                                                                March
                                                                                                22,
                                                                                                2021
                                                                                                at
                                                                                                1:52
                                                                                                pm
                                                                                            </span>
                                                                                        </h4>
                                                                                        <div className="ratings-container comment-rating">
                                                                                            <div className="ratings-full">
                                                                                                <span
                                                                                                    className="ratings"
                                                                                                    style={{
                                                                                                        width: "80%",
                                                                                                    }}
                                                                                                />
                                                                                                <span className="tooltiptext tooltip-top" />
                                                                                            </div>
                                                                                        </div>
                                                                                        <p>
                                                                                            Nullam
                                                                                            a
                                                                                            magna
                                                                                            porttitor,
                                                                                            dictum
                                                                                            risus
                                                                                            nec,
                                                                                            faucibus
                                                                                            sapien.
                                                                                            Ultrices
                                                                                            eros
                                                                                            in
                                                                                            cursus
                                                                                            turpis
                                                                                            massa
                                                                                            tincidunt
                                                                                            ante
                                                                                            in
                                                                                            nibh
                                                                                            mauris
                                                                                            cursus
                                                                                            mattis.
                                                                                            Cras
                                                                                            ornare
                                                                                            arcu
                                                                                            dui
                                                                                            vivamus
                                                                                            arcu
                                                                                            felis
                                                                                            bibendum
                                                                                            ut
                                                                                            tristique.
                                                                                        </p>
                                                                                        <div className="comment-action">
                                                                                            <a
                                                                                                href="#"
                                                                                                className="btn btn-secondary btn-link btn-underline sm btn-icon-left font-weight-normal text-capitalize"
                                                                                            >
                                                                                                <i className="far fa-thumbs-up" />
                                                                                                Helpful
                                                                                                (1)
                                                                                            </a>
                                                                                            <a
                                                                                                href="#"
                                                                                                className="btn btn-dark btn-link btn-underline sm btn-icon-left font-weight-normal text-capitalize"
                                                                                            >
                                                                                                <i className="far fa-thumbs-down" />
                                                                                                Unhelpful
                                                                                                (0)
                                                                                            </a>
                                                                                            <div className="review-image">
                                                                                                <a href="#">
                                                                                                    <figure>
                                                                                                        <img
                                                                                                            src="assets/images/products/default/review-img-2.jpg"
                                                                                                            width={
                                                                                                                60
                                                                                                            }
                                                                                                            height={
                                                                                                                60
                                                                                                            }
                                                                                                            alt="Attachment image of John Doe's review on Electronics Black Wrist Watch"
                                                                                                            data-zoom-image="assets/images/products/default/review-img-2.jpg"
                                                                                                        />
                                                                                                    </figure>
                                                                                                </a>
                                                                                                <a href="#">
                                                                                                    <figure>
                                                                                                        <img
                                                                                                            src="assets/images/products/default/review-img-3.jpg"
                                                                                                            width={
                                                                                                                60
                                                                                                            }
                                                                                                            height={
                                                                                                                60
                                                                                                            }
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
                                                                                            width={
                                                                                                90
                                                                                            }
                                                                                            height={
                                                                                                90
                                                                                            }
                                                                                        />
                                                                                    </figure>
                                                                                    <div className="comment-content">
                                                                                        <h4 className="comment-author">
                                                                                            <a href="#">
                                                                                                John
                                                                                                Doe
                                                                                            </a>
                                                                                            <span className="comment-date">
                                                                                                March
                                                                                                22,
                                                                                                2021
                                                                                                at
                                                                                                1:21
                                                                                                pm
                                                                                            </span>
                                                                                        </h4>
                                                                                        <div className="ratings-container comment-rating">
                                                                                            <div className="ratings-full">
                                                                                                <span
                                                                                                    className="ratings"
                                                                                                    style={{
                                                                                                        width: "60%",
                                                                                                    }}
                                                                                                />
                                                                                                <span className="tooltiptext tooltip-top" />
                                                                                            </div>
                                                                                        </div>
                                                                                        <p>
                                                                                            In
                                                                                            fermentum
                                                                                            et
                                                                                            sollicitudin
                                                                                            ac
                                                                                            orci
                                                                                            phasellus.
                                                                                            A
                                                                                            condimentum
                                                                                            vitae
                                                                                            sapien
                                                                                            pellentesque
                                                                                            habitant
                                                                                            morbi
                                                                                            tristique
                                                                                            senectus
                                                                                            et.
                                                                                            In
                                                                                            dictum
                                                                                            non
                                                                                            consectetur
                                                                                            a
                                                                                            erat.
                                                                                            Nunc
                                                                                            scelerisque
                                                                                            viverra
                                                                                            mauris
                                                                                            in
                                                                                            aliquam
                                                                                            sem
                                                                                            fringilla.
                                                                                        </p>
                                                                                        <div className="comment-action">
                                                                                            <a
                                                                                                href="#"
                                                                                                className="btn btn-secondary btn-link btn-underline sm btn-icon-left font-weight-normal text-capitalize"
                                                                                            >
                                                                                                <i className="far fa-thumbs-up" />
                                                                                                Helpful
                                                                                                (0)
                                                                                            </a>
                                                                                            <a
                                                                                                href="#"
                                                                                                className="btn btn-dark btn-link btn-underline sm btn-icon-left font-weight-normal text-capitalize"
                                                                                            >
                                                                                                <i className="far fa-thumbs-down" />
                                                                                                Unhelpful
                                                                                                (1)
                                                                                            </a>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                    <div
                                                                        className="tab-pane"
                                                                        id="helpful-positive"
                                                                    >
                                                                        <ul className="comments list-style-none">
                                                                            <li className="comment">
                                                                                <div className="comment-body">
                                                                                    <figure className="comment-avatar">
                                                                                        <img
                                                                                            src="assets/images/agents/1-100x100.png"
                                                                                            alt="Commenter Avatar"
                                                                                            width={
                                                                                                90
                                                                                            }
                                                                                            height={
                                                                                                90
                                                                                            }
                                                                                        />
                                                                                    </figure>
                                                                                    <div className="comment-content">
                                                                                        <h4 className="comment-author">
                                                                                            <a href="#">
                                                                                                John
                                                                                                Doe
                                                                                            </a>
                                                                                            <span className="comment-date">
                                                                                                March
                                                                                                22,
                                                                                                2021
                                                                                                at
                                                                                                1:54
                                                                                                pm
                                                                                            </span>
                                                                                        </h4>
                                                                                        <div className="ratings-container comment-rating">
                                                                                            <div className="ratings-full">
                                                                                                <span
                                                                                                    className="ratings"
                                                                                                    style={{
                                                                                                        width: "60%",
                                                                                                    }}
                                                                                                />
                                                                                                <span className="tooltiptext tooltip-top" />
                                                                                            </div>
                                                                                        </div>
                                                                                        <p>
                                                                                            pellentesque
                                                                                            habitant
                                                                                            morbi
                                                                                            tristique
                                                                                            senectus
                                                                                            et.
                                                                                            In
                                                                                            dictum
                                                                                            non
                                                                                            consectetur
                                                                                            a
                                                                                            erat.
                                                                                            Nunc
                                                                                            ultrices
                                                                                            eros
                                                                                            in
                                                                                            cursus
                                                                                            turpis
                                                                                            massa
                                                                                            tincidunt
                                                                                            ante
                                                                                            in
                                                                                            nibh
                                                                                            mauris
                                                                                            cursus
                                                                                            mattis.
                                                                                            Cras
                                                                                            ornare
                                                                                            arcu
                                                                                            dui
                                                                                            vivamus
                                                                                            arcu
                                                                                            felis
                                                                                            bibendum
                                                                                            ut
                                                                                            tristique.
                                                                                        </p>
                                                                                        <div className="comment-action">
                                                                                            <a
                                                                                                href="#"
                                                                                                className="btn btn-secondary btn-link btn-underline sm btn-icon-left font-weight-normal text-capitalize"
                                                                                            >
                                                                                                <i className="far fa-thumbs-up" />
                                                                                                Helpful
                                                                                                (1)
                                                                                            </a>
                                                                                            <a
                                                                                                href="#"
                                                                                                className="btn btn-dark btn-link btn-underline sm btn-icon-left font-weight-normal text-capitalize"
                                                                                            >
                                                                                                <i className="far fa-thumbs-down" />
                                                                                                Unhelpful
                                                                                                (0)
                                                                                            </a>
                                                                                            <div className="review-image">
                                                                                                <a href="#">
                                                                                                    <figure>
                                                                                                        <img
                                                                                                            src="assets/images/products/default/review-img-1.jpg"
                                                                                                            width={
                                                                                                                60
                                                                                                            }
                                                                                                            height={
                                                                                                                60
                                                                                                            }
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
                                                                                            width={
                                                                                                90
                                                                                            }
                                                                                            height={
                                                                                                90
                                                                                            }
                                                                                        />
                                                                                    </figure>
                                                                                    <div className="comment-content">
                                                                                        <h4 className="comment-author">
                                                                                            <a href="#">
                                                                                                John
                                                                                                Doe
                                                                                            </a>
                                                                                            <span className="comment-date">
                                                                                                March
                                                                                                22,
                                                                                                2021
                                                                                                at
                                                                                                1:52
                                                                                                pm
                                                                                            </span>
                                                                                        </h4>
                                                                                        <div className="ratings-container comment-rating">
                                                                                            <div className="ratings-full">
                                                                                                <span
                                                                                                    className="ratings"
                                                                                                    style={{
                                                                                                        width: "80%",
                                                                                                    }}
                                                                                                />
                                                                                                <span className="tooltiptext tooltip-top" />
                                                                                            </div>
                                                                                        </div>
                                                                                        <p>
                                                                                            Nullam
                                                                                            a
                                                                                            magna
                                                                                            porttitor,
                                                                                            dictum
                                                                                            risus
                                                                                            nec,
                                                                                            faucibus
                                                                                            sapien.
                                                                                            Ultrices
                                                                                            eros
                                                                                            in
                                                                                            cursus
                                                                                            turpis
                                                                                            massa
                                                                                            tincidunt
                                                                                            ante
                                                                                            in
                                                                                            nibh
                                                                                            mauris
                                                                                            cursus
                                                                                            mattis.
                                                                                            Cras
                                                                                            ornare
                                                                                            arcu
                                                                                            dui
                                                                                            vivamus
                                                                                            arcu
                                                                                            felis
                                                                                            bibendum
                                                                                            ut
                                                                                            tristique.
                                                                                        </p>
                                                                                        <div className="comment-action">
                                                                                            <a
                                                                                                href="#"
                                                                                                className="btn btn-secondary btn-link btn-underline sm btn-icon-left font-weight-normal text-capitalize"
                                                                                            >
                                                                                                <i className="far fa-thumbs-up" />
                                                                                                Helpful
                                                                                                (1)
                                                                                            </a>
                                                                                            <a
                                                                                                href="#"
                                                                                                className="btn btn-dark btn-link btn-underline sm btn-icon-left font-weight-normal text-capitalize"
                                                                                            >
                                                                                                <i className="far fa-thumbs-down" />
                                                                                                Unhelpful
                                                                                                (0)
                                                                                            </a>
                                                                                            <div className="review-image">
                                                                                                <a href="#">
                                                                                                    <figure>
                                                                                                        <img
                                                                                                            src="assets/images/products/default/review-img-2.jpg"
                                                                                                            width={
                                                                                                                60
                                                                                                            }
                                                                                                            height={
                                                                                                                60
                                                                                                            }
                                                                                                            alt="Attachment image of John Doe's review on Electronics Black Wrist Watch"
                                                                                                            data-zoom-image="assets/images/products/default/review-img-2-800x900.jpg"
                                                                                                        />
                                                                                                    </figure>
                                                                                                </a>
                                                                                                <a href="#">
                                                                                                    <figure>
                                                                                                        <img
                                                                                                            src="assets/images/products/default/review-img-3.jpg"
                                                                                                            width={
                                                                                                                60
                                                                                                            }
                                                                                                            height={
                                                                                                                60
                                                                                                            }
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
                                                                    <div
                                                                        className="tab-pane"
                                                                        id="helpful-negative"
                                                                    >
                                                                        <ul className="comments list-style-none">
                                                                            <li className="comment">
                                                                                <div className="comment-body">
                                                                                    <figure className="comment-avatar">
                                                                                        <img
                                                                                            src="assets/images/agents/3-100x100.png"
                                                                                            alt="Commenter Avatar"
                                                                                            width={
                                                                                                90
                                                                                            }
                                                                                            height={
                                                                                                90
                                                                                            }
                                                                                        />
                                                                                    </figure>
                                                                                    <div className="comment-content">
                                                                                        <h4 className="comment-author">
                                                                                            <a href="#">
                                                                                                John
                                                                                                Doe
                                                                                            </a>
                                                                                            <span className="comment-date">
                                                                                                March
                                                                                                22,
                                                                                                2021
                                                                                                at
                                                                                                1:21
                                                                                                pm
                                                                                            </span>
                                                                                        </h4>
                                                                                        <div className="ratings-container comment-rating">
                                                                                            <div className="ratings-full">
                                                                                                <span
                                                                                                    className="ratings"
                                                                                                    style={{
                                                                                                        width: "60%",
                                                                                                    }}
                                                                                                />
                                                                                                <span className="tooltiptext tooltip-top" />
                                                                                            </div>
                                                                                        </div>
                                                                                        <p>
                                                                                            In
                                                                                            fermentum
                                                                                            et
                                                                                            sollicitudin
                                                                                            ac
                                                                                            orci
                                                                                            phasellus.
                                                                                            A
                                                                                            condimentum
                                                                                            vitae
                                                                                            sapien
                                                                                            pellentesque
                                                                                            habitant
                                                                                            morbi
                                                                                            tristique
                                                                                            senectus
                                                                                            et.
                                                                                            In
                                                                                            dictum
                                                                                            non
                                                                                            consectetur
                                                                                            a
                                                                                            erat.
                                                                                            Nunc
                                                                                            scelerisque
                                                                                            viverra
                                                                                            mauris
                                                                                            in
                                                                                            aliquam
                                                                                            sem
                                                                                            fringilla.
                                                                                        </p>
                                                                                        <div className="comment-action">
                                                                                            <a
                                                                                                href="#"
                                                                                                className="btn btn-secondary btn-link btn-underline sm btn-icon-left font-weight-normal text-capitalize"
                                                                                            >
                                                                                                <i className="far fa-thumbs-up" />
                                                                                                Helpful
                                                                                                (0)
                                                                                            </a>
                                                                                            <a
                                                                                                href="#"
                                                                                                className="btn btn-dark btn-link btn-underline sm btn-icon-left font-weight-normal text-capitalize"
                                                                                            >
                                                                                                <i className="far fa-thumbs-down" />
                                                                                                Unhelpful
                                                                                                (1)
                                                                                            </a>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                    <div
                                                                        className="tab-pane"
                                                                        id="highest-rating"
                                                                    >
                                                                        <ul className="comments list-style-none">
                                                                            <li className="comment">
                                                                                <div className="comment-body">
                                                                                    <figure className="comment-avatar">
                                                                                        <img
                                                                                            src="assets/images/agents/2-100x100.png"
                                                                                            alt="Commenter Avatar"
                                                                                            width={
                                                                                                90
                                                                                            }
                                                                                            height={
                                                                                                90
                                                                                            }
                                                                                        />
                                                                                    </figure>
                                                                                    <div className="comment-content">
                                                                                        <h4 className="comment-author">
                                                                                            <a href="#">
                                                                                                John
                                                                                                Doe
                                                                                            </a>
                                                                                            <span className="comment-date">
                                                                                                March
                                                                                                22,
                                                                                                2021
                                                                                                at
                                                                                                1:52
                                                                                                pm
                                                                                            </span>
                                                                                        </h4>
                                                                                        <div className="ratings-container comment-rating">
                                                                                            <div className="ratings-full">
                                                                                                <span
                                                                                                    className="ratings"
                                                                                                    style={{
                                                                                                        width: "80%",
                                                                                                    }}
                                                                                                />
                                                                                                <span className="tooltiptext tooltip-top" />
                                                                                            </div>
                                                                                        </div>
                                                                                        <p>
                                                                                            Nullam
                                                                                            a
                                                                                            magna
                                                                                            porttitor,
                                                                                            dictum
                                                                                            risus
                                                                                            nec,
                                                                                            faucibus
                                                                                            sapien.
                                                                                            Ultrices
                                                                                            eros
                                                                                            in
                                                                                            cursus
                                                                                            turpis
                                                                                            massa
                                                                                            tincidunt
                                                                                            ante
                                                                                            in
                                                                                            nibh
                                                                                            mauris
                                                                                            cursus
                                                                                            mattis.
                                                                                            Cras
                                                                                            ornare
                                                                                            arcu
                                                                                            dui
                                                                                            vivamus
                                                                                            arcu
                                                                                            felis
                                                                                            bibendum
                                                                                            ut
                                                                                            tristique.
                                                                                        </p>
                                                                                        <div className="comment-action">
                                                                                            <a
                                                                                                href="#"
                                                                                                className="btn btn-secondary btn-link btn-underline sm btn-icon-left font-weight-normal text-capitalize"
                                                                                            >
                                                                                                <i className="far fa-thumbs-up" />
                                                                                                Helpful
                                                                                                (1)
                                                                                            </a>
                                                                                            <a
                                                                                                href="#"
                                                                                                className="btn btn-dark btn-link btn-underline sm btn-icon-left font-weight-normal text-capitalize"
                                                                                            >
                                                                                                <i className="far fa-thumbs-down" />
                                                                                                Unhelpful
                                                                                                (0)
                                                                                            </a>
                                                                                            <div className="review-image">
                                                                                                <a href="#">
                                                                                                    <figure>
                                                                                                        <img
                                                                                                            src="assets/images/products/default/review-img-2.jpg"
                                                                                                            width={
                                                                                                                60
                                                                                                            }
                                                                                                            height={
                                                                                                                60
                                                                                                            }
                                                                                                            alt="Attachment image of John Doe's review on Electronics Black Wrist Watch"
                                                                                                            data-zoom-image="assets/images/products/default/review-img-2-800x900.jpg"
                                                                                                        />
                                                                                                    </figure>
                                                                                                </a>
                                                                                                <a href="#">
                                                                                                    <figure>
                                                                                                        <img
                                                                                                            src="assets/images/products/default/review-img-3.jpg"
                                                                                                            width={
                                                                                                                60
                                                                                                            }
                                                                                                            height={
                                                                                                                60
                                                                                                            }
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
                                                                    <div
                                                                        className="tab-pane"
                                                                        id="lowest-rating"
                                                                    >
                                                                        <ul className="comments list-style-none">
                                                                            <li className="comment">
                                                                                <div className="comment-body">
                                                                                    <figure className="comment-avatar">
                                                                                        <img
                                                                                            src="assets/images/agents/1-100x100.png"
                                                                                            alt="Commenter Avatar"
                                                                                            width={
                                                                                                90
                                                                                            }
                                                                                            height={
                                                                                                90
                                                                                            }
                                                                                        />
                                                                                    </figure>
                                                                                    <div className="comment-content">
                                                                                        <h4 className="comment-author">
                                                                                            <a href="#">
                                                                                                John
                                                                                                Doe
                                                                                            </a>
                                                                                            <span className="comment-date">
                                                                                                March
                                                                                                22,
                                                                                                2021
                                                                                                at
                                                                                                1:54
                                                                                                pm
                                                                                            </span>
                                                                                        </h4>
                                                                                        <div className="ratings-container comment-rating">
                                                                                            <div className="ratings-full">
                                                                                                <span
                                                                                                    className="ratings"
                                                                                                    style={{
                                                                                                        width: "60%",
                                                                                                    }}
                                                                                                />
                                                                                                <span className="tooltiptext tooltip-top" />
                                                                                            </div>
                                                                                        </div>
                                                                                        <p>
                                                                                            pellentesque
                                                                                            habitant
                                                                                            morbi
                                                                                            tristique
                                                                                            senectus
                                                                                            et.
                                                                                            In
                                                                                            dictum
                                                                                            non
                                                                                            consectetur
                                                                                            a
                                                                                            erat.
                                                                                            Nunc
                                                                                            ultrices
                                                                                            eros
                                                                                            in
                                                                                            cursus
                                                                                            turpis
                                                                                            massa
                                                                                            tincidunt
                                                                                            ante
                                                                                            in
                                                                                            nibh
                                                                                            mauris
                                                                                            cursus
                                                                                            mattis.
                                                                                            Cras
                                                                                            ornare
                                                                                            arcu
                                                                                            dui
                                                                                            vivamus
                                                                                            arcu
                                                                                            felis
                                                                                            bibendum
                                                                                            ut
                                                                                            tristique.
                                                                                        </p>
                                                                                        <div className="comment-action">
                                                                                            <a
                                                                                                href="#"
                                                                                                className="btn btn-secondary btn-link btn-underline sm btn-icon-left font-weight-normal text-capitalize"
                                                                                            >
                                                                                                <i className="far fa-thumbs-up" />
                                                                                                Helpful
                                                                                                (1)
                                                                                            </a>
                                                                                            <a
                                                                                                href="#"
                                                                                                className="btn btn-dark btn-link btn-underline sm btn-icon-left font-weight-normal text-capitalize"
                                                                                            >
                                                                                                <i className="far fa-thumbs-down" />
                                                                                                Unhelpful
                                                                                                (0)
                                                                                            </a>
                                                                                            <div className="review-image">
                                                                                                <a href="#">
                                                                                                    <figure>
                                                                                                        <img
                                                                                                            src="assets/images/products/default/review-img-3.jpg"
                                                                                                            width={
                                                                                                                60
                                                                                                            }
                                                                                                            height={
                                                                                                                60
                                                                                                            }
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
                                            <ProductSideBar />
                                            {/* End of Sidebar */}
                                        </div>
                                    )}
                                </>
                            ) : statusCode === 404 ? (
                                <ErrorCard
                                    statusCode={404}
                                    imagePath={errorImageUrl.imagePath_404}
                                    message="Quelque chose s'est mal passé! Veuillez réessayer plus tard."
                                    buttonText="Retour à l'accueil"
                                    buttonLink="/"
                                />
                            ) : (
                                // Affichage d'un message d'erreur
                                <ErrorCard
                                    statusCode={500}
                                    imagePath={errorImageUrl.imagePath_500}
                                    message="Quelque chose s'est mal passé! Veuillez réessayer plus tard."
                                    buttonText="Retour à l'accueil"
                                    buttonLink="/"
                                />
                            )}
                        </div>
                    </div>

                    {/* End of Page Content */}
                </main>
                {/* End of Main */}
                {/* Start of Footer */}
                <Footer />
                {/* End of Footer */}
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
