import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { Navigation, Thumbs } from "swiper/modules";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { fullUrl } from "../services/apiService";

const ProductGallery = ({
    param,
    ArtStk,
    galerieImage,
    imageRuptureStock,
    defaultImage,
}) => {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const getImageName = (imagePath) => {
        const parts = imagePath.split("/");
        return parts[parts.length - 1];
    };

    return (
        <div className="col-md-6 mb-4 mb-md-8 bg-white remove-padding">
            <div className="product-gallery product-gallery-sticky">
                {/* Swiper principal pour les images */}
                <Swiper
                    navigation
                    thumbs={{ swiper: thumbsSwiper }}
                    modules={[Navigation, Thumbs]}
                    className="product-single-swiper swiper-theme"
                >
                    {galerieImage && galerieImage.length > 0 ? (
                        galerieImage.map((image, index) => (
                            <SwiperSlide key={index}>
                                <figure className="product-image">
                                    <Zoom>
                                        <img
                                            // src={
                                            //   image.src && image.src !== '' && image.src != null
                                            //     ? (ArtStk > 0
                                            //         ? fullUrl + image.src
                                            //         : param.urlBaseImage + imageRuptureStock) // Image de rupture de stock
                                            //     : param.urlBaseImage + defaultImage
                                            // }
                                            src={
                                                image.src &&
                                                image.src !== "" &&
                                                image.src != null
                                                    ? fullUrl + image.src
                                                    : fullUrl + defaultImage
                                            }
                                            alt={
                                                image.alt || "Image du produit"
                                            }
                                            width={500}
                                            height={500}
                                        />
                                    </Zoom>
                                </figure>
                            </SwiperSlide>
                        ))
                    ) : (
                        <SwiperSlide>
                            <figure className="product-image">
                                <Zoom>
                                    <img
                                        src={fullUrl + defaultImage}
                                        alt="Default Product"
                                        width="500"
                                        height="500"
                                    />
                                </Zoom>
                            </figure>
                        </SwiperSlide>
                    )}
                </Swiper>

                {/* Swiper pour les miniatures */}
                <Swiper
                    onSwiper={setThumbsSwiper}
                    slidesPerView={4}
                    spaceBetween={10}
                    watchSlidesVisibility
                    watchSlidesProgress
                    modules={[Navigation, Thumbs]}
                    className="product-thumbs-wrap swiper-container"
                >
                    {galerieImage &&
                        galerieImage.map((image, index) => (
                            <SwiperSlide key={index}>
                                <img
                                    src={
                                        image.src &&
                                        image.src !== "" &&
                                        image.src != null &&
                                        getImageName(image.src) !== ""
                                            ? fullUrl + image.src
                                            : fullUrl + defaultImage
                                    }
                                    alt="Product Thumb"
                                    width={500}
                                    height={500}
                                />
                            </SwiperSlide>
                        ))}
                </Swiper>
            </div>
        </div>
    );
};


export default ProductGallery;
