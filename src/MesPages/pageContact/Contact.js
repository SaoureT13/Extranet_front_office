import React from "react";
// import Header from '../../Mescomposants/Header'; // Importation du composant Header
import Footer from "../../Mescomposants/Footer";

const Contact = () => {
    return (
        <>
            <div id="otherpage">
                {/* <Header /> */}

                <main className="main">
                    {/* Start of Page Header */}
                    <div className="page-header">
                        <div className="container">
                            <h1 className="page-title mb-0">Contactez-nous</h1>
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
                                <p className="text-center w-50 d-block mx-auto mt-5">
                                    {" "}
                                    À SN PROVECI, vous trouverez toujours une
                                    oreille attentive à vos préoccupations et
                                    recevrez des conseils pertinents. Pour
                                    prendre un Rendez-vous, se faire livrer ou
                                    pour obtenir des informations
                                    complémentaires.
                                </p>
                            </section>
                            {/* End of Contact Title Section */}

                            <section className="contact-information-section mb-10">
                                <div className="swiper-container swiper-theme">
                                    <div className="swiper-wrapper row">
                                        <div className="swiper-slide icon-box text-center icon-box-primary col-lg-3">
                                            <span className="icon-box-icon icon-headphone">
                                                <i className="w-icon-headphone" />
                                            </span>
                                            <div className="icon-box-content">
                                                <h4 className="icon-box-title">
                                                    Nous contacter
                                                </h4>
                                                <p>
                                                    (+225) 27 21 35 30 27 /
                                                    (+225) 01 02 48 70 53
                                                </p>
                                                <p>(+225) 01 02 50 44 40</p>
                                            </div>
                                        </div>

                                        <div className="swiper-slide icon-box text-center icon-box-primary col-lg-3">
                                            <span className="icon-box-icon icon-email">
                                                <i className="w-icon-envelop-closed" />
                                            </span>
                                            <div className="icon-box-content">
                                                <h4 className="icon-box-title">
                                                    Par E-mail
                                                </h4>
                                                <p>snproveci@snproveci.com</p>
                                                <p>comptoir@snproveci.com</p>
                                            </div>
                                        </div>

                                        <div className="swiper-slide icon-box text-center icon-box-primary col-lg-3">
                                            <span className="icon-box-icon icon-map-marker">
                                                <i className="w-icon-map-marker" />
                                            </span>
                                            <div className="icon-box-content">
                                                <h4 className="icon-box-title">
                                                    Nous rencontrer
                                                </h4>
                                                <p>
                                                    Marcory Zone 4 rue G64 du
                                                    canal boulevard <br />À côté
                                                    du Golden Hôtel 18 BP 2863
                                                    Abidjan 18
                                                </p>
                                            </div>
                                        </div>
                                        <div className="swiper-slide icon-box text-center icon-box-primary col-lg-3">
                                            <span className="icon-box-icon icon-fax">
                                                <i className="w-icon-fax" />
                                            </span>
                                            <div className="icon-box-content">
                                                <h4 className="icon-box-title">
                                                    Fax
                                                </h4>
                                                <p>(+225) 27 21 35 30 29</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            {/* End of Contact Information section */}

                            <hr className="divider mb-10 pb-1" />

                            <section className="contact-section">
                                <div className="row gutter-lg pb-3">
                                    <div className="col-lg-6 mb-8">
                                        <h4 className="title mb-3">
                                            Horaire d'ouverture
                                        </h4>
                                        <div className="accordion accordion-bg accordion-gutter-md accordion-border">
                                            <div className="card">
                                                <div
                                                    id="collapse1"
                                                    className="card-body expanded"
                                                >
                                                    <div className="row">
                                                        {/* <div className="col-lg-3 col-sm-6">
                            <div className="widget">
                            <h3 className="widget-title">Company</h3>
                            <ul className="widget-body">
                                <li>
                                <a href="about-us.html">About Us</a>
                                </li>
                                <li>
                                <a href="#">Team Member</a>
                                </li>
                                <li>
                                <a href="#">Career</a>
                                </li>
                                <li>
                                <a href="contact-us.html">Contact Us</a>
                                </li>
                                <li>
                                <a href="#">Affiliate</a>
                                </li>
                                <li>
                                <a href="#">Order History</a>
                                </li>
                            </ul>
                            </div>
                        </div> */}
                                                        {/* <div className="col-lg-3 col-sm-6">
                            <div className="widget">
                            <h4 className="widget-title">My Account</h4>
                            <ul className="widget-body">
                                <li>
                                <a href="#">Track My Order</a>
                                </li>
                                <li>
                                <a href="cart.html">View Cart</a>
                                </li>
                                <li>
                                <a href="login.html">Sign In</a>
                                </li>
                                <li>
                                <a href="#">Help</a>
                                </li>
                                <li>
                                <a href="wishlist.html">My Wishlist</a>
                                </li>
                                <li>
                                <a href="#">Privacy Policy</a>
                                </li>
                            </ul>
                            </div>
                        </div> */}

                                                        <div className="col-lg-7 col-sm-6">
                                                            <div className="widget">
                                                                {/* <h4 className="widget-title">Customer Service</h4> */}
                                                                <ul className="widget-body">
                                                                    <li>
                                                                        <a href="#">
                                                                            Lundi
                                                                            8h à
                                                                            12h
                                                                            –
                                                                            13h
                                                                            à
                                                                            16h40s
                                                                        </a>
                                                                    </li>
                                                                    <li>
                                                                        <a href="#">
                                                                            Mardi
                                                                            8h à
                                                                            12h
                                                                            –
                                                                            13h
                                                                            à
                                                                            16h40!
                                                                        </a>
                                                                    </li>
                                                                    <li>
                                                                        <a href="#">
                                                                            Mercredi
                                                                            8h à
                                                                            12h
                                                                            –
                                                                            13h
                                                                            à
                                                                            16h40
                                                                        </a>
                                                                    </li>
                                                                    <li>
                                                                        <a href="#">
                                                                            Jeudi
                                                                            8h à
                                                                            12h
                                                                            –
                                                                            13h
                                                                            à
                                                                            16h40
                                                                        </a>
                                                                    </li>
                                                                    <li>
                                                                        <a href="#">
                                                                            Vendredi
                                                                            8h à
                                                                            12h
                                                                            –
                                                                            13h
                                                                            à
                                                                            16h40
                                                                        </a>
                                                                    </li>
                                                                    <li>
                                                                        <a href="#">
                                                                            Samedi
                                                                            9h à
                                                                            12h
                                                                        </a>
                                                                        <a href="#">
                                                                            Dimanche
                                                                            et
                                                                            jours
                                                                            fériés{" "}
                                                                            <span className="badge badge-danger">
                                                                                Fermé
                                                                            </span>{" "}
                                                                        </a>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* <div className="card">
                    <div className="card-header">
                      <a href="#collapse2" className="expand">Why is my registration delayed?</a>
                    </div>
                    <div id="collapse2" className="card-body collapsed">
                      <p className="mb-0">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                        do eiusmod temp orincid idunt ut labore et dolore magna
                        aliqua. Venenatis tellus in metus vulp utate eu sceler isque
                        felis. Vel pretium.
                      </p>
                    </div>
                  </div> */}
                                            {/* <div className="card">
                    <div className="card-header">
                      <a href="#collapse3" className="expand">What do I need to buy products?</a>
                    </div>
                    <div id="collapse3" className="card-body collapsed">
                      <p className="mb-0">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                        do eiusmod temp orincid idunt ut labore et dolore magna
                        aliqua. Venenatis tellus in metus vulp utate eu sceler isque
                        felis. Vel pretium.
                      </p>
                    </div>
                  </div> */}
                                            {/* <div className="card">
                    <div className="card-header">
                      <a href="#collapse4" className="expand">How can I track an order?</a>
                    </div>
                    <div id="collapse4" className="card-body collapsed">
                      <p className="mb-0">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                        do eiusmod temp orincid idunt ut labore et dolore magna
                        aliqua. Venenatis tellus in metus vulp utate eu sceler isque
                        felis. Vel pretium.
                      </p>
                    </div>
                  </div> */}
                                            {/* <div className="card">
                    <div className="card-header">
                      <a href="#collapse5" className="expand">How can I get money back?</a>
                    </div>
                    <div id="collapse5" className="card-body collapsed">
                      <p className="mb-0">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                        do eiusmod temp orincid idunt ut labore et dolore magna
                        aliqua. Venenatis tellus in metus vulp utate eu sceler isque
                        felis. Vel pretium.
                      </p>
                    </div>
                  </div> */}
                                        </div>
                                    </div>
                                    <div className="col-lg-6 mb-8">
                                        <h4 className="title mb-3">
                                            Nous écrire message
                                        </h4>
                                        <form
                                            className="form contact-us-form"
                                            action="#"
                                            method="post"
                                        >
                                            <div className="form-group">
                                                <label htmlFor="username">
                                                    Votre nom
                                                </label>
                                                <input
                                                    type="text"
                                                    id="username"
                                                    name="username"
                                                    className="form-control"
                                                    style={{ borderColor: "#214293" }}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="email_1">
                                                    Votre email
                                                </label>
                                                <input
                                                    type="email"
                                                    id="email_1"
                                                    name="email_1"
                                                    className="form-control"
                                                    style={{ borderColor: "#214293" }}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="message">
                                                    Votre message
                                                </label>
                                                <textarea
                                                    id="message"
                                                    name="message"
                                                    cols={30}
                                                    rows={5}
                                                    className="form-control"
                                                    style={{ borderColor: "#214293" }}
                                                ></textarea>
                                            </div>
                                            <button
                                                type="submit"
                                                className="btn btn-dark btn-rounded"
                                            >
                                                Envoyez
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default Contact;
