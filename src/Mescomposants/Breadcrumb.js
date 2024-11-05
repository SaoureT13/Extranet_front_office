import React from 'react';

const Breadcrumb = ({ items }) => {
  return (
    <ul className="breadcrumb bb-no">
      {items.map((item, index) => (
        <li key={index}>
          {item.url ? (
            <a href={item.url}>{item.label}</a>
          ) : (
            <span>{item.label}</span>
          )}
        </li>
      ))}
    </ul>
  );
};

export default Breadcrumb;
