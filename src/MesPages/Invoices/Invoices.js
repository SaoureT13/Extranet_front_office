import React, { useCallback } from "react";
import Pagination from "../../Mescomposants/Pagination/Pagination";
import { formatPrice } from "../Panier/Cart";
import { crudData, formatDateOriginal } from "../../services/apiService";
import { useState, useEffect } from "react";
import { generatePageNumbers } from "../../services/lib";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

function Invoices({ param = {} }) {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const [totalPage, setTotalPage] = useState(0);
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeFilters, setActiveFilters] = useState(() => {
        const filters = {
            year: "",
            statut: "",
            search: "",
        };
        searchParams.forEach((value, key) => {
            filters[key] = value;
        });
        delete filters.limit;
        delete filters.page;
        return filters;
    });
    const [page, setPage] = useState(() => {
        return parseInt(searchParams.get("page")) || 1;
    });
    const [limit, setLimit] = useState(() => {
        return parseInt(searchParams.get("limit")) || 20;
    });

    useEffect(() => {
        const updatedFilters = {
            year: "",
            statut: "",
            search: "",
        };

        searchParams.forEach((value, key) => {
            updatedFilters[key] = value;
        });

        setActiveFilters(updatedFilters);
    }, [searchParams]);

    const handleActiveFilters = useCallback(
        (filterName, filterValue) => {
            setActiveFilters((prevActiveFilters) => {
                const updatedFilters = structuredClone(prevActiveFilters);

                // if (!updatedFilters[filterName]) {
                //     updatedFilters[filterName] = [filterValue];
                // } else if (updatedFilters[filterName].includes(filterValue)) {
                //     updatedFilters[filterName] = updatedFilters[
                //         filterName
                //     ].filter((val) => val !== filterValue);
                // } else {
                //     updatedFilters[filterName].push(filterValue);
                // }
                updatedFilters[filterName] = filterValue;
                const params = new URLSearchParams();
                Object.keys(updatedFilters).forEach((key) => {
                    updatedFilters[key] !== ""
                        ? params.set(key, updatedFilters[key])
                        : params.delete(key);
                });
                params.set("limit", limit);
                params.set("page", 1);
                setSearchParams(params);

                return updatedFilters;
            });
        },
        [setSearchParams, limit]
    );

    const handleClearActiveFilters = () => {
        setSearchParams({});
    };

    const goToPage = (page) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", page);
        setSearchParams(params);
        setPage(page);
    };

    const handleSetLimit = (limit) => {
        const params = new URLSearchParams(searchParams);
        params.set("limit", limit);
        params.set("page", 1);
        setSearchParams(params);
        setPage(1);
        setLimit(limit);
    };

    const handleSearch = (e) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", 1);
        params.set("search", e);
        setSearchParams(params);
        setPage(1);
        setActiveFilters({
            ...activeFilters,
            search: e,
        });
    };

    const fetchProducts = async (activeFilters) => {
        const data = new URLSearchParams();

        for (const key in activeFilters) {
            if (key === "search") {
                if (activeFilters[key] !== "") {
                    data.append("FILTER_OPTIONS[search]", activeFilters[key]);
                }
            }
            if (key === "year") {
                if (activeFilters[key] !== "") {
                    data.append("FILTER_OPTIONS[PcvDate]", activeFilters[key]);
                }
            }
            if (key === "statut") {
                if (activeFilters[key] !== "") {
                    data.append(
                        "FILTER_OPTIONS[PcvEtatFNuf]",
                        activeFilters[key]
                    );
                }
            }
        }

        data.append("FILTER_OPTIONS[PcvGCliID]", userData.LG_CLIID);

        data.append("LIMIT", limit);
        data.append("PAGE", page);
        data.append("mode", "listInvoices");

        try {
            const response = await crudData(data, "CommandeManager.php", false);
            setTotalPage(() => {
                return Math.ceil(response.data["total"] / limit);
            });
            return response.data.data;
        } catch (error) {
            console.error(error);
        }
    };

    const { data: invoices, isLoading } = useQuery({
        queryKey: ["invoices", activeFilters, page, limit],
        queryFn: () => fetchProducts(activeFilters),
        placeholderData: keepPreviousData,
    });

    const [pageNumbers, setPageNumbers] = useState([]);
    useEffect(() => {
        setPageNumbers(generatePageNumbers(totalPage, page));
    }, [page, totalPage]);

    return (
        <div className={` ${param.userData ? "bgUserConnected" : ""}`}>
            <div className="page-wrapper">
                <main className="main cart">
                    <div className="page-content">
                        <div className="container">
                            <div
                                className="row gutter-lg mb-10 page-contnainer bg-blue-light p-5"
                                style={{ minHeight: "314px" }}
                            >
                                <div className="d-flex align-items-center flex-wrap mb-4">
                                    <h1 className="mb-0 mr-4">Mes factures</h1>
                                </div>

                                <>
                                    <div className="d-flex align-items-top mb-4 flex-wrap">
                                        <div
                                            className="search-bar mb-4"
                                            style={{ marginRight: "20px" }}
                                        >
                                            <input
                                                type="text"
                                                className="form-control"
                                                style={{
                                                    color: "#336699",
                                                    borderColor: "#336699",
                                                    borderWidth: "2px",
                                                }}
                                                placeholder="N° Commande"
                                                value={activeFilters.search}
                                                onChange={(e) =>
                                                    handleSearch(e.target.value)
                                                }
                                            />
                                        </div>
                                        <div>
                                            <h4
                                                style={{
                                                    margin: "0px 20px 0px 0px",
                                                }}
                                            >
                                                Filtrer par:
                                            </h4>
                                            <div className="d-flex align-items-center gap-4">
                                                <div>
                                                    <label htmlFor="year">
                                                        Année:{" "}
                                                    </label>
                                                    <select
                                                        name="year"
                                                        id="year"
                                                        className="form-select "
                                                        style={{
                                                            padding: "6px 10px",
                                                            fontFamily:
                                                                "Poppins",
                                                            marginRight: "10px",
                                                            binvoice: "none",
                                                            background:
                                                                "#214293",
                                                            color: "white",
                                                            border: "none",
                                                        }}
                                                        onChange={(e) =>
                                                            handleActiveFilters(
                                                                "year",
                                                                e.target.value
                                                            )
                                                        }
                                                    >
                                                        <option value="">
                                                            Toutes
                                                        </option>
                                                        <option value="2020">
                                                            2020
                                                        </option>
                                                        <option value="2021">
                                                            2021
                                                        </option>
                                                        <option value="2022">
                                                            2022
                                                        </option>
                                                        <option value="2023">
                                                            2023
                                                        </option>
                                                        <option value="2024">
                                                            2024
                                                        </option>
                                                        <option value="2025">
                                                            2025
                                                        </option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label htmlFor="year">
                                                        Statut:{" "}
                                                    </label>
                                                    <select
                                                        name="year"
                                                        id="year"
                                                        className="form-select "
                                                        style={{
                                                            padding: "6px 10px",
                                                            fontFamily:
                                                                "Poppins",
                                                            marginRight: "10px",
                                                            binvoice: "none",
                                                            background:
                                                                "#214293",
                                                            color: "white",
                                                            border: "none",
                                                        }}
                                                        onChange={(e) =>
                                                            handleActiveFilters(
                                                                "statut",
                                                                e.target.value
                                                            )
                                                        }
                                                    >
                                                        <option value="">
                                                            Toutes
                                                        </option>
                                                        <option value="NufPcvEtatFNo">
                                                            Non réglé
                                                        </option>
                                                        <option value="NufPCVEtatFT">
                                                            Réglé
                                                        </option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="col-lg-12 pr-lg-4 mb-6 table-min-h d-flex flex-column"
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
                                                            textAlign: "center",
                                                        }}
                                                    >
                                                        <span>Statut</span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="">
                                                {invoices &&
                                                invoices.length > 0 ? (
                                                    <>
                                                        {invoices &&
                                                            invoices.map(
                                                                (
                                                                    invoice,
                                                                    index
                                                                ) => (
                                                                    <tr
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="item-hover"
                                                                        // style={{
                                                                        //     background:
                                                                        //         currentinvoiceID ===
                                                                        //         invoice.PcvID
                                                                        //             ? " #3656a1"
                                                                        //             : "none",
                                                                        //     color:
                                                                        //         currentinvoiceID ===
                                                                        //         invoice.PcvID
                                                                        //             ? " #ffffff"
                                                                        //             : "#3656a1",
                                                                        // }}
                                                                        // onClick={() =>
                                                                        //     handleSetCurrentinvoiceID(
                                                                        //         invoice.PcvID
                                                                        //     )
                                                                        // }
                                                                    >
                                                                        <td className="product-thumbnail">
                                                                            <p
                                                                                style={{
                                                                                    margin: "1em 0px",
                                                                                }}
                                                                            >
                                                                                #
                                                                                {
                                                                                    invoice.PcvID
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
                                                                                    invoice.PcvDate
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
                                                                                        invoice.PcvMtHT
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
                                                                                        invoice.PcvMtTTC
                                                                                    )
                                                                                )}{" "}
                                                                                FCFA
                                                                            </p>
                                                                        </td>
                                                                        <td className="product-price">
                                                                            <p
                                                                                className="text-center"
                                                                                style={{
                                                                                    margin: "1em 0px",
                                                                                }}
                                                                            >
                                                                                {invoice.PcvEtatFNuf ===
                                                                                    "NufPCVEtatFNo" ||
                                                                                invoice.PcvEtatFNuf ===
                                                                                    "NufPcvEtatFNo" ? (
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
                                                                                                "#fd7e14 ",
                                                                                            color: "#fff",
                                                                                        }}
                                                                                    >
                                                                                        {/* <svg
                                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                                            viewBox="0 0 24 24"
                                                                                            fill="currentColor"
                                                                                            width={
                                                                                                24
                                                                                            }
                                                                                        >
                                                                                            <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 10.5858L9.17157 7.75736L7.75736 9.17157L10.5858 12L7.75736 14.8284L9.17157 16.2426L12 13.4142L14.8284 16.2426L16.2426 14.8284L13.4142 12L16.2426 9.17157L14.8284 7.75736L12 10.5858Z"></path>
                                                                                        </svg> */}
                                                                                        <svg
                                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                                            viewBox="0 0 24 24"
                                                                                            fill="currentColor"
                                                                                            width={
                                                                                                24
                                                                                            }
                                                                                        >
                                                                                            <path d="M6 4H4V2H20V4H18V6C18 7.61543 17.1838 8.91468 16.1561 9.97667C15.4532 10.703 14.598 11.372 13.7309 12C14.598 12.628 15.4532 13.297 16.1561 14.0233C17.1838 15.0853 18 16.3846 18 18V20H20V22H4V20H6V18C6 16.3846 6.81616 15.0853 7.8439 14.0233C8.54682 13.297 9.40202 12.628 10.2691 12C9.40202 11.372 8.54682 10.703 7.8439 9.97667C6.81616 8.91468 6 7.61543 6 6V4ZM8 4V6C8 6.68514 8.26026 7.33499 8.77131 8H15.2287C15.7397 7.33499 16 6.68514 16 6V4H8ZM12 13.2219C10.9548 13.9602 10.008 14.663 9.2811 15.4142C9.09008 15.6116 8.92007 15.8064 8.77131 16H15.2287C15.0799 15.8064 14.9099 15.6116 14.7189 15.4142C13.992 14.663 13.0452 13.9602 12 13.2219Z"></path>
                                                                                        </svg>
                                                                                    </span>
                                                                                ) : (
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
                                                                                )}
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
                                        <div className="d-flex justify-content-end align-items-center">
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

export default Invoices;
