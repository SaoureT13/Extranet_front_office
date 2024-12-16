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
    const [clisolde, setCliSolde] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [filters, setFilters] = useState();

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
                console.log(response.data);
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
                    setCliSolde(response.data.clisolde);
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

    const fetchGammeAndCategory = async (params, url, setFilters) => {
        crudData(params, url)
            .then((response) => {
                if (response && response.status === 200) {
                    const filters = response.data || [];
                    localStorage.setItem("filters", JSON.stringify(filters));
                    const newMegaMenu = [];
                    Object.keys(filters).forEach((item) => {
                        const items = [];
                        filters[item].forEach((element) => {
                            items.push({ label: element, href: "/shop" });
                        });
                        newMegaMenu.push({ title: item.toUpperCase(), items: items });
                    });
                    setFilters(newMegaMenu);
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
            const paramsGammeAndCategory = {
                mode: mode.getProductListGammeAndCategoryMode,
            };
            fetchGammeAndCategory(
                paramsGammeAndCategory,
                apiEndpointe.StockManagerEndPoint,
                setFilters
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

    useEffect(() => {
        const paramsGammeAndCategory = {
            mode: mode.getProductListGammeAndCategoryMode,
        };
        fetchGammeAndCategory(
            paramsGammeAndCategory,
            apiEndpointe.StockManagerEndPoint,
            setFilters
        );
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
                    window.location.replace("/extranet/");
                    console.log("userData supprimé du localStorage");
                }
                
                // Actualise la page
            } else {
                setError(userData.desc_statut);
            }
        } catch (error) {
            console.error("Erreur de déconnexion:", error);
        }
    };

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
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
                                <EncoursComponent
                                    totalAmount={totalAmount}
                                    clisolde={clisolde}
                                />
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
                                        <div
                                            className="alert alert-danger"
                                            role="alert"
                                        >
                                            {error}
                                        </div>
                                    )}
                                    <form onSubmit={handleLogin}>
                                        <div className="input-group height-updated">
                                            <input
                                                type="text"
                                                id="email"
                                                placeholder="Login"
                                                value={STR_UTILOGIN}
                                                onChange={(e) =>
                                                    setEmail(e.target.value)
                                                }
                                                className="input-field"
                                            />
                                        </div>

                                        <div className="input-group height-updated">
                                            <input
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                placeholder="Mot de passe"
                                                value={STR_UTIPASSWORD}
                                                onChange={(e) =>
                                                    setPassword(e.target.value)
                                                }
                                                className="input-field"
                                            />
                                            {showPassword ? (
                                                <svg
                                                    onClick={handleShowPassword}
                                                    className="password-icon"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                    width={24}
                                                    height={24}
                                                >
                                                    <path d="M17.8827 19.2968C16.1814 20.3755 14.1638 21.0002 12.0003 21.0002C6.60812 21.0002 2.12215 17.1204 1.18164 12.0002C1.61832 9.62282 2.81932 7.5129 4.52047 5.93457L1.39366 2.80777L2.80788 1.39355L22.6069 21.1925L21.1927 22.6068L17.8827 19.2968ZM5.9356 7.3497C4.60673 8.56015 3.6378 10.1672 3.22278 12.0002C4.14022 16.0521 7.7646 19.0002 12.0003 19.0002C13.5997 19.0002 15.112 18.5798 16.4243 17.8384L14.396 15.8101C13.7023 16.2472 12.8808 16.5002 12.0003 16.5002C9.51498 16.5002 7.50026 14.4854 7.50026 12.0002C7.50026 11.1196 7.75317 10.2981 8.19031 9.60442L5.9356 7.3497ZM12.9139 14.328L9.67246 11.0866C9.5613 11.3696 9.50026 11.6777 9.50026 12.0002C9.50026 13.3809 10.6196 14.5002 12.0003 14.5002C12.3227 14.5002 12.6309 14.4391 12.9139 14.328ZM20.8068 16.5925L19.376 15.1617C20.0319 14.2268 20.5154 13.1586 20.7777 12.0002C19.8603 7.94818 16.2359 5.00016 12.0003 5.00016C11.1544 5.00016 10.3329 5.11773 9.55249 5.33818L7.97446 3.76015C9.22127 3.26959 10.5793 3.00016 12.0003 3.00016C17.3924 3.00016 21.8784 6.87992 22.8189 12.0002C22.5067 13.6998 21.8038 15.2628 20.8068 16.5925ZM11.7229 7.50857C11.8146 7.50299 11.9071 7.50016 12.0003 7.50016C14.4855 7.50016 16.5003 9.51488 16.5003 12.0002C16.5003 12.0933 16.4974 12.1858 16.4919 12.2775L11.7229 7.50857Z"></path>
                                                </svg>
                                            ) : (
                                                <svg
                                                    onClick={handleShowPassword}
                                                    className="password-icon"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                    width={24}
                                                    height={24}
                                                >
                                                    <path d="M12.0003 3C17.3924 3 21.8784 6.87976 22.8189 12C21.8784 17.1202 17.3924 21 12.0003 21C6.60812 21 2.12215 17.1202 1.18164 12C2.12215 6.87976 6.60812 3 12.0003 3ZM12.0003 19C16.2359 19 19.8603 16.052 20.7777 12C19.8603 7.94803 16.2359 5 12.0003 5C7.7646 5 4.14022 7.94803 3.22278 12C4.14022 16.052 7.7646 19 12.0003 19ZM12.0003 16.5C9.51498 16.5 7.50026 14.4853 7.50026 12C7.50026 9.51472 9.51498 7.5 12.0003 7.5C14.4855 7.5 16.5003 9.51472 16.5003 12C16.5003 14.4853 14.4855 16.5 12.0003 16.5ZM12.0003 14.5C13.381 14.5 14.5003 13.3807 14.5003 12C14.5003 10.6193 13.381 9.5 12.0003 9.5C10.6196 9.5 9.50026 10.6193 9.50026 12C9.50026 13.3807 10.6196 14.5 12.0003 14.5Z"></path>
                                                </svg>
                                            )}
                                        </div>
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
                <MainNav param={param} megaMenu={filters} />
            </header>
        </>
    );
};

export default TopBar;
