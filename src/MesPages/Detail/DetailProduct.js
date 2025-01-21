// src/components/Accueil.js
import React, { useState, useEffect } from "react"; // Importation de React et des hooks useState et useEffect
import AppMenu from "../../Mescomposants/AppMenu";
import ProductGallery from "../../Mescomposants/ProductGallery";
import PhotoSwipe from "../../Mescomposants/PhotoSwipe";

import { crudData } from "../../services/apiService"; // Importation de la fonction crudData
import ErrorCard from "../../Mescomposants/ErrorCard";
import ProductCarousel from "../Home/ProductCarousel";
import "react-toastify/dist/ReactToastify.css";
import { formatPrice } from "../Panier/Cart";
import { toast } from "react-toastify";
import useFetch from "../../hooks/useFetch";
import useRequest from "../../hooks/useRequest";

const DetailProduct = ({
    param = {},
    onSuccess,
    defaultImage,
    imageRuptureStock,
}) => {
    const errorImageUrl = JSON.parse(localStorage.getItem("errorImageUrl"));
    const paths = JSON.parse(localStorage.getItem("appPaths"));
    const urlBaseImage = localStorage.getItem("urlBaseImage");
    const date = JSON.parse(localStorage.getItem("appDate"));

    const [productData, setProductData] = useState(null);
    const [activeTab, setActiveTab] = useState("product-tab-specification");
    const [quantity, setQuantity] = useState(1); // Gestion de la quantité
    const [statusCode, setStatusCode] = useState(200); // Code statut HTTP
    const [isLoading, setIsLoading] = useState(false);

    const [addedProducts, setAddedProducts] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupContent, setPopupContent] = useState({});
    const [isLoadingSpinner, setIsLoadingSpinner] = useState(false);
    const [substitutionProducts, setSubstitutionProducts] = useState([]);
    const [gallery, setGallery] = useState(null);

    const { makeRequest } = useRequest();

    const formData = new FormData();
    formData.append("mode", param.mode.getProductMode);
    formData.append("LG_PROID", localStorage.getItem("selectedProductId"));
    formData.append("ON_FRONT", true);

    const { data, loading, error } = useFetch(
        "StockManager.php",
        { method: "POST" },
        formData
    );

    useEffect(() => {
        if (error != null) {
            if (error === "Network Error") {
                setStatusCode(404);
            } else {
                setStatusCode(500);
            }
        }
    }, [error]);

    useEffect(() => {
        if (data) {
            setProductData(data.products[0]);
            fetchSubstitutionProducts();
        }
    }, [data]);

    useEffect(() => {
        if (productData) {
            const fetchProductPictures = async () => {
                const formData = new FormData();
                formData.append("mode", param.mode.showAllProductImagesMode);
                formData.append(
                    "LG_PROID",
                    localStorage.getItem("selectedProductId")
                );
                try {
                    const response = await makeRequest(
                        "ConfigurationManager.php",
                        {
                            method: "POST",
                            data: formData,
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                        }
                    );

                    if (response && response.code_statut === "1") {
                        setGallery(response.data);
                    } else {
                        toast.error(response.desc_statut);
                    }
                } catch (error) {
                    console.log(error);
                }
            };

            fetchProductPictures();
        }
    }, [productData]);

    const fetchSubstitutionProducts = async () => {
        const formData = new FormData();
        formData.append("mode", param.mode.getSubstitutionProductsMode);
        formData.append("LG_PROID", localStorage.getItem("selectedProductId"));
        try {
            const response = await makeRequest("StockManager.php", {
                method: "POST",
                data: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response && response.products) {
                setSubstitutionProducts(response.products);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Fonction pour gérer l'incrémentation
    const handleIncrement = () => {
        setQuantity((prevQuantity) => parseInt(prevQuantity) + 1);
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
            alert(
                "Please select some product options before adding this product to your cart."
            );
            return;
        }

        if (quantity <= parseInt(productData.ArtStk) && quantity > 0) {
            // Simulate loading state
            setIsLoadingSpinner(true);

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
                LG_AGEID: param.userData.LG_AGEID,
                STR_COMMNAME: "",
                STR_COMMADRESSE: "Plateau, Pullman",
                STR_LIVADRESSE: "Zone 4, marcory",
                LG_PROID: productData.ArtID,
                STR_UTITOKEN: param.userData.STR_UTITOKEN,
                INT_CPRQUANTITY: quantity,
            };

            // Envoyer les données vers l'API
            crudData(payload, param.apiEndpointe.CommandeManagerEndPoint)
                .then((response) => {
                    if (response && response.status === 200) {
                        if (response.data.code_statut === "1") {
                            localStorage.setItem(
                                "LG_COMMID",
                                response.data.LG_COMMID
                            );
                            toast.success("Produit ajouté au panier"); // Notification de succès
                            onSuccess();
                        } else {
                            toast.error(
                                "Erreur : " + response.data.desc_statut
                            ); // Notification d'erreur
                        }
                    } else {
                        toast.error("Erreur survenu");
                    }
                })
                .catch((error) => {shop-content
                    console.error("Erreur lors de l'ajout au panier:", error);
                })
                .finally(() => {
                    setIsLoadingSpinner(false);
                });

            // Close popup after a delay
            setTimeout(() => {
                setIsPopupOpen(false);
            }, 3000);
        } else {
            toast.error("Stock insuffisante");
        }
    };

    // useEffect(() => {
    //     const currentProduct = JSON.parse(
    //         localStorage.getItem("selectedProductId")
    //     );

    //     let payload = null;

    //     if (param?.userData?.STR_UTITOKEN != null) {
    //         payload = {
    //             mode: param.mode.markProductAsViewedMode,
    //             LG_PROID: currentProduct,
    //             STR_UTITOKEN: param?.userData?.STR_UTITOKEN,
    //         };
    //     } else {
    //         payload = {
    //             mode: param.mode.markProductAsViewedMode,
    //             LG_PROID: currentProduct,
    //             STR_UTITOKEN: "1",
    //         };
    //     }

    //     crudData(payload, param.apiEndpointe.ConfigurationManagerEndPoint)
    //         .then((response) => {
    //             if (response && response.status === 200) {
    //                 if (response.data.code_statut !== "1") {
    //                     console.log("Erreur dans le marquage");
    //                 }
    //             } else {
    //                 toast.error("Erreur survenu");
    //             }
    //         })
    //         .catch((error) => {
    //             console.error("Erreur:", error);
    //         });
    // }, []);

    return (
        <>
            <div
                className={`page-wrapper ${
                    param.userData ? "bgUserConnected" : "bgUserDisConnected"
                }`}
            >
                <main className="main mb-0 pb-1">
                    <AppMenu />
                    <div className="page-content">
                        <div className="container">
                            {loading ? (
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
                                <>
                                    {productData && (
                                        <div className="row gutter-lg">
                                            <div className="main-content">
                                                <div className="product product-single row">
                                                    <ProductGallery
                                                        ArtStk={
                                                            productData.ArtStk
                                                        }
                                                        param={param}
                                                        imageRuptureStock={
                                                            imageRuptureStock
                                                        }
                                                        galerieImage={gallery}
                                                        defaultImage={
                                                            defaultImage
                                                        }
                                                    />
                                                    <div className="col-md-6 mb-6 mb-md-8 bg-white remove-padding">
                                                        <div
                                                            className="product-details important-padding"
                                                            data-sticky-options="{'minWidth': 767}"
                                                        >
                                                            <h1 className="product-title">
                                                                {
                                                                    productData.ArtLib
                                                                }
                                                            </h1>
                                                            <hr className="product-divider" />
                                                            {param.userData !=
                                                                null && (
                                                                <>
                                                                    {" "}
                                                                    <div className="product-price">
                                                                        {formatPrice(
                                                                            parseInt(
                                                                                productData?.ArtPrixBase
                                                                            )
                                                                        )}{" "}
                                                                        FCFA
                                                                    </div>{" "}
                                                                    <hr className="product-divider" />
                                                                </>
                                                            )}
                                                            {param.userData !=
                                                                null && (
                                                                <div className="fix-bottom product-sticky-content sticky-content">
                                                                    <div className="product-form container">
                                                                        <div className="product-qty-form mb-0 product-qty-form-updated">
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
                                                                                    max="100000"
                                                                                    onChange={(
                                                                                        e
                                                                                    ) =>
                                                                                        setQuantity(
                                                                                            e
                                                                                                .target
                                                                                                .value
                                                                                        )
                                                                                    } // Gestion du changement de quantité
                                                                                />
                                                                                <button
                                                                                    onClick={
                                                                                        handleIncrement
                                                                                    }
                                                                                    className="quantity-plus w-icon-plus"
                                                                                >
                                                                                    {/* Contenu du bouton */}
                                                                                </button>
                                                                                <button
                                                                                    onClick={
                                                                                        handleDecrement
                                                                                    }
                                                                                    className="quantity-minus w-icon-minus"
                                                                                >
                                                                                    {/* Contenu du bouton */}
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                        <button
                                                                            type="submit"
                                                                            className={`d-flex align-items-center btn ${
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
                                                                                Ajoutez
                                                                                au
                                                                                panier
                                                                            </span>
                                                                            {isLoadingSpinner && (
                                                                                <div class="loader ml-4"></div>
                                                                            )}
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            <div className="social-links-wrapper"></div>

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
                                                                </ul>
                                                                <div className="tab-content">
                                                                    <div
                                                                        className="tab-pane active pane-padding"
                                                                        id="product-tab-description"
                                                                    >
                                                                        <div className="row mb-4">
                                                                            <div className="col-md-12 mb-5">
                                                                                <p className="mb-4">
                                                                                    {
                                                                                        productData.CmtTxt
                                                                                    }
                                                                                </p>
                                                                            </div>
                                                                        </div>
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
                                                                        </div>
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
                                                        </div>
                                                    </div>
                                                </div>
                                                {substitutionProducts?.length >
                                                    0 && (
                                                    <ProductCarousel
                                                        products={
                                                            substitutionProducts
                                                        }
                                                        sectionTitle="Produits de substitutions"
                                                    />
                                                )}
                                            </div>
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

export default DetailProduct;
