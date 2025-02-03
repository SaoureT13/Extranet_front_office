import React from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/splide/dist/css/splide.min.css";
import ProductWrap from "../../Mescomposants/Product/ProductWrap";

const ProductCarousel = ({ products, sectionTitle, imagelBaseUrl }) => {
    return (
        <div>
            <h2 className="mb-4 sectionTitle">{sectionTitle}</h2>
            {/* <Splide
      options={{
        type: products.length > 5 ? 'loop' : '',
        autoplay: true,
        interval: 6000,  // Intervalle d'autoplay en millisecondes
        pauseOnHover: false,
        perPage: products.length > 5 ? 5 : products.length,  // Nombre de produits à afficher par page
        gap: '1rem',  // Espace entre les slides
        pagination: false,
        arrows: products.length > 5 ? true : false,
        breakpoints: {
          1200: {
            perPage: 4,  // Afficher 4 produits par page pour les écrans de moins de 1200px de large
          },
          992: {
            perPage: 3,  // Afficher 3 produits par page pour les écrans de moins de 992px de large
          },
          768: {
            perPage: 2,  // Afficher 2 produits par page pour les écrans de moins de 768px de large
          },
          576: {
            perPage: 1,  // Afficher 1 produit par page pour les écrans de moins de 576px de large
          },
        },
      }}
    > */}
            <div
                className="d-flex"
                style={{
                    width: "100%",
                    overflowX: "auto",
                    overflowY: "hidden",
                    whiteSpace: "nowrap",
                    position: "relative",
                    paddingBottom: "20px",
                }}
            >
                <div
                    className="d-flex justify-content-center"
                    style={{ gap: "20px" }}
                >
                    {products?.map((product) => (
                        // <SplideSlide key={product.id}>
                        <ProductWrap product={product} />
                        // </SplideSlide>
                    ))}
                </div>
            </div>
            {/* </Splide> */}
        </div>
    );
};

export default ProductCarousel;
