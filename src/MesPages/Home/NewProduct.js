import React from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/splide.min.css';
import ProductWrap from '../../Mescomposants/Product/ProductWrap'

const NewProduct = ({defaultImage, param, products, onSuccess }) => {
  return (
    <>
     <h2 className="mb-4 sectionTitle">Nouveaux arrivages</h2>
     {/* <Splide
      options={{
        type: 'loop',
        autoplay: true,
        interval: 6000,  
        pauseOnHover: false,
        perPage: 5, 
        gap: '1rem',  
        pagination: false,
        arrows: true,
      }}
    >
        </Splide> */}
      <div className='row'>
        {products?.map(product => (
            // <SplideSlide key={product.id}></SplideSlide>
            <ProductWrap ey={product.id} product={product} defaultImage={defaultImage} urlBaseImage={param.urlBaseImage}  userData ={param.userData}  col_css="col-xl-2 col-lg-2 col-4" onSuccess={onSuccess}/>
            // <ProductWrap key={product.ArtID} product={product} defaultImage={defaultImage} urlBaseImage={param.urlBaseImage}  userData ={param.userData} col_css="col-xl-3 col-lg-3 col-4" />

            
        ))}

      </div>
    
     </>
    
  );
};

export default NewProduct;
