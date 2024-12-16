import React, { useState } from "react";
import { crudData } from "../../services/apiService";
import { toast } from "react-toastify";
import { formatPrice } from "../../MesPages/Panier/Cart";

const CSVUploader = ({
    onHandleProductData,
    fetchData,
    onHandlePanierData,
    fetchPanierData,
    data,
    onHandlesetData,
    params,
    onHandleSuccess,
}) => {
    const mode = JSON.parse(localStorage.getItem("appMode"));
    const apiEndpointe = JSON.parse(localStorage.getItem("apiEndpointe"));
    const userData = JSON.parse(localStorage.getItem("userData"));
    const [currentPage, setCurrentPage] = useState(1);
    const [currentFileName, setCurrentFileName] = useState("");
    const rowsPerPage = 10; // Nombre de lignes par page
    const [isLoadingSpinner, setIsLoadingSpinner] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorReport, setErrorReport] = useState([]);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const content = e.target.result;
                parseCSV(content);
            };

            reader.readAsText(file);
        }
        setCurrentFileName(event.target.files[0].name);
    };

    //TODO
    //Construire la fiche rapport en excel ou txt, la rendre uploadable.
    //Ajouter un bouton pour télécharger la fiche rapport
    //Dans le fichier fait un produit problematique par ligne

    const parseCSV = (csvText) => {
        const rows = csvText.trim().split("\n"); // Divise les lignes
        const parsedData = rows.map((row) => {
            const columns = row.split(",");
            return {
                str_proname: columns[0],
                int_cprquantity: columns[1],
            };
        });
        if (parsedData.length > 0) {
            fetchProductsList(parsedData);
        }
        // (parsedData);
    };

    // Pagination logic
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

    const totalPages = Math.ceil(data.length / rowsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleAddToCart = () => {
        // Simulate loading state
        setIsLoadingSpinner(true);

        const payload = {
            mode: params.mode.createCommproduittMode,
            LG_AGEID: params.userData.LG_AGEID,
            STR_COMMNAME: "",
            STR_COMMADRESSE: "Plateau, Pullman",
            STR_LIVADRESSE: "Zone 4, marcory",
            STR_UTITOKEN: params.userData.STR_UTITOKEN,
            CMD_DATA: JSON.stringify(data),
        };

        console.log(payload);

        //Envoyer les données vers l'API
        crudData(payload, params.apiEndpointe.CommandeManagerEndPoint)
            .then((response) => {
                if (response && response.status === 200) {
                    if (response.data.code_statut === "1") {
                        localStorage.setItem(
                            "LG_COMMID",
                            response.data.LG_COMMID
                        );
                        onHandleSuccess();
                        const paramPanier = {
                            mode: mode.getClientPanierMode,
                            LG_AGEID: userData?.LG_AGEID,
                        };
                        fetchPanierData(
                            paramPanier,
                            apiEndpointe.CommandeManagerEndPoint,
                            onHandlePanierData
                        );
                        const params = {
                            mode: mode.listCommandeproductMode,
                            LG_AGEID: userData?.LG_AGEID,
                        };
                        fetchData(
                            params,
                            apiEndpointe.CommandeManagerEndPoint,
                            onHandleProductData
                        );
                        const newErrors = response.data.product_unavailable
                            .filter(
                                (item) =>
                                    !errorReport.some(
                                        (error) => error.codeProduit === item
                                    )
                            )
                            .map((item) => {
                                return {
                                    codeProduit: item,
                                    motif: "Produit en rupture de stock",
                                };
                            });

                        setErrorReport((errors) => [...errors, ...newErrors]);
                        if (response.data.product_added_to_cart > 0) {
                            toast.success("Produits ajoutés au panier");
                        }
                    } else {
                        toast.error("Erreur : " + response.data.desc_statut);
                    }
                } else {
                    toast.error("Erreur survenu");
                }
            })
            .catch((error) => {
                console.error("Erreur lors de l'ajout au panier:", error);
            })
            .finally(() => {
                setIsLoadingSpinner(false);
                onHandlesetData([]);
                setCurrentFileName("");
            });
    };

    const fetchProductsList = (JSONData) => {
        const payload = {
            mode: mode.getProductsMode,
            CMD_DATA: JSON.stringify(JSONData),
        };
        setIsLoading(true);
        crudData(payload, params.apiEndpointe.ConfigurationManagerEndPoint)
            .then((response) => {
                if (response && response.status === 200) {
                    if (response.data.code_statut !== "1") {
                        console.error(
                            "Erreur lors de la récupération des produits:",
                            response.data.desc_statut
                        );
                    } else {
                        console.log(response.data.products);
                        onHandlesetData(response.data.products);
                        const errors = response.data.products_not_found.map(
                            (item) => {
                                return {
                                    codeProduit: item,
                                    motif: "Produit correspondant introuvable",
                                };
                            }
                        );
                        setErrorReport(errors);
                    }
                } else {
                    console.error("Erreur survenu");
                }
            })
            .catch((error) => {
                console.error("Erreur lors de l'ajout au panier:", error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <div style={{}}>
            <h2>Charger votre fichier de commande</h2>
            <p style={{ marginTop: "-20px" }}>
                Choisissez un fichier au format <u>csv</u>
            </p>
            <label
                htmlFor="file-upload"
                style={{
                    display: "inline-block",
                    backgroundColor: "#2b4fa9",
                    color: "#fff",
                    padding: "10px 20px",
                    fontSize: "16px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginBottom: "20px",
                }}
            >
                Sélectionner un fichier
            </label>
            <input
                id="file-upload"
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                style={{ display: "none" }}
            />
            {currentFileName && (
                <div>
                    <span>
                        <strong>Fichier sélectionné :</strong>
                    </span>
                    <p>{currentFileName}</p>
                </div>
            )}

            {errorReport.length > 0 && (
                <div style={{ marginBottom: "40px" }}>
                    <h3 style={{ color: "red", marginTop: "30px" }}>
                        Rapport d'Erreurs
                    </h3>
                    <table style={errorTableStyle}>
                        <thead>
                            <tr>
                                <th style={tableCellStyleError}>
                                    Code Produit
                                </th>
                                <th style={tableCellStyleError}>Motif</th>
                            </tr>
                        </thead>
                        <tbody>
                            {errorReport.map((error, index) => (
                                <tr key={index}>
                                    <td style={tableCellStyleError}>
                                        {error.codeProduit}
                                    </td>
                                    <td style={tableCellStyleError}>
                                        {error.motif}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {data.length > 0 && (
                <>
                    <h3>Liste produits à ajouter au panier :</h3>
                    <div style={{ minHeight: "342px" }}>
                        <table
                            style={{
                                width: "100%",
                                borderCollapse: "collapse",
                            }}
                        >
                            <thead>
                                <tr>
                                    <th style={tableHeaderStyle}>
                                        Code Produit
                                    </th>
                                    <th style={tableHeaderStyle}>Libéllé</th>
                                    <th style={tableHeaderStyle}>
                                        Prix de vente
                                    </th>
                                    <th style={tableHeaderStyle}>Quantité</th>
                                    <th style={tableHeaderStyle}>
                                        Montant total
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentRows.map((row, index) => (
                                    <tr key={index}>
                                        <td style={tableCellStyle}>
                                            {row.str_proname}
                                        </td>
                                        <td style={tableCellStyle}>
                                            {row.str_prodescription}
                                        </td>
                                        <td style={tableCellStyle}>
                                            {formatPrice(row.int_propricevente)}
                                        </td>
                                        <td style={tableCellStyle}>
                                            {row.int_cprquantity}
                                        </td>
                                        <td style={tableCellStyle}>
                                            {formatPrice(row.dbl_montant)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination controls */}
                    <div style={paginationStyle}>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index}
                                onClick={() => handlePageChange(index + 1)}
                                style={{
                                    ...pageButtonStyle,
                                    backgroundColor:
                                        currentPage === index + 1
                                            ? "#2b4fa9"
                                            : "#fff",
                                    color:
                                        currentPage === index + 1
                                            ? "#fff"
                                            : "#2b4fa9",
                                    fontFamily: "inherit",
                                }}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>

                    {/* Validation button */}
                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                        <button
                            onClick={handleAddToCart}
                            className="d-flex align-items-center justify-content-center btn btn-block btn-dark btn-icon-right btn-rounded  btn-checkout"
                        >
                            ajouter au panier
                            {isLoadingSpinner && (
                                <div className="loader ml-4"></div>
                            )}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

// Styles
const tableHeaderStyle = {
    border: "1px solid #ddd",
    padding: "8px",
    backgroundColor: "#f4f4f4",
    textAlign: "left",
};

const tableCellStyle = {
    border: "1px solid #ddd",
    padding: "8px",
};

const paginationStyle = {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
};

const pageButtonStyle = {
    margin: "0 5px",
    padding: "5px 10px",
    border: "1px solid #007BFF",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
};

const errorTableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    backgroundColor: "#FFD2D2",
    textAlign: "left",
};

const tableCellStyleError = {
    border: "1px solid red",
    padding: "8px",
    color: "red",
};

const tableHeaderStyleError = {
    border: "1px solid #ddd",
    padding: "8px",
    backgroundColor: "red",
    textAlign: "left",
};

export default CSVUploader;
