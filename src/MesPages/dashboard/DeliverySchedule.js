import React, { useState } from 'react';

// Données des onglets
const tabsData = [
    {
        id: 'product-tab-centre-nord',
        title: 'Centre-nord',
    },
    {
        id: 'product-tab-est',
        title: 'Est',
    },
    {
        id: 'product-tab-sud-est',
        title: 'Sud-est',
    }
];

// Données des listes
const listsData = {
    'product-tab-centre-nord': [
      {
        id: 67,
        date: '01/07 avant 12H00',
        deliveryDate: '03/07',
        areas: 'Abidjan - Agboville - Adzopé - Abengourou - Agnibilékrou - Daoukro',
      },
      {
        id: 71,
        date: '01/07 avant 12H00',
        deliveryDate: '03/07',
      },
      {
        id: 72,
        date: '01/07 avant 12H00',
        deliveryDate: '03/07',
      },
    ],
    'product-tab-est': [
      {
        id: 69,
        date: '01/07 avant 12H00',
        deliveryDate: '03/07',
      },
      {
        id: 71,
        date: '01/07 avant 12H00',
        deliveryDate: '03/07',
      },
      {
        id: 72,
        date: '01/07 avant 12H00',
        deliveryDate: '03/07',
      },
    ],
    'product-tab-sud-est': [
      
      
      {
        id: 70,
        date: '01/07 avant 12H00',
        deliveryDate: '03/07',
      },
      {
        id: 71,
        date: '01/07 avant 12H00',
        deliveryDate: '03/07',
      },
      {
        id: 72,
        date: '01/07 avant 12H00',
        deliveryDate: '03/07',
      },
    ],
};

const ProductTabs = ({param = {}}) => {
    // Initialiser l'onglet actif avec 'product-tab-est'
    const [activeTab, setActiveTab] = useState('product-tab-est');

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
    };

    return (
        <div className={` ${param.userData ? 'bgUserConnected' : ''}`}>
          <div className='container'>
          <div className='bg-blue-light p-5'>
          <div className="delivery-schedule-header">
            <h2>Calendrier de livraison</h2>
            <p>
              Les livraisons seront gratuites, mais nous ne prendrons pas les produits de nos concurrents. NB: Veuillez
              respecter la date limite de Commande <strong>DONT L'HEURE LIMITE EST DE 12 H 00</strong>, passer cette heure
              les commandes ne seront pas prises en compte pour la livraison de l'intérieur, pour nous permettre de
              préparer les colis, et ne pas retarder la livraison.
            </p>
          </div>
            <div className="tab tab-nav-boxed tab-nav-underline product-tabs">
              <ul className="nav nav-tabs" role="tablist">
                  {tabsData.map((tab) => (
                      <li className="nav-item" key={tab.id}>
                          <a
                              href={`#${tab.id}`}
                              className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                              onClick={() => handleTabClick(tab.id)}
                          >
                              {tab.title}
                          </a>
                      </li>
                  ))}
              </ul>
              <div className="tab-content d-flex">
                  {tabsData.map((tab) => (
                      <div
                          key={tab.id}
                          className={`tab-pane p-5 ${activeTab === tab.id ? 'active in' : ''}`}
                          id={tab.id}
                      >
                          <ul className="list-none">
                              {listsData[tab.id].map((item, index) => (
                                  <li key={index}>
                                      {/* <p>{item.title}</p> */}
                                      <strong>LIVRAISON {item.id}</strong> | Date limite de commande {item.date} | Livraison {item.deliveryDate}

                                  </li>
                              ))}
                          </ul>
                      </div>
                  ))}
                  <div className="calendar-icon">
                    <img src="assets/images/icone-calendar.png" width={100} alt="Calendar Icon" className='pull-right'/>
                  </div>
              </div>
          </div>
          </div>
          </div>
          
        </div>
    );
};

export default ProductTabs;
