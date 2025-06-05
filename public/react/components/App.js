import React, { useEffect, useState } from "react";
import ItemForm from "./ItemForm";

// Prepend the API URL to any fetch calls.
import apiURL from "../api";
import Item from "./Item";
import SingleItem from "./SingleItem";
import AddingProductForm from "./AddingProductForm";

function App() {
  const [items, setItems] = useState([]);
  const [singleItem, setSingleItem] = useState(null);
  const [form, toggleForm] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [searchItems, setSearchItems] = useState("");
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      const response = await fetch(
        `${apiURL}/items${searchItems ? `?name=${encodeURIComponent(searchItems)}` : ""}`
      );
      const data = await response.json();
      setItems(data);
    };
    fetchItems();// Fetch the items
  }, [refresh, searchItems]);

  const handleSearch = (e) => {
    setSearchItems(e.target.value);
    setRefresh(!refresh); // Trigger a refresh to apply the search filter
  }

  const handleCreationClick = () => {
    setIsAddingProduct(true);
  }

  return (
  <>
    <h1 className="title">Inventory App</h1>
    {isAddingProduct ? (
      <AddingProductForm setIsAddingProduct={setIsAddingProduct} setItems={setItems}/>
    ) : !singleItem ? (
      <>
      <div>
        <input
          value={searchItems}
          onChange={handleSearch}
          placeholder="Search by name..."
        />
      </div>
        {items.map((item) => (
          <Item key={item.id} item={item} setSingleItem={setSingleItem}/>
        ))}
        <button onClick={handleCreationClick}>Add Item</button>
      </>
    ) : (
      <SingleItem form={form} singleItem={singleItem} setSingleItem={setSingleItem} refresh={refresh} setRefresh={setRefresh} toggleForm={toggleForm}/>
    )}
  </>
);
}

export default App;
