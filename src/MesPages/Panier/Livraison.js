// src/components/Accueil.js
import React, { useState, useEffect, useContext } from "react"; // Importation de React et des hooks useState et useEffect
import TopBar from "../../Mescomposants/Header/TopBar";
import AppMenu from "../../Mescomposants/AppMenu";
import MobileMenu from "../../Mescomposants/MobileMenu";
import Footer from "../../Mescomposants/Footer";
import ShopFilter from "../../Mescomposants/ShopFilter";
import ShopCategory from "../../Mescomposants/ShopCategory";
import ShopBrand from "../../Mescomposants/ShopBrand";
import { toast } from "react-toastify";
import { useTheme } from "../../contexts/ThemeContext";

// import ShopSidebar from './ShopSidebar';
// import Product from './Product';
// import MainContent from './MainContent';
// import Header from './components/Header'; // Importation du composant Header
import { useNavigate } from "react-router-dom"; // Utilisez useNavigate pour la redirection
import { fetchEvenements, crudData } from "../../services/apiService"; // Importation de la fonction fetchEvenements depuis le fichier apiService
import ErrorCard from "../../Mescomposants/ErrorCard";
import ProductWrap from "../../Mescomposants/Product/ProductWrap";
import { formatPrice } from "./Cart";

const Livraison = ({ onSuccess, param = {} }) => {
    const { theme, toggleTheme } = useTheme();

    const mode = JSON.parse(localStorage.getItem("appMode"));
    const date = JSON.parse(localStorage.getItem("appDate"));
    const apiEndpointe = JSON.parse(localStorage.getItem("apiEndpointe"));
    const paths = JSON.parse(localStorage.getItem("appPaths"));
    const [user, setUser] = useState(null);
    const [productData, setProductData] = useState([]);
    const [cart, setCart] = useState([]);
    const [quantities, setQuantities] = useState({});
    const navigate = useNavigate();
    const [statusCode, setStatusCode] = useState(null); // Code statut HTTP
    const [isLoading, setIsLoading] = useState(false);
    const userData = JSON.parse(localStorage.getItem("userData"));
    const [zones, setZones] = useState([]);
    const [selectedZone, setSelectedZone] = useState(null);
    const [deliveryAddress, setDeliveryAddress] = useState(null);
    const [isLoadingSpinner, setIsLoadingSpinner] = useState(false);

    /*Pagination*/
    const [currentPage, setCurrentPage] = useState(1);
    const itemPerPage = 4;
    const [currentData, setCurrentData] = useState([]);
    let indexOfLastItem = currentPage * itemPerPage;
    let indexOfFirstItem = indexOfLastItem - itemPerPage;

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
    /*Pagination*/

    const fetchZoneData = (params, url) => {
        setIsLoading(true);
        crudData(params, url)
            .then((response) => {
                setIsLoading(false);
                if (response && response.status === 200) {
                    const zones = response.data.zone_de_livraison || []; // Ensure it's an array
                    setZones(Array.isArray(zones) ? zones : []); // Safeguard to ensure it's an array
                    setStatusCode(response.status);
                } else {
                    console.error("Erreur HTTP:", response);
                    setStatusCode(response?.status || "Unknown error");
                }
            })
            .catch((error) => {
                setIsLoading(false);
                setStatusCode(404);
                console.error(
                    "Erreur lors de la récupération des données:",
                    error
                );
            });
    };

    const fetchData = (params, url, setProductData) => {
        setIsLoading(true);
        crudData(params, url)
            .then((response) => {
                setIsLoading(false);
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
                setIsLoading(false);
                setStatusCode(404);
                console.error(
                    "Erreur lors de la récupération des données:",
                    error
                );
            });
    };

    const fetchPanierData = (params, url, setProductData) => {
        setIsLoading(true);
        crudData(params, url)
            .then((response) => {
                setIsLoading(false);
                if (response && response.status === 200) {
                    const produitVeto = response.data.data || []; // Ensure it's an array
                    setCart(produitVeto);
                } else {
                    console.error("Erreur HTTP:", response);
                    setStatusCode(response?.status || "Unknown error");
                }
            })
            .catch((error) => {
                setIsLoading(false);
                setStatusCode(404);
                console.error(
                    "Erreur lors de la récupération des données:",
                    error
                );
            });
    };

    const ClotuteCommproduit = (params, url) => {
        setIsLoadingSpinner(true);
        crudData(params, url)
            .then((response) => {
                if (response.status === 200) {
                    if (response.data.code_statut === "1") {
                        toast.success("Commande valider avec succès");
                        toast.success(response.data.desc_statut);
                        setCart([]);
                        setSelectedZone(null);
                        setDeliveryAddress(null);
                        setProductData([]);
                        onSuccess();
                        navigate("/");
                    } else {
                        toast.error("Erreur : " + response.data.desc_statut);
                    }
                }
            })
            .catch((error) => {
                console.error(
                    "Erreur lors de la récupération des données:",
                    error
                );
            })
            .finally(() => {
                setIsLoadingSpinner(false);
            });
    };

    useEffect(() => {
        if (!userData) {
            navigate(paths.signIn); // Redirige vers la page d'accueil si l'utilisateur est vide
        } else {
            setUser(userData); // Set user in state
            const params = {
                mode: mode.listCommandeproductMode,
                LG_AGEID: userData.LG_AGEID,
                // LG_COMMID: userData.LG_COMMID,
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
                setProductData
            );
            const paramsZone = { mode: mode.getZoneLivraisonMode };
            fetchZoneData(paramsZone, apiEndpointe.CommandeManagerEndPoint);
        }
    }, [navigate]);

    const handleCloture = () => {
        if (!selectedZone || !deliveryAddress) {
            toast.error("Veuillez remplir tous les champs obligatoires");
            return;
        }
        const params = {
            mode: mode.validationCommandeMode,
            LG_AGEID: userData.LG_AGEID,
            STR_UTITOKEN: userData.STR_UTITOKEN,
            STR_COMMLIVADRESSE: deliveryAddress,
            LG_ZONLIVID: selectedZone,
        };

        ClotuteCommproduit(params, apiEndpointe.CommandeManagerEndPoint);
    };

    const handleZoneChange = (event) => {
        setSelectedZone(event.target.value); // Mettez à jour l'état avec la valeur sélectionnée
    };

    const handleDeliveryAddressChange = (event) => {
        setDeliveryAddress(event.target.value);
    };

    return (
        <div className={` ${param.userData ? "bgUserConnected" : ""}`}>
            <div className="page-wrapper">
                {/* Start of Header */}
                {/* <TopBar /> */}

                <main className="main cart">
                    <AppMenu />

                    {/* Start of Breadcrumb */}
                    {/* <nav className="breadcrumb-nav">
          <div className="container">
            <ul className="breadcrumb shop-breadcrumb bb-no">
              <li className="active">
                <a href="cart.html">Shopping Cart</a>
              </li>
              <li>
                <a href="checkout.html">Checkout</a>
              </li>
              <li>
                <a href="order.html">Order Complete</a>
              </li>
            </ul>
          </div>
        </nav> */}

                    {/* End of Breadcrumb */}
                    {/* Start of PageContent */}
                    <div className="page-content">
                        <div className="container">
                            <form
                                className="form checkout-form"
                                action="#"
                                method="post"
                            >
                                <div className="row mb-9">
                                    <div className="col-lg-7 pr-lg-4 mb-4">
                                        <h3 className="title billing-title text-uppercase ls-10 pt-1 pb-3 mb-0">
                                            Details de livraison
                                        </h3>

                                        <div className="form-group">
                                            <label>Zone de livraison *</label>
                                            <div className="select-box">
                                                <select
                                                    name="LG_ZONLIVID"
                                                    className="form-control form-control-md"
                                                    onChange={handleZoneChange}
                                                    value={selectedZone}
                                                >
                                                    <option
                                                        value="default"
                                                        selected="selected"
                                                    >
                                                        Choisissez votre zone de
                                                        livraison
                                                    </option>
                                                    {zones &&
                                                        zones.map(
                                                            (item, index) => (
                                                                <option
                                                                    key={index}
                                                                    value={
                                                                        item.id
                                                                    }
                                                                >
                                                                    {item.name}
                                                                </option>
                                                            )
                                                        )}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>
                                                Adresse de livraison *
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control form-control-md"
                                                name="STR_COMMLIVADRESSE"
                                                value={deliveryAddress}
                                                onChange={
                                                    handleDeliveryAddressChange
                                                }
                                                placeholder="Adresse de livraison"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-5 mb-4 sticky-sidebar-wrapper">
                                        <div
                                            className="pin-wrapper"
                                            style={{ height: "898.992px" }}
                                        >
                                            <div
                                                className="order-summary-wrapper sticky-sidebar"
                                                style={{
                                                    borderBottom:
                                                        "1px solid rgb(238, 238, 238)",
                                                    width: 505,
                                                }}
                                            >
                                                <h3 className="title text-uppercase ls-10">
                                                    Ma commande
                                                </h3>
                                                <div className="order-summary">
                                                    <table className="order-table">
                                                        <thead>
                                                            <tr>
                                                                <th colSpan={2}>
                                                                    <b>
                                                                        Product
                                                                    </b>
                                                                </th>
                                                            </tr>
                                                            <tr>
                                                                <div className="d-flex justify-content-end margin-auto">
                                                                    {productData && (
                                                                        <div className="toolbox toolbox-pagination justify-content-between padding-0">
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
                                                                                        Prec
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
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {currentData &&
                                                                currentData.map(
                                                                    (
                                                                        item,
                                                                        index
                                                                    ) => (
                                                                        <tr
                                                                            key={
                                                                                index
                                                                            }
                                                                            className="bb-no"
                                                                        >
                                                                            <td className="product-name">
                                                                                {
                                                                                    item.PlvLib
                                                                                }{" "}
                                                                                <i className="fas fa-times" />{" "}
                                                                                <span className="product-quantity">
                                                                                    {parseInt(
                                                                                        item.PlvQteUV
                                                                                    )}
                                                                                </span>
                                                                            </td>
                                                                            <td className="product-total">
                                                                                {formatPrice(
                                                                                    parseInt(
                                                                                        item?.PlvPUNet
                                                                                    ) *
                                                                                        parseInt(
                                                                                            item?.PlvQteUV
                                                                                        )
                                                                                )}{" "}
                                                                                fcfa
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                )}
                                                            <tr className="cart-subtotal bb-no">
                                                                <td>
                                                                    <b>
                                                                        Montant
                                                                        HT
                                                                    </b>
                                                                </td>
                                                                <td>
                                                                    <b>
                                                                        {formatPrice(
                                                                            parseInt(
                                                                                cart?.dbl_commmtht
                                                                            )
                                                                        )}{" "}
                                                                        FCFA
                                                                    </b>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                        <tfoot>
                                                            <tr className="order-total">
                                                                <th>
                                                                    <b>Total</b>
                                                                </th>
                                                                <td>
                                                                    <b>
                                                                        {formatPrice(
                                                                            parseInt(
                                                                                cart?.dbl_commmtttc
                                                                            )
                                                                        )}{" "}
                                                                        FCFA
                                                                    </b>
                                                                </td>
                                                            </tr>
                                                        </tfoot>
                                                    </table>
                                                    <div className="form-group place-order pt-6">
                                                        <button
                                                            type="button"
                                                            className="d-flex align-items-center justify-content-center btn btn-dark btn-block btn-rounded"
                                                            onClick={
                                                                handleCloture
                                                            }
                                                        >
                                                            Valider la commande
                                                            {isLoadingSpinner && (
                                                                <div class="loader ml-4"></div>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* End of PageContent */}
                </main>
            </div>
        </div>
    );
};

export default Livraison;
