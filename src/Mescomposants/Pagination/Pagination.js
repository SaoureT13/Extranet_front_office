import React from "react";

const Pagination = ({ totalPages, currentPage, onPageChange, pageNumbers }) => {
    const top = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <div className="toolbox toolbox-pagination justify-content-between">
            <ul className="pagination">
                <li className={`prev ${currentPage === 1 ? "disabled" : ""}`}>
                    <button
                        type="button"
                        className="btn btn-link"
                        aria-label="Previous"
                        onClick={(e) => {
                            e.preventDefault();
                            onPageChange(Math.max(1, currentPage - 1));
                            top();
                        }}
                    >
                        <i className="w-icon-long-arrow-left" />
                        Prec
                    </button>
                </li>

                {pageNumbers.map((pageNumber, index) =>
                    pageNumber === "..." ? (
                        <span key={index} className="dots">
                            ...
                        </span>
                    ) : (
                        <li
                            className={`page-item ${
                                pageNumber === currentPage ? "active" : ""
                            }`}
                            key={index}
                        >
                            {/* <buttonn class="page" href="#" data-i="1" data-page="8">
                                                                </buttonn> */}
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onPageChange(pageNumber);
                                    top();
                                }}
                                className={`page-link`}
                                tabIndex="0"
                                style={{
                                    fontFamily: "inherit",
                                    color: "inherit",
                                    cursor: "pointer",
                                }}
                            >
                                {pageNumber}
                            </button>
                        </li>
                    )
                )}

                <li
                    className={`next ${
                        currentPage === totalPages ? "disabled" : ""
                    }`}
                >
                    <button
                        type="button"
                        aria-label="Next"
                        onClick={(e) => {
                            e.preventDefault();
                            onPageChange(Math.min(totalPages, currentPage + 1));
                            top();
                        }}
                        className="btn btn-link"
                    >
                        Suiv <i className="w-icon-long-arrow-right" />
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default Pagination;
