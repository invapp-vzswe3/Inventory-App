import React, { useEffect, useState } from "react";
import ItemForm from "./ItemForm";
import apiURL from "../api";
import Item from "./Item";
import SingleItem from "./SingleItem";
import AddingProductForm from "./AddingProductForm";

function App() {
  // State to store all items
  const [items, setItems] = useState([]);

  // State to display one selected item
  const [singleItem, setSingleItem] = useState(null);

  // Toggle to show update form
  const [form, toggleForm] = useState(false);

  // Used to re-fetch data on updates
  const [refresh, setRefresh] = useState(false);

  // Holds the current search string
  const [searchItems, setSearchItems] = useState("");

  // Controls whether the item creation form is shown
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  // 🛒 Cart state to store selected items with quantity
  const [cart, setCart] = useState([]);

  // Fetch items from backend (with search if applied)
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
  };

  const handleCreationClick = () => {
    setIsAddingProduct(true);
  };

  // Add item to cart (increase quantity if already exists)
  const addToCart = (item) => {
    const exists = cart.find((i) => i.id === item.id);
    if (exists) {
      setCart(cart.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  // Remove item from cart by ID
  const removeFromCart = (itemId) => {
    setCart(cart.filter((item) => item.id !== itemId));
  };

  // Simulate checkout: send cart data to backend and reset cart
  const checkout = async () => {
    for (const item of cart) {
      await fetch(`${apiURL}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: 1, // static for now; replace with real user auth later
          itemId: item.id,
          quantity: item.quantity,
        }),
      });
    }
    alert("Checkout complete!");
    setCart([]);
  };

  return (
  <>
    <h1 className="title">Inventory App</h1>
    
    <div>
        <h2>🛒 Your Cart</h2>
        {cart.length === 0 ? (
          <p>Cart is empty</p>
        ) : (
          cart.map((item) => (
            <div key={item.id}>
              {item.name} x {item.quantity}
              <button onClick={() => removeFromCart(item.id)}>Remove</button>
            </div>
          ))
        )}
        {cart.length > 0 && <button onClick={checkout}>Checkout</button>}
      </div>
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
          <Item key={item.id} item={item} setSingleItem={setSingleItem} addToCart={addToCart}/>
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
