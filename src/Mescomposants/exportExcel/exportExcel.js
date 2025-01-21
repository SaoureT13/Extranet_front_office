import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { formatDateOriginal } from "../../services/apiService";

const OrderForm = ({ orderDetails, orderItems }) => {
    const exportToExcel = () => {
        // Préparer les données pour Excel
        const data = [
            ["N° Commande:", orderDetails.PcvID],
            ["Date:", formatDateOriginal(orderDetails.PcvDate)],
            [],
            ["Code", "Libellé", "Prix", "Quantité", "Total"], // En-têtes de colonnes
            ...orderItems.map((item) => [
                item.ArtCode,
                item.ArtLib,
                `${item.ArtPrixBase} FCFA`,
                item.int_cprquantity,
                `${(item.ArtPrixBase * item.int_cprquantity)} FCFA`,
            ]), // Ligne des produits
        ];

        // Créer une feuille Excel
        const ws = XLSX.utils.aoa_to_sheet(data);

        // Appliquer un style simple (bordures, alignement)
        const range = XLSX.utils.decode_range(ws["!ref"]);
        for (let R = range.s.r; R <= range.e.r; R++) {
            for (let C = range.s.c; C <= range.e.c; C++) {
                const cell = ws[XLSX.utils.encode_cell({ r: R, c: C })];
                if (cell) {
                    cell.s = {
                        font: { bold: R === 0 || R === range.e.r },
                        alignment: { horizontal: "center" },
                        border: {
                            top: { style: "thin" },
                            bottom: { style: "thin" },
                            left: { style: "thin" },
                            right: { style: "thin" },
                        },
                    };
                }
            }
        }

        // Créer le classeur Excel
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Detals Commande");

        // Exporter le fichier Excel
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], {
            type: "application/octet-stream",
        });
        saveAs(blob, `Commandes-#${orderDetails.PcvID}.xlsx`);
    };

    return (
        <btn
            className=""
            type="button"
            style={{
                cursor: "pointer",
            }}
            onClick={exportToExcel}
        >
            Excel{" "}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384 512"
                fill="currentColor"
            >
                <path d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-288-128 0c-17.7 0-32-14.3-32-32L224 0 64 0zM256 0l0 128 128 0L256 0zM155.7 250.2L192 302.1l36.3-51.9c7.6-10.9 22.6-13.5 33.4-5.9s13.5 22.6 5.9 33.4L221.3 344l46.4 66.2c7.6 10.9 5 25.8-5.9 33.4s-25.8 5-33.4-5.9L192 385.8l-36.3 51.9c-7.6 10.9-22.6 13.5-33.4 5.9s-13.5-22.6-5.9-33.4L162.7 344l-46.4-66.2c-7.6-10.9-5-25.8 5.9-33.4s25.8-5 33.4 5.9z" />
            </svg>
        </btn>
    );
};

export default OrderForm;
