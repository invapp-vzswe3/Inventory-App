import React, { useEffect, useState } from "react";

// Prepend the API URL to any fetch calls.
import apiURL from "../api";

function App() {
  const [items, setItems] = useState([]);
  const [singleItem, setSingleItem] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [searchItems, setSearchItems] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      const response = await fetch(
        `${apiURL}/items${searchItems ? `?name=${encodeURIComponent(searchItems)}` : ""}`
      );
      const data = await response.json();
      console.log(items)
      setItems(data);
    };
  fetchItems();// Fetch the items
  }, [refresh, searchItems]);


  const singleItemView = async (id) => {
    const response = await fetch(`${apiURL}/items/${id}`); // Fetch a single item by ID
    const data = await response.json();
    setSingleItem(data);
  }

  const handleSearch = (e) => {
    setSearchItems(e.target.value);
    setRefresh(!refresh); // Trigger a refresh to apply the search filter
  }

  const goBackToItems = () => {
    setSingleItem(null);
    setRefresh(!refresh); 
    console.log(refresh);
  }

  const deleteItem = async (id) => {
    await fetch(`${apiURL}/items/${id}`, {
      method: "DELETE",
    });
    console.log(`Item with ID ${id} deleted`);
    setSingleItem(null);
    setRefresh(!refresh);  
  }

  return (
    <>
      <h1 className = "title">Inventory App</h1>
      <div>
        <input onChange={handleSearch}  ></input>
        
      </div>
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
          <button onClick={goBackToItems}>Back to Items</button>
          <button onClick={() => deleteItem(singleItem.id)}className = "deletebutton">Delete</button>
        </div>
      )}
  </>
);
}

export default App;
