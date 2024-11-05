import React from 'react';
import { NavLink } from 'react-router-dom';

const MainNav = (param) => {
  console.log("hxfgsdjwhxfgsjdwf");
  console.log(param);


  const menuItems = [
    {
      label: 'ACCUEIL',
      href: '/',
    },
    {
      label: 'NOS PRODUITS',
      megamenu: [
        {
          title: 'Médicaments d’élevages',
          items: [
            { label: "ANTIBIOTIQUES", href: "/shop" },
            { label: "ANTICOCCIDIENS", href: "/shop" },
            { label: "ANTI PARASITAIRES", href: "/shop" },
            { label: "ANTI-STRESS", href: "/shop" },
            { label: "PIERRES À LÉCHER", href: "/shop" },
            { label: "TRYPANOCIDES", href: "/shop" },
            { label: "VACCINS", href: "/shop" },
            { label: "VITAMINES", href: "/shop" },
          ],
        },
        {
          title: 'Médicaments animaux de compagnie',
          items: [
            { label: "ALIMENTS", href: "/shop", tip: 'New' },
            { label: "ANTIBIOTIQUES", href: "/shop" },
            { label: "ANTICOCCIDIENS", href: "/shop" },
            { label: "ANTI PARASITAIRES", href: "/shop" },
            { label: "ANTI-STRESS", href: "/shop" },
            { label: "TRYPANOCIDES", href: "/shop" },
            { label: "VACCINS", href: "/shop" },
            { label: "VITAMINES", href: "/shop" },
          ],
        },
        {
          title: 'Matériel vétérinaire',
          items: [
            { label: "Nouveauté", href: "/shop" },
            { label: "Promotions", href: "/shop" },
          ],
        },
      ],
    },
    {
      label: "SOCIÉTÉ",
      href: "/societe",
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
    ...(param.param.userData
      ? [
          {
            label: "TABLEAU DE BOARD",
            href: "/dashboard",
            submenu: [
              { label: 'Calendrier de livraison', href: "/extranet/livraison" },
              { label: 'Vos en cours', href: 'vendor-wcfm-store-list.html' },
              { label: 'Vos commandes', href: 'vendor-wcmp-store-list.html' },
              { label: 'Vos factures', href: 'vendor-wc-store-list.html' },
              { label: 'Administration', href: 'vendor-wc-store-list.html' },

            ],
          },
        ]
      : [])
  ];

  return (
    <div className="header-bottom sticky-content fix-top sticky-header">
      <div className="container">
        <div className="inner-wrap">
          <div className="header-left">
            <nav className="main-nav">
              <ul className="menu active-underline">
                {menuItems.map((item, index) => (
                  <li
                    key={index}
                    className={
                      (item.submenu && item.submenu.length > 0) || item.megamenu
                        ? 'has-submenu'
                        : ''
                    }
                  >
                    <NavLink to={item.href}>{item.label}</NavLink>
                    {item.megamenu && (
                      <ul className="megamenu">
                        {item.megamenu.map((megaItem, megaIndex) => (
                          <li key={megaIndex}>
                            <h4>{megaItem.title}</h4>
                            <ul>
                              {megaItem.items.map((subItem, subIndex) => (
                                <li key={subIndex}>
                                  <NavLink to={subItem.href}>
                                    {subItem.label}
                                    {subItem.tip && <span className="tip tip-hot">{subItem.tip}</span>}
                                  </NavLink>
                                </li>
                              ))}
                            </ul>
                          </li>
                        ))}
                      </ul>
                    )}
                    {item.submenu && item.submenu.length > 0 && (
                      <ul className="submenu">
                        {item.submenu.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <a href={subItem.href}>{subItem.label}</a>
                            {subItem.submenu && subItem.submenu.length > 0 && (
                              <ul className="submenu">
                                {subItem.submenu.map((subSubItem, subSubIndex) => (
                                  <li key={subSubIndex}>
                                    <NavLink to={subSubItem.href}>
                                      {subSubItem.label}
                                    </NavLink>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        ))}
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
