// src/services/apiService.js
import { format, parse } from "date-fns";
import { fr } from "date-fns/locale";

import axios from 'axios';


export function formatDateSecond(rawDate){
  const date = parse(rawDate, "yyyy-MM-dd HH:mm:ss", new Date());
  return format(date, "MMM do, yyyy HH:mm", { locale: fr });
}

const getRootUrl = (port) => {
  const originWithoutPort = window.location.protocol + '//' + window.location.hostname;
  const defaultPort = "80";
  const baseUrl = "/extranetbackend/backoffice/webservices/";
  //const baseUrl = "/backoffice/webservices/";
  // const baseUrl = "/webservices/";
  const finalPort = port ? port : defaultPort;
  return `http://192.168.161.157:${finalPort}/`;
  //return `${originWithoutPort}:${finalPort}${baseUrl}`;
};


const getFullUrl = () => {
  const { protocol, hostname, port } = window.location;
  const portPart = port ? `:${port}` : '';
  // return `${protocol}//${hostname}:8888/`;
  return `${protocol}//${hostname}/`;
};


export const fullUrl = getFullUrl();
console.log(fullUrl)
// const fullUrl = "https://djx.975.mytemp.website/";

// +++++++++++++++ FONCTION +++++++++++++++++++
// const urlBaseImage = ""

const urlBaseImage = "extranetbackend/backoffice/"//alert(fullUrl+urlBaseImage); backoffice
const rootUrl = fullUrl + "extranetbackend/backoffice/webservices/"; //Production //extranetbackend/


const fetchEvenements = (params) => {
  return axios.post(`${rootUrl}TicketManager.php`, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
};

// Vous pouvez ajouter d'autres fonctions pour d'autres appels API ici
// Par exemple, une fonction pour obtenir les détails d'un événement
const fetchEvenementDetails = (eventId) => {
  const params = {
    mode: 'getEvenementDetails',
    LG_EVENID: eventId
    //STR_UTITOKEN: 'wzpjku2dvokriz3phgop',
  };

  return axios.post(`${rootUrl}TicketManager.php`, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
};


const doConnexion = (params) => {
  return axios.post(`${rootUrl}Authentification.php`, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
};

const doDisConnexion = (params) => {
  return axios.post(`${rootUrl}Authentification.php`, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
};

const crudData = (params,apiUrl) => {
  return axios.post(`${rootUrl}${apiUrl}`, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
};





const currentYear = new Date().getFullYear(); // Obtenir l'année en cours
const firstDayOfYear = new Date(currentYear, 0, 1); // 1er janvier de l'année en cours
const today = new Date(); // Date du jour



// Formater les dates en 'YYYY-MM-DD' (en retirant la partie heure)
const formatDate = (date) => date.toISOString().split('T')[0];

// Obtenir la date du dernier jour du mois prochain

const nextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0); // Obtenir le dernier jour du mois prochain
// on peut changer le nombre de mois (2)


// Stocker dans le localStorage
localStorage.setItem('DT_BEGIN', formatDate(firstDayOfYear));
localStorage.setItem('today', formatDate(today));

const date = {
  firstDayOfYear: formatDate(firstDayOfYear),
  // today: formatDate(today),
  today: formatDate(nextMonth),
};

const mode = {
  listProductMode: 'listProduct',
  getProductMode: 'getProduct',
  createCommproduittMode:'createCommproduit',
  listCommandeproductMode : 'listCommandeproduct',
  deleteCommproduitMode:'deleteCommproduit',
  updateCommproduitMode:'updateCommproduit',
  doConnexionMode:'doConnexion',
  getZoneLivraisonMode:'getDeliveryPlace',
  listProductByCommandeMode: 'listProductByCommande',

  getClientPanierMode : 'getClientPanier',
  validationCommandeMode : 'validationCommande',
  getExternalClientPanierMode : 'getExternalClientPanier',
  listClientCommandeMode : 'listClientCommande',
  getClientCalendarMode : 'getClientCalendar',
  getProductsMode: 'getProducts',



  listCategorieplaceEvenementMode:'listCategorieplaceEvenement',
  getProductListGammeAndCategoryMode: 'getProductListGammeAndCategory',
  markProductAsViewedMode: "markProductAsViewed",
  
};


const paths = {
  signIn: "/",
  saveEvent: "/save-event",
  eventDetails: "/event-details",
  eventList: "/liste-evenement",
  saveBanner: "/save-banner",
  clientList: "/liste-client",
  ticketList: "/liste-ticket",
  detailClient: "/detail-client",
  mesCommandes: "/mes-commandes",


  dashboard: "/tableau-bord",
  saveEventData: "/save-event-data",
  listeEventData: "/liste-event-data",
  saveEventBanner: "/save-event-banner",
  listeEventBanner: "/liste-event-banniere",
  listeUtilisateurs: "/liste-utilisateurs",
  saveUtilisateurs: "/save-utilisateurs",
  notFound: "*",
  
};


const apiEndpointe = {
  StockManagerEndPoint: 'StockManager.php',
  CommandeManagerEndPoint: 'CommandeManager.php',
  ConfigurationManagerEndPoint: 'ConfigurationManager.php',
};

const errorImageUrl = {
  imagePath_404: 'assets/images/404.png',
  imagePath_500: 'assets/images/500.png',
  imagePath_maintenance: 'assets/images/maintenance.png',
};



const userDatas = {
  UTIFIRSTLASTNAME: null,
  UTIPHONE: null,
  UTIMAIL: null,
  UTILOGIN: null,
  UTIPIC: null,
  LG_AGEID:'14226168275285031549',
  STR_UTITOKEN: "c4cd488e9ebde9552879",
  PRODESCRIPTION: "super administrateur",
  PROID: null,
  PROTYPE: "system",
  SOCNAME: "nkm-tech",
  SOCDESCRIPTION: "nkm-technology",
  SOCLOGO: "logo_nkm.png",
  SOCID: "1",
  LG_CLIID: '596',
  code_statut: "1",
  desc_statut: "Bienvenu ngbeadego martial",
  LG_COMMID:'353493'
}

export const defaultImage= "extranetbackend/backoffice/images/default-product-image.jpg";

const imageRuptureStock= "images/produits/AMOXY-C1KG-FACE.jpg";

localStorage.setItem("defaultImage", JSON.stringify(defaultImage));
localStorage.setItem("imageRuptureStock", imageRuptureStock);
// localStorage.setItem("urlBaseImage", fullUrl + urlBaseImage);
localStorage.setItem("urlBaseImage", "/images/img1.jpeg");



// localStorage.setItem('userData', JSON.stringify(userData));
localStorage.setItem("errorImageUrl", JSON.stringify(errorImageUrl));
localStorage.setItem("appPaths", JSON.stringify(paths));
localStorage.setItem("appMode", JSON.stringify(mode));
localStorage.setItem("apiEndpointe", JSON.stringify(apiEndpointe));
localStorage.setItem("appDate", JSON.stringify(date));
localStorage.setItem("appDevise", "GNF");





export { fetchEvenements, fetchEvenementDetails, doConnexion, doDisConnexion , crudData};
