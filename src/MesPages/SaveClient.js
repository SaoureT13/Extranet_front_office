// src/components/Accueil.js
import React, { useState, useEffect, useContext } from 'react'; // Importation de React et des hooks useState et useEffect
import TopBar from '../Mescomposants/Header/TopBar'
import AppMenu from '../Mescomposants/AppMenu'
import MobileMenu from '../Mescomposants/MobileMenu'
import Footer from '../Mescomposants/Footer'
import ShopFilter from '../Mescomposants/ShopFilter'
import ShopCategory from '../Mescomposants/ShopCategory'
import ShopBrand from '../Mescomposants/ShopBrand'
import { ToastContainer, toast } from 'react-toastify';
import { useTheme } from '../contexts/ThemeContext';
import WizardForm from './WizardForm'





// import ShopSidebar from './ShopSidebar';
// import Product from './Product';
// import MainContent from './MainContent';
// import Header from './components/Header'; // Importation du composant Header
import { useNavigate } from 'react-router-dom'; // Utilisez useNavigate pour la redirection
import { fetchEvenements, crudData } from '../services/apiService'; // Importation de la fonction fetchEvenements depuis le fichier apiService
import ErrorCard from '../Mescomposants/ErrorCard';
import ProductWrap from '../Mescomposants/Product/ProductWrap';


const Cart = () => {

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


const DeletUpdateCommproduit = (params, url, setProductData) => {
    crudData(params, url)
    .then(response => {

        if (response.status === 200) {

            if (response.data.code_statut === "1") {
            toast.success(response.data.desc_statut);  // Notification de succès
            const params = {
                mode: mode.listCommandeproductMode,
                LG_AGEID: userData.LG_AGEID,
                // LG_COMMID: userData.LG_COMMID,
            };
            fetchData(params, apiEndpointe.CommandeManagerEndPoint, setProductData);

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
  
useEffect(() => {
     
    // if (!userData) {
    //     navigate(paths.signIn);
    // } else {
    // setUser(userData);
    // const params = {
    //     mode: mode.listCommandeproductMode,
    //     LG_AGEID: userData.LG_AGEID,
    // };
    // fetchData(params, apiEndpointe.CommandeManagerEndPoint, setProductData);
    // }
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
        STR_UTITOKEN:userData.STR_UTITOKEN,
    };
    DeletUpdateCommproduit(params, apiEndpointe.CommandeManagerEndPoint, setProductData);
    

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
    STR_UTITOKEN:userData.STR_UTITOKEN,
    };
    DeletUpdateCommproduit(params, apiEndpointe.CommandeManagerEndPoint, setProductData);
};

  
  return (
    <>
      <>
  <div className="page-wrapper">
    {/* Start of Header */}
    <TopBar />


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
      <div className="row gutter-lg mb-10 page-contnainer">
        <WizardForm />
      </div>
    </div>
  </div>
  {/* End of PageContent */}
</main>

    {/* End of Main */}
    {/* Start of Footer */}
    <Footer/>
    {/* End of Footer */}
  </div>

  
</>

    </>
  );
};

export default Cart;
