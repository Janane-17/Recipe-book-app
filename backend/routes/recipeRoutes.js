const express = require("express");
const router = express.Router();
const Recipe = require("../models/Recipe");
const User = require("../models/User");

// ➡️ User Registration
router.post("/auth/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.json({ message: "User already exists" });

    const newUser = new User({ username, password });
    await newUser.save();
    res.json({ message: "User registered successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ➡️ User Login
router.post("/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (!user) return res.json({ message: "Invalid credentials" });
    res.json({ message: "Login successful!" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ➡️ Search recipes by name, ingredient, or tag
router.get("/search", async (req, res) => {
  try {
    const { name, ingredient, tag } = req.query;
    let query = {};

    if (name) query.name = { $regex: name, $options: "i" };
    if (ingredient) query.ingredients = { $elemMatch: { $regex: ingredient, $options: "i" } };
    if (tag) query.tags = { $elemMatch: { $regex: tag, $options: "i" } };

    const recipes = await Recipe.find(query);
    if (recipes.length === 0) return res.json({ message: "No recipes found" });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ➡️ Get recipes by category
router.get("/category/:category", async (req, res) => {
  try {
    const recipes = await Recipe.find({ category: req.params.category });
    if (recipes.length === 0) return res.json({ message: "No recipes found" });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ➡️ Get all favorite recipes
router.get("/favorites", async (req, res) => {
  try {
    const recipes = await Recipe.find({ isFavorite: true });
    if (recipes.length === 0) return res.json({ message: "No favorite recipes yet!" });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ➡️ Get trending recipes (top 5 by likes)
router.get("/trending", async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ likes: -1 }).limit(5);
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ➡️ Get total recipe count
router.get("/count", async (req, res) => {
  try {
    const count = await Recipe.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ➡️ Get a random recipe
router.get("/random", async (req, res) => {
  try {
    const recipes = await Recipe.find();
    if (recipes.length === 0) return res.json({ message: "No recipes available" });
    const random = recipes[Math.floor(Math.random() * recipes.length)];
    res.json(random);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ➡️ Get all recipes
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ➡️ Create a new recipe
router.post("/", async (req, res) => {
  try {
    const { name, ingredients, instructions, category, tags } = req.body;
    const newRecipe = new Recipe({ name, ingredients, instructions, category, tags });
    await newRecipe.save();
    res.json({ message: "Recipe added successfully!", recipe: newRecipe });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ➡️ Add recipe to favorites
router.post("/:id/favorite", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.json({ message: "Recipe not found" });
    recipe.isFavorite = true;
    await recipe.save();
    res.json({ message: "Recipe added to favorites!" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ➡️ Remove recipe from favorites
router.delete("/:id/favorite", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.json({ message: "Recipe not found" });
    recipe.isFavorite = false;
    await recipe.save();
    res.json({ message: "Recipe removed from favorites!" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ➡️ Like a recipe
router.post("/:id/like", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.json({ message: "Recipe not found" });
    recipe.likes = (recipe.likes || 0) + 1;
    await recipe.save();
    res.json({ message: "Recipe liked!", recipe });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ➡️ Update recipe tags
router.put("/:id/tags", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.json({ message: "Recipe not found" });
    recipe.tags = req.body.tags || [];
    await recipe.save();
    res.json({ message: "Tags updated successfully!", recipe });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ➡️ Update recipe by ID
router.put("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.json({ message: "Recipe not found" });
    const { name, ingredients, instructions, category, tags } = req.body;
    if (name) recipe.name = name;
    if (ingredients) recipe.ingredients = ingredients;
    if (instructions) recipe.instructions = instructions;
    if (category) recipe.category = category;
    if (tags) recipe.tags = tags;
    await recipe.save();
    res.json({ message: "Recipe updated successfully!", recipe });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ➡️ Get recipe by ID
router.get("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.json({ message: "Recipe not found" });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ➡️ Delete recipe by ID
router.delete("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) return res.json({ message: "Recipe not found" });
    res.json({ message: "Recipe deleted successfully!", deleted: recipe });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
