// import React from "react";
// // import { ExcelFile, ExcelSheet, ExcelColumn } from "react-data-export";
// import ReactExport from "react-data-export";
// import ReactExport from "react-data-export"

// const ExcelFile = ReactExport.ExcelFile;
// const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
// const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

// const DailyStockReport = () => {
//     const reportData = [
//         {
//             srNo: 1,
//             productName: "Product A",
//             openingStock: 50,
//             purchaseQty: 20,
//             balanceQty: 70,
//             consumptionQty: 30,
//             closingStock: 40,
//         },
//         {
//             srNo: 2,
//             productName: "Product B",
//             openingStock: 100,
//             purchaseQty: 50,
//             balanceQty: 150,
//             consumptionQty: 60,
//             closingStock: 90,
//         },
//     ];

//     // Métadonnées
//     const metadata = [
//         [{ value: "Department:", style: { font: { bold: true } } }, { value: "Sales" }],
//         [{ value: "Stockkeeper Name:", style: { font: { bold: true } } }, { value: "John Doe" }],
//         [{ value: "Manager Name:", style: { font: { bold: true } } }, { value: "Jane Smith" }],
//         [],
//     ];

//     // Données du tableau principal
//     const tableHeaders = [
//         [
//             { value: "Sr. No.", style: { font: { bold: true } } },
//             { value: "Product Name", style: { font: { bold: true } } },
//             { value: "Opening Stock Qty", style: { font: { bold: true } } },
//             { value: "Purchase Qty", style: { font: { bold: true } } },
//             { value: "Balance Qty", style: { font: { bold: true } } },
//             { value: "Consumption Qty", style: { font: { bold: true } } },
//             { value: "Closing Stock Qty", style: { font: { bold: true } } },
//         ],
//     ];

//     const tableData = reportData.map((item) => [
//         { value: item.srNo },
//         { value: item.productName },
//         { value: item.openingStock },
//         { value: item.purchaseQty },
//         { value: item.balanceQty },
//         { value: item.consumptionQty },
//         { value: item.closingStock },
//     ]);

//     const excelData = [
//         {
//             columns: [],
//             data: [...metadata, ...tableHeaders, ...tableData],
//         },
//     ];

//     return (
//         <Exce
//             filename="DailyStockSummary"
//             element={<button>Download Daily Stock Summary</button>}
//         >
//             <ExcelSheet dataSet={excelData} name="Stock Summary" />
//         </Exce>
//     );
// };

// export default DailyStockReport;
