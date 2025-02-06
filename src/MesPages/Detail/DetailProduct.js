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
import { HighlightText } from "../../services/lib";

const DetailProduct = ({
    param = {},
    onSuccess,
    defaultImage,
    imageRuptureStock,
}) => {
    const errorImageUrl = JSON.parse(localStorage.getItem("errorImageUrl"));

    const [productData, setProductData] = useState(null);
    const [quantity, setQuantity] = useState(1); // Gestion de la quantité
    const [statusCode, setStatusCode] = useState(200); // Code statut HTTP

    const [addedProducts, setAddedProducts] = useState([]);
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
                    toast.error(error);
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
                            // toast.success("Produit ajouté au panier"); // Notification de succès
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
                .catch((error) => {
                    console.error("Erreur lors de l'ajout au panier:", error);
                })
                .finally(() => {
                    setIsLoadingSpinner(false);
                });
        } else {
            toast.error("Stock insuffisante");
        }
    };

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth", // Optionnel : pour un défilement en douceur
        });
    }, []);

    useEffect(() => {
        const currentProduct = JSON.parse(
            localStorage.getItem("selectedProductId")
        );

        let payload = null;

        if (param?.userData?.STR_UTITOKEN != null) {
            payload = {
                mode: param.mode.markProductAsViewedMode,
                LG_PROID: currentProduct,
                STR_UTITOKEN: param?.userData?.STR_UTITOKEN,
            };
        } else {
            payload = {
                mode: param.mode.markProductAsViewedMode,
                LG_PROID: currentProduct,
                STR_UTITOKEN: "1",
            };
        }

        crudData(payload, param.apiEndpointe.ConfigurationManagerEndPoint)
            .then((response) => {
                if (response && response.status === 200) {
                    if (response.data.code_statut !== "1") {
                        console.log("Erreur dans le marquage");
                    }
                } else {
                    toast.error("Erreur survenu");
                }
            })
            .catch((error) => {
                toast.error("Erreur:", error);
            });
    }, []);

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
                            {
                                // loading ? (
                                //     <div className="text-center">
                                //         <p>Chargement des produits...</p>
                                //         <div
                                //             className="spinner-border"
                                //             role="status"
                                //         >
                                //             <span className="sr-only">
                                //                 Chargement...
                                //             </span>
                                //         </div>
                                //     </div>
                                // ) :
                                statusCode === 200 ? (
                                    <>
                                        {/* {productData && ( */}
                                        <div className="row gutter-lg">
                                            <div className="main-content">
                                                <div className="product product-single row">
                                                    <ProductGallery
                                                        ArtStk={
                                                            productData &&
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
                                                                {productData &&
                                                                    productData.ArtLib}
                                                            </h1>
                                                            <div
                                                                className="product-subtitle"
                                                                style={{
                                                                    fontSize:
                                                                        "2rem",
                                                                }}
                                                            >
                                                                {productData &&
                                                                    productData?.ArtCode}
                                                            </div>{" "}
                                                            <hr className="product-divider" />
                                                            {param.userData !=
                                                                null && (
                                                                <>
                                                                    {" "}
                                                                    <div className="product-price">
                                                                        {productData &&
                                                                            formatPrice(
                                                                                parseInt(
                                                                                    productData?.ArtPrixBase
                                                                                )
                                                                            ) +
                                                                                " FCFA"}
                                                                    </div>{" "}
                                                                    <hr className="product-divider" />
                                                                </>
                                                            )}
                                                            {param.userData !=
                                                                null && (
                                                                <div className="fix-bottom product-sticky-content sticky-content">
                                                                    <div
                                                                        className="product-form container"
                                                                        style={{
                                                                            gap: "8px",
                                                                        }}
                                                                    >
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
                                                                                productData &&
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
                                                                                Ajouter
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
                                                                                <p className="mb-4 ">
                                                                                    {productData &&
                                                                                        productData.CmtTxt &&
                                                                                        productData.CmtTxt.split(
                                                                                            "///=> "
                                                                                        ).map(
                                                                                            (
                                                                                                line,
                                                                                                index
                                                                                            ) =>
                                                                                                index ===
                                                                                                0 ? (
                                                                                                    ""
                                                                                                ) : (
                                                                                                    <React.Fragment
                                                                                                        key={
                                                                                                            index
                                                                                                        }
                                                                                                    >
                                                                                                        {
                                                                                                            <HighlightText
                                                                                                                text={
                                                                                                                    line
                                                                                                                }
                                                                                                                keywords={[
                                                                                                                    "posologie",
                                                                                                                    "COMPOSITION",
                                                                                                                    "INDICATION",
                                                                                                                    "POSOLOGIE",
                                                                                                                ]}
                                                                                                            />
                                                                                                        }
                                                                                                        <br />
                                                                                                    </React.Fragment>
                                                                                                )
                                                                                        )}
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
                                        {/* )} */}
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
                                )
                            }
                        </div>
                    </div>

                    {/* End of Page Content */}
                </main>
            </div>
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
            <PhotoSwipe />
        </>
    );
};

export default DetailProduct;
