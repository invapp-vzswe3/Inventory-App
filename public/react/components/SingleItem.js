import React from "react";
import ItemForm from "./ItemForm";
import apiURL from "../api";

export default function SingleItem({form, singleItem, refresh, setSingleItem, toggleForm, setRefresh}) {
  

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
        <div>
                <h2>{singleItem.name}</h2>
                <p>Price: ${singleItem.price}</p>
                <p>Description: {singleItem.description}</p>
                <p>Category: {singleItem.category}</p>
                <img
                  className="singleitemimage"
                  src={singleItem.image}
                  alt={singleItem.name}
                  width="20%"
                  height="20%"
                />
                <br />
                <button onClick={() => toggleForm(!form)}>Update Item</button>
                {form && (
                  <ItemForm singleItem={singleItem} setSingleItem={setSingleItem} />
                )}
                <button onClick={goBackToItems}>Back to Items</button>
                <button
                  onClick={() => deleteItem(singleItem.id)}
                  className="deletebutton"
                >
                  Delete
                </button>
            </div>
    )
}