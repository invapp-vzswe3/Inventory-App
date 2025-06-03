import React, { useEffect, useState } from "react";

// Prepend the API URL to any fetch calls.
import apiURL from "../api";

function App() {
  const [items, setItems] = useState([]);
  const [singleItem, setSingleItem] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      const response = await fetch(`${apiURL}/items`); // Fetch items from the API
      const data = await response.json();
      console.log(items)
      setItems(data);
    };
  fetchItems();// Fetch the items
  }, []);


  const singleItemView = async (id) => {
    const response = await fetch(`${apiURL}/items/${id}`); // Fetch a single item by ID
    const data = await response.json();
    setSingleItem(data);
  }

  return (
    <>
      <h1>Inventory App</h1>
      {!singleItem ? (
        items.map(item => (
          <button key={item.id} onClick={() => singleItemView(item.id)}>{item.name} ${item.price} {item.description} {item.category} {item.image} </button>
        ))
      ) : (
        <div>
          <h2>{singleItem.name}</h2>
          <p>Price: ${singleItem.price}</p>
          <p>Description: {singleItem.description}</p>
          <p>Category: {singleItem.category}</p>
          <img src={singleItem.image} alt={singleItem.name} />
          <br />
          <button onClick={() => setSingleItem(null)}>Back to Items</button>
        </div>
      )}
  </>
);
}

export default App;
