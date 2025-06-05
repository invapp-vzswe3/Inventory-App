import React from "react";

export default function Item({ item, singleItemView}) {
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