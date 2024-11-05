// src/components/Accueil.js
import React, { useState, useEffect, useContext } from 'react'; // Importation de React et des hooks useState et useEffect
import TopBar from '../../Mescomposants/Header/TopBar'
import AppMenu from '../../Mescomposants/AppMenu'
import MobileMenu from '../../Mescomposants/MobileMenu'
import Footer from '../../Mescomposants/Footer'
import ShopFilter from '../../Mescomposants/ShopFilter'
import ShopCategory from '../../Mescomposants/ShopCategory'
import ShopBrand from '../../Mescomposants/ShopBrand'
import { ToastContainer, toast } from 'react-toastify';
import { useTheme } from '../../contexts/ThemeContext';
import { NavLink } from 'react-router-dom';





// import ShopSidebar from './ShopSidebar';
// import Product from './Product';
// import MainContent from './MainContent';
// import Header from './components/Header'; // Importation du composant Header
import { useNavigate } from 'react-router-dom'; // Utilisez useNavigate pour la redirection
import { fetchEvenements, crudData } from '../../services/apiService'; // Importation de la fonction fetchEvenements depuis le fichier apiService
import ErrorCard from '../../Mescomposants/ErrorCard';
import ProductWrap from '../../Mescomposants/Product/ProductWrap';


const Cart = ({onSuccess, param = {}}) => {

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
  const userData = JSON.parse(localStorage.getItem('userData'));
  const [cart, setCart] = useState([]);

//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem('userData'));
//     if (!user) {
//       navigate('/'); // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
//     }
//   }, [navigate]);


  const handleChangeTheme = () => {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      toggleTheme(newTheme);
  };




  const fetchData = (params, url, setProductData) => {
    setIsLoading(true);
    crudData(params, url)
      .then(response => {
        setIsLoading(false);
        if (response && response.status === 200) {
          const produitVeto = response.data.lines || [];  // Ensure it's an array
          setProductData(Array.isArray(produitVeto) ? produitVeto : []);  // Safeguard to ensure it's an array
          setStatusCode(response.status);
  
          const initialQuantities = produitVeto.reduce((acc, product) => {
            acc[product.PlvID] = product.PlvQteUV;
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
        setStatusCode(404);
        console.error('Erreur lors de la récupération des données:', error);
      });
  };
  


    const DeletUpdateCommproduit = (params, url, setProductData) => {
      crudData(params, url)
        .then(response => {
  
          if (response.status === 200) {
  
              if (response.data.code_statut === "1") {
                toast.success(response.data.desc_statut);  // Notification de succès
                onSuccess();
                const params = {
                  mode: mode.listCommandeproductMode,
                  LG_AGEID: userData?.LG_AGEID,
                  // LG_COMMID: userData.LG_COMMID,
                };
                fetchData(params, apiEndpointe.CommandeManagerEndPoint, setProductData);
                const paramPanier = { mode: mode.getClientPanierMode,LG_AGEID: userData?.LG_AGEID,};
                fetchPanierData(paramPanier, apiEndpointe.CommandeManagerEndPoint, setProductData);

              } else if (response.data.code_statut === "0") {
                toast.error("Erreur : " + response.data.desc_statut);  // Notification d'erreur
              }
              // const produitVeto = response.data.lines;
              
           }
          
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des données:', error);
      });
    };


    const ClotuteCommproduit = (params, url) => {
      crudData(params, url)
        .then(response => {
          if (response.status === 200) {
              if (response.data.code_statut === "1") {
                toast.success(response.data.desc_statut);
                localStorage.setItem('LG_COMMID', '');
                onSuccess();
              } else {
                toast.error("Erreur : " + response.data.desc_statut);
              }
           }
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des données:', error);
      });
    };
  
   
  
  
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
          STR_UTITOKEN:userData.STR_UTITOKEN,
        };
        DeletUpdateCommproduit(params, apiEndpointe.CommandeManagerEndPoint, setProductData);
        
  
        return {
          ...prevQuantities,
          [productId]: newQuantity,
        };
      });
    };
  
  
    const handleRemoveItem = (productId) => {
      const params = {
        mode: mode.deleteCommproduitMode,
        LG_CPRID: productId,
        STR_UTITOKEN:userData.STR_UTITOKEN,
      };
      DeletUpdateCommproduit(params, apiEndpointe.CommandeManagerEndPoint, setProductData);
    };

    const handleCloture = () => {
      const params = {
        mode: mode.validationCommandeMode,
        LG_AGEID: userData?.LG_AGEID,
        STR_UTITOKEN:userData.STR_UTITOKEN,
      };
      
      ClotuteCommproduit(params, apiEndpointe.CommandeManagerEndPoint);
    };



  const LG_COMMID = localStorage.getItem('LG_COMMID');

  const fetchPanierData = (params, url, setProductData) => {
    setIsLoading(true);
    crudData(params, url)
      .then(response => {
        setIsLoading(false);
        if (response && response.status === 200) {
          const produitVeto = response.data.data || [];  // Ensure it's an array
          setCart(produitVeto);
  
        } else {
          console.error('Erreur HTTP:', response);
          setStatusCode(response?.status || 'Unknown error');
        }
      })
      .catch(error => {
        setIsLoading(false);
        setStatusCode(404);
        console.error('Erreur lors de la récupération des données:', error);
      });
  };


  useEffect(() => {
 
      setUser(userData); // Set user in state
      const params = { mode: mode.listCommandeproductMode, LG_AGEID: userData?.LG_AGEID,};
      fetchData(params, apiEndpointe.CommandeManagerEndPoint, setProductData);
      // const paramPanier = { mode: mode.getClientPanierMode,LG_COMMID: localStorage.getItem('LG_COMMID'),};
      const paramPanier = { mode: mode.getClientPanierMode,LG_AGEID: userData?.LG_AGEID,};
      fetchPanierData(paramPanier, apiEndpointe.CommandeManagerEndPoint, setProductData);
   
  }, []);


  const handleClick = (product) => {
    // Enregistrer l'ID du produit dans localStorage
    localStorage.setItem("selectedProductId", product.ArtID);
};
    

  
  return (
    <div className={` ${param.userData ? 'bgUserConnected' : ''}`}>
        <div className="page-wrapper">
          {/* Start of Header */}
          {/* <TopBar /> */}


          <main className="main cart">
          <AppMenu />

        {/* Start of Breadcrumb */}
        {/* <nav className="breadcrumb-nav">
          <div className="container">
            <ul className="breadcrumb shop-breadcrumb bb-no">
              <li className="active">
                <a href="cart.html">Shopping Cart</a>
              </li>
              <li>
                <a href="checkout.html">Checkout</a>
              </li>
              <li>
                <a href="order.html">Order Complete</a>
              </li>
            </ul>
          </div>
        </nav> */}

        {/* End of Breadcrumb */}
        {/* Start of PageContent */}
        <div className="page-content">
          <div className="container">
            <div className="row gutter-lg mb-10 page-contnainer bg-blue-light p-5" style={{ minHeight: "314px" }}>
              {productData || productData.length > 0 ? (<>
              <div className="col-lg-8 pr-lg-4 mb-6">
                <table className="shop-table cart-table">
                  <thead>
                    <tr>
                      <th className="product-name">
                        <span>Produit</span>
                      </th>
                      <th />
                      <th className="product-price">
                        <span>Prix</span>
                      </th>
                      <th className="product-quantity">
                        <span>Quantité</span>
                      </th>
                      <th className="product-subtotal">
                        <span>Total</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                  {!productData || productData.length === 0 ? (
                              <tr><td>Votre panier est vide.</td></tr>
                            ) : (
                              <>
                                  {productData && productData.map((product, index) => (

                                  <tr key={index}>
                                  <td className="product-thumbnail">
                                    <div className="p-relative">
                                      <NavLink to={"/detail-produit"} onClick={()=>handleClick(product)}>
                                        <figure>
                                          <img
                                            src="assets/images/products/AMOXY-C1KG-FACE.jpg"
                                            alt="product"
                                            width={300}
                                            height={338}
                                          />
                                        </figure>
                                      </NavLink>
                                      <button type="submit" className="btn btn-close" onClick={() => handleRemoveItem(product.PlvID)}>
                                        <i className="fas fa-times" />
                                      </button>
                                    </div>
                                  </td>
                                  <td className="product-name">
                                    <NavLink to={"/detail-produit"} onClick={()=>handleClick(product)}>{product.PlvLib}</NavLink>
                                  </td>
                                  <td className="product-price">
                                    <span className="amount">{formatPrice(parseInt(product.PlvPUNet))} FCFA</span>
                                  </td>
                                  <td className="product-quantity">
                                    <div className="input-group">
                                      <input
                                        className="quantity form-control"
                                        type="number"
                                        min={1}
                                        value={ parseInt(quantities[product.PlvID])  || parseInt(product.PlvQteUV) }
                                          onChange={(e) => {
                                            const inputValue = e.target.value;
                                            // Validation pour que la valeur soit toujours un nombre entier valide
                                            if (!isNaN(inputValue) && Number(inputValue) >= 1) {
                                              handleQuantityChange(product.PlvID, Number(inputValue) - (quantities[product.PlvID] || product.PlvQteUV));
                                            }
                                          }}
                                        max={100000}
                                      />
                                      <button 
                                      className={`quantity-plus w-icon-plus ${quantities[product.PlvID] <= 1 ? 'disabled' : ''}`} // Désactive visuellement si la quantité est 1
                                
                                      onClick={() => handleQuantityChange(product.PlvID, 1)}
                                      
                                      />
                                      <button 
                                      className={`quantity-minus w-icon-minus cart-item__decrement ${quantities[product.PlvID] <= 1 ? 'disabled' : ''}`} // Désactive visuellement si la quantité est 1
                                      onClick={() => handleQuantityChange(product.PlvID, -1)}
                                      disabled={quantities[product.PlvID] <= '1'} 
                                      
                                      />
                                    </div>
                                  </td>
                                  <td className="product-subtotal">
                                    <span className="amount">{formatPrice(parseInt(product.PlvQteUV) * parseInt(product.PlvPUNet))} FCFA</span>
                                  </td>
                                  </tr>
                                  ))}
                              </>
                      )}
                    
                  </tbody>
                </table>
                
              </div>

              {cart && Object.entries(cart).length > 0 && (<div className="col-lg-4 sticky-sidebar-wrapper">
                            <div className="sticky-sidebar">
                                <div className="cart-summary mb-4">
                                    <h3 className="cart-title text-uppercase">Total</h3>
                                    <div className="cart-subtotal d-flex align-items-center justify-content-between">
                                        <label className="ls-25">Montant HT</label>
                                        <span>{formatPrice(cart?.dbl_commmtht)} FCFA</span>
                                    </div>

                                    <hr className="divider"/>

                                    <hr className="divider mb-6"/>
                                    <div className="order-total d-flex justify-content-between align-items-center">
                                        <label>Total</label>
                                        <span className="ls-50">{formatPrice(cart?.dbl_commmtttc)} FCFA</span>
                                    </div>
                                    <NavLink to={"/choix-livraison"}
                                        className="btn btn-block btn-dark btn-icon-right btn-rounded  btn-checkout">
                                        Proceder au payement<i className="w-icon-long-arrow-right"></i></NavLink>
                                </div>
                            </div>
                        </div>)}
              {/* <a href='/livraison' className="btn btn-block btn-dark btn-icon-right btn-rounded  btn-checkout" onClick={handleCloture}> Valider ma commande
                <i className="w-icon-long-arrow-right" />
              </a> */}
              </>) : (
                <p className='text-center'>Votre panier est vide.</p>
              )}
            </div>
          </div>
        </div>
        {/* End of PageContent */}
      </main>

        </div>

    </div>
  );
};

export default Cart;

export function formatPrice(price) {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
