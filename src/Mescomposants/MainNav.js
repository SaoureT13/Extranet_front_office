import React from "react";
import { NavLink } from "react-router-dom";

const MainNav = ({ param, megaMenu }) => {
    const menuItems = [
        {
            label: "ACCUEIL",
            href: "/",
        },
        {
            label: "NOS PRODUITS",
            href: "/catalogue",
            megamenu: megaMenu || [
                {
                    title: "Médicaments d’élevages",
                    items: [
                        { label: "ANTIBIOTIQUES", href: "/catalogue" },
                        { label: "ANTICOCCIDIENS", href: "/catalogue" },
                        { label: "ANTI PARASITAIRES", href: "/catalogue" },
                        { label: "ANTI-STRESS", href: "/catalogue" },
                        { label: "PIERRES À LÉCHER", href: "/catalogue" },
                        { label: "TRYPANOCIDES", href: "/catalogue" },
                        { label: "VACCINS", href: "/catalogue" },
                        { label: "VITAMINES", href: "/catalogue" },
                    ],
                },
                {
                    title: "Médicaments animaux de compagnie",
                    items: [
                        { label: "ALIMENTS", href: "/catalogue", tip: "New" },
                        { label: "ANTIBIOTIQUES", href: "/catalogue" },
                        { label: "ANTICOCCIDIENS", href: "/catalogue" },
                        { label: "ANTI PARASITAIRES", href: "/catalogue" },
                        { label: "ANTI-STRESS", href: "/catalogue" },
                        { label: "TRYPANOCIDES", href: "/catalogue" },
                        { label: "VACCINS", href: "/catalogue" },
                        { label: "VITAMINES", href: "/catalogue" },
                    ],
                },
                {
                    title: "Matériel vétérinaire",
                    items: [
                        { label: "Nouveauté", href: "/catalogue" },
                        { label: "Promotions", href: "/catalogue" },
                    ],
                },
            ],
        },
        {
            label: "SERVICES",
            href: "/services",
        },
        {
            label: "CONTACTS",
            href: "/contact",
        },
        // Ajoutez une condition pour afficher le menu tableau de bord uniquement si userData est défini
        ...(param.userData
            ? [
                  {
                      label: "TABLEAU DE BORD",
                      href: "/dashboard",
                      submenu: [
                          {
                              label: "Calendrier de livraison",
                              href: "/livraison",
                          },
                          {
                              label: "Mes commandes",
                              href: "/mes-commandes",
                          },
                          {
                              label: "Mes factures",
                              href: "/factures",
                          },
                      ],
                  },
              ]
            : []),
    ];

    return (
        <div
            className={`header-bottom sticky-content fix-top sticky-header }`}
        >
            <div className="container">
                <div className="inner-wrap">
                    <div className="header-left" style={{ margin: "0 auto" }}>
                        <nav className="main-nav">
                            <ul className="menu active-underline">
                                {menuItems.map((item, index) => (
                                    <li
                                        key={index}
                                        className={
                                            (item.submenu &&
                                                item.submenu.length > 0) ||
                                            item.megamenu
                                                ? "has-submenu"
                                                : ""
                                        }
                                    >
                                        <NavLink to={item.href}>
                                            {item.label}
                                        </NavLink>
                                        {item.megamenu && (
                                            <ul className="megamenu">
                                                {item.megamenu.map(
                                                    (megaItem, megaIndex) => (
                                                        <li key={megaIndex}>
                                                            <h4>
                                                                {megaItem.title}
                                                            </h4>
                                                            <ul>
                                                                {megaItem.items.map(
                                                                    (
                                                                        subItem,
                                                                        subIndex
                                                                    ) => (
                                                                        <li
                                                                            key={
                                                                                subIndex
                                                                            }
                                                                        >
                                                                            <NavLink
                                                                                to={
                                                                                    subItem.href
                                                                                }
                                                                                onClick={() => {
                                                                                    localStorage.setItem(
                                                                                        "cat",
                                                                                        JSON.stringify(
                                                                                            {
                                                                                                [megaItem.title]:
                                                                                                    subItem.label,
                                                                                            }
                                                                                        )
                                                                                    );
                                                                                }}
                                                                            >
                                                                                {
                                                                                    subItem.label
                                                                                }
                                                                                {subItem.tip && (
                                                                                    <span className="tip tip-hot">
                                                                                        {
                                                                                            subItem.tip
                                                                                        }
                                                                                    </span>
                                                                                )}
                                                                            </NavLink>
                                                                        </li>
                                                                    )
                                                                )}
                                                            </ul>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        )}
                                        {item.submenu &&
                                            item.submenu.length > 0 && (
                                                <ul className="submenu">
                                                    {item.submenu.map(
                                                        (subItem, subIndex) => (
                                                            <li key={subIndex}>
                                                                <NavLink
                                                                    to={
                                                                        subItem.href
                                                                    }
                                                                >
                                                                    {
                                                                        subItem.label
                                                                    }
                                                                </NavLink>
                                                                {subItem.submenu &&
                                                                    subItem
                                                                        .submenu
                                                                        .length >
                                                                        0 && (
                                                                        <ul className="submenu">
                                                                            {subItem.submenu.map(
                                                                                (
                                                                                    subSubItem,
                                                                                    subSubIndex
                                                                                ) => (
                                                                                    <li
                                                                                        key={
                                                                                            subSubIndex
                                                                                        }
                                                                                    >
                                                                                        <NavLink
                                                                                            to={
                                                                                                subSubItem.href
                                                                                            }
                                                                                        >
                                                                                            {
                                                                                                subSubItem.label
                                                                                            }
                                                                                        </NavLink>
                                                                                    </li>
                                                                                )
                                                                            )}
                                                                        </ul>
                                                                    )}
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            )}
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainNav;
