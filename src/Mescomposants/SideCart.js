// src/components/Accueil.js
import React, { useState, useEffect, useContext } from 'react'; // Importation de React et des hooks useState et useEffect
import { useTheme } from '../contexts/ThemeContext';
import DesktopMenu from './DesktopMenu'
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; // Utilisez useNavigate pour la redirection
import { fetchEvenements, crudData } from '../services/apiService'; // Importation de la fonction deleteProduct
// import './CartItem.css'; // Make sure to create a corresponding CSS file
import { toast } from 'react-toastify';
import ErrorCard from '../Mescomposants/ErrorCard';


const SideCart = () => {

    const { theme, toggleTheme } = useTheme();

    const mode = JSON.parse(localStorage.getItem("appMode"));
    const date = JSON.parse(localStorage.getItem("appDate"));
    const apiEndpointe = JSON.parse(localStorage.getItem("apiEndpointe"));
    const paths = JSON.parse(localStorage.getItem("appPaths"));
    const [user, setUser] = useState(null);
    const [productData, setProductData] = useState([]);
    const [quantities, setQuantities] = useState({});
    const navigate = useNavigate();
    const [statusCode, setStatusCode] = useState(null);     // Code statut HTTP
    const [isLoading, setIsLoading] = useState(false);  

//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem('user'));
//     if (!user) {
//       navigate('/'); // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
//     }
//   }, [navigate]);


    const handleChangeTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        toggleTheme(newTheme);
    };




    const fetchData = (params, url, setProcutData) => {
        setIsLoading(true); // Activez le statut de chargement avant la requête
        crudData(params, url)
          .then(response => {
            setIsLoading(false); // Désactivez le statut de chargement une fois la réponse reçue
            if (response && response.status === 200) {
              const produitVeto = response.data.lines;
              setProcutData(produitVeto);
              setStatusCode(response?.status);
    
              const initialQuantities = produitVeto.reduce((acc, product) => {
                acc[product.PlvID] = product.PlvQteUV; // Utiliser l'ID du produit comme clé
                return acc;
              }, {});
              setQuantities(initialQuantities);
    
            } else {
              console.error('Erreur HTTP:', response);
              setStatusCode(response?.status || 'Unknown error');
            }
          })
          .catch(error => {
            setIsLoading(false);
            if (error.response) {
              setStatusCode(error.response.status);
              console.error('Erreur de réponse serveur:', error.response.status, error.response.data);
            } else if (error.request) {
              setStatusCode(404);
              console.error('Erreur de requête:', error.request);
            } else {
              setStatusCode('Request setup error');
              console.error('Erreur de configuration:', error.message);
              // alert('Erreur: ' + error.message);
            }
          });
      };
    
    
      const deletData = (params, url, setProductData) => {
        crudData(params, url)
          .then(response => {
    
            if (response.status === 200) {
    
                if (response.data.code_statut === "1") {
                  toast.success(response.data.desc_statut);  // Notification de succès
                } else if (response.data.code_statut === "0") {
                  toast.error("Erreur : " + response.data.desc_statut);  // Notification d'erreur
                }
                // const produitVeto = response.data.lines;
                const params = {
                  mode: mode.listCommandeproductMode,
                  LG_CLIID: '954',
                  LG_COMMID: '353484',
                };
                fetchData(params, apiEndpointe.CommandeManagerEndPoint, setProductData);
             }
            
          })
          .catch(error => {
            console.error('Erreur lors de la récupération des données:', error);
        });
      };
    
      useEffect(() => {
        const params = {
            mode: mode.listCommandeproductMode,
            LG_CLIID: '954',
            LG_COMMID: '353484',
          };
          fetchData(params, apiEndpointe.CommandeManagerEndPoint, setProductData);
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser) {
          navigate(paths.signIn); // Redirige vers la page d'accueil si l'utilisateur est vide
        } else {
          setUser(storedUser); // Set user in state
        //   const params = {
        //     mode: mode.listCommandeproductMode,
        //     LG_CLIID: '954',
        //     LG_COMMID: '353484',
        //   };
        //   fetchData(params, apiEndpointe.CommandeManagerEndPoint, setProductData);
        }
      }, [navigate]);
    
    
      const handleQuantityChange = (productId, change) => {
        setQuantities(prevQuantities => {
          const currentQuantity = prevQuantities[productId] !== undefined
            ? prevQuantities[productId]
            : productData.find(p => p.PlvID === productId).PlvQteUV;
    
          const newQuantity = Math.max(1, parseInt(currentQuantity) + change); // Assurez-vous que la quantité ne descende pas en dessous de 1
    
          const params = {
            mode: mode.updateCommproduitMode,
            LG_CPRID: productId,
            INT_CPRQUANTITY: newQuantity,
            STR_UTITOKEN:'c4cd488e9ebde9552879',
          };
          deletData(params, apiEndpointe.CommandeManagerEndPoint, setProductData);
          
    
          return {
            ...prevQuantities,
            [productId]: newQuantity,
          };
        });
      };
    
      const calculateTotal = () => {
        return productData.reduce((total, product) => {
          const quantity = quantities[product.PlvID] || product.PlvQteUV;
          return total + (product.PlvPUNet * quantity);
        }, 0);
      };
    
    
      const handleRemoveItem = (productId) => {
        const params = {
          mode: mode.deleteCommproduitMode,
          LG_CPRID: productId,
          STR_UTITOKEN:'c4cd488e9ebde9552879',
        };
        deletData(params, apiEndpointe.CommandeManagerEndPoint, setProductData);
      };

  
  return (
    <div className="dropdown-box">
                <div className="cart-header">
                  <span>Shopping Cart</span>
                  <a href="#" className="btn-close">
                    Close
                    <i className="w-icon-long-arrow-right" />
                  </a>
                </div>
                <div className="products">
                {!productData || productData.length === 0 ? (
                        <p>Votre panier est vide.</p>
                      ) : (
                        <>
                            {productData && productData.map((product) => (
                                <div className="product product-cart">
                                    <div className="product-detail">
                                    <a href="#" className="product-name">
                                        {product.PlvLib}
                                    </a>
                                    <div className="price-box">
                                        <span className="product-quantity">{parseInt(product.PlvQteUV)}</span>
                                        <span className="product-price">{parseInt(product.PlvPUNet)}</span>
                                    </div>
                                    </div>
                                    <figure className="product-media">
                                    <a href="product-default.html">
                                        <img
                                        src="assets/images/cart/product-1.jpg"
                                        alt="product"
                                        height={84}
                                        width={94}
                                        />
                                    </a>
                                    </figure>
                                    <button
                                    className="btn btn-link btn-close"
                                    aria-label="button"
                                    onClick={() => handleRemoveItem(product.PlvID)}
                                    >
                                    <i className="fas fa-times" />
                                    </button>
                                </div>
                            ))}
                        </>
                )}
                </div>
                <div className="cart-total">
                  <label>Subtotal:</label>
                  <span className="price">$58.67</span>
                </div>
                <div className="cart-action">

                <NavLink className="btn btn-dark btn-outline btn-rounded" to={"/cart"} >Voir le panier</NavLink>
                  <a
                    href="checkout.html"
                    className="btn btn-primary  btn-rounded"
                  >
                    Checkout
                  </a>
                </div>
              </div>
  );
};

export default SideCart;