import { toast } from "react-toastify";
import { apiEndpointe, crudData, mode } from "../services/apiService";

export const UpdateCommproduit = async (
    params,
    url
    // setProductData,
    // LG_AGEID,
    // onSuccess
) => {
    try {
        const response = await crudData(params, url);
        if (response.status === 200) {
            if (response.data.code_statut === "1") {
                return true;
            } else if (response.data.code_statut === "0") {
                toast.error("Erreur : " + response.data.desc_statut); // Notification d'erreur
                return false;
            }
        }
    } catch (error) {
        toast.error("Erreur:", error);
        return false;
    }
};
