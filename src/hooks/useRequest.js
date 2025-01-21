import { useState } from "react";
import axios from "axios";
import { rootUrl } from "../services/apiService";

const useRequest = () => {
    const [data, setData] = useState(null);

    const makeRequest = async (url, options = {}) => {
        try {
            const response = await axios({
                url: rootUrl + url,
                ...options,
            });

            console.log(response.data)
            setData(response.data); // Mets à jour les données avec la réponse
            return response.data; // Retourne directement les données
        } catch (err) {
            // Si une erreur se produit, on logue l'erreur dans la console
            console.error("Erreur lors de la requête :", err);
            return null; // Retourne null en cas d'erreur
        }
    };

    return { data, makeRequest }; // Retourne les données et la fonction pour faire la requête
};

export default useRequest;
