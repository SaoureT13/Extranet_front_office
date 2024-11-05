import React from "react";
// import "./PhotoSwipe.css"; // Importez le fichier CSS si nécessaire pour votre style

const PhotoSwipe = () => {
  return (
    <div className="pswp" tabIndex={-1} role="dialog" aria-hidden="true">
      {/* Background of PhotoSwipe */}
      <div className="pswp__bg" />
      {/* Slides wrapper */}
      <div className="pswp__scroll-wrap">
        {/* Container for slides */}
        <div className="pswp__container">
          <div className="pswp__item" />
          <div className="pswp__item" />
          <div className="pswp__item" />
        </div>
        {/* Default interface */}
        <div className="pswp__ui pswp__ui--hidden">
          <div className="pswp__top-bar">
            {/* Controls */}
            <div className="pswp__counter" />
            <button
              className="pswp__button pswp__button--close"
              aria-label="Close (Esc)"
            />
            <button
              className="pswp__button pswp__button--zoom"
              aria-label="Zoom in/out"
            />
            <div className="pswp__preloader">
              <div className="loading-spin" />
            </div>
          </div>
          <div className="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
            <div className="pswp__share-tooltip" />
          </div>
          <button
            className="pswp__button pswp__button--arrow--left"
            aria-label="Previous (arrow left)"
          />
          <button
            className="pswp__button pswp__button--arrow--right"
            aria-label="Next (arrow right)"
          />
          <div className="pswp__caption">
            <div className="pswp__caption__center" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoSwipe;
