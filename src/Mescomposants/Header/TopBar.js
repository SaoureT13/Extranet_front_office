// src/components/Accueil.js
import React, { useState, useEffect, useContext } from "react"; // Importation de React et des hooks useState et useEffect
import { useTheme } from "../../contexts/ThemeContext";
import DesktopMenu from "../DesktopMenu";
import MainNav from "../MainNav";
import SideCart from "../SideCart";
import { useNavigate } from "react-router-dom"; // Utilisez useNavigate pour la redirection
import { fetchEvenements, crudData } from "../../services/apiService"; // Importation de la fonction deleteProduct
// import './CartItem.css'; // Make sure to create a corresponding CSS file
import { toast } from "react-toastify";
import ErrorCard from "../ErrorCard";
import { NavLink } from "react-router-dom";
import { Modal, Button, Dropdown } from "react-bootstrap";
import { doConnexion, doDisConnexion } from "../../services/apiService";
import EncoursComponent from "../Encours/EncoursComponent";
import "./login.css"; // Add your custom styles here

const TopBar = ({ param, onComplete, triggerRequest }) => {
    const { theme, toggleTheme } = useTheme();
    const [showModal, setShowModal] = useState(false); // State to control modal visibility
    const userData = JSON.parse(localStorage.getItem("userData"));
    const mode = JSON.parse(localStorage.getItem("appMode"));
    const apiEndpointe = JSON.parse(localStorage.getItem("apiEndpointe"));
    const paths = JSON.parse(localStorage.getItem("appPaths"));
    const [statusCode, setStatusCode] = useState(null);
    const [productData, setProductData] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);

    // LOGIN SYSTEME
    const [STR_UTILOGIN, setEmail] = useState("");
    const [STR_UTIPASSWORD, setPassword] = useState("");
    const [IS_ADMIN, setCodeSociete] = useState(0);

    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [encours, setEncours] = useState(null); // Nouvel état pour l'encours

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const params = new URLSearchParams();
            params.append("mode", param.mode.doConnexionMode);
            params.append("STR_UTILOGIN", STR_UTILOGIN);
            params.append("STR_UTIPASSWORD", STR_UTIPASSWORD);
            params.append("IS_ADMIN", IS_ADMIN);

            const response = await doConnexion(params);
            const userData = response.data;

            if (userData.code_statut === "1") {
                localStorage.setItem("userData", JSON.stringify(userData));

                // Fermer le modal et actualiser la page
                setShowModal(false); // Ferme le modal
                window.location.reload(); // Actualise la page
            } else {
                setError(userData.desc_statut);
            }
        } catch (error) {
            setError("Erreur de connexion. Veuillez réessayer.");
        }
    };

    const fetchPanierData = async (params, url, setTotalAmount) => {
        crudData(params, url)
            .then((response) => {
                if (response && response.status === 200) {
                    onComplete();
                } else {
                    console.error("Erreur HTTP:", response);
                    setStatusCode(response?.status || "Unknown error");
                }
            })
            .catch((error) => {
                setStatusCode(404);
                console.error(
                    "Erreur lors de la récupération des données:",
                    error
                );
            });
    };

    const fetchData = async (params, url, setProductData, setTotalAmount) => {
        crudData(params, url)
            .then((response) => {
                if (response && response.status === 200) {
                    const produitVeto = response.data.lines || []; // Ensure it's an array
                    const panier = Array.isArray(produitVeto)
                        ? produitVeto
                        : [];

                    // Calculer le montant total du panier
                    const totalAmount = panier.reduce((acc, item) => {
                        // Enlever les espaces éventuels et convertir en nombres
                        const prixUnitaire =
                            parseFloat(item.PlvPUNet.trim()) || 0;
                        const quantite = parseFloat(item.PlvQteUV.trim()) || 0;
                        return acc + prixUnitaire * quantite;
                    }, 0);
                    setProductData(panier);
                    setTotalAmount(totalAmount);
                    onComplete();
                } else {
                    console.error("Erreur HTTP:", response);
                    setStatusCode(response?.status || "Unknown error");
                }
            })
            .catch((error) => {
                setStatusCode(404);
                console.error(
                    "Erreur lors de la récupération des données:",
                    error
                );
            });
    };

    useEffect(() => {
        if (triggerRequest) {
            console.log("Quantity is greater than 0, refreshing component...");
            const params = {
                mode: mode.listCommandeproductMode,
                LG_AGEID: userData.LG_AGEID,
            };

            fetchData(
                params,
                apiEndpointe.CommandeManagerEndPoint,
                setProductData,
                setTotalAmount
            );

            const paramPanier = {
                mode: mode.getExternalClientPanierMode,
                LG_AGEID: userData.LG_AGEID,
            };
            fetchPanierData(
                paramPanier,
                apiEndpointe.CommandeManagerEndPoint,
                setTotalAmount
            );
        }
    }, [triggerRequest, onComplete]); // The effect will run whenever `quantity` changes

    useEffect(() => {
        //console.log(userData);

        if (userData) {
            // setUser(userData); // Set user in state
            const params = {
                mode: mode.listCommandeproductMode,
                LG_AGEID: userData.LG_AGEID,
            };
            fetchData(
                params,
                apiEndpointe.CommandeManagerEndPoint,
                setProductData,
                setTotalAmount
            );
        }
    }, []);

    const handleChangeTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        toggleTheme(newTheme);
    };

    const handleLogout = async () => {
        try {
            const params = new URLSearchParams();
            params.append("mode", "doDisConnexion");
            params.append("STR_UTITOKEN", param?.userData.STR_UTITOKEN);

            // Attendre la réponse de la fonction de déconnexion
            const response = await doDisConnexion(params);
            const userData = response.data;

            if (userData.code_statut === "1") {
                if (localStorage.getItem("userData")) {
                    // Suppression de 'userData' si présent dans le localStorage
                    localStorage.removeItem("userData");
                    console.log("userData supprimé du localStorage");
                }

                window.location.reload(); // Actualise la page
            } else {
                setError(userData.desc_statut);
            }
        } catch (error) {
            console.error("Erreur de déconnexion:", error);
        }
    };

    return (
        <>
            <header
                className={`header header-border ${
                    param.userData ? "bgUserConnected" : ""
                }`}
            >
                <div className="header-middle">
                    <div className="container">
                        <div className="header-left mr-md-4">
                            <a
                                href="#"
                                className="mobile-menu-toggle  w-icon-hamburger"
                                aria-label="menu-toggle"
                            ></a>
                            <a href="demo1.html" className="logo ml-lg-0">
                                <img
                                    src="assets/images/logo.png"
                                    alt="logo"
                                    width={144}
                                    height={45}
                                />
                            </a>
                            {param.userData ? (
                                <EncoursComponent totalAmount={totalAmount} />
                            ) : (
                                <></>
                            )}
                        </div>
                        <div className="header-right ml-4">
                            {param.userData ? (
                                <>
                                    <nav className="main-nav text-center">
                                        <ul className="menu ">
                                            <li className="">
                                                <a
                                                    className="wishlist label-down link d-xs-show"
                                                    href="wishlist.html"
                                                >
                                                    <i className="w-icon-heart" />
                                                    <span className="wishlist-label d-lg-show fs_header_1_4rem">
                                                        {
                                                            param.userData
                                                                .STR_UTIFIRSTLASTNAME
                                                        }
                                                    </span>
                                                </a>
                                                <ul className="submenu text-left">
                                                    <li>
                                                        <a
                                                            onClick={
                                                                handleLogout
                                                            }
                                                        >
                                                            Deconnexion
                                                        </a>
                                                    </li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </nav>
                                    <div className="dropdown cart-dropdown cart-offcanvas mr-lg-0">
                                        {/* <div className="cart-overlay" /> */}
                                        <a className="cart-toggle label-down link">
                                            <NavLink
                                                className="cart-toggle label-down link"
                                                to={"/cart"}
                                            >
                                                <i className="w-icon-cart">
                                                    <span className="cart-count">
                                                        {productData &&
                                                            productData.length}
                                                    </span>
                                                    {/* productData && productData.length */}
                                                </i>
                                            </NavLink>
                                            <span className="cart-label">
                                                Panier
                                            </span>
                                        </a>
                                        {/* <SideCart /> */}
                                    </div>
                                </>
                            ) : (
                                <div className="circle mx-4">
                                    <div className="text">
                                        <p className="mb-1 sign-text">
                                            Accès Membre
                                        </p>
                                        <p className="mb-1 text-small-desc mt-1">
                                            Pour accéder à nos prix <br />
                                            et commander en ligne
                                        </p>
                                    </div>
                                    <button
                                        className="btn fs-20"
                                        onClick={() => setShowModal(true)}
                                    >
                                        S'identifier
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {/* End of Header Middle */}
                <Modal
                    size="lg"
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    centered
                >
                    {/* <Modal.Header closeButton>
          </Modal.Header> */}
                    <Modal.Body>
                        <div className="row justify-content-center">
                            <div className="login-container">
                                <div className="login-left">
                                    <h1>
                                        <span className="highlight">
                                            Hello !
                                        </span>{" "}
                                        nous sommes heureux de vous revoir
                                    </h1>
                                    <p>
                                        Pour vous connecter renseignez votre
                                        identifiant
                                    </p>
                                    {error && (
                                        <p className="alert alert-danger">{error}</p>
                                    )}
                                    <form onSubmit={handleLogin}>
                                        <input
                                            type="text"
                                            id="email"
                                            placeholder="login"
                                            value={STR_UTILOGIN}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            className="input-field"
                                        />

                                        <input
                                            type="password"
                                            placeholder="Mot de passe"
                                            value={STR_UTIPASSWORD}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            className="input-field"
                                        />

                                        {/* <input type="password" placeholder="Code société"
                  value={IS_ADMIN}
                  onChange={(e) => setCodeSociete(e.target.value)}
                  className="input-field" /> */}

                                        <div className="options">
                                            <label>
                                                <input type="checkbox" /> Rester
                                                connecté
                                            </label>
                                            <a href="#">
                                                Mot de passe oublié ?
                                            </a>
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn-submit"
                                        >
                                            S'identifier
                                        </button>
                                    </form>
                                    <p className="signup">
                                        Pas encore de compte ?{" "}
                                        <NavLink to={"/saveclient"}>
                                            Créer un compte
                                        </NavLink>
                                    </p>
                                </div>
                                <div className="login-right">
                                    <div className="company-info">
                                        <img
                                            src="path_to_logo"
                                            alt="SN Proveci Logo"
                                            className="company-logo"
                                        />
                                        <h2>GROSSISTE VÉTÉRINAIRE</h2>
                                        <p>
                                            En tant que client bénéficiez d'un
                                            accompagnement personnalisé,
                                            commandez en ligne, accédez à des
                                            offres préférentielles
                                        </p>
                                    </div>
                                    <div className="animal-icons">
                                        {/* Add your animal icons here */}
                                        <img
                                            src="assets/images/image_footer.png"
                                            alt="Icon"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
                {/* <DesktopMenu /> */}
                <MainNav param={param} />
            </header>
        </>
    );
};

export default TopBar;
