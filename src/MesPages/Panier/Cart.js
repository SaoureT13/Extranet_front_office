import React, { useState, useEffect } from "react";
import AppMenu from "../../Mescomposants/AppMenu";
import { toast } from "react-toastify";
import { useTheme } from "../../contexts/ThemeContext";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { crudData, defaultImage, fullUrl } from "../../services/apiService";
import CSVUploader from "../../Mescomposants/CSVUploader/CsvUploader";

const Cart = ({ onSuccess, param = {} }) => {
    const { theme, toggleTheme } = useTheme();

    const mode = JSON.parse(localStorage.getItem("appMode"));
    const apiEndpointe = JSON.parse(localStorage.getItem("apiEndpointe"));
    const [user, setUser] = useState(null);
    const [productData, setProductData] = useState([]);
    /*Pagination*/
    const [currentPage, setCurrentPage] = useState(1);
    const itemPerPage = 4;
    const [currentData, setCurrentData] = useState([]);
    let indexOfLastItem = currentPage * itemPerPage;
    let indexOfFirstItem = indexOfLastItem - itemPerPage;
    /*Pagination*/
    const [quantities, setQuantities] = useState({});
    const [statusCode, setStatusCode] = useState(null); // Code statut HTTP
    const [isLoading, setIsLoading] = useState(false);
    const userData = JSON.parse(localStorage.getItem("userData"));
    const [cart, setCart] = useState([]);

    useEffect(() => {
        setCurrentData(productData.slice(indexOfFirstItem, indexOfLastItem));
    }, [currentPage, productData]);

    const handleNextPage = () => {
        if (indexOfLastItem < productData.length) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (indexOfFirstItem > 0) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    const fetchData = (params, url, setProductData) => {
        setIsLoading(true);
        crudData(params, url)
            .then((response) => {
                if (response && response.status === 200) {
                    const produitVeto = response.data.lines || []; // Ensure it's an array
                    setProductData(
                        Array.isArray(produitVeto) ? produitVeto : []
                    ); // Safeguard to ensure it's an array
                    setStatusCode(response.status);

                    const initialQuantities = produitVeto.reduce(
                        (acc, product) => {
                            acc[product.PlvID] = product.PlvQteUV;
                            return acc;
                        },
                        {}
                    );
                    setQuantities(initialQuantities);
                } else {
                    console.error("Erreur HTTP:", response);
                    setStatusCode(response?.status || "Unknown error");
                }
            })
            .catch((error) => {
                setStatusCode(404);
                console.error(
                    "Erreur lors de la récupération des données:",
                    error
                );
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const DeletUpdateCommproduit = (params, url, setProductData) => {
        crudData(params, url)
            .then((response) => {
                if (response.status === 200) {
                    if (response.data.code_statut === "1") {
                        onSuccess();
                        const params = {
                            mode: mode.listCommandeproductMode,
                            LG_AGEID: userData?.LG_AGEID,
                        };
                        fetchData(
                            params,
                            apiEndpointe.CommandeManagerEndPoint,
                            setProductData
                        );
                        const paramPanier = {
                            mode: mode.getClientPanierMode,
                            LG_AGEID: userData?.LG_AGEID,
                        };
                        fetchPanierData(
                            paramPanier,
                            apiEndpointe.CommandeManagerEndPoint,
                            setCart
                        );
                    } else if (response.data.code_statut === "0") {
                        toast.error("Erreur : " + response.data.desc_statut); // Notification d'erreur
                    }
                    // const produitVeto = response.data.lines;
                }
            })
            .catch((error) => {
                console.error(
                    "Erreur lors de la récupération des données:",
                    error
                );
            });
    };

    const handleQuantityChange = (productId, change) => {
        setQuantities((prevQuantities) => {
            const currentQuantity =
                prevQuantities[productId] !== undefined
                    ? prevQuantities[productId]
                    : productData.find((p) => p.PlvID === productId).PlvQteUV;

            const newQuantity = Math.max(1, parseInt(currentQuantity) + change);

            const params = {
                mode: mode.updateCommproduitMode,
                LG_CPRID: productId,
                INT_CPRQUANTITY: newQuantity,
                STR_UTITOKEN: userData.STR_UTITOKEN,
            };
            DeletUpdateCommproduit(
                params,
                apiEndpointe.CommandeManagerEndPoint,
                setProductData
            );

            return {
                ...prevQuantities,
                [productId]: newQuantity,
            };
        });
    };

    const handleRemoveItem = (productId) => {
        const params = {
            mode: mode.deleteCommproduitMode,
            LG_CPRID: productId,
            STR_UTITOKEN: userData.STR_UTITOKEN,
        };
        DeletUpdateCommproduit(
            params,
            apiEndpointe.CommandeManagerEndPoint,
            setProductData
        );
        setCurrentPage(1);
    };

    const fetchPanierData = (params, url, setCart) => {
        crudData(params, url)
            .then((response) => {
                if (response && response.status === 200) {
                    const produitVeto = response.data.data || []; // Ensure it's an array
                    setCart(produitVeto);
                } else {
                    console.error("Erreur HTTP:", response);
                    setStatusCode(response?.status || "Unknown error");
                }
            })
            .catch((error) => {
                setStatusCode(404);
                console.error(
                    "Erreur lors de la récupération des données:",
                    error
                );
            });
    };

    useEffect(() => {
        setUser(userData); // Set user in state
        const params = {
            mode: mode.listCommandeproductMode,
            LG_AGEID: userData?.LG_AGEID,
        };
        fetchData(params, apiEndpointe.CommandeManagerEndPoint, setProductData);
        const paramPanier = {
            mode: mode.getClientPanierMode,
            LG_AGEID: userData?.LG_AGEID,
        };
        fetchPanierData(
            paramPanier,
            apiEndpointe.CommandeManagerEndPoint,
            setCart
        );
    }, []);

    const handleClick = (product) => {
        // Enregistrer l'ID du produit dans localStorage
        const selectedProduct = cart.produits.find(
            (p) => p.lg_cprid === product.PlvID
        );

        localStorage.setItem("selectedProductId", selectedProduct.lg_proid);
    };

    return (
        <div className={` ${param.userData ? "bgUserConnected" : ""}`}>
            <div className="page-wrapper">
                <main className="main cart">
                    <AppMenu />
                    <div className="page-content">
                        <div className="container bg-blue-light">
                            <div
                                className="row gutter-lg  page-contnainer p-5"
                                style={{ minHeight: "314px" }}
                            >
                                {productData || productData.length > 0 ? (
                                    <>
                                        <div className="col-lg-8 pr-lg-4 mb-6 table-min-h d-flex flex-column">
                                            <table className="shop-table cart-table">
                                                <thead>
                                                    <tr>
                                                        <th className="product-name">
                                                            <span>Produit</span>
                                                        </th>
                                                        <th />
                                                        <th className="product-price">
                                                            <span>Prix</span>
                                                        </th>
                                                        <th className="product-quantity">
                                                            <span>
                                                                Quantité
                                                            </span>
                                                        </th>
                                                        <th className="product-subtotal">
                                                            <span>Total</span>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="">
                                                    {isLoading &&
                                                    currentData.length === 0 ? (
                                                        <tr className="">
                                                            <td className="">
                                                                Chargement des
                                                                données...
                                                            </td>
                                                        </tr>
                                                    ) : !isLoading &&
                                                      currentData.length ===
                                                          0 ? (
                                                        <tr className="">
                                                            <td className="">
                                                                Votre panier est
                                                                vide.
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        <>
                                                            {currentData &&
                                                                currentData.map(
                                                                    (
                                                                        product,
                                                                        index
                                                                    ) => (
                                                                        <tr
                                                                            key={
                                                                                index
                                                                            }
                                                                            className=""
                                                                        >
                                                                            <td className="product-thumbnail">
                                                                                <div className="p-relative">
                                                                                    <NavLink
                                                                                        to={`/${product.str_proslug}`}
                                                                                        onClick={() =>
                                                                                            handleClick(
                                                                                                product
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        <figure>
                                                                                            <img
                                                                                                src={`${
                                                                                                    product.str_propic
                                                                                                        ? fullUrl +
                                                                                                          product.str_propic
                                                                                                        : fullUrl +
                                                                                                          defaultImage
                                                                                                }`}
                                                                                                alt="product"
                                                                                                width={
                                                                                                    300
                                                                                                }
                                                                                                height={
                                                                                                    338
                                                                                                }
                                                                                            />
                                                                                        </figure>
                                                                                    </NavLink>
                                                                                    <button
                                                                                        type="submit"
                                                                                        className="btn btn-close"
                                                                                        onClick={() =>
                                                                                            handleRemoveItem(
                                                                                                product.PlvID
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        <i className="fas fa-times" />
                                                                                    </button>
                                                                                </div>
                                                                            </td>
                                                                            <td className="product-name">
                                                                                <NavLink
                                                                                    to={`/${product.str_proslug}`}
                                                                                    onClick={() =>
                                                                                        handleClick(
                                                                                            product
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        product.PlvLib
                                                                                    }
                                                                                </NavLink>
                                                                                <br />
                                                                                <span
                                                                                    style={{
                                                                                        fontWeight:
                                                                                            "400",
                                                                                    }}
                                                                                >
                                                                                    {
                                                                                        product.PlvCode
                                                                                    }
                                                                                </span>
                                                                            </td>
                                                                            <td className="">
                                                                                <span className="amount">
                                                                                    {product &&
                                                                                        formatPrice(
                                                                                            parseInt(
                                                                                                product.PlvPUNet
                                                                                            )
                                                                                        ) +
                                                                                            " FCFA"}{" "}
                                                                                </span>
                                                                            </td>
                                                                            <td className="product-quantity">
                                                                                <div className="input-group max-width-164">
                                                                                    <input
                                                                                        className="quantity form-control"
                                                                                        type="number"
                                                                                        min={
                                                                                            1
                                                                                        }
                                                                                        value={
                                                                                            parseInt(
                                                                                                quantities[
                                                                                                    product
                                                                                                        .PlvID
                                                                                                ]
                                                                                            ) ||
                                                                                            parseInt(
                                                                                                product.PlvQteUV
                                                                                            )
                                                                                        }
                                                                                        onChange={(
                                                                                            e
                                                                                        ) => {
                                                                                            const inputValue =
                                                                                                e
                                                                                                    .target
                                                                                                    .value;
                                                                                            if (
                                                                                                !isNaN(
                                                                                                    inputValue
                                                                                                ) &&
                                                                                                Number(
                                                                                                    inputValue
                                                                                                ) >=
                                                                                                    1
                                                                                            ) {
                                                                                                handleQuantityChange(
                                                                                                    product.PlvID,
                                                                                                    Number(
                                                                                                        inputValue
                                                                                                    ) -
                                                                                                        (quantities[
                                                                                                            product
                                                                                                                .PlvID
                                                                                                        ] ||
                                                                                                            product.PlvQteUV)
                                                                                                );
                                                                                            }
                                                                                        }}
                                                                                        max={
                                                                                            100000
                                                                                        }
                                                                                    />
                                                                                    <button
                                                                                        className={`quantity-plus w-icon-plus ${
                                                                                            quantities[
                                                                                                product
                                                                                                    .PlvID
                                                                                            ] <=
                                                                                            1
                                                                                                ? "disabled"
                                                                                                : ""
                                                                                        }`} // Désactive visuellement si la quantité est 1
                                                                                        onClick={() =>
                                                                                            handleQuantityChange(
                                                                                                product.PlvID,
                                                                                                1
                                                                                            )
                                                                                        }
                                                                                    />
                                                                                    <button
                                                                                        className={`quantity-minus w-icon-minus cart-item__decrement ${
                                                                                            quantities[
                                                                                                product
                                                                                                    .PlvID
                                                                                            ] <=
                                                                                            1
                                                                                                ? "disabled"
                                                                                                : ""
                                                                                        }`} // Désactive visuellement si la quantité est 1
                                                                                        onClick={() =>
                                                                                            handleQuantityChange(
                                                                                                product.PlvID,
                                                                                                -1
                                                                                            )
                                                                                        }
                                                                                        disabled={
                                                                                            quantities[
                                                                                                product
                                                                                                    .PlvID
                                                                                            ] <=
                                                                                            "1"
                                                                                        }
                                                                                    />
                                                                                </div>
                                                                            </td>
                                                                            <td className="product-subtotal">
                                                                                <span className="amount">
                                                                                    {product &&
                                                                                        formatPrice(
                                                                                            parseInt(
                                                                                                product.PlvQteUV
                                                                                            ) *
                                                                                                parseInt(
                                                                                                    product.PlvPUNet
                                                                                                )
                                                                                        )}{" "}
                                                                                    FCFA
                                                                                </span>
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                )}
                                                        </>
                                                    )}
                                                </tbody>
                                            </table>
                                            <div className="d-flex justify-content-end margin-auto">
                                                {productData && (
                                                    <div className="toolbox toolbox-pagination justify-content-between">
                                                        <ul className="pagination">
                                                            <li
                                                                className={`prev ${
                                                                    indexOfFirstItem -
                                                                        1 <
                                                                    0
                                                                        ? "disabled"
                                                                        : ""
                                                                }`}
                                                            >
                                                                <a
                                                                    onClick={
                                                                        handlePreviousPage
                                                                    }
                                                                    className={`${
                                                                        indexOfFirstItem -
                                                                            1 <
                                                                        0
                                                                            ? "disabled"
                                                                            : ""
                                                                    }`}
                                                                    disabled={
                                                                        indexOfFirstItem -
                                                                            1 <
                                                                        0
                                                                            ? true
                                                                            : false
                                                                    }
                                                                    aria-label="Previous"
                                                                >
                                                                    <i className="w-icon-long-arrow-left"></i>
                                                                    Préc
                                                                </a>
                                                            </li>
                                                            <li
                                                                className={`next ${
                                                                    indexOfLastItem +
                                                                        1 >
                                                                    productData.length
                                                                        ? "disabled"
                                                                        : "bg-[#F4F7F9]"
                                                                }`}
                                                            >
                                                                <a
                                                                    onClick={
                                                                        handleNextPage
                                                                    }
                                                                    className={`${
                                                                        indexOfLastItem +
                                                                            1 >
                                                                        productData.length
                                                                            ? "disabled"
                                                                            : "bg-[#F4F7F9]"
                                                                    }`}
                                                                    aria-label="Next"
                                                                    disabled={
                                                                        indexOfLastItem +
                                                                            1 >
                                                                        productData.length
                                                                            ? true
                                                                            : false
                                                                    }
                                                                >
                                                                    Suiv{" "}
                                                                    <i className="w-icon-long-arrow-right"></i>
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {cart &&
                                            Object.entries(cart).length > 0 && (
                                                <div className="col-lg-4 sticky-sidebar-wrapper">
                                                    <div className="sticky-sidebar">
                                                        <div className="cart-summary mb-4">
                                                            <h3 className="cart-title text-uppercase">
                                                                Total
                                                            </h3>
                                                            <div className="cart-subtotal d-flex align-items-center justify-content-between">
                                                                <label className="ls-25">
                                                                    Montant HT
                                                                </label>
                                                                <span>
                                                                    {cart &&
                                                                        formatPrice(
                                                                            cart?.dbl_commmtht
                                                                        )}{" "}
                                                                    FCFA
                                                                </span>
                                                            </div>

                                                            <hr className="divider" />

                                                            <hr className="divider mb-6" />
                                                            <div className="order-total d-flex justify-content-between align-items-center">
                                                                <label>
                                                                    Total
                                                                </label>
                                                                <span className="ls-50">
                                                                    {cart &&
                                                                        formatPrice(
                                                                            cart?.dbl_commmtttc
                                                                        )}{" "}
                                                                    FCFA
                                                                </span>
                                                            </div>
                                                            <NavLink
                                                                to={
                                                                    "/choix-livraison"
                                                                }
                                                                className="btn btn-block btn-dark btn-icon-right btn-rounded  btn-checkout"
                                                            >
                                                                Proceder à la
                                                                validation
                                                                <i className="w-icon-long-arrow-right"></i>
                                                            </NavLink>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                    </>
                                ) : (
                                    <p className="text-center">
                                        Votre panier est vide.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* End of PageContent */}
                </main>
            </div>
        </div>
    );
};

export default Cart;

export function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
