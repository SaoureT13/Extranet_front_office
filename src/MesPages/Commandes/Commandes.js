import React, { useEffect, useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import {
    convertInRawDate,
    crudData,
    formatDateSecond,
} from "../../services/apiService";
import { formatPrice } from "../Panier/Cart";
import ProductWrap from "../../Mescomposants/Product/ProductWrap";
import DailyStockReport from "../../Mescomposants/exportExcel/exportExcel";

function Commandes({ onSuccess, param = {} }) {
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingProduct, setIsLoadingProduct] = useState(false);

    const userData = JSON.parse(localStorage.getItem("userData"));
    const [statusCode, setStatusCode] = useState(null);
    const [user, setUser] = useState(null);
    const apiEndpointe = JSON.parse(localStorage.getItem("apiEndpointe"));
    const mode = JSON.parse(localStorage.getItem("appMode"));
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [currentOrderID, setCurrentOrderID] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemPerPage = 10;
    const [currentProducts, setCurrentProducts] = useState([]);
    let indexOfLastItem = currentPage * itemPerPage;
    let indexOfFirstItem = indexOfLastItem - itemPerPage;

    useEffect(() => {
        setCurrentProducts(products.slice(indexOfFirstItem, indexOfLastItem));
    }, [
        currentPage,
        products,
        setCurrentProducts,
        indexOfFirstItem,
        indexOfLastItem,
    ]);

    const handleNextPage = () => {
        if (indexOfLastItem < products.length) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (indexOfFirstItem > 0) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    const fetchProductsByOrder = (params, url) => {
        setIsLoadingProduct(true);
        crudData(params, url)
            .then((response) => {
                setIsLoadingProduct(false);
                if (response && response.status === 200) {
                    const data = response.data.products || []; // Ensure it's an array
                    setProducts(data);
                } else {
                    console.error("Erreur HTTP:", response);
                    setStatusCode(response?.status || "Unknown error");
                }
            })
            .catch((error) => {
                setIsLoadingProduct(false);
                setStatusCode(404);
                console.error(
                    "Erreur lors de la récupération des données:",
                    error
                );
            });
    };

    useEffect(() => {
        const params = {
            mode: mode.listProductByCommandeMode,
            LG_COMMID: currentOrderID,
        };
        if (currentOrderID !== null) {
            fetchProductsByOrder(params, apiEndpointe.CommandeManagerEndPoint);
        }
    }, [
        currentOrderID,
        mode.listProductByCommandeMode,
        apiEndpointe.CommandeManagerEndPoint,
    ]);

    const handleSetCurrentOrderID = (PcvID) => {
        if (PcvID === currentOrderID) return;
        setCurrentOrderID(PcvID);
    };

    const fetchOrders = (params, url) => {
        setIsLoading(true);
        crudData(params, url)
            .then((response) => {
                setIsLoading(false);
                if (response && response.status === 200) {
                    const data = response.data.pieces || []; // Ensure it's an array
                    setOrders(data);
                    setCurrentOrderID(data[0].PcvID);
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

    useEffect(() => {
        setUser(userData); // Set user in state
        const params = {
            mode: mode.listClientCommandeMode,
            LG_AGEID: userData?.LG_AGEID,
            LG_CLIID: userData?.LG_SOCID,
        };
        fetchOrders(params, apiEndpointe.CommandeManagerEndPoint);
    }, []);

    return (
        <div className={` ${param.userData ? "bgUserConnected" : ""}`}>
            <div className="page-wrapper">
                {/* Start of Header */}
                {/* <TopBar /> */}

                <main className="main cart">
                    {/* <AppMenu /> */}

                    {/* Start of Breadcrumb */}
                    {/* <nav className="breadcrumb-nav">
        </nav> */}

                    {/* End of Breadcrumb */}
                    {/* Start of PageContent */}
                    <div className="page-content">
                        <div className="container">
                            <div
                                className="row gutter-lg mb-10 page-contnainer bg-blue-light p-5"
                                style={{ minHeight: "314px" }}
                            >
                                <h1>Mes commandes</h1>
                                {orders && orders.length > 0 ? (
                                    <>
                                        <div className="col-lg-8 pr-lg-4 mb-6 table-min-h d-flex flex-column">
                                            <table className="shop-table cart-table">
                                                <thead>
                                                    <tr>
                                                        <th
                                                            className="product-name"
                                                            style={{
                                                                textAlign:
                                                                    "left",
                                                            }}
                                                        >
                                                            <span>
                                                                N° Commande
                                                            </span>
                                                        </th>

                                                        <th
                                                            className="product-price"
                                                            style={{
                                                                textAlign:
                                                                    "left",
                                                            }}
                                                        >
                                                            <span>
                                                                Date de commande
                                                            </span>
                                                        </th>
                                                        <th
                                                            className="product-quantity"
                                                            style={{
                                                                textAlign:
                                                                    "left",
                                                            }}
                                                        >
                                                            <span>
                                                                Montant TTC
                                                            </span>
                                                        </th>
                                                        <th
                                                            className="product-subtotal"
                                                            style={{
                                                                textAlign:
                                                                    "left",
                                                            }}
                                                        >
                                                            <span>
                                                                Montant HT
                                                            </span>
                                                        </th>
                                                        <th
                                                            className="product-subtotal"
                                                            style={{
                                                                textAlign:
                                                                    "left",
                                                            }}
                                                        >
                                                            <span>Statut</span>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="">
                                                    {!orders ||
                                                    orders.length === 0 ? (
                                                        <tr className="">
                                                            <td className="">
                                                                Chargement des
                                                                données
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        <>
                                                            {orders &&
                                                                orders.map(
                                                                    (
                                                                        order,
                                                                        index
                                                                    ) => (
                                                                        <tr
                                                                            key={
                                                                                index
                                                                            }
                                                                            className="item-hover"
                                                                            style={{
                                                                                borderLeft:
                                                                                    currentOrderID ===
                                                                                    order.PcvID
                                                                                        ? "6px solid #3656a1"
                                                                                        : "none",
                                                                                borderRight:
                                                                                    currentOrderID ===
                                                                                    order.PcvID
                                                                                        ? "6px solid #3656a1"
                                                                                        : "none",
                                                                            }}
                                                                            onClick={() =>
                                                                                handleSetCurrentOrderID(
                                                                                    order.PcvID
                                                                                )
                                                                            }
                                                                        >
                                                                            <td className="product-thumbnail">
                                                                                <p>
                                                                                    {
                                                                                        order.PcvID
                                                                                    }
                                                                                </p>
                                                                            </td>
                                                                            <td className="product-name">
                                                                                <p>
                                                                                    {formatDateSecond(
                                                                                        order.PcvDate
                                                                                    )}
                                                                                </p>
                                                                            </td>
                                                                            <td className="product-price">
                                                                                <p className="">
                                                                                    {formatPrice(
                                                                                        parseInt(
                                                                                            order.PcvMtHT
                                                                                        )
                                                                                    )}{" "}
                                                                                    FCFA
                                                                                </p>
                                                                            </td>
                                                                            <td className="product-price">
                                                                                <p className="">
                                                                                    {formatPrice(
                                                                                        parseInt(
                                                                                            order.PcvMtTTC
                                                                                        )
                                                                                    )}{" "}
                                                                                    FCFA
                                                                                </p>
                                                                            </td>
                                                                            <td className="product-price">
                                                                                <p className="">
                                                                                    {order.etat ===
                                                                                    "closed"
                                                                                        ? <img src="images/data-processing.png" alt="" width={24} height={24} />
                                                                                        : <img src="images/histoire.png" alt="" width={24} height={24} />}
                                                                                </p>
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                )}
                                                        </>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="col-lg-4 sticky-sidebar-wrapper">
                                            <div className="sticky-sidebar">
                                                <div
                                                    className="cart-summary mb-4"
                                                    style={{
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    <h3 className="cart-title text-uppercase">
                                                        Resumé de la commande
                                                    </h3>
                                                    {products &&
                                                    products.length > 0
                                                        ? currentProducts.map(
                                                              (
                                                                  product,
                                                                  index
                                                              ) => (
                                                                  <div
                                                                      key={
                                                                          index
                                                                      }
                                                                      style={{
                                                                          display:
                                                                              "flex",
                                                                          justifyContent:
                                                                              "space-between",
                                                                      }}
                                                                  >
                                                                      <div
                                                                          style={{
                                                                              display:
                                                                                  "flex",
                                                                              flexDirection:
                                                                                  "column",
                                                                              alignItems:
                                                                                  "baseline",
                                                                          }}
                                                                      >
                                                                          <p
                                                                              style={{
                                                                                  marginBottom: 0,
                                                                              }}
                                                                          >
                                                                              {
                                                                                  product.ArtLib
                                                                              }
                                                                          </p>
                                                                          <p>
                                                                              Quantité:{" "}
                                                                              {
                                                                                  product.int_cprquantity
                                                                              }
                                                                          </p>
                                                                      </div>
                                                                      <p>
                                                                          {formatPrice(
                                                                              product.ArtPrixBase *
                                                                                  product.int_cprquantity
                                                                          )}{" "}
                                                                          FCFA
                                                                      </p>
                                                                  </div>
                                                              )
                                                          )
                                                        : ""}

                                                    <div className="cart-subtotal d-flex align-items-center justify-content-between">
                                                        <div className="d-flex justify-content-end margin-auto">
                                                            {products && (
                                                                <div className="toolbox toolbox-pagination justify-content-between remove-top-and-bottom-padding">
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
                                                                                Prev
                                                                            </a>
                                                                        </li>
                                                                        <li
                                                                            className={`next ${
                                                                                indexOfLastItem +
                                                                                    1 >
                                                                                products.length
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
                                                                                    products.length
                                                                                        ? "disabled"
                                                                                        : "bg-[#F4F7F9]"
                                                                                }`}
                                                                                aria-label="Next"
                                                                                disabled={
                                                                                    indexOfLastItem +
                                                                                        1 >
                                                                                    products.length
                                                                                        ? true
                                                                                        : false
                                                                                }
                                                                            >
                                                                                Next{" "}
                                                                                <i className="w-icon-long-arrow-right"></i>
                                                                            </a>
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="p">Par page: {itemPerPage}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : isLoading ? (
                                    <p className="text-center">
                                        Chargement des données...
                                    </p>
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
}

export default Commandes;
