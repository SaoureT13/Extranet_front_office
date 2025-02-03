import React from "react";

function LoaderCartItem() {
    return (
        <div
            class="loader ml-4"
            style={{
                position: "absolute",
                top: "30%",
                transform: "translateY(-50%)",
                right: "-2.5rem",
                borderColor: "#2b4fa9",
                borderTopColor: "#f3f3f3",
                borderTopWidth: "4px",
                width: "22px",
                height: "22px",
            }}
        ></div>
    );
}

export default LoaderCartItem;
