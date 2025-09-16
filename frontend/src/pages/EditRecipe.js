import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";

const EditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipeData, setRecipeData] = useState({
    name: "",
    ingredients: "",
    instructions: "",
    category: "",
    tags: ""
  });

  // Fetch existing recipe
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await API.get(`/${id}`);
        const data = res.data;
        setRecipeData({
          name: data.name,
          ingredients: data.ingredients.join(", "),
          instructions: data.instructions,
          category: data.category,
          tags: data.tags.join(", ")
        });
      } catch (err) {
        console.error(err);
        alert("Failed to load recipe.");
      }
    };
    fetchRecipe();
  }, [id]);

  const handleChange = (e) => {
    setRecipeData({ ...recipeData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/${id}`, {
        ...recipeData,
        ingredients: recipeData.ingredients.split(",").map(i => i.trim()),
        tags: recipeData.tags.split(",").map(t => t.trim())
      });
      alert("Recipe updated successfully!");
      navigate(`/recipe/${id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to update recipe.");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", fontSize: "24px", fontWeight: "bold" }}>Edit Recipe</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Recipe Name"
          value={recipeData.name}
          onChange={handleChange}
          required
          style={fieldStyle}
        />
        <textarea
          name="ingredients"
          placeholder="Ingredients (comma separated)"
          value={recipeData.ingredients}
          onChange={handleChange}
          required
          style={fieldStyle}
        />
        <textarea
          name="instructions"
          placeholder="Instructions"
          value={recipeData.instructions}
          onChange={handleChange}
          required
          style={fieldStyle}
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={recipeData.category}
          onChange={handleChange}
          style={fieldStyle}
        />
        <input
          type="text"
          name="tags"
          placeholder="Tags (comma separated)"
          value={recipeData.tags}
          onChange={handleChange}
          style={fieldStyle}
        />
        <button type="submit" style={submitStyle}>Update Recipe</button>
      </form>
    </div>
  );
};

// Uniform style for all input and textarea fields
const fieldStyle = {
  width: "100%",
  padding: "10px",
  margin: "10px 0",
  borderRadius: "5px",
  border: "1px solid #ccc",
  fontSize: "13px",
  fontFamily: "Arial, sans-serif" // same font for all
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

export default EditRecipe;
