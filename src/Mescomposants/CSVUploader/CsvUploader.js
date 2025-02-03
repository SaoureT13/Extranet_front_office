import React, { useState } from "react";
import { crudData } from "../../services/apiService";
import { toast } from "react-toastify";
import { formatPrice } from "../../MesPages/Panier/Cart";
import * as XLSX from "xlsx";

const CSVUploader = ({ data, onHandlesetData, params, onHandleSuccess }) => {
    const mode = JSON.parse(localStorage.getItem("appMode"));
    const [currentPage, setCurrentPage] = useState(1);
    const [currentFileName, setCurrentFileName] = useState("");
    const rowsPerPage = 10; // Nombre de lignes par page
    const [isLoadingSpinner, setIsLoadingSpinner] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorReport, setErrorReport] = useState([]);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const extension = file.name.split(".")[1];
            if (extension === "csv") {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const content = e.target.result;
                    parseCSV(content);
                };
                reader.readAsText(file);
            } else if (extension === "xlsx") {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var data = e.target.result;
                    let readedData = XLSX.read(data, { type: "binary" });
                    const wsname = readedData.SheetNames[0];
                    const ws = readedData.Sheets[wsname];

                    const jsonData = XLSX.utils.sheet_to_json(ws, {
                        header: 1,
                    });
                    parseXLSX(jsonData);
                };
                reader.readAsArrayBuffer(file);
            } else {
                return;
            }
            setCurrentFileName(event.target.files[0].name);
        }
    };

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
    };

    const parseXLSX = (jsonData) => {
        const parsedData = jsonData.map((row) => {
            return {
                str_proname: row[0],
                int_cprquantity: row[1],
            };
        });
        if (parseXLSX.length > 0) {
            fetchProductsList(parsedData);
        }
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

                        if (response.data?.product_unavailable) {
                            let newErrors = response.data?.product_unavailable
                                .filter(
                                    (item) =>
                                        !errorReport.some(
                                            (error) =>
                                                error.codeProduit === item
                                        )
                                )
                                .map((item) => {
                                    return {
                                        codeProduit: item,
                                        motif: "Produit en rupture de stock",
                                    };
                                });
                            setErrorReport((errors) => [
                                ...errors,
                                ...newErrors,
                            ]);
                        }

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
                console.log(error);
                if (error) {
                    toast.error("Erreur lors de l'ajout au panier:", error);
                }
            })
            .finally(() => {
                setIsLoadingSpinner(false);
                onHandlesetData([]);
                setCurrentFileName("");
                window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                });
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
            <h2>Charger un fichier de commande </h2>
            <p style={{ marginTop: "-20px" }}>
                Vous pouvez importer un fichier <u>Csv</u> ou <u>Excel</u> pour
                la saisie de votre commande automatiquement.
                <br />
                Cliquer sur une icone pour telecharger un exemplaire.
            </p>
            <div
                className="d-flex flex-wrap"
                style={{
                    gap: "20px",
                    marginBottom: "20px",
                    marginTop: "-20px",
                }}
            >
                <div>
                    <h5 style={{ margin: 0 }}>Csv:</h5>
                    <a
                        className=""
                        href="/assets/example_file/example.csv"
                        download
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                            fill="#008000"
                            width={24}
                            height={24}
                        >
                            <path d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 144-208 0c-35.3 0-64 28.7-64 64l0 144-48 0c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128zM200 352l16 0c22.1 0 40 17.9 40 40l0 8c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-8c0-4.4-3.6-8-8-8l-16 0c-4.4 0-8 3.6-8 8l0 80c0 4.4 3.6 8 8 8l16 0c4.4 0 8-3.6 8-8l0-8c0-8.8 7.2-16 16-16s16 7.2 16 16l0 8c0 22.1-17.9 40-40 40l-16 0c-22.1 0-40-17.9-40-40l0-80c0-22.1 17.9-40 40-40zm133.1 0l34.9 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-34.9 0c-7.2 0-13.1 5.9-13.1 13.1c0 5.2 3 9.9 7.8 12l37.4 16.6c16.3 7.2 26.8 23.4 26.8 41.2c0 24.9-20.2 45.1-45.1 45.1L304 512c-8.8 0-16-7.2-16-16s7.2-16 16-16l42.9 0c7.2 0 13.1-5.9 13.1-13.1c0-5.2-3-9.9-7.8-12l-37.4-16.6c-16.3-7.2-26.8-23.4-26.8-41.2c0-24.9 20.2-45.1 45.1-45.1zm98.9 0c8.8 0 16 7.2 16 16l0 31.6c0 23 5.5 45.6 16 66c10.5-20.3 16-42.9 16-66l0-31.6c0-8.8 7.2-16 16-16s16 7.2 16 16l0 31.6c0 34.7-10.3 68.7-29.6 97.6l-5.1 7.7c-3 4.5-8 7.1-13.3 7.1s-10.3-2.7-13.3-7.1l-5.1-7.7c-19.3-28.9-29.6-62.9-29.6-97.6l0-31.6c0-8.8 7.2-16 16-16z" />
                        </svg>
                    </a>
                </div>
                <div>
                    <h5 style={{ margin: 0 }}>Excel:</h5>

                    <a
                        className=""
                        href="/assets/example_file/example.xlsx"
                        download
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 384 512"
                            fill="#008000"
                            width={24}
                            height={24}
                        >
                            <path d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-288-128 0c-17.7 0-32-14.3-32-32L224 0 64 0zM256 0l0 128 128 0L256 0zM155.7 250.2L192 302.1l36.3-51.9c7.6-10.9 22.6-13.5 33.4-5.9s13.5 22.6 5.9 33.4L221.3 344l46.4 66.2c7.6 10.9 5 25.8-5.9 33.4s-25.8 5-33.4-5.9L192 385.8l-36.3 51.9c-7.6 10.9-22.6 13.5-33.4 5.9s-13.5-22.6-5.9-33.4L162.7 344l-46.4-66.2c-7.6-10.9-5-25.8 5.9-33.4s25.8-5 33.4 5.9z" />
                        </svg>
                    </a>
                </div>
            </div>
            <div className="d-flex flex-wrap" style={{ gap: "10px" }}>
                <div>
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
                        }}
                    >
                        Sélectionner fichier
                    </label>
                </div>
                <input
                    id="file-upload"
                    type="file"
                    accept=".csv, .xlsx"
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
            </div>

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
                    <div
                        style={{
                            width: "100%",
                            overflowX: "auto",
                            overflowY: "hidden",
                            whiteSpace: "nowrap",
                            position: "relative",
                        }}
                    >
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
                                        <td
                                            style={{
                                                ...tableCellStyle,
                                                textAlign: "right",
                                            }}
                                        >
                                            {formatPrice(row.int_propricevente)}
                                        </td>
                                        <td
                                            style={{
                                                ...tableCellStyle,
                                                textAlign: "center",
                                            }}
                                        >
                                            {row.int_cprquantity}
                                        </td>
                                        <td
                                            style={{
                                                ...tableCellStyle,
                                                textAlign: "right",
                                            }}
                                        >
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
