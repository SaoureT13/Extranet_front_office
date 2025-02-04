import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { crudData } from "../../services/apiService";
import { generatePageNumbers } from "../../services/lib";
import Pagination from "../Pagination/Pagination";

function MostPopularProductsCard() {
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState();
    const [month, setMonth] = useState();
    const [total, setTotal] = useState();
    const [totalPage, setTotalPage] = useState();

    const handleChangeLimit = (limit) => {
        setLimit(limit);
    };

    const goToPage = (page) => {
        setPage(page);
    };

    const handleChangeSearch = (value) => {
        setSearch(value);
    };

    const handleChangeMonth = (intMonth) => {
        setMonth(intMonth);
    };

    const fetchProductStats = async (
        limit,
        page,
        search = null,
        month = null
    ) => {
        try {
            const response = await crudData(
                {
                    mode: "listProductsStatViewed",
                    LIMIT: limit,
                    PAGE: page,
                    "FILTER_OPTIONS[search]": search,
                    "FILTER_OPTIONS[month]": month,
                },
                `StatistiqueManager.php`
            );

            if (response.data.code_statut === "1") {
                console.log(response.data);
                return response.data;
            } else {
                toast.error(response.data.desc_statut);
                return false;
            }
        } catch (error) {
            toast.error("Error: " + error.message);
        }
    };

    const { data: products, isLoading } = useQuery({
        queryKey: ["products", limit, page, search, month],
        queryFn: () => fetchProductStats(limit, page, search, month),
        placeholderData: keepPreviousData,
    });

    useEffect(() => {
        if (products !== null && products !== undefined) {
            setTotal(products.total);
            setTotalPage(() => {
                return Math.ceil(products.total / limit);
            });
        }
    }, [products]);

    const pageNumbers = generatePageNumbers(totalPage, page);
    return (
        <>
            <div
                className="d-flex justify-content-between"
                style={{
                    padding: "0.75rem 0.6rem",
                }}
            >
                <h4 className="mb-0 mr-4">Produits les plus consultés</h4>
                <select
                    name="month"
                    id="month"
                    className="form-select "
                    style={{
                        padding: "6px 10px",
                        fontFamily: "Poppins",
                        marginRight: "10px",
                        border: "none",
                        background: "#214293",
                        color: "white",
                    }}
                >
                    <option value="all">Tous les mois</option>
                    <option value="01">Janvier</option>
                    <option value="02">Février</option>
                    <option value="03">Mars</option>
                    <option value="04">Avril</option>
                    <option value="05">Mai</option>
                    <option value="06">Juin</option>
                    <option value="07">Juillet</option>
                    <option value="08">Août</option>
                    <option value="09">Septembre</option>
                    <option value="10">Octobre</option>
                    <option value="11">Novembre</option>
                    <option value="12">Décembre</option>
                </select>
            </div>
            <table className=" cart-table">
                <thead>
                    <tr>
                        <th
                            className="product-quantity"
                            style={{
                                textAlign: "left",
                                padding: "0.75rem 0.6rem",
                                margin: 0,
                            }}
                        >
                            <span>Nom du produit</span>
                        </th>

                        <th
                            className="product-price"
                            style={{
                                textAlign: "left",
                                padding: "0.75rem 0.6rem",
                                margin: 0,
                            }}
                        >
                            <span>Prix</span>
                        </th>
                        <th
                            className="product-quantity"
                            style={{
                                textAlign: "left",
                                padding: "0.75rem 0.6rem",
                                margin: 0,
                            }}
                        >
                            <span>Stock</span>
                        </th>
                        <th
                            className="product-subtotal"
                            style={{
                                textAlign: "left",
                                padding: "0.75rem 0.6rem",
                                margin: 0,
                            }}
                        >
                            <span>Vues</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {products !== undefined &&
                        products?.data?.map((product, index) => (
                            <tr
                                className="item-hover"
                                style={{
                                    background: "none",
                                    color: "rgb(54, 86, 161)",
                                }}
                                key={index}
                            >
                                <td className="product-thumbnail">
                                    <p
                                        style={{
                                            padding: "0.75rem 0.6rem",
                                            margin: 0,
                                        }}
                                    >
                                        {product.PRODESCRIPTION}
                                    </p>
                                </td>
                                <td className="product-price">
                                    <p
                                        style={{
                                            padding: "0.75rem 0.6rem",
                                            margin: 0,
                                        }}
                                    >
                                        {" "}
                                        {product.PROPRICE}
                                    </p>
                                </td>
                                <td className="product-name">
                                    <p
                                        className=""
                                        style={{
                                            padding: "0.75rem 0.6rem",
                                            margin: 0,
                                        }}
                                    >
                                        {product.PROSTOCK}
                                    </p>
                                </td>
                                <td className="product-price">
                                    <p
                                        style={{
                                            padding: "0.75rem 0.6rem",
                                            margin: 0,
                                            fontWeight: "bold",
                                        }}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                fill="currentColor"
                                                d="m23.5 17l-5 5l-3.5-3.5l1.5-1.5l2 2l3.5-3.5zM12 9a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5c-.25.65-.56 1.26-.92 1.85a5.8 5.8 0 0 0-1.9-.73l.64-1.12a9.821 9.821 0 0 0-17.64 0A9.82 9.82 0 0 0 12 17.5l1.21-.07c-.14.5-.21 1.03-.21 1.57v.46l-1 .04c-5 0-9.27-3.11-11-7.5c1.73-4.39 6-7.5 11-7.5"
                                            />
                                        </svg>
                                        {product.PROVIEWED}
                                    </p>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
            <div className="d-flex justify-content-between align-items-center flex-wrap justify-content-sm-center">
                <div>
                    <Pagination
                        currentPage={page}
                        totalPages={totalPage}
                        onPageChange={goToPage}
                        pageNumbers={pageNumbers}
                    />
                </div>
            </div>
        </>
    );
}

export default MostPopularProductsCard;
