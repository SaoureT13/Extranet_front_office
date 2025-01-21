import React from "react";
import { useTheme } from "../contexts/ThemeContext";
import MobileMenu from "./MobileMenu";
import { NavLink } from "react-router-dom";

function Footer({ param = {} }) {
    const { theme, toggleTheme } = useTheme();

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth", // Optionnel : pour un défilement en douceur
        });
    };

    return (
        <div className={` ${param.userData != null ? "bgUserConnected" : ""}`}>
            <footer
                className=" pt-10"
                data-animation-options='{"name": "fadeIn"}'
            >
                <button
                    onClick={scrollToTop}
                    style={{
                        position: "fixed",
                        bottom: "20px",
                        right: "20px",
                        borderRadius: "50%",
                        padding: "10px",
                        border: "none",
                        background: "#fff302",
                        color: "#2b4Fa9",
                        cursor: "pointer",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        width={28}
                    >
                        <path d="M12 4.83582L5.79291 11.0429L7.20712 12.4571L12 7.66424L16.7929 12.4571L18.2071 11.0429L12 4.83582ZM12 10.4857L5.79291 16.6928L7.20712 18.107L12 13.3141L16.7929 18.107L18.2071 16.6928L12 10.4857Z"></path>
                    </svg>
                </button>
                <div className="container text-center">
                    <div
                        style={{
                            width: "70%",
                            margin: "0 auto",
                            marginTop: "30px",
                            marginBottom: "30px",
                        }}
                        className="m"
                    >
                        <img src="assets/images/image_footer.png" alt="Icon" />
                    </div>
                    <div
                        style={{
                            width: "80%",
                            margin: "0 auto",
                            marginTop: "30px",
                        }}
                        className="m"
                    >
                        <h3 className="text-center">CONTACTEZ UN CONSEILLER</h3>
                        <p className="text-center">
                            Nous sommes là pour vous accompagner efficacement
                            dans le choix et la commande de vos produits.
                        </p>
                        <div className="footer-top pt-3">
                            <div className="row mx-auto">
                                <div className="col-lg-4 col-sm-6">
                                    <div className="widget">
                                        <h3 className="widget-title">
                                            Par Email
                                        </h3>
                                        <ul className="widget-body">
                                            <li>
                                                <a
                                                    href="mailto:snproveci@snproveci.com"
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    snproveci@snproveci.com
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    href="mailto:comptoir@snproveci.com"
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    comptoir@snproveci.com
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-sm-6">
                                    <div className="widget">
                                        <h3 className="widget-title">
                                            Par téléphone
                                        </h3>
                                        <ul className="widget-body">
                                            <li>
                                                <a href="tel:+2252721353027">
                                                    (+225) 27 21 35 30 27
                                                </a>
                                            </li>
                                            <li>
                                                <a href="tel:+2250102487053">
                                                    (+225) 01 02 48 70 53
                                                </a>
                                            </li>
                                            <li>
                                                <a href="tel:+2250102504440">
                                                    (+225) 01 02 50 44 40
                                                </a>
                                            </li>
                                        </ul>
                                        <h3 className="widget-title">
                                            Par Fax
                                        </h3>
                                        <ul className="widget-body">
                                            <li>
                                                <a href="tel:+2252721353029">
                                                    (+225) 27 21 35 30 29
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-sm-6">
                                    <div className="widget">
                                        <h4 className="widget-title">
                                            Localisation
                                        </h4>
                                        <ul className="widget-body">
                                            <li>
                                                <a
                                                    href="https://maps.app.goo.gl/fmcDXPVbGJ8tPT6y8"
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    <p>
                                                        Marcory Zone 4 rue G64
                                                        du canal boulevard{" "}
                                                        <br /> À côté du Golden
                                                        Hôtel <br /> 18 BP 2863
                                                        Abidjan 18
                                                    </p>{" "}
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <div className="footer-left">
                            <p className="copyright">
                                Copyright © 2021 SN-PROVECI. Tous droits
                                réservés.
                            </p>
                        </div>
                        {/* <div className="footer-right">
                        <span className="payment-label mr-lg-8">We're using safe payment for</span>
                        <figure className="payment">
                            <img src="assets/images/payment.png" alt="payment" width="159" height="25" />
                        </figure>
                    </div> */}
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Footer;
