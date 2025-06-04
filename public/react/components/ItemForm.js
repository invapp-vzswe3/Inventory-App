import React, { useState } from "react";
import apiURL from "../api";

export default function ItemForm({ singleItem, setSingleItem }) {

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: 0,
        category: "",
    })  

    async function handleSubmit(e) {
        e.preventDefault();
            
        try {
            const response = await fetch(`${apiURL}/items/${singleItem.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",

                },
                body: JSON.stringify({...singleItem, ...formData}),

            })
            const data = await response.json();
            setSingleItem(data);
            setFormData({
                name: "",
                description: "",
                price: 0,
                category: "",
            }) 
        } catch(err) {
            throw new Error(err);
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}/><br />
                <input type="text" placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}/><br />
                <input type="number" placeholder="Price" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})}/><br />
                <input type="text" placeholder="Category" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}/><br />
                <button type="submit">Submit</button>
            </form>
        </>
    )
}

// Item.init(
//   {
//  name: {
//       type: Sequelize.STRING,// Define your columns here
//       allowNull: false
//   },
  
//   description: Sequelize.TEXT,
//   price: {
//       type: Sequelize.INTEGER,
//       allowNull: false
//   },
//   category: Sequelize.STRING,
//     image: Sequelize.STRING,
//   },
//   {
//     sequelize,
//     modelName: 'Item',
//   }
// );