import React, { useState } from 'react';

const EncoursComponent = ({totalAmount, clisolde}) => {
 
  console.log(clisolde)
  
  // Les données d'exemple
  const [data, setData] = useState({
    encours: clisolde, 
    panier: totalAmount
  });

  console.log(data.encours)
  // Calcul de l'encours restant
  const encoursRestant = clisolde > 0 ? clisolde - totalAmount : 0;
  console.log(clisolde)

  return (
    <div style={styles.container}>
      <div style={styles.barContainer}>
        {/* <div style={{ ...styles.bar, ...styles.commande, width: `${(data.commande / data.encours) * 100}%` }}>
          Commandes {data.commande.toLocaleString()}
        </div> */}
        <div style={{ ...styles.bar, ...styles.panier, width: `${(totalAmount / clisolde) * 100}%` }}>
          {/* Panier {data.panier.toLocaleString()} */}
        </div>
        <div style={{ ...styles.bar, ...styles.restant, width: `${(encoursRestant /clisolde) * 100}%` }}>
          {/* En cours restant */}
        </div>
      </div>
      

      <div style={styles.footer}>
        {/* <span>Commandes {data.commande.toLocaleString()}</span> */}
        <span>Panier: {totalAmount ? totalAmount.toLocaleString() : 0}</span>
        <span>Encours: {encoursRestant > 0 ? encoursRestant.toLocaleString() : "Pas d'encours"}</span>
      </div>

      <div style={styles.footer}>
        {/* <span>Encours du 27/09 au 27/10</span> */}
        {/* <span>{data.encours.toLocaleString()}</span> */}
        {/* <span>{(data.commande + data.panier).toLocaleString()}</span> */}
      </div>

    </div>
  );
};

// Styles en objet JavaScript
const styles = {
  container: {
    backgroundColor: '#f9f9f9',
    padding: '15px',
    borderRadius: '10px',
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  barContainer: {
    display: 'flex',
    height: '25px',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#f1f1f1',
    marginBottom: '10px',
  },
  bar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '12px',
    whiteSpace: 'nowrap',
  },
  commande: {
    backgroundColor: '#6c92dd',

  },
  panier: {
    backgroundColor: '#3656a1',

  },
  restant: {
    backgroundColor: '#bad3fb',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: '#4a5568',
  },
};

export default EncoursComponent;
