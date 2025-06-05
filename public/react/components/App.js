import React, { useEffect, useState } from "react";
import ItemForm from "./ItemForm";
import apiURL from "../api";
import Item from "./Item";
import SingleItem from "./SingleItem";

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
    fetchItems();
  }, [refresh, searchItems]);

  // Get single item by ID for detailed view
  const singleItemView = async (id) => {
    const response = await fetch(`${apiURL}/items/${id}`);
    const data = await response.json();
    setSingleItem(data);
  };

  // Update search input value
  const handleSearch = (e) => {
    setSearchItems(e.target.value);
  };

  // Reset view back to item list
  const goBackToItems = () => {
    setSingleItem(null);
    setRefresh(!refresh);
  };

  // Delete selected item
  const deleteItem = async (id) => {
    await fetch(`${apiURL}/items/${id}`, {
      method: "DELETE",
    });
    setSingleItem(null);
    setRefresh(!refresh);
  };

  // Show product creation form
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

    {isAddingProduct ? (
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          const productData = {
            name: event.target.name.value,
            description: event.target.description.value,
            price: event.target.price.value,
            category: event.target.category.value,
            image: event.target.image.value,
          };
          await fetch(`${apiURL}/items`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(productData),
          });
          setIsAddingProduct(false);
          const response = await fetch(`${apiURL}/items`);
          setItems(await response.json());
        }}
      >
        <input name="name" placeholder="Name" /> <br />
        <input name="description" placeholder="Description" /> <br />
        <input name="price" placeholder="Price" /> <br />
        <input name="category" placeholder="Category" /> <br />
        <input name="image" placeholder="Image URL" /> <br />
        <button type="submit">Add Item</button>
        <button type="button" onClick={() => setIsAddingProduct(false)}>
          Cancel
        </button>
      </form>
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
          <Item key={item.id} item={item} singleItemView={singleItemView}/>
        ))}
        <button onClick={handleCreationClick}>Add Item</button>
      </>
    ) : (
      <SingleItem form={form} singleItem={singleItem} setSingleItem={setSingleItem} toggleForm={toggleForm} goBackToItems={goBackToItems} deleteItem={deleteItem}/>
    )}
  </>
);
}

export default App;
