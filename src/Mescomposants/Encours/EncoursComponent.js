import React, { useEffect, useState } from "react";
import { useOrdersContext } from "../../contexts/OrdersContext";

const EncoursComponent = ({ totalAmount }) => {
    const clisolde = JSON.parse(localStorage.getItem("userData")).STR_SOCSOLDE;

    const { sumAmountOrders, fetchUserSumAmountOrders } = useOrdersContext();

    // Les données d'exemple
    const [data, setData] = useState({
        encours: clisolde,
        panier: totalAmount,
        commande: 0,
    });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userData"));
        if (user) {
            fetchUserSumAmountOrders();
        }
    }, []);

    useEffect(() => {
        if (sumAmountOrders !== null) {
            setData({ ...data, commande: sumAmountOrders });
        }
    }, [sumAmountOrders]);
    // console.log(data.encours)
    // Calcul de l'encours restant
    const encoursRestant =
        clisolde > 0 ? clisolde - totalAmount - data?.commande : 0;

    return (
        <div
            style={styles.container}
            className="responsive-encours order-md-4 order-2"
        >
            <div style={styles.barContainerParent}>
                <span style={styles.meter}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="34"
                        height="34"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M12 4C6.486 4 2 8.486 2 14a9.89 9.89 0 0 0 1.051 4.445c.17.34.516.555.895.555h16.107c.379 0 .726-.215.896-.555A9.89 9.89 0 0 0 22 14c0-5.514-4.486-10-10-10zm7.41 13H4.59A7.875 7.875 0 0 1 4 14c0-4.411 3.589-8 8-8s8 3.589 8 8a7.875 7.875 0 0 1-.59 3z"></path>
                        <path d="M10.939 12.939a1.53 1.53 0 0 0 0 2.561 1.53 1.53 0 0 0 2.121-.44l3.962-6.038a.034.034 0 0 0 0-.035.033.033 0 0 0-.045-.01l-6.038 3.962z"></path>
                    </svg>
                </span>
                <div style={styles.barContainer}>
                    {data.commande !== null && (
                        <div
                            style={{
                                ...styles.bar,
                                ...styles.commande,
                                width: `${
                                    (data?.commande / data?.encours) * 100
                                }%`,
                            }}
                        >
                            {/* Commandes {data?.commande.toLocaleString()} */}
                        </div>
                    )}
                    <div
                        style={{
                            ...styles.bar,
                            ...styles.panier,
                            width: `${
                                ((totalAmount * 0.05 + totalAmount) /
                                    clisolde) *
                                100
                            }%`,
                        }}
                    >
                        {/* Panier {data.panier.toLocaleString()} */}
                    </div>
                    <div
                        style={{
                            ...styles.bar,
                            ...styles.restant,
                            width: `${(encoursRestant / clisolde) * 100}%`,
                        }}
                    >
                        {/* En cours restant */}
                    </div>
                </div>
            </div>

            <div style={styles.footer}>
                <span>
                    Commandes:{" "}
                    {data.commande !== null && data?.commande.toLocaleString()}
                </span>
                <span>
                    Panier: {totalAmount ? totalAmount.toLocaleString() : 0}
                </span>
                <span>
                    Encours:{" "}
                    {encoursRestant > 0
                        ? encoursRestant.toLocaleString()
                        : "Pas d'encours"}
                </span>
            </div>

            <div style={styles.footer}>
                {/* <span>Encours du 27/09 au 27/10</span> */}
                {/* <span>{data.encours.toLocaleString()}</span> */}
                {/* <span>{(data.commande + data.panier).toLocaleString()}</span> */}
            </div>
        </div>
    );
};

// Styles en objet JavaScript
const styles = {
    container: {
        backgroundColor: "#f9f9f9",
        padding: "15px",
        borderRadius: "10px",
        width: "100%",
        // margin: "0 auto",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    barContainerParent: {
        position: "relative",
        paddingLeft: "40px",
    },
    barContainer: {
        display: "flex",
        height: "25px",
        borderRadius: "8px",
        overflow: "hidden",
        backgroundColor: "#f1f1f1",
        marginBottom: "10px",
    },
    bar: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontSize: "12px",
        whiteSpace: "nowrap",
    },
    commande: {
        backgroundColor: "#6c92dd",
    },
    panier: {
        backgroundColor: "#3656a1",
    },
    restant: {
        backgroundColor: "#bad3fb",
    },
    footer: {
        display: "flex",
        justifyContent: "space-between",
        fontSize: "12px",
        // color: "#4a5568",
        color: "#336699 !important",
        fontWeight: "bold",
    },
    meter: {
        position: "absolute",
        left: "0",
        bottom: "-12px",
    },
};

export default EncoursComponent;
