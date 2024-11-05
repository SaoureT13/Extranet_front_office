import { useEffect } from 'react';

const LoadExternalScripts = () => {
  useEffect(() => {
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.defer = true;

        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));

        document.body.appendChild(script);
      });
    };

    const loadScripts = async () => {
      try {

        await loadScript("https://portotheme.com/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js");await loadScript("assets/vendor/jquery/jquery.min.js");
        await loadScript("assets/vendor/sticky/sticky.min.js");
        await loadScript("assets/vendor/jquery.plugin/jquery.plugin.min.js");
        await loadScript("assets/vendor/imagesloaded/imagesloaded.pkgd.min.js");
        await loadScript("assets/vendor/magnific-popup/jquery.magnific-popup.min.js");
        await loadScript("assets/vendor/swiper/swiper-bundle.min.js");
        await loadScript("assets/vendor/zoom/jquery.zoom.js");
        await loadScript("assets/vendor/photoswipe/photoswipe.min.js");
        await loadScript("assets/vendor/photoswipe/photoswipe-ui-default.min.js");

        await loadScript("assets/js/main.js");

      } catch (error) {
        console.error(error);
      }
    };

    loadScripts();

    return () => {
      // Cleanup if needed
    };
  }, []);

  return null;  // This component doesn't render any visible UI
};

export default LoadExternalScripts;
