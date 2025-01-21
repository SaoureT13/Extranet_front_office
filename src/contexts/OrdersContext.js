import React, { createContext, useContext, useState } from "react";
import { crudData } from "../services/apiService";

const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
    const [sumAmountOrders, setSumAmountOrders] = useState(null);

    const fetchUserSumAmountOrders = () => {
        const user = JSON.parse(localStorage.getItem("userData"));
        if (user) {
            const params = {
                mode: "listOrdersByClient",
                LG_CLIID: user.LG_CLIID,
            };

            crudData(params, "CommandeManager.php").then((res) => {
                setSumAmountOrders(res.data.data.sumAmountOrders);
            });
        }
    };

    return (
        <OrdersContext.Provider
            value={{ sumAmountOrders, fetchUserSumAmountOrders }}
        >
            {children}
        </OrdersContext.Provider>
    );
};

export const useOrdersContext = () => useContext(OrdersContext);
