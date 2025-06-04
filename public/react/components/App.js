import React, { useEffect, useState } from "react";

// Prepend the API URL to any fetch calls.
import apiURL from "../api";

function App() {
  const [items, setItems] = useState([]);
  const [singleItem, setSingleItem] = useState(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  

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
  const handleCreationClick=()=>{
    setIsAddingProduct(true)
}

  return (
  <>
    <h1>Inventory App</h1>

    {isAddingProduct ? (
      <form onSubmit={async (event) => {
        event.preventDefault();
        const productData = {
          name: event.target.name.value,
          description: event.target.description.value,
          price: event.target.price.value,
          category: event.target.category.value,
          image: event.target.image.value,
        };
        await fetch(`${apiURL}/items`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        });
        setIsAddingProduct(false);
        const response = await fetch(`${apiURL}/items`);
        setItems(await response.json());
      }}>
        <input name="name" placeholder="Name"/> <br />
        <input name="description" placeholder="Description" /> <br />
        <input name="price" placeholder="Price"/> <br />
        <input name="category" placeholder="Category" /> <br />
        <input name="image" placeholder="Image URL" /> <br />
        <button type="submit">Add Item</button>
        <button type="button" onClick={() => setIsAddingProduct(false)}>Cancel</button>
      </form>
    ) : singleItem ? (
      <div>
        <h2>{singleItem.name}</h2>
        <p>Price: ${singleItem.price}</p>
        <p>Description: {singleItem.description}</p>
        <p>Category: {singleItem.category}</p>
        <img src={singleItem.image} alt={singleItem.name} />
        <br />
        <button onClick={() => setSingleItem(null)}>Back to Items</button>
      </div>
    ) : (
      <>
        {items.map(item => (
          <button key={item.id} onClick={() => singleItemView(item.id)}>
          <b> Item:</b> {item.name} <b> Price:</b>${item.price} <b>Description:</b>{item.description} <b>Category:</b> {item.category} 
          </button>
          
        ))}
        <br />
        <button onClick={handleCreationClick}>Add Item</button>
        
      </>
    )}
  </>
);
}

export default App;
