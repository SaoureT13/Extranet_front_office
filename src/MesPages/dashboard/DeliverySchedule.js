import React, { useEffect, useState } from "react";
import { crudData } from "../../services/apiService";

// Données des onglets
const tabsData = [
    {
        id: "product-tab-centre-nord",
        title: "Centre-nord",
    },
    {
        id: "product-tab-est",
        title: "Est",
    },
    {
        id: "product-tab-sud-est",
        title: "Sud-est",
    },
];

// Données des listes
const listsData = {
    "product-tab-centre-nord": [
        {
            id: 67,
            date: "01/07 avant 12H00",
            deliveryDate: "03/07",
            areas: "Abidjan - Agboville - Adzopé - Abengourou - Agnibilékrou - Daoukro",
        },
        {
            id: 71,
            date: "01/07 avant 12H00",
            deliveryDate: "03/07",
        },
        {
            id: 72,
            date: "01/07 avant 12H00",
            deliveryDate: "03/07",
        },
    ],
    "product-tab-est": [
        {
            id: 69,
            date: "01/07 avant 12H00",
            deliveryDate: "03/07",
        },
        {
            id: 71,
            date: "01/07 avant 12H00",
            deliveryDate: "03/07",
        },
        {
            id: 72,
            date: "01/07 avant 12H00",
            deliveryDate: "03/07",
        },
    ],
    "product-tab-sud-est": [
        {
            id: 70,
            date: "01/07 avant 12H00",
            deliveryDate: "03/07",
        },
        {
            id: 71,
            date: "01/07 avant 12H00",
            deliveryDate: "03/07",
        },
        {
            id: 72,
            date: "01/07 avant 12H00",
            deliveryDate: "03/07",
        },
    ],
};

const ProductTabs = ({ param = {} }) => {
    // Initialiser l'onglet actif avec 'product-tab-est'
    const [activeTab, setActiveTab] = useState("product-tab-est");
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState({});
    const apiEndpointe = JSON.parse(localStorage.getItem("apiEndpointe"));
    const mode = JSON.parse(localStorage.getItem("appMode"));
    const userData = JSON.parse(localStorage.getItem("userData"));

    // useEffect(() => {
    //   if(Object.entries(data).length !== 0){
    //     setActiveTab(data?.tabsData[0].id);
    //   }
    // }, [data])

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
    };

    const fetchData = (params, url) => {
        setIsLoading(true);
        crudData(params, url)
            .then((response) => {
                setIsLoading(false);
                if (response && response.status === 200) {
                    const data = response.data.data || [];
                    setActiveTab(data?.tabsData[0].id);
                    setData(data);
                } else {
                    console.error("Erreur HTTP:", response);
                }
            })
            .catch((error) => {
                setIsLoading(false);
                console.error(
                    "Erreur lors de la récupération des données:",
                    error
                );
            });
    };

    useEffect(() => {
        const params = {
            mode: mode.getClientCalendarMode,
            LG_AGEID: userData?.LG_AGEID,
            // LG_AGEID: "MLrfU4PCOrnQ7C8na9mz",
        };
        fetchData(params, apiEndpointe.CommandeManagerEndPoint);
    }, [
        userData?.LG_AGEID,
        mode.getClientCalendarMode,
        apiEndpointe.CommandeManagerEndPoint,
    ]);

    return (
        <div className={` ${param.userData ? "bgUserConnected" : ""}`}>
            <div className="container">
                <div className="bg-blue-light p-5">
                    <div className="delivery-schedule-header">
                        <h2>Calendrier de livraison</h2>
                        <p>
                            Les livraisons seront gratuites, mais nous ne
                            prendrons pas les produits de nos concurrents. NB:
                            Veuillez respecter la date limite de Commande{" "}
                            <strong>DONT L'HEURE LIMITE EST DE 12 H 00</strong>,
                            passer cette heure les commandes ne seront pas
                            prises en compte pour la livraison de l'intérieur,
                            pour nous permettre de préparer les colis, et ne pas
                            retarder la livraison.
                        </p>
                    </div>
                    <div className="tab tab-nav-boxed tab-nav-underline product-tabs">
                        {isLoading ? (
                            <div className="tab-content d-flex justify-content-center p-3">
                                <p>Chargement des données...</p>
                            </div>
                        ) : Object.entries(data).length !== 0 ? (
                            <>
                                <ul className="nav nav-tabs" role="tablist">
                                    {Object.entries(data).length !== 0 &&
                                        data?.tabsData.map((tab) => (
                                            <li
                                                className="nav-item"
                                                key={tab.id}
                                            >
                                                <a
                                                    href={`#${tab.id}`}
                                                    className={`nav-link ${
                                                        activeTab === tab.id
                                                            ? "active"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        handleTabClick(tab.id)
                                                    }
                                                >
                                                    {tab.title}
                                                </a>
                                            </li>
                                        ))}
                                </ul>
                                <div className="tab-content d-flex">
                                    {Object.entries(data).length !== 0 &&
                                        data?.tabsData.map((tab) => (
                                            <div
                                                key={tab.id}
                                                className={`tab-pane p-5 ${
                                                    activeTab === tab.id
                                                        ? "active in"
                                                        : ""
                                                }`}
                                                id={tab.id}
                                            >
                                                <ul className="list-none">
                                                    {Object.entries(data)
                                                        .length !== 0 &&
                                                        data?.listsData[
                                                            tab.id
                                                        ].map((item, index) => (
                                                            <li key={index}>
                                                                <strong>
                                                                    LIVRAISON{" "}
                                                                    {item.id}
                                                                </strong>{" "}
                                                                | Date limite de
                                                                commande{" "}
                                                                {item.date} |
                                                                Livraison{" "}
                                                                {
                                                                    item.deliveryDate
                                                                }
                                                            </li>
                                                        ))}
                                                </ul>
                                            </div>
                                        ))}
                                    <div className="calendar-icon">
                                        <img
                                            src="assets/images/icone-calendar.png"
                                            width={100}
                                            alt="Calendar Icon"
                                            className="pull-right"
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="tab-content d-flex justify-content-center p-3">
                                <p>
                                    Vous n'êtes présent sur aucun calendrier de
                                    livraison
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductTabs;
