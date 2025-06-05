import React from "react";
import apiURL from "../api";

export default function AddingProductForm({setIsAddingProduct, setItems}) {
    return (
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
    )
}