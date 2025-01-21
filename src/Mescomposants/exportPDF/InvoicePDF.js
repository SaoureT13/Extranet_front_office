import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
    Link,
    Font,
} from "@react-pdf/renderer";
import n2words from "n2words";
import { formatPrice } from "../../MesPages/Panier/Cart";
import { formatDateOriginal } from "../../services/apiService";

Font.register({
    family: "Poppins",
    fonts: [
        {
            src: "/fonts/Poppins/Poppins-Regular.ttf", // Regular
            fontWeight: "normal",
        },
        {
            src: "/fonts/Poppins/Poppins-Bold.ttf", // Regular
            fontWeight: "bold",
        },
    ],
});

const styles = StyleSheet.create({
    font: {
        fontSize: 7,
    },
    page: {
        fontSize: 10,
        padding: 30,
        fontFamily: "Poppins",
    },
    header: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    image: {
        width: 50,
        height: 50,
    },
    table: {
        display: "table",
        width: "auto",
        borderStyle: "solid",
        borderColor: "#ddd",
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
    },
    tableRow: {
        flexDirection: "row",
    },
    tableCell: {
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#ddd",
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 5,
        fontSize: 10,
    },
    tableCellName: {
        width: "15%",
        textAlign: "left",
    },
    tableCellNumber: { width: "5%" },
    tableCellDescription: {
        width: "30%",
        textAlign: "left",
    },
    tableCellPrice: {
        width: "20%",
        textAlign: "right",
    },
    tableCellQuantity: {
        width: "15%",
        textAlign: "center",
    },
    tableCellTotal: {
        width: "20%",
        textAlign: "right",
    },
    totals: {
        marginTop: 20,
        textAlign: "right",
        fontSize: "14px",
    },
});

const InvoicePDF = ({ products, order }) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* En-tête */}
                <View style={styles.header}>
                    <View style={styles.image}>
                        <Image
                            src="/assets/images/logo_pdf.png"
                            style={styles.image}
                        />
                    </View>
                    <View>
                        <Text style={styles.font}>
                            Email: snproveci@snproveci.com{" "}
                            <Text style={{ ...styles.font, display: "block" }}>
                                - comptoir@snproveci.com
                            </Text>
                        </Text>
                        <Text style={{ ...styles.font, color: "#214293" }}>
                            Website:{" "}
                            <Link src="https://djx.975.mytemp.website/">
                                https://djx.975.mytemp.website/
                            </Link>
                        </Text>
                        <Text style={styles.font}>
                            Contact: (+225) 27 21 35 30 27{" "}
                            <Text style={{ ...styles.font, display: "block" }}>
                                - (+225) 01 02 48 70 53{" "}
                            </Text>
                            <Text style={{ ...styles.font, display: "block" }}>
                                {" "}
                                - (+225) 01 02 50 44 40
                            </Text>
                        </Text>
                        <Text style={styles.font}>
                            Fax: (+225) 27 21 35 30 29
                        </Text>
                    </View>
                </View>

                <View style={styles.header}>
                    <View>
                        <Text>N° Commande</Text>
                        <Text style={{ fontWeight: "bold" }}>
                            #{order.PcvID}
                        </Text>
                    </View>
                    <View>
                        <Text>Date</Text>
                        <Text>{formatDateOriginal(order.PcvDate)}</Text>
                    </View>
                </View>

                {/* Tableau des produits */}
                <View style={styles.table}>
                    <View
                        style={{
                            ...styles.tableRow,
                            backgroundColor: "#c2cef0",
                            color: "#214293",
                        }}
                    >
                        <Text
                            style={[styles.tableCell, styles.tableCellNumber]}
                        >
                            #
                        </Text>
                        <Text style={[styles.tableCell, styles.tableCellName]}>
                            Code Produit
                        </Text>
                        <Text
                            style={[
                                styles.tableCell,
                                styles.tableCellDescription,
                            ]}
                        >
                            Libellé
                        </Text>
                        <Text
                            style={{
                                ...styles.tableCell,
                                ...styles.tableCellPrice,
                                textAlign: "left",
                            }}
                        >
                            Prix
                        </Text>
                        <Text
                            style={{
                                ...styles.tableCell,
                                ...styles.tableCellQuantity,
                                textAlign: "left",
                            }}
                        >
                            Quantité
                        </Text>
                        <Text
                            style={{
                                ...styles.tableCell,
                                ...styles.tableCellTotal,
                                textAlign: "left",
                            }}
                        >
                            Total
                        </Text>
                    </View>
                    {products.map((product, index) => (
                        <View style={styles.tableRow} key={index}>
                            <Text
                                style={[
                                    styles.tableCell,
                                    styles.tableCellNumber,
                                ]}
                            >
                                {index + 1}
                            </Text>
                            <Text
                                style={[styles.tableCell, styles.tableCellName]}
                            >
                                {product.ArtCode}
                            </Text>
                            <Text
                                style={[
                                    styles.tableCell,
                                    styles.tableCellDescription,
                                ]}
                            >
                                {product.ArtLib}
                            </Text>
                            <Text
                                style={[
                                    styles.tableCell,
                                    styles.tableCellPrice,
                                ]}
                            >
                                {formatPrice(product.ArtPrixBase)} FCFA
                            </Text>
                            <Text
                                style={[
                                    styles.tableCell,
                                    styles.tableCellQuantity,
                                ]}
                            >
                                {product.int_cprquantity}
                            </Text>
                            <Text
                                style={[
                                    styles.tableCell,
                                    styles.tableCellTotal,
                                ]}
                            >
                                {formatPrice(
                                    product.int_cprquantity *
                                        product.ArtPrixBase
                                )}{" "}
                                FCFA
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Totaux */}
                <View style={styles.totals}>
                    <Text>Montant HT: {formatPrice(order.PcvMtHT)} FCFA</Text>
                    <Text>
                        TVA(5%): {formatPrice(order.PcvMtHT * 0.05)} FCFA
                    </Text>
                    <Text style={{ fontWeight: "bold" }}>
                        Montant total: {formatPrice(order.PcvMtTTC)} FCFA
                    </Text>
                </View>

                <View style={{ textAlign: "center", marginTop: "50px" }}>
                    <Text style={{ fontSize: "18px" }}>
                        Facture arrêté à la somme de{" "}
                        {n2words(order.PcvMtTTC, { lang: "fr" })} Francs CFA
                    </Text>
                </View>
            </Page>
        </Document>
    );
};

export default InvoicePDF;
