import React, { useState, useEffect } from "react";
import "@splidejs/splide/dist/css/splide.min.css";
import { crudData, fullUrl } from "../../services/apiService";
import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";

const ExtranetSlider = ({
    numberSlidesToShow,
    defaultImage,
    slideMargin,
    ImagelBaseUrl,
}) => {
    // const date = JSON.parse(localStorage.getItem("appDate"));
    const mode = JSON.parse(localStorage.getItem("appMode"));
    const [sliderData, setData] = useState([]);

    // function getImageName(imagePath) {
    //     // On divise la chaîne par les '/' et on prend le dernier élément
    //     const parts = imagePath.split("/");
    //     return parts[parts.length - 1];
    // }

    useEffect(() => {
        const formData = new FormData();

        formData.append("mode", mode.listDocumentsMode);
        formData.append(
            "FILTER_OPTIONS[LG_LSTID]",
            "0000000000000000000000000000000000000792"
        );

        crudData(formData, "ConfigurationManager.php")
            .then((response) => {
                setData(response.data.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    const options = {
        type: "loop",
        gap: "1rem",
        autoplay: true,
        pauseOnHover: false,
        resetProgress: false,
    };

    return (
        <section className="home home--hero">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="hero splide splide--hero">
                            <div className="splide__track">
                                <Splide
                                    options={options}
                                    aria-labelledby="autoplay-example-heading"
                                    hasTrack={false}
                                >
                                    <div style={{ position: "relative" }}>
                                        <SplideTrack>
                                            {sliderData.length > 0 &&
                                                sliderData.map(
                                                    (image, index) => (
                                                        <SplideSlide>
                                                            <img
                                                                src={`
                                                                    ${
                                                                        fullUrl +
                                                                        image.STR_DOCPATH
                                                                    }
                                                                `}
                                                                alt={
                                                                    image.LG_DOCID
                                                                }
                                                            />
                                                        </SplideSlide>
                                                    )
                                                )}
                                        </SplideTrack>
                                    </div>
                                </Splide>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ExtranetSlider;
