import React, { useEffect, useState } from "react";

// Prepend the API URL to any fetch calls.
import apiURL from "../api";

function App() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
    const response = await fetch('/items');
    const data = await response.json();
    console.log(items)
    setItems(data);
  };
  fetchItems();// Fetch the items
  }, []);

  return (
    <>
      <h1>Inventory App</h1>
     <ul>
      {items.map(item => (
        <li key={item.id}>{item.name} ${item.price} {item.description} {item.category} {item.image} </li>
      ))}
    </ul>
  </>
);
}

export default App;
