import React, { useEffect, useState } from "react";

// Prepend the API URL to any fetch calls.
import apiURL from "../api";

function App() {
  const [items, setItems] = useState([]);
  const [singleItem, setSingleItem] = useState(null);
  const [form, toggleForm] = useState(false);

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
      <h1 className = "title">Inventory App</h1>
      {!singleItem ? (
        items.map(item => (
          <div onClick={() => singleItemView(item.id)} className = "items" key = {item.id}>
            <h2>{item.name}</h2>
            <img className = "itemimage" src = {item.image} alt={item.name} width="20%" height="20%"/> 
            <h3 className = "price">Price: ${item.price}</h3>
          </div>
        ))
      ) : (
        <div>
          <h2>{singleItem.name}</h2>
          <p>Price: ${singleItem.price}</p>
          <p>Description: {singleItem.description}</p>
          <p>Category: {singleItem.category}</p>
          <img className = "singleitemimage" src={singleItem.image} alt={singleItem.name} width="20%" height= "20%" />
          <br />
          <button onClick={() => setSingleItem(null)}>Back to Items</button>
          <button onClick={() => toggleForm(!form)}>Update Item</button>
          {form && (
            <h1>Form is toggled</h1>
          )}
        </div>
      )}
  </>
);
}

export default App;
