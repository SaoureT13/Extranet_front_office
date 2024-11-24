import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <div className="toolbox toolbox-pagination justify-content-between">
            <ul className="pagination">
                <li className={`prev ${currentPage === 1 ? "disabled" : ""}`}>
                    <a
                        aria-label="Previous"
                        onClick={() =>
                            currentPage > 1 && onPageChange(currentPage - 1)
                        }
                    >
                        <i className="w-icon-long-arrow-left" />
                        Prev
                    </a>
                </li>

                {[...Array(totalPages)].map((_, index) => (
                    <li
                        key={index}
                        className={`page-item ${
                            currentPage === index + 1 ? "active" : ""
                        }`}
                    >
                        <a
                            className="page-link"
                            onClick={() => onPageChange(index + 1)}
                        >
                            {index + 1}
                        </a>
                    </li>
                ))}

                <li
                    className={`next ${
                        currentPage === totalPages ? "disabled" : ""
                    }`}
                >
                    <a
                        aria-label="Next"
                        onClick={() =>
                            currentPage < totalPages &&
                            onPageChange(currentPage + 1)
                        }
                    >
                        Next <i className="w-icon-long-arrow-right" />
                    </a>
                </li>
            </ul>
        </div>
    );
};

export default Pagination;
