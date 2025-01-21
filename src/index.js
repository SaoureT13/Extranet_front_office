import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ThemeProvider } from "./contexts/ThemeContext";
import { HeaderProvider } from "./contexts/HeaderContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OrdersProvider } from "./contexts/OrdersContext";

const queryClient = new QueryClient();

ReactDOM.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <HeaderProvider>
                    <OrdersProvider>
                        <App />
                    </OrdersProvider>
                </HeaderProvider>
            </ThemeProvider>
        </QueryClientProvider>
    </React.StrictMode>,
    document.getElementById("root")
);
reportWebVitals();
