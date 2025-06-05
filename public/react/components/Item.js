import React from "react";
import apiURL from "../api";

export default function Item({ item, setSingleItem }) {
    const singleItemView = async (id) => {
      const response = await fetch(`${apiURL}/items/${id}`); // Fetch a single item by ID
      const data = await response.json();
      setSingleItem(data);
    }
    return (
        <div
            onClick={() => singleItemView(item.id)}
            className="items"
            key={item.id}
          >
            <h2>{item.name}</h2>
            <img
              className="itemimage"
              src={item.image}
              alt={item.name}
              width="20%"
              height="20%"
            />
            <h3 className="price">Price: ${item.price}</h3>
          </div>
    )
}