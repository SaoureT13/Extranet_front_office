import React from 'react';
import './DeliverySchedule.css'; // Ensure the CSS file is created and imported

const DeliverySchedule = () => {
  const tabs = [
    { id: 1, name: 'Centre-nord' },
    { id: 2, name: 'Est' },
    { id: 3, name: 'Sud-est' },
  ];

  const locations = [
    {
      id: 67,
      date: '01/07 avant 12H00',
      deliveryDate: '03/07',
      areas: 'Abidjan - Agboville - Adzopé - Abengourou - Agnibilékrou - Daoukro',
    },
    {
      id: 69,
      date: '01/07 avant 12H00',
      deliveryDate: '03/07',
    },
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
  ];

  return (
    <div className="delivery-schedule-container">
      <div className="delivery-schedule-header">
        <h2>Calendrier de livraison</h2>
        <p>
          Les livraisons seront gratuites, mais nous ne prendrons pas les produits de nos concurrents. NB: Veuillez
          respecter la date limite de Commande <strong>DONT L'HEURE LIMITE EST DE 12 H 00</strong>, passer cette heure
          les commandes ne seront pas prises en compte pour la livraison de l'intérieur, pour nous permettre de
          préparer les colis, et ne pas retarder la livraison.
        </p>
      </div>

      <div className="tabs">
        {tabs.map((tab) => (
          <div key={tab.id} className="tab active">{tab.name}</div>
        ))}
      </div>

      <div className="delivery-content">
        <div className="location-list">
          <h3>{locations[0].areas}</h3>
          {locations.map((location) => (
            <p key={location.id}>
              <strong>LIVRAISON {location.id}</strong> | Date limite de commande {location.date} | Livraison {location.deliveryDate}
            </p>
          ))}
        </div>
        <img src='assets/images/icone-calendar.png'/>

        <div className="calendar-icon">
          <img src="assets/images/icone-calendar.png" alt="Calendar Icon" />
        </div>
      </div>
    </div>
  );
};

export default DeliverySchedule;
