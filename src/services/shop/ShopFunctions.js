// src/components/ShopFunctions.js
import { fetchEvenements, crudData } from '../../services/apiService'; // Importation de la fonction fetchEvenements depuis le fichier apiService

export const handleAddToCart = (product, setAddedProducts, setPopupContent, setIsPopupOpen) => {
    // Check if the product requires options
    if (product.options && product.options.length > 0) {
      return;
    }
  
    setTimeout(() => {
      setAddedProducts(prevProducts => [...prevProducts, product]);
  
      setPopupContent({
        name: product.name,
        imageSrc: product.imageSrc,
        message: "has been added to cart.",
      });
      setIsPopupOpen(true);
  
      setTimeout(() => {
        setIsPopupOpen(false);
      }, 3000);
    }, 500);
};
  
export const handleSearch = (e, products, setFilteredProducts, setCurrentPage, searchTerm) => {
    e.preventDefault();
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
    setCurrentPage(1);
};
  
export const applyFilters = (filters, products, setFilteredProducts, setCurrentPage) => {
    let filtered = [...products];
  
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter(product => filters.categories.includes(product.category));
    }
  
    if (filters.sizes && filters.sizes.length > 0) {
      filtered = filtered.filter(product => filters.sizes.includes(product.size));
    }
  
    if (filters.brands && filters.brands.length > 0) {
      filtered = filtered.filter(product => filters.brands.includes(product.brand));
    }
  
    if (filters.colors && filters.colors.length > 0) {
      filtered = filtered.filter(product => filters.colors.includes(product.color));
    }
  
    setFilteredProducts(filtered);
    setCurrentPage(1);
};
  
export const fetchData = (params, url, setProcutData, setIsLoading, setStatusCode) => {
    setIsLoading(true);
    crudData(params, url)
      .then(response => {
        setIsLoading(false);
        if (response && response.status === 200) {
          const produitVeto = response.data.products;
          setProcutData(produitVeto);
          setStatusCode(response.status);
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
        }
      });
};
  