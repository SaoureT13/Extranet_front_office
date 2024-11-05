import React from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/splide.min.css';
import ProductWrap from '../../Mescomposants/Product/ProductWrap'

const ProductCarousel = ({ products, sectionTitle }) => {
  return (
    <>
     <h2 className="mb-4 sectionTitle">{sectionTitle}</h2>
     <Splide
      options={{
        type: products.length > 5 ? 'loop' : '',
        autoplay: true,
        interval: 6000,  // Intervalle d'autoplay en millisecondes
        pauseOnHover: false,
        perPage: products.length > 5 ? 5 : products.length,  // Nombre de produits à afficher par page
        gap: '1rem',  // Espace entre les slides
        pagination: false,
        arrows: products.length > 5 ? true : false,
      }}
    >
      {products?.map(product => (
        <SplideSlide key={product.id}>
          <ProductWrap product={product} col_css=""/>
        </SplideSlide>
      ))}
    </Splide>
     </>
    
  );
};

export default ProductCarousel;
