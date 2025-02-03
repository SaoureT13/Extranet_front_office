import React, { useEffect, useState } from "react";
import { crudData, formatDateOriginal } from "../../services/apiService";
import { formatPrice } from "../Panier/Cart";
import { pdf } from "@react-pdf/renderer";
import InvoicePDF from "../../Mescomposants/exportPDF/InvoicePDF";
import { Modal, Button } from "react-bootstrap";
import { CSVLink } from "react-csv";
import OrderForm from "../../Mescomposants/exportExcel/exportExcel";
import { generatePageNumbers } from "../../services/lib";
import Pagination from "../../Mescomposants/Pagination/Pagination";

function Commandes({ onSuccess, param = {} }) {
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingProduct, setIsLoadingProduct] = useState(false);
    const [showModal, setShowModal] = useState(false); // State to control modal visibility
    const userData = JSON.parse(localStorage.getItem("userData"));
    const [statusCode, setStatusCode] = useState(null);
    const [user, setUser] = useState(null);
    const apiEndpointe = JSON.parse(localStorage.getItem("apiEndpointe"));
    const mode = JSON.parse(localStorage.getItem("appMode"));
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [currentOrderID, setCurrentOrderID] = useState(null);
    //etat pour contenir l'année des commandes à afficher
    const [year, setYear] = useState(null);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [pageNumbers, setPageNumbers] = useState([]);
    const [totalPage, setTotalPage] = useState(null);

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

    const fetchProductsOnOrder = (params, url) => {
        setIsLoadingProduct(true);
        crudData(params, url)
            .then((response) => {
                setIsLoadingProduct(false);
                if (response && response.status === 200) {
                    const data = response.data.data || []; // Ensure it's an array
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
            fetchProductsOnOrder(params, apiEndpointe.CommandeManagerEndPoint);
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
                    const data = response.data.data || [];
                    setTotalPage(() => {
                        return Math.ceil(response.data["total"] / limit);
                    });
                    setOrders(data);
                    if (data.length > 0) {
                        setCurrentOrderID(data[0].PcvID);
                    } else {
                        setCurrentOrderID(null);
                    }
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
        setUser(userData);
        const params = {
            mode: mode.listClientCommandeMode,
            "FILTER_OPTIONS[PcvGCliID]": userData.LG_CLIID,
            PAGE: page,
            LIMIT: limit,
        };
        if (year !== null && year !== "all") {
            params["FILTER_OPTIONS[PcvDate]"] = year;
        }
        fetchOrders(params, apiEndpointe.CommandeManagerEndPoint);
    }, [year, page, limit]);

    const handleDownload = async () => {
        const blob = await pdf(
            <InvoicePDF
                products={products}
                order={orders.find((order) => order.PcvID === currentOrderID)}
            />
        ).toBlob();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `commande-#${currentOrderID}.pdf`;
        link.click();
    };
    useEffect(() => {
        setPageNumbers(generatePageNumbers(totalPage, page));
    }, [page, totalPage]);

    const goToPage = (page) => {
        setPage(page);
    };

    useEffect(() => {
        if (orders.length === 0) {
            setProducts([]);
        }
    }, [orders]);
    return (
        <div className={` ${param.userData ? "bgUserConnected" : ""}`}>
            <div className="page-wrapper">
                {/* Start of Header */}
                {/* <TopBar /> */}

                <main className="main cart">
                    <div className="page-content">
                        <div className="container">
                            <div className="row gutter-lg mb-10 page-contnainer bg-blue-light p-5">
                                <div className="d-flex align-items-center justify-content-between flex-wrap mb-4">
                                    <div className="d-flex">
                                        <h1 className="mb-0 mr-4">
                                            Mes commandes
                                        </h1>
                                        <button
                                            onClick={() => setShowModal(true)}
                                            type="button"
                                            className="btn btn-primary absolute-btn"
                                            data-bs-toggle="modal"
                                            data-bs-target="#exampleModalCenter"
                                            style={{}}
                                        >
                                            Exporter
                                        </button>
                                    </div>

                                    <div>
                                        <label htmlFor="year">
                                            Afficher commandes de:{" "}
                                        </label>
                                        <select
                                            name="year"
                                            id="year"
                                            className="form-select "
                                            style={{
                                                padding: "6px 10px",
                                                fontFamily: "Poppins",
                                                marginRight: "10px",
                                                border: "none",
                                                background: "#214293",
                                                color: "white",
                                            }}
                                            onChange={(e) =>
                                                setYear(e.target.value)
                                            }
                                        >
                                            <option value="all">Toutes</option>
                                            <option value="2020">2020</option>
                                            <option value="2021">2021</option>
                                            <option value="2022">2022</option>
                                            <option value="2023">2023</option>
                                            <option value="2024">2024</option>
                                            <option value="2025">2025</option>
                                        </select>
                                    </div>

                                    <Modal
                                        size="lg"
                                        show={showModal}
                                        onHide={() => setShowModal(false)}
                                        centered
                                    >
                                        <Modal.Header>
                                            <Modal.Title className="d-flex justify-content-between w-100">
                                                <h3 className="mb-4">
                                                    {" "}
                                                    Exporter details commande N°
                                                    #{currentOrderID}
                                                </h3>
                                            </Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <div className="row text-center">
                                                <div>
                                                    <p
                                                        style={{
                                                            fontSize: "16px",
                                                        }}
                                                    >
                                                        Choisissez le format de
                                                        l'export des details
                                                    </p>
                                                    <div
                                                        className="d-flex justify-content-center"
                                                        style={{ gap: "20px" }}
                                                    >
                                                        <btn
                                                            className="p-2"
                                                            style={{
                                                                cursor: "pointer",
                                                            }}
                                                            type="button"
                                                            onClick={
                                                                handleDownload
                                                            }
                                                        >
                                                            PDF{" "}
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 512 512"
                                                                fill="#ff0000"
                                                            >
                                                                <path d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 144-208 0c-35.3 0-64 28.7-64 64l0 144-48 0c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128zM176 352l32 0c30.9 0 56 25.1 56 56s-25.1 56-56 56l-16 0 0 32c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-48 0-80c0-8.8 7.2-16 16-16zm32 80c13.3 0 24-10.7 24-24s-10.7-24-24-24l-16 0 0 48 16 0zm96-80l32 0c26.5 0 48 21.5 48 48l0 64c0 26.5-21.5 48-48 48l-32 0c-8.8 0-16-7.2-16-16l0-128c0-8.8 7.2-16 16-16zm32 128c8.8 0 16-7.2 16-16l0-64c0-8.8-7.2-16-16-16l-16 0 0 96 16 0zm80-112c0-8.8 7.2-16 16-16l48 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0 0 32 32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0 0 48c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-64 0-64z" />
                                                            </svg>
                                                        </btn>
                                                        <OrderForm
                                                            orderDetails={orders.find(
                                                                (order) =>
                                                                    order.PcvID ===
                                                                    currentOrderID
                                                            )}
                                                            orderItems={
                                                                products
                                                            }
                                                        />
                                                        <CSVLink
                                                            data={products.map(
                                                                (product) => ({
                                                                    Code: product.ArtCode,
                                                                    Libellé:
                                                                        product.ArtLib,
                                                                    Prix: product.ArtPrixBase,
                                                                    Quantité:
                                                                        product.int_cprquantity,
                                                                    Total:
                                                                        product.int_cprquantity *
                                                                        product.ArtPrixBase,
                                                                })
                                                            )}
                                                            separator={";"}
                                                            filename={`commande-#${currentOrderID}.csv`}
                                                            target="_blank"
                                                            enclosingCharacter={``}
                                                            className=""
                                                            type="button"
                                                            style={{
                                                                color: "#2b4fa9",
                                                            }}
                                                        >
                                                            Csv
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 512 512"
                                                                fill="#008000"
                                                            >
                                                                <path d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 144-208 0c-35.3 0-64 28.7-64 64l0 144-48 0c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128zM200 352l16 0c22.1 0 40 17.9 40 40l0 8c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-8c0-4.4-3.6-8-8-8l-16 0c-4.4 0-8 3.6-8 8l0 80c0 4.4 3.6 8 8 8l16 0c4.4 0 8-3.6 8-8l0-8c0-8.8 7.2-16 16-16s16 7.2 16 16l0 8c0 22.1-17.9 40-40 40l-16 0c-22.1 0-40-17.9-40-40l0-80c0-22.1 17.9-40 40-40zm133.1 0l34.9 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-34.9 0c-7.2 0-13.1 5.9-13.1 13.1c0 5.2 3 9.9 7.8 12l37.4 16.6c16.3 7.2 26.8 23.4 26.8 41.2c0 24.9-20.2 45.1-45.1 45.1L304 512c-8.8 0-16-7.2-16-16s7.2-16 16-16l42.9 0c7.2 0 13.1-5.9 13.1-13.1c0-5.2-3-9.9-7.8-12l-37.4-16.6c-16.3-7.2-26.8-23.4-26.8-41.2c0-24.9 20.2-45.1 45.1-45.1zm98.9 0c8.8 0 16 7.2 16 16l0 31.6c0 23 5.5 45.6 16 66c10.5-20.3 16-42.9 16-66l0-31.6c0-8.8 7.2-16 16-16s16 7.2 16 16l0 31.6c0 34.7-10.3 68.7-29.6 97.6l-5.1 7.7c-3 4.5-8 7.1-13.3 7.1s-10.3-2.7-13.3-7.1l-5.1-7.7c-19.3-28.9-29.6-62.9-29.6-97.6l0-31.6c0-8.8 7.2-16 16-16z" />
                                                            </svg>
                                                        </CSVLink>
                                                    </div>
                                                </div>
                                            </div>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button
                                                variant="secondary"
                                                onClick={() =>
                                                    setShowModal(false)
                                                }
                                            >
                                                Fermer
                                            </Button>
                                        </Modal.Footer>
                                    </Modal>
                                </div>

                                <>
                                    <div
                                        className="col-lg-8 pr-lg-4 mb-6 table-min-h d-flex flex-column"
                                        style={{
                                            width: "100%",
                                            overflowX: "auto",
                                            overflowY: "hidden",
                                            whiteSpace: "nowrap",
                                            position: "relative",
                                        }}
                                    >
                                        <table className=" cart-table">
                                            <thead>
                                                <tr>
                                                    <th
                                                        className="product-quantity"
                                                        style={{
                                                            textAlign: "left",
                                                            minWidth: "150px",
                                                        }}
                                                    >
                                                        <span>N° Commande</span>
                                                    </th>

                                                    <th
                                                        className="product-price"
                                                        style={{
                                                            textAlign: "left",
                                                            minWidth: "150px",
                                                        }}
                                                    >
                                                        <span>Date</span>
                                                    </th>
                                                    <th
                                                        className="product-quantity"
                                                        style={{
                                                            textAlign: "left",
                                                            minWidth: "150px",
                                                        }}
                                                    >
                                                        <span>Montant TTC</span>
                                                    </th>
                                                    <th
                                                        className="product-subtotal"
                                                        style={{
                                                            textAlign: "left",
                                                            minWidth: "150px",
                                                        }}
                                                    >
                                                        <span>Montant HT</span>
                                                    </th>
                                                    <th
                                                        className="product-subtotal"
                                                        style={{
                                                            textAlign: "left",
                                                            minWidth: "150px",
                                                        }}
                                                    >
                                                        <span>Statut</span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="">
                                                {orders && orders.length > 0 ? (
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
                                                                            background:
                                                                                currentOrderID ===
                                                                                order.PcvID
                                                                                    ? " #3656a1"
                                                                                    : "none",
                                                                            color:
                                                                                currentOrderID ===
                                                                                order.PcvID
                                                                                    ? " #ffffff"
                                                                                    : "#3656a1",
                                                                        }}
                                                                        onClick={() =>
                                                                            handleSetCurrentOrderID(
                                                                                order.PcvID
                                                                            )
                                                                        }
                                                                    >
                                                                        <td className="product-thumbnail">
                                                                            <p
                                                                                style={{
                                                                                    margin: "1em 0px",
                                                                                }}
                                                                            >
                                                                                {
                                                                                    order.PcvID
                                                                                }
                                                                            </p>
                                                                        </td>
                                                                        <td className="product-name">
                                                                            <p
                                                                                style={{
                                                                                    margin: "1em 0px",
                                                                                }}
                                                                            >
                                                                                {" "}
                                                                                {formatDateOriginal(
                                                                                    order.PcvDate
                                                                                )}
                                                                            </p>
                                                                        </td>
                                                                        <td className="product-price">
                                                                            <p
                                                                                className=""
                                                                                style={{
                                                                                    margin: "1em 0px",
                                                                                }}
                                                                            >
                                                                                {formatPrice(
                                                                                    parseInt(
                                                                                        order.PcvMtHT
                                                                                    )
                                                                                )}{" "}
                                                                                FCFA
                                                                            </p>
                                                                        </td>
                                                                        <td className="product-price">
                                                                            <p
                                                                                className=""
                                                                                style={{
                                                                                    margin: "1em 0px",
                                                                                }}
                                                                            >
                                                                                {formatPrice(
                                                                                    parseInt(
                                                                                        order.PcvMtTTC
                                                                                    )
                                                                                )}{" "}
                                                                                FCFA
                                                                            </p>
                                                                        </td>
                                                                        <td className="product-price">
                                                                            <p
                                                                                className=""
                                                                                style={{
                                                                                    margin: "1em 0px",
                                                                                }}
                                                                            >
                                                                                <h4>
                                                                                    <span
                                                                                        className="badge badge-secondary"
                                                                                        style={{
                                                                                            display:
                                                                                                "inline-block",
                                                                                            padding:
                                                                                                ".25em",
                                                                                            fontSize:
                                                                                                "75%",
                                                                                            fontWeight: 700,
                                                                                            lineHeight: 0,
                                                                                            textAlign:
                                                                                                "center",
                                                                                            whiteSpace:
                                                                                                "nowrap",
                                                                                            verticalAlign:
                                                                                                "baseline",
                                                                                            borderRadius:
                                                                                                "99999%",
                                                                                            background:
                                                                                                "#28a745",
                                                                                            color: "#fff",
                                                                                        }}
                                                                                    >
                                                                                        <svg
                                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                                            viewBox="0 0 24 24"
                                                                                            fill="currentColor"
                                                                                            width={
                                                                                                24
                                                                                            }
                                                                                        >
                                                                                            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM17.4571 9.45711L11 15.9142L6.79289 11.7071L8.20711 10.2929L11 13.0858L16.0429 8.04289L17.4571 9.45711Z"></path>
                                                                                        </svg>
                                                                                    </span>
                                                                                </h4>
                                                                            </p>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            )}
                                                    </>
                                                ) : isLoading ? (
                                                    <tr>
                                                        <td>
                                                            Chargement des
                                                            données...
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    <tr>
                                                        <td
                                                            colSpan={5}
                                                            className="text-center"
                                                            style={{
                                                                padding: "30px",
                                                            }}
                                                        >
                                                            Aucune données
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                        <div className="d-flex justify-content-between align-items-center flex-wrap justify-content-sm-center">
                                            <div>
                                                <Pagination
                                                    currentPage={page}
                                                    totalPages={totalPage}
                                                    onPageChange={goToPage}
                                                    pageNumbers={pageNumbers}
                                                />
                                            </div>
                                        </div>
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
                                                {products && products.length > 0
                                                    ? currentProducts.map(
                                                          (product, index) => (
                                                              <div
                                                                  key={index}
                                                                  style={{
                                                                      display:
                                                                          "flex",
                                                                  }}
                                                              >
                                                                  <div
                                                                      style={{
                                                                          width: "100%",
                                                                      }}
                                                                  >
                                                                      <p
                                                                          className="mb-0"
                                                                          style={{
                                                                              textAlign:
                                                                                  "left",
                                                                          }}
                                                                      >
                                                                          {
                                                                              product.ArtLib
                                                                          }
                                                                      </p>
                                                                      <div className="d-flex justify-content-between">
                                                                          <p>
                                                                              {
                                                                                  product.int_cprquantity
                                                                              }{" "}
                                                                              *{" "}
                                                                              {formatPrice(
                                                                                  parseInt(
                                                                                      product.ArtPrixBase
                                                                                  )
                                                                              )}{" "}
                                                                              FCFA
                                                                          </p>
                                                                          <p>
                                                                              {formatPrice(
                                                                                  product.ArtPrixBase *
                                                                                      product.int_cprquantity
                                                                              )}{" "}
                                                                              FCFA
                                                                          </p>
                                                                      </div>
                                                                  </div>
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
                                                        <p className="p">
                                                            Par page:{" "}
                                                            {itemPerPage}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
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
