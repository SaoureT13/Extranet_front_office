import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import MobileMenu  from './MobileMenu'
import { NavLink } from 'react-router-dom';


function Footer({ param = {} }) {
  const { theme, toggleTheme } = useTheme();


  return (
    <div className={` ${param.userData != null ? 'bgUserConnected' : ''}`}>
        
        <footer className=" pt-10" data-animation-options='{"name": "fadeIn"}'>
           
            <div className="container">
                <div style={{ width: '50%', margin: '0 auto', marginTop: '30px' }} className="m">
                    <img src="assets/images/image_footer.png" alt="Icon" />
                </div>
                <div style={{ width: '65%', margin: '0 auto', marginTop: '30px' }} className="m">
                    <h3 className='text-center'>CONTACTEZ UN CONSEILLER</h3>
                    <p className='text-center'>Nous sommes là pour vous accompagner efficacement dans le choix et la commande de vos produits.</p>
                <div className="footer-top pt-3">
                    <div className="row mx-auto">
                        <div className="col-lg-4 col-sm-6">
                            <div className="widget">
                                <h3 className="widget-title">Par Email</h3>
                                <ul className="widget-body">
                                    <li><a href="#">snproveci@snproveci.com</a></li>
                                    <li><a href="#">comptoir@snproveci.com</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-4 col-sm-6">
                            <div className="widget">
                                <h3 className="widget-title">Par téléphone</h3>
                                <ul className="widget-body">
                                    <li><a href="#">(+225) 27 21 35 30 27</a></li>
                                    <li><a href="#">(+225) 01 02 48 70 53</a></li>
                                    <li><a href="contact-us.html">(+225) 01 02 50 44 40</a></li>
                                </ul>
                                <ul className="widget-body">
                                    <li><a href="about-us.html">Par Fax</a></li>
                                    <li><a href="#">(+225) 27 21 35 30 29</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-4 col-sm-6">
                            <div className="widget">
                                <h4 className="widget-title">Par téléphone</h4>
                                <ul className="widget-body">
                                    <li><a href="#">Marcory Zone 4 rue G64 du canal boulevard<br/>
                                        À côté du Golden Hôtel<br/>
                                        18 BP 2863 Abidjan 18 </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        
                    </div>
                </div>
                </div>
                
                <div className="footer-bottom">
                    <div className="footer-left">
                        <p className="copyright">Copyright © 2021 SN-PROVECI. All Rights Reserved.</p>
                    </div>
                    <div className="footer-right">
                        <span className="payment-label mr-lg-8">We're using safe payment for</span>
                        <figure className="payment">
                            <img src="assets/images/payment.png" alt="payment" width="159" height="25" />
                        </figure>
                    </div>
                </div>
            </div>
        </footer>
        <MobileMenu />

    </div>
  );
}

export default Footer;
