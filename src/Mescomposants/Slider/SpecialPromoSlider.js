import React from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/splide/css";
import "./PromoSlider.css"; // Vous pouvez utiliser un fichier CSS externe

const products = [
  {
    id: 1,
    name: "Alben Oral Solution 10%",
    volume: "1000 ml",
    promotion: "2 achetés = 1 offert",
    expiration: "Profitez de notre offre jusqu'au 24 Décembre",
    imageUrl: "assets/images/products/AMOXY-C1KG-FACE.jpg", // Chemin de l'image
  },
  // Vous pouvez ajouter plus de produits ici
];

const PromoSlider = () => {
  return (
    <div className="mt-5 mb-5">
      <Splide
        options={{
          perPage: 1,
          autoplay: true,
          interval: 3000,
          pauseOnHover: true,
          type: "loop",
        }}
      >
        {products.map((product) => (
          <SplideSlide key={product.id}>
            <div className="promo-slide">
              <div className="product-image-container">
                <img src={product.imageUrl} alt={product.name} className="product-image" />
              </div>
              <div className="promo-text-container">
                <p className="promo-special">
                  <span className="promo-highlight">{product.promotion}</span>
                </p>
                <p className="promo-expiration">{product.expiration}</p>
              </div>
            </div>
          </SplideSlide>
        ))}
      </Splide>
    </div>
  );
};

export default PromoSlider;
