// src/components/Accueil.js
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

const MobileMenu = ({ megaMenu }) => {
    return (
        <>
            {/* Start of Mobile Menu */}
            <div
                className="mobile-menu-wrapper"
                style={{ background: "#214293;" }}
            >
                <div className="mobile-menu-overlay" />
                {/* End of .mobile-menu-overlay */}
                <Link to="#" className="mobile-menu-close">
                    <i className="close-icon" />
                </Link>
                {/* End of .mobile-menu-close */}
                <div className="mobile-menu-container scrollable">
                    <div className="tab-content">
                        <div className="tab-pane active" id="main-menu">
                            <ul className="mobile-menu">
                                <li>
                                    <Link to="/">Accueil</Link>
                                </li>
                                <li>
                                    <Link to="/shop">Nos Produits</Link>
                                    <ul>
                                        {megaMenu &&
                                            megaMenu.map((item, index) => (
                                                <li key={index}>
                                                    <Link to="/shop">
                                                        {item.title}
                                                    </Link>
                                                    <ul>
                                                        {item.items.map(
                                                            (
                                                                subItem,
                                                                subIndex
                                                            ) => (
                                                                <li>
                                                                    <Link
                                                                        to={
                                                                            subItem.href
                                                                        }
                                                                        key={
                                                                            subIndex
                                                                        }
                                                                    >
                                                                        {
                                                                            subItem.label
                                                                        }
                                                                    </Link>
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                </li>
                                            ))}
                                    </ul>
                                </li>
                                <li>
                                    <Link to="vendor-dokan-store.html">
                                        Services
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/contact">Contacts</Link>
                                </li>
                                {JSON.parse(
                                    localStorage.getItem("userData")
                                ) && (
                                    <li>
                                        <Link to="">Tableau de bord</Link>
                                        <ul>
                                            <li>
                                                <Link to="/livraison">
                                                    Calendrier de livraison
                                                </Link>
                                                <Link to="/mes-commandes">
                                                    Mes commandes
                                                </Link>
                                                <Link to="/factures">
                                                    Mes factures
                                                </Link>
                                            </li>
                                        </ul>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            {/* End of Mobile Menu */}
        </>
    );
};

export default MobileMenu;
