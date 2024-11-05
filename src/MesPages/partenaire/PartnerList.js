import React from 'react';
// import Header from '../../Mescomposants/Header'; // Importation du composant Header
import Footer from '../../Mescomposants/Footer';


const partners = [
  {
    href: 'element-alerts.html',
    image: "assets/images/fournisseurs/Canavet.png",
    label: 'Canavet',
  },
  {
    href: 'element-alerts.html',
    image: "assets/images/fournisseurs/pantex-holland.png",
    label: 'Pantex holland',
  },
  {
    href: 'element-alerts.html',
    image: "assets/images/fournisseurs/BIOVAC LOGO ביוואק - לוגו אנגלית מעודכן 2020 (JPEG).jpg",
    label: 'Biovac',
  },
  {
    href: 'element-alerts.html',
    image: "assets/images/fournisseurs/bioveta.png",
    label: 'Bioveta',
  },
  {
    href: 'element-alerts.html',
    image: "assets/images/fournisseurs/Boehringer-Ingelheim-logo.png",
    label: 'Boehringer Ingelheim',
  },
  {
    href: 'element-alerts.html',
    image: "assets/images/fournisseurs/CEVA.jpg",
    label: 'Ceva',
  },
  {
    href: 'element-alerts.html',
    image: "assets/images/fournisseurs/DOPHARMA.png",
    label: 'Dopharma',
  },
  {
    href: 'element-alerts.html',
    image: "assets/images/fournisseurs/hipra.jpg",
    label: 'Hipra',
  },
  {
    href: 'element-alerts.html',
    image: "assets/images/fournisseurs/huvepharma-logo-08-2026.png",
    label: 'Huvepharma',
  },
  {
    href: 'element-alerts.html',
    image: "assets/images/fournisseurs/Inovet_logo_RGB.jpg",
    label: 'Inovet',
  },
  {
    href: 'element-alerts.html',
    image: "assets/images/fournisseurs/lanavet.png",
    label: 'Lanavet',
  },
  {
    href: 'element-alerts.html',
    image: "assets/images/fournisseurs/laprovet-.jpg",
    label: 'Laprovet',
  },
  {
    href: 'element-alerts.html',
    image: "assets/images/fournisseurs/Medivet.png",
    label: 'Medivet',
  },
  {
    href: 'element-alerts.html',
    image: "assets/images/fournisseurs/mixscience.jpg",
    label: 'Mixscience',
  },
  {
    href: 'element-alerts.html',
    image: "assets/images/fournisseurs/Nutriblock.jpg",
    label: 'Nutriblock',
  },
  // Ajoutez d'autres partenaires ici
];


const PartnerList = () => {
  return (

    
    <>
      <div id="otherpage">
        {/* <Header /> */}
        

        <main className="main">
          {/* Start of Page Header */}
          <div className="page-header">
            <div className="container">
              <h1 className="page-title mb-0">Nos Partenaires
              </h1>
            </div>
          </div>
          {/* End of Page Header */}
          
          {/* Start of Breadcrumb */}
          {/* <nav className="breadcrumb-nav mb-10 pb-1">
            <div className="container">
              <ul className="breadcrumb">
                <li>
                  <a href="demo1.html">Home</a>
                </li>
                <li>Contact Us</li>
              </ul>
            </div>
          </nav> */}
          {/* End of Breadcrumb */}
          
          {/* Start of PageContent */}
          <div className="page-content contact-us">
            <div className="container">
              <section className="content-title-section mb-10">
                {/* <h3 className=" text-center mb-3">Contact Information</h3> */}
                <p className="text-center w-50 d-block mx-auto my-5"> À SN PROVECI, vous trouverez toujours une oreille attentive à vos préoccupations et recevrez des conseils pertinents. Pour prendre un Rendez-vous, se faire livrer ou pour obtenir des informations complémentaires.</p>
              </section>
              {/* End of Contact Title Section */}

              <img src="assets/images/carte.png" className='img-fluid'/>
              
              <section className="element-section text-center mt-10 mb-10 pt-5 pb-2" id="section-elements">
                  <div className='row'>
                      {partners.map((partner, index) => (
                        <div className=' col-xl-3 col-lg-4 col-md-3 col-xs-6 col-12'>

                          <div class="mb-4">
                            <a href="element-accordions.html" target="blank" class="element">
                              <img src= {partner.image}  height="80px"/>
                          
                            {/* <span>{partner.label}</span> */}
                                {/* <p>{partner.label}</p> */}
                            </a>
                        </div>
                        </div>
                      ))}
                    
                  </div>
              </section>
              {/* End of Contact Information section */}
              
              <hr className="divider mb-10 pb-1" />
            </div>
          </div>
        </main>

      </div>
    </>
  );
};

export default PartnerList;

