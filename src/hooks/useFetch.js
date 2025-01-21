import { useState, useEffect } from "react";
import axios from "axios";
import { rootUrl } from "../services/apiService";

const useFetch = (url, options = {}, formData = null) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fullUrl = rootUrl + url;
        let isMounted = true; // Empêche les mises à jour d'état après un démontage

        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const headers = {
                    ...options.headers, // Conserve les headers existants
                };

                // Si des données multipart sont fournies, définis les headers automatiquement
                if (formData instanceof FormData) {
                    headers["Content-Type"] = "multipart/form-data";
                }

                const response = await axios({
                    url: fullUrl,
                    method: options.method || "GET", // Méthode par défaut GET
                    data: formData || options.data, // Priorité au FormData
                    headers,
                    ...options,
                });

                if (isMounted) {
                    setData(response.data);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.response?.data?.message || err.message);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, []);

    return { data, loading, error };
};

export default useFetch;
