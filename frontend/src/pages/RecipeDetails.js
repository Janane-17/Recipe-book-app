import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);

  // Fetch recipe details
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await API.get(`/${id}`);
        setRecipe(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load recipe.");
      }
    };
    fetchRecipe();
  }, [id]);

  // Like recipe
  const handleLike = async () => {
    try {
      const res = await API.post(`/${recipe._id}/like`);
      setRecipe(res.data.recipe);
    } catch (err) {
      console.error(err);
      alert("Failed to like recipe.");
    }
  };

  // Unlike recipe
  const handleUnlike = async () => {
    try {
      await API.post(`/${recipe._id}/unlike`);
      setRecipe({ ...recipe, likes: recipe.likes - 1 });
    } catch (err) {
      console.error(err);
      alert("Failed to unlike recipe.");
    }
  };

  // Add to favorites
  const handleAddFavorite = async () => {
    try {
      await API.post(`/${recipe._id}/favorite`);
      setRecipe({ ...recipe, isFavorite: true });
    } catch (err) {
      console.error(err);
      alert("Failed to add to favorites.");
    }
  };

  // Remove from favorites
  const handleRemoveFavorite = async () => {
    try {
      await API.delete(`/${recipe._id}/favorite`);
      setRecipe({ ...recipe, isFavorite: false });
    } catch (err) {
      console.error(err);
      alert("Failed to remove from favorites.");
    }
  };

  // Delete recipe
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;
    try {
      await API.delete(`/${recipe._id}`);
      alert("Recipe deleted successfully!");
      navigate("/"); // go back to home page
    } catch (err) {
      console.error(err);
      alert("Failed to delete recipe.");
    }
  };

  // Navigate to edit page
  const handleEdit = () => {
    navigate(`/edit/${recipe._id}`);
  };

  if (!recipe) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h1 style={{ fontSize: "36px", fontWeight: "bold", textAlign: "center" }}>
        {recipe.name}
      </h1>

      <p><strong>Category:</strong> {recipe.category}</p>

      <p><strong>Ingredients:</strong></p>
      <ul>
        {recipe.ingredients.map((ing, idx) => (
          <li key={idx}>{ing}</li>
        ))}
      </ul>

      <p><strong>Instructions:</strong></p>
      <p>{recipe.instructions}</p>

      <p><strong>Likes:</strong> {recipe.likes || 0}</p>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
        {recipe.likes ? (
          <button onClick={handleUnlike} style={buttonStyle}>Unlike</button>
        ) : (
          <button onClick={handleLike} style={buttonStyle}>Like</button>
        )}

        {recipe.isFavorite ? (
          <button onClick={handleRemoveFavorite} style={buttonStyle}>Remove Favorite</button>
        ) : (
          <button onClick={handleAddFavorite} style={buttonStyle}>Add to Favorite</button>
        )}

        <button onClick={handleEdit} style={{ ...buttonStyle, backgroundColor: "#FFA500" }}>
          Edit Recipe
        </button>

        <button onClick={handleDelete} style={{ ...buttonStyle, backgroundColor: "#ff4d4d" }}>
          Delete Recipe
        </button>
      </div>
    </div>
  );
};

// Shared button style
const buttonStyle = {
  backgroundColor: "#4CAF50",
  color: "#fff",
  border: "none",
  padding: "10px 15px",
  borderRadius: "5px",
  cursor: "pointer",
};

export default RecipeDetails;
