import { useEffect, useState } from "react";
import { crudData, formatDateOriginal } from "../../services/apiService";
import { formatPrice } from "../Panier/Cart";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { generatePageNumbers } from "../../services/lib";
import { toast } from "react-toastify";
import MostPopularProductsCard from "../../Mescomposants/MostPopularProductsCard/MostPopularProductsCard";
import OrderChart from "../../Mescomposants/OrderChart/OrderChart";

function Dashboard({ param }) {
    const [contentID, setContentID] = useState(1);

    const handleChangeContentID = (id) => {
        setContentID(id);
    };

    const listOptions = [
        "Chriffre d'affaire",
        "Produits les plus consultés",
        " Produits les plus commandés",
    ];

    return (
        <div className={` ${param.userData ? "bgUserConnected" : ""}`}>
            <div className="container">
                <div className="bg-blue-light p-5">
                    <div className="row">
                        <h2>Tableau de bord</h2>
                        {/* <div className="col-lg-3">
                            <aside
                                className="sidebar shop-sidebar left-sidebar sticky-sidebar-wrapper sidebar-fixed page-container"
                                style={{ margin: 0 }}
                            >
                                <div
                                    className="sidebar-content scrollablei"
                                    style={{ padding: 0 }}
                                >
                                    <div className="sticky-sidebar">
                                        <div className="widget widget-collapsible">
                                            {listOptions.map(
                                                (option, index) => (
                                                    <div
                                                        className="widget-header"
                                                        key={index}
                                                    >
                                                        <button
                                                            className="btn"
                                                            style={
                                                                index + 1 !==
                                                                contentID
                                                                    ? {
                                                                          color: "rgb(54, 86, 161)",
                                                                          borderColor:
                                                                              "white",

                                                                          width: "100%",
                                                                          textAlign:
                                                                              "left",
                                                                      }
                                                                    : {
                                                                          color: "#fff",
                                                                          backgroundColor:
                                                                              "rgb(54, 86, 161)",
                                                                          borderColor:
                                                                              "rgb(54, 86, 161)",
                                                                          width: "100%",
                                                                          textAlign:
                                                                              "left",
                                                                          overflow:
                                                                              "hidden",
                                                                      }
                                                            }
                                                            onClick={() =>
                                                                handleChangeContentID(
                                                                    index + 1
                                                                )
                                                            }
                                                        >
                                                            {option}
                                                        </button>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </aside>
                        </div> */}
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
                            <OrderChart />
                            {/* {contentID === 2 ? ( */}
                            <hr className="product-divider" />
                            <hr className="product-divider" />
                            <MostPopularProductsCard />
                            {/* ) : contentID === 1 ? ( */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
