import React, { useState, useEffect, useContext } from "react"; // Importation de React et des hooks useState et useEffect
import { NavLink } from "react-router-dom";
import { crudData, defaultImage, fullUrl } from "../../services/apiService"; // Importation de la fonction crudData
import { toast } from "react-toastify";
import { formatPrice } from "../../MesPages/Panier/Cart";
import { verifyImageLink } from "../../services/lib";

const ProductWrap = ({ product, userData = {}, col_css, onSuccess }) => {
    // Vérifier si les données utilisateur sont présentes dans localStorage
    // const userData = JSON.parse(localStorage.getItem('userData'));
    const mode = JSON.parse(localStorage.getItem("appMode"));
    const apiEndpointe = JSON.parse(localStorage.getItem("apiEndpointe"));
    const errorImageUrl = JSON.parse(localStorage.getItem("errorImageUrl"));
    const paths = JSON.parse(localStorage.getItem("appPaths"));
    const [productData, setProductData] = useState(null);
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState("product-tab-specification");
    const [quantity, setQuantity] = useState(1); // Gestion de la quantité
    const [statusCode, setStatusCode] = useState(null); // Code statut HTTP
    const [isLoading, setIsLoading] = useState(false);
    const [addedProducts, setAddedProducts] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupContent, setPopupContent] = useState({});

    const handleAddToCart = (product) => {
        // Check if the product requires options
        if (product.options && product.options.length > 0) {
            // alert("Please select some product options before adding this product to your cart.");
            return;
        }

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
                LG_PROID: product.ArtID,
                STR_UTITOKEN: userData.STR_UTITOKEN,
                INT_CPRQUANTITY: 1,
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
                        onSuccess();
                        // toast.success(response.data.desc_statut);  // Notification de succès
                    } else if (response.data.code_statut === "0") {
                        toast.error(
                            `Erreur: ${product.ArtLib} en rupture de stock`
                        ); // Notification d'erreur
                    }
                })
                .catch((error) => {
                    console.error("Erreur lors de l'ajout au panier:", error);
                });

            // Close popup after a delay
            setTimeout(() => {
                setIsPopupOpen(false);
            }, 3000);
        }, 500);
    };

    const handleClick = () => {
        // Enregistrer l'ID du produit dans localStorage
        localStorage.setItem("selectedProductId", product.ArtID);
    };

    const getImageName = (imagePath) => {
        const parts = imagePath.split("/");
        return parts[parts.length - 1];
    };

    return (
        <>
            <div className={` ${col_css}`}>
                <div
                    className="product-wrap product-wrap-max-w flex-shrink-0"
                    style={{ width: "255px" }}
                >
                    <div className="product text-center">
                        <figure className="product-media">
                            <NavLink
                                to={"/detail-produit"}
                                onClick={handleClick}
                            >
                                <img
                                    // src={
                                    //   getImageName(product.ArtGPicID) === ''
                                    //     ? defaultImage
                                    //     : urlBaseImage + product.ArtGPicID
                                    // }
                                    // src={`${fullUrl + defaultImage}`}
                                    src={`${
                                        product.ArtGPicID
                                            ? verifyImageLink(
                                                  fullUrl + product.ArtGPicID
                                              ) !== false
                                                ? fullUrl + product.ArtGPicID
                                                : fullUrl + defaultImage
                                            : fullUrl + defaultImage
                                    }`}
                                    alt={product.ArtLib}
                                    width={300}
                                    height={338}
                                />
                            </NavLink>
                            {/* {userData && userData.STR_UTITOKEN && (
                                <div className="product-action-horizontal">
                                    <button
                                        className="btn-product-icon btn-cart w-icon-cart cursor-pointer"
                                        title="Ajouter au panier"
                                        onClick={() => handleAddToCart(product)}
                                    ></button>
                                    {/* <a href="#" className="btn-product-icon btn-wishlist w-icon-heart" title="Wishlist" />
                            <a href="#" className="btn-product-icon btn-compare w-icon-compare" title="Compare" /> 
                                    <a href="#" className="btn-product-icon btn-quickview w-icon-eye" title="Vue rapide" />
                                    </div>)}*/}
                        </figure>
                        <NavLink to={"/detail-produit"} onClick={handleClick}>
                            <div className="product-details">
                                <div className="product-cat">
                                    <a>{product?.ArtCateg}</a>
                                </div>
                                <h3 className="product-name">
                                    <a>{product.ArtLib}</a>
                                </h3>
                                {/* <div className="ratings-container">
                        <div className="ratings-full">
                            <span className="ratings" style={{ width: "100%" }} />
                            <span className="tooltiptext tooltip-top" />
                        </div>
                        <a href="product-default.html" className="rating-reviews">
                            (3 reviews)
                        </a>
                        </div> */}
                                {userData && userData.STR_UTITOKEN && (
                                    <div className="product-pa-wrapper">
                                        <div className="product-price">
                                            {formatPrice(
                                                parseInt(product?.ArtPrixBase)
                                            )}{" "}
                                            FCFA
                                        </div>
                                    </div>
                                )}
                            </div>
                        </NavLink>
                    </div>
                </div>
            </div>

            {/* Popup for added products */}
            {isPopupOpen && (
                <div className="minipopup-area">
                    <div className="minipopup-box show" style={{ top: 0 }}>
                        <div className="product product-list-sm  product-cart">
                            <figure className="product-media">
                                <NavLink
                                    to={"/detail-produit"}
                                    onClick={handleClick}
                                >
                                    <img
                                        src="assets/images/products/AMOXY-C1KG-FACE.jpg"
                                        alt="Product"
                                        width={80}
                                        height={90}
                                    />
                                </NavLink>
                            </figure>
                            <div className="product-details">
                                <h4 className="product-name">
                                    <NavLink
                                        to={"/detail-produit"}
                                        onClick={handleClick}
                                    >
                                        {product.ArtLib}
                                    </NavLink>
                                </h4>
                                <p>Ajouté au panier</p>
                            </div>
                        </div>
                        <div className="product-action">
                            <NavLink
                                to={"/cart"}
                                className="btn btn-rounded btn-sm"
                            >
                                Voir le panier
                            </NavLink>
                            {/* <a href="checkout.html" className="btn btn-dark btn-rounded btn-sm">
                          Checkout
                      </a> */}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductWrap;
