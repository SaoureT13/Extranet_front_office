import "./App.css";
import React, { useState } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import Accueil from "./MesPages/Home/Accueil.js";
import DetailProduct from "./MesPages/Detail/DetailProduct.js";
import Shop from "./MesPages/Shop";
import Cart from "./MesPages/Panier/Cart.js";
import Livraison from "./MesPages/Panier/Livraison.js";
import LoadExternalScripts from "./Mescomposants/LoadExternalScripts";
import Form from "./Dashboard/Form.js";
import Contact from "./MesPages/pageContact/Contact.js";
import PartnerList from "./MesPages/partenaire/PartnerList.js";
import SaveClient from "./MesPages/SaveClient/SaveClient.js";
import TopBar from "./Mescomposants/Header/TopBar";

import Footer from "./Mescomposants/Footer.js";

import DeliverySchedule from "./MesPages/dashboard/DeliverySchedule.js";
import { ToastContainer } from "react-toastify";
import Commandes from "./MesPages/Commandes/Commandes.js";
import InvoicePDF from "./Mescomposants/exportPDF/InvoicePDF.js";
import Invoices from "./MesPages/Invoices/Invoices.js";

function App() {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const mode = JSON.parse(localStorage.getItem("appMode"));
    const apiEndpointe = JSON.parse(localStorage.getItem("apiEndpointe"));
    const paths = JSON.parse(localStorage.getItem("appPaths"));

    const urlBaseImage = localStorage.getItem("urlBaseImage");

    const defaultImage = JSON.parse(localStorage.getItem("defaultImage"));

    const imageRuptureStock = localStorage.getItem("imageRuptureStock");

    const params = {
        userData: userData,
        mode: mode,
        apiEndpointe: apiEndpointe,
        paths: paths,
        urlBaseImage: urlBaseImage,
    };

    const [triggerRequest, setTriggerRequest] = useState(false);

    const handleSuccess = () => {
        console.log(
            "Succès de la première requête, on déclenche la deuxième..."
        );
        setTriggerRequest(true); // Déclenche la requête dans B
    };

    const handleRequestComplete = () => {
        console.log(
            "Requête dans B terminée, réinitialisation de triggerRequest"
        );
        setTriggerRequest(false); // Réinitialise l'état pour permettre un nouveau clic
    };

    // const [quantiteTicketGratuit, setQuantiteTicketGratuit] = useState(false);

    // const handleQuantityUpdate = (totalQuantities) => {
    //   console.log("Quantité totale des tickets:", totalQuantities);
    //   setQuantiteTicketGratuit(totalQuantities);
    // };

    return (
        <div>
            <Router>
                {/* TopBar is now inside Router */}
                {/* <TopBar  quantity={quantiteTicketGratuit}/> */}
                <TopBar
                    param={params}
                    triggerRequest={triggerRequest}
                    onComplete={handleRequestComplete}
                />
                <Routes>
                    <Route path="*" element={<Navigate to="/" />} />
                    <Route
                        path="/"
                        element={
                            <Accueil
                                param={params}
                                defaultImage={defaultImage}
                                onSuccess={handleSuccess}
                            />
                        }
                    />
                    <Route
                        path="/detail-produit"
                        element={
                            <DetailProduct
                                param={params}
                                defaultImage={defaultImage}
                                imageRuptureStock={imageRuptureStock}
                                onSuccess={handleSuccess}
                            />
                        }
                    />
                    <Route
                        path="/shop/:params?"
                        element={
                            <Shop param={params} defaultImage={defaultImage} />
                        }
                    />
                    <Route
                        path="/cart"
                        element={
                            <Cart param={params} onSuccess={handleSuccess} />
                        }
                    />
                    <Route path="/form" element={<Form />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route
                        path="/choix-livraison"
                        element={<Livraison onSuccess={handleSuccess} />}
                    />
                    <Route path="/partenaire" element={<PartnerList />} />
                    <Route path="/saveclient" element={<SaveClient />} />
                    <Route
                        path="/livraison"
                        element={<DeliverySchedule param={params} />}
                    />
                    <Route path="/mes-commandes" element={<Commandes />} />
                    <Route path="/factures" element={<Invoices />} />
                    <Route path="/pdf-tst" element={<InvoicePDF />} />
                    {/* Redirection vers la page d'accueil */}
                </Routes>
                <Footer param={params} />
            </Router>
            <LoadExternalScripts />
            <ToastContainer />
        </div>
    );
}

export default App;
