import React, { useState, useEffect, useCallback } from "react";
import TopBar from "../Mescomposants/Header/TopBar";
import AppMenu from "../Mescomposants/AppMenu";
import MobileMenu from "../Mescomposants/MobileMenu";
import Footer from "../Mescomposants/Footer";
import ShopSidebar from "../Mescomposants/ShopSidebar";
import ClipLoader from "react-spinners/ClipLoader";
import { fetchEvenements, crudData } from "../services/apiService";
import ErrorCard from "../Mescomposants/ErrorCard";
import ProductWrap from "../Mescomposants/Product/ProductWrap";
import Pagination from "../Mescomposants/Pagination/Pagination"; // Import the new Pagination component
import { useSearchParams } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { generatePageNumbers } from "../services/lib";

const Shop = ({ param, defaultImage }) => {
    const [totalPage, setTotalPage] = useState(0);
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeFilters, setActiveFilters] = useState(() => {
        const filters = {
            gammes: [],
            categories: [],
            especes: [],
            search: "",
        };
        searchParams.forEach((value, key) => {
            filters[key] = value.split(",");
        });
        delete filters.limit;
        delete filters.page;
        console.log(filters);
        return filters;
    });
    const [page, setPage] = useState(() => {
        return parseInt(searchParams.get("page")) || 1;
    });
    const [limit, setLimit] = useState(() => {
        return parseInt(searchParams.get("limit")) || 20;
    });

    useEffect(() => {
        const updatedFilters = {
            gammes: [],
            categories: [],
            especes: [],
            search: "",
        };

        searchParams.forEach((value, key) => {
            updatedFilters[key] = value.split(",");
        });

        setActiveFilters(updatedFilters);
    }, [searchParams]);

    const handleActiveFilters = useCallback(
        (filterName, filterValue) => {
            setActiveFilters((prevActiveFilters) => {
                const updatedFilters = structuredClone(prevActiveFilters);

                if (!updatedFilters[filterName]) {
                    updatedFilters[filterName] = [filterValue];
                } else if (updatedFilters[filterName].includes(filterValue)) {
                    updatedFilters[filterName] = updatedFilters[
                        filterName
                    ].filter((val) => val !== filterValue);
                } else {
                    updatedFilters[filterName].push(filterValue);
                }

                const params = new URLSearchParams();
                Object.keys(updatedFilters).forEach((key) => {
                    if (updatedFilters[key].length > 0) {
                        params.set(key, updatedFilters[key].join(","));
                    }
                });
                params.set("limit", limit);
                params.set("page", 1);
                setSearchParams(params);

                return updatedFilters;
            });
        },
        [setSearchParams, limit]
    );

    const handleClearActiveFilters = () => {
        setSearchParams({});
    };

    const goToPage = (page) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", page);
        setSearchParams(params);
        setPage(page);
    };

    const handleSetLimit = (limit) => {
        const params = new URLSearchParams(searchParams);
        params.set("limit", limit);
        params.set("page", 1);
        setSearchParams(params);
        setPage(1);
        setLimit(limit);
    };

    const handleSearch = (e) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", 1);
        params.set("search", e);
        setSearchParams(params);
        setPage(1);
        setActiveFilters({
            ...activeFilters,
            search: e,
        });
    };

    const fetchProducts = async (activeFilters) => {
        const data = new URLSearchParams();

        for (const key in activeFilters) {
            if (key === "search") {
                data.append("FILTER_OPTIONS[search]", activeFilters[key]);
            }
            if (key === "categories") {
                activeFilters[key].forEach((value) => {
                    data.append("FILTER_OPTIONS[str_procateg][]", value);
                });
            }
            if (key === "especes") {
                activeFilters[key].forEach((value) => {
                    data.append("FILTER_OPTIONS[str_proespece][]", value);
                });
            }
            if (key === "gammes") {
                activeFilters[key].forEach((value) => {
                    data.append("FILTER_OPTIONS[str_progamme][]", value);
                });
            }
        }

        data.append("LIMIT", limit);
        data.append("PAGE", page);
        data.append("mode", "listProduct");

        try {
            const response = await crudData(data, "StockManager.php", false);
            setTotalPage(() => {
                return Math.ceil(response.data["total"] / limit);
            });
            return response.data["products"];
        } catch (error) {
            console.error(error);
        }
    };

    const { data, isLoading } = useQuery({
        queryKey: ["products", activeFilters, page, limit],
        queryFn: () => fetchProducts(activeFilters),
        placeholderData: keepPreviousData,
    });

    const [pageNumbers, setPageNumbers] = useState([]);
    useEffect(() => {
        setPageNumbers(generatePageNumbers(totalPage, page));
    }, [page, totalPage]);

    return (
        <div className={` ${param.userData ? "bgUserConnected" : ""}`}>
            <div className="page-wrapper">
                <main className="main mb-0 pb-1">
                    <div className="page-content">
                        <div className="container pt-5">
                            <div
                                className="shop-content row mb-10 page-container m-0 ml-0"
                                style={{ gap: "20px" }}
                            >
                                <ShopSidebar
                                    onFilterChange={handleActiveFilters}
                                    activeFilters={activeFilters}
                                    onResetAllFilters={handleClearActiveFilters}
                                />

                                <div className="main-content pr-0 pl-0">
                                    {/* Search bar */}
                                    <div className="search-bar mb-4" style={{}}>
                                        <input
                                            type="text"
                                            className="form-control"
                                            style={{
                                                color: "#336699",
                                                borderColor: "#336699",
                                                borderWidth: "2px",
                                            }}
                                            placeholder="Rechercher un produit..."
                                            value={activeFilters.search}
                                            onChange={(e) =>
                                                handleSearch(e.target.value)
                                            }
                                        />
                                    </div>

                                    {isLoading ? (
                                        <div className="loading-container d-block mx-auto">
                                            Loading...
                                        </div>
                                    ) : data !== undefined &&
                                      data.length > 0 ? (
                                        <div className="product-wrapper row cols-xl-4 cols-md-3 cols-sm-1 cols-1">
                                            {data.map((product) => (
                                                <ProductWrap
                                                    key={product.ArtID}
                                                    product={product}
                                                    defaultImage={defaultImage}
                                                    urlBaseImage={
                                                        param.urlBaseImage
                                                    }
                                                    userData={param.userData}
                                                    // col_css="col-xl-3 col-lg-3 col-4"
                                                    col_css="d-flex justify-content-center w"
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div>Aucun produit trouvé.</div>
                                    )}
                                    <Pagination
                                        currentPage={page}
                                        totalPages={totalPage}
                                        onPageChange={goToPage}
                                        pageNumbers={pageNumbers}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Shop;
