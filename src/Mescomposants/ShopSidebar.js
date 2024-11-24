import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

const ShopSidebar = ({ filters, onFilterChange }) => {
  const [selectedCategories, setSelectedCategories] = useState(filters?.categories || []);
  const [selectedFamilies, setSelectedFamilies] = useState(filters?.families || []);
  const [selectedBrands, setSelectedBrands] = useState(filters?.brands || []);

  const [categories, setCategories] = useState([]);
  const [gammes, setGammes] = useState([]);

  useEffect(() => {
    setSelectedCategories(filters?.categories || []);
    setSelectedFamilies(filters?.families || []);
    setSelectedBrands(filters?.brands || []);
  }, [filters]);

  useEffect(()=>{
    const filters = JSON.parse(localStorage.getItem('filters'))
    setCategories(filters.categories)
    setGammes(filters.gammes)
  }, [])

  const handleCheckboxChange = (value, type) => {
    let updatedFilters = { ...filters };

    if (type === 'categories') {
      if (selectedCategories.includes(value)) {
        updatedFilters.categories = selectedCategories.filter(cat => cat !== value);
      } else {
        updatedFilters.categories = [...selectedCategories, value];
      }
      setSelectedCategories(updatedFilters.categories);
    } else if (type === 'families') {
      if (selectedFamilies.includes(value)) {
        updatedFilters.families = selectedFamilies.filter(fam => fam !== value);
      } else {
        updatedFilters.families = [...selectedFamilies, value];
      }
      setSelectedFamilies(updatedFilters.families);
    } else if (type === 'brands') {
      if (selectedBrands.includes(value)) {
        updatedFilters.brands = selectedBrands.filter(brand => brand !== value);
      } else {
        updatedFilters.brands = [...selectedBrands, value];
      }
      setSelectedBrands(updatedFilters.brands);
    }

    // Call the parent handler to update filters
    onFilterChange(updatedFilters);
  };

  // Function to reset all filters
  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedFamilies([]);
    setSelectedBrands([]);

    // Reset the filters object passed to the parent component
    onFilterChange({
      categories: [],
      families: [],
      brands: []
    });
  };

  return (
    <aside className="sidebar shop-sidebar left-sidebar sticky-sidebar-wrapper sidebar-fixed page-container">
      <div className="sidebar-content scrollable p-3">
        <div className="sticky-sidebar">
          <CollapsibleWidget title="Par catégories" defaultOpen={true}>
            <ul className="widget-body filter-items item-check mt-1">
              {categories?.map((category) => (
                <li key={category}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCheckboxChange(category, 'categories')}
                    />
                    {category}
                  </label>
                </li>
              ))}
            </ul>
          </CollapsibleWidget>

          {/* <CollapsibleWidget title="Par familles" defaultOpen={true}>
            <ul className="widget-body filter-items item-check mt-1">
              {['Aviculture', 'Élevage Lapins', 'Élevage Porcs'].map((family) => (
                <li key={family}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedFamilies.includes(family)}
                      onChange={() => handleCheckboxChange(family, 'families')}
                    />
                    {family}
                  </label>
                </li>
              ))}
            </ul>
          </CollapsibleWidget> */}

          <CollapsibleWidget title="Par marques" defaultOpen={false}>
            <ul className="widget-body filter-items item-check">
              {gammes?.map((brand) => (
                <li key={brand}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleCheckboxChange(brand, 'brands')}
                    />
                    {brand}
                  </label>
                </li>
              ))}
            </ul>
          </CollapsibleWidget>

          {/* Reset Filters Button */}
          <div className="reset-filters mt-4">
            <button className="btn btn-secondary" onClick={resetFilters}>
              Réinitialiser les filtres
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

const CollapsibleWidget = ({ title, defaultOpen, children }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="widget widget-collapsible">
      <div className="widget-header" onClick={toggleOpen}>
        <h3 className="widget-title w-100">
          {title}
          <FontAwesomeIcon icon={isOpen ? faMinus : faPlus} className="ml-2" />
        </h3>
      </div>
      {isOpen && <div className="widget-body">{children}</div>}
    </div>
  );
};

export default ShopSidebar;
