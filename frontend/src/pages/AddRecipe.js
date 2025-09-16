import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

const AddRecipe = () => {
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState({
    name: "",
    ingredients: "",
    instructions: "",
    category: "",
    tags: ""
  });

  const handleChange = (e) => {
    setRecipe({ ...recipe, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/", {
        ...recipe,
        ingredients: recipe.ingredients.split(",").map(i => i.trim()),
        tags: recipe.tags.split(",").map(t => t.trim())
      });
      alert("Recipe added successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to add recipe.");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", fontSize: "24px", fontWeight: "bold" }}>Add New Recipe</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Recipe Name"
          value={recipe.name}
          onChange={handleChange}
          required
          style={fieldStyle}
        />
        <textarea
          name="ingredients"
          placeholder="Ingredients (comma separated)"
          value={recipe.ingredients}
          onChange={handleChange}
          required
          style={fieldStyle}
        />
        <textarea
          name="instructions"
          placeholder="Instructions"
          value={recipe.instructions}
          onChange={handleChange}
          required
          style={{ ...fieldStyle, minHeight: "150px" }} // taller box
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={recipe.category}
          onChange={handleChange}
          style={fieldStyle}
        />
        <input
          type="text"
          name="tags"
          placeholder="Tags (comma separated)"
          value={recipe.tags}
          onChange={handleChange}
          style={fieldStyle}
        />
        <button type="submit" style={submitStyle}>Add Recipe</button>
      </form>
    </div>
  );
};

// Same style as EditRecipe
const fieldStyle = {
  width: "100%",
  padding: "10px",
  margin: "10px 0",
  borderRadius: "5px",
  border: "1px solid #ccc",
  fontSize: "13px",
  fontFamily: "Arial, sans-serif"
};

const submitStyle = {
  backgroundColor: "#4CAF50",
  color: "#fff",
  border: "none",
  padding: "10px 20px",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "13px",
  fontFamily: "Arial, sans-serif"
};

export default AddRecipe;
