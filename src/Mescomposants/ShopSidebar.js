import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

const ShopSidebar = ({ onFilterChange, onResetAllFilters, activeFilters }) => {
    const filters = JSON.parse(localStorage.getItem("filters"));

    const top = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <aside className="sidebar shop-sidebar left-sidebar sticky-sidebar-wrapper sidebar-fixed page-container">
            <div className="sidebar-content scrollable p-3">
                <div className="sticky-sidebar">
                    {filters &&
                        Object.keys(filters).length > 0 &&
                        Object.keys(filters).map((filter, index) => (
                            <CollapsibleWidget
                                title={`Par ${filter}`}
                                defaultOpen={index === 0}
                                key={index}
                            >
                                <ul className="widget-body filter-items item-check mt-1">
                                    {filters[filter]?.map((category) => (
                                        <li key={category}>
                                            <label
                                                className="checkbox"
                                                htmlFor={category}
                                            >
                                                <input
                                                    style={{
                                                        cursor: "pointer",
                                                    }}
                                                    type="checkbox"
                                                    checked={activeFilters[
                                                        `${filter}`
                                                    ]?.includes(category)}
                                                    onChange={() =>
                                                        onFilterChange(
                                                            filter,
                                                            category
                                                        )
                                                    }
                                                    id={category}
                                                />
                                                {category}
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </CollapsibleWidget>
                        ))}

                    {/* Reset Filters Button */}
                    <div className="reset-filters mt-4">
                        <button
                            className="btn"
                            style={{
                                color: "#fff",
                                borderColor: "#3656a1",
                                backgroundColor: "#3656a1",
                            }}
                            onClick={() => {
                                onResetAllFilters();
                                top();
                            }}
                        >
                            Réinitialiser les filtres
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
};

const CollapsibleWidget = ({ title, defaultOpen, children }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="widget widget-collapsible">
            <div className="widget-header" onClick={toggleOpen}>
                <h3 className="widget-title w-100">
                    {title}
                    <FontAwesomeIcon
                        icon={isOpen ? faMinus : faPlus}
                        className="ml-2"
                    />
                </h3>
            </div>
            {isOpen && <div className="widget-body">{children}</div>}
        </div>
    );
};

export default ShopSidebar;
