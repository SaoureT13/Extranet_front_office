import React, { useState, useEffect } from 'react'; 
import TopBar from '../Mescomposants/Header/TopBar'
import AppMenu from '../Mescomposants/AppMenu'
import MobileMenu from '../Mescomposants/MobileMenu'
import Footer from '../Mescomposants/Footer'
import ShopSidebar from '../Mescomposants/ShopSidebar'
import ClipLoader from 'react-spinners/ClipLoader'; 
import { fetchEvenements, crudData } from '../services/apiService'; 
import ErrorCard from '../Mescomposants/ErrorCard';
import ProductWrap from '../Mescomposants/Product/ProductWrap';
import Pagination from '../Mescomposants/Pagination/Pagination'; // Import the new Pagination component


const Shop = ({ param,defaultImage }) => {
  const [productData, setProcutData] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);  
  const [filters, setFilters] = useState({
    categories: [],
    families: [],
    brands: [],
    otherCriteria: [],
  });
  const [searchKeyword, setSearchKeyword] = useState(''); // New state for search
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [totalProducts, setTotalProducts] = useState(0);

  const fetchData = (params, url) => {
    setIsLoading(true); 
    // Remplace cette ligne avec ton API pour récupérer les produits
    crudData(params, url)
      .then(response => {
        setIsLoading(false); 
        if (response && response.status === 200) {
          const produits = response.data.products;
          setProcutData(produits);
          setFilteredProducts(produits); // Initialize with all products
          setTotalProducts(response.data.totalProducts || produits.length);
        } else {
          console.error('Erreur HTTP:', response);
        }
      })
      .catch(error => {
        setIsLoading(false);
        console.error('Erreur:', error);
      });
  };

  useEffect(() => {
    const params = {
      mode: param.mode.listProductMode,
      STR_UTITOKEN: param.userData ? param.userData.STR_UTITOKEN : '', // Ensure userData is not null
      length: 10000, //itemsPerPage.toString(),
      start: 1,//((currentPage - 1) * itemsPerPage).toString(), 
    };
    fetchData(params, param.apiEndpointe.StockManagerEndPoint);
  }, [currentPage]);

  // Apply filters and search to the products
  useEffect(() => {
    const applyFiltersAndSearch = () => {

      if (!productData || productData.length === 0) {
        setFilteredProducts([]); // No products found, reset the list
        setTotalProducts(0);
        return;
      }

      let filtered = productData;

      // Apply category, family, brand filters
      if (filters.categories && filters.categories.length > 0) {
        filtered = filtered.filter(product => filters.categories.includes(product.ArtCategEnu));
      }
      if (filters.families && filters.families.length > 0) {
        filtered = filtered.filter(product => filters.families.includes(product.ArtFamilleEnu));
      }
      if (filters.brands && filters.brands.length > 0) {
        filtered = filtered.filter(product => filters.brands.includes(product.ARTFREE3));
      }

      // Apply search keyword
      if (searchKeyword.trim() !== '') {
        filtered = filtered.filter(product => 
          product.ArtLib.toLowerCase().includes(searchKeyword.toLowerCase()) || 
          product.ArtCode.toLowerCase().includes(searchKeyword.toLowerCase())
        );
      }

      setFilteredProducts(filtered);
      setTotalProducts(filtered.length);
    };

    applyFiltersAndSearch();
  }, [filters, searchKeyword, productData]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  const currentProducts = filteredProducts.slice(0, itemsPerPage); 
  const totalPages = Math.ceil(totalProducts / itemsPerPage);


  return (
    <div className={` ${param.userData ? 'bgUserConnected' : ''}`}>
      <div className="page-wrapper">
        <main className="main mb-0 pb-1">
          <div className="page-content">
            <div className="container">
              <div className="shop-content row gutter-lg mb-10 page-container">
                <ShopSidebar filters={filters} onFilterChange={handleFilterChange} />

                <div className="main-content">
                  {/* Search bar */}
                  <div className="search-bar mb-4">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Rechercher un produit..."
                      value={searchKeyword}
                      onChange={handleSearchChange}
                    />
                  </div>

                  {isLoading ? (
                    <div className="loading-container d-block mx-auto">
                      Loading...
                    </div>
                  ) : filteredProducts.length > 0 ? (
                    <div className="product-wrapper row cols-md-3 cols-sm-2 cols-2">
                      {currentProducts.map(product => (
                        <ProductWrap key={product.ArtID} product={product} defaultImage={defaultImage} urlBaseImage={param.urlBaseImage}  userData ={param.userData} col_css="col-xl-3 col-lg-3 col-4" />
                      ))}
                    </div>
                  ) : (
                    <div>Aucun produit trouvé.</div>
                  )}
                  <Pagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={setCurrentPage} 
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Shop;