import React, { useEffect, useState } from "react";
import ItemForm from "./ItemForm";
import apiURL from "../api";
import Item from "./Item";
import SingleItem from "./SingleItem";
import AddingProductForm from "./AddingProductForm";

function App() {
  // 📦 All available items
  const [items, setItems] = useState([]);

  // 🔍 Single selected item (for detailed view/editing)
  const [singleItem, setSingleItem] = useState(null);

  // 🔄 Toggles update form inside single item view
  const [form, toggleForm] = useState(false);

  // 🔁 Used to trigger re-fetching items after an update/delete
  const [refresh, setRefresh] = useState(false);

  // 🔎 Holds the user’s search input
  const [searchItems, setSearchItems] = useState("");

  // ➕ Controls if Add New Product form is visible
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  // 🛒 Cart containing selected items and their quantity
  const [cart, setCart] = useState([]);

  // 📥 Fetch items from backend (filtered if search is used)
  useEffect(() => {
    const fetchItems = async () => {
      const response = await fetch(
        `${apiURL}/items${searchItems ? `?name=${encodeURIComponent(searchItems)}` : ""}`
      );
      const data = await response.json();
      setItems(data);
    };
    fetchItems();
  }, [refresh, searchItems]);

  // 🎯 Updates search term as user types
  const handleSearch = (e) => {
    setSearchItems(e.target.value);
  };

  // ➕ Show the Add New Product form
  const handleCreationClick = () => {
    setIsAddingProduct(true);
  };

  // 🛒 Add item to cart (or increase quantity if it already exists)
  const addToCart = (item) => {
    const exists = cart.find((i) => i.id === item.id);
    if (exists) {
      // If item is already in cart, increase its quantity
      setCart(cart.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      // If item is new to cart, add with quantity 1
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  // ❌ Remove item from cart by its ID
  const removeFromCart = (itemId) => {
    setCart(cart.filter((item) => item.id !== itemId));
  };

  // ✅ Checkout: send all cart items to backend and clear cart
  const checkout = async () => {
    for (const item of cart) {
      await fetch(`${apiURL}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: 1, // static for now — replace with real user ID later
          itemId: item.id,
          quantity: item.quantity,
        }),
      });
    }
    alert("Checkout complete!");
    setCart([]); // Clear cart after checkout
  };

  return (
    <>
      {/* 🧾 App Title */}
      <h1 className="title">Inventory App</h1>

      {/* 🛒 Shopping Cart Section */}
      <div className="cart">
        <h2>🛒 Your Cart</h2>
        {cart.length === 0 ? (
          <p>Cart is empty</p>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="cart-item">
              {item.name} x {item.quantity}
              {/* ❌ Remove from cart button */}
              <button className="btn-red" onClick={() => removeFromCart(item.id)}>
                Remove
              </button>
            </div>
          ))
        )}
        {/* ✅ Checkout Button */}
        {cart.length > 0 && (
          <button className="btn-green" onClick={checkout}>
            Checkout
          </button>
        )}
      </div>

      {/* ✏️ Adding New Item Form */}
      {isAddingProduct ? (
        <AddingProductForm
          setIsAddingProduct={setIsAddingProduct}
          setItems={setItems}
        />
      ) : !singleItem ? (
        <>
          {/* 🔎 Search Input */}
          <div>
            <input
              value={searchItems}
              onChange={handleSearch}
              placeholder="Search by name..."
            />
          </div>

          {/* 🧱 Items Grid: List of all items */}
          <div className="items-grid">
            {items.map((item) => (
              <Item
                key={item.id}
                item={item}
                setSingleItem={setSingleItem}
                addToCart={addToCart}
              />
            ))}
          </div>

          {/* ➕ Add New Item Button */}
          <button className="btn-green" onClick={handleCreationClick}>
            Add Item
          </button>
        </>
      ) : (
        // 🔍 Single Item View with Edit/Delete options
        <SingleItem
          form={form}
          singleItem={singleItem}
          setSingleItem={setSingleItem}
          refresh={refresh}
          setRefresh={setRefresh}
          toggleForm={toggleForm}
        />
      )}
    </>
  );
}

export default App;
