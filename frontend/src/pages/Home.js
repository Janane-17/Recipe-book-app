import { useState, useEffect } from "react";
import API from "../api";
import { Link, useNavigate } from "react-router-dom";

function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [trending, setTrending] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("username");
    navigate("/login");
  };

  const fetchRecipes = async (query = "") => {
    try {
      const res = await API.get(query ? `/search?name=${query}` : "/");
      if (res.data.message) {
        setMessage(res.data.message);
        setRecipes([]);
        setCategories([]);
      } else {
        setRecipes(res.data.map((r) => ({ ...r, likedByUser: false })));
        setMessage("");
        const cats = [...new Set(res.data.map((r) => r.category || "Uncategorized"))];
        setCategories(cats);
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to fetch recipes.");
    } finally {
      setLoading(false);
    }
  };

  const fetchByCategory = async (category) => {
    setSelectedCategory(category);
    setLoading(true);
    try {
      const res = await API.get(`/category/${category}`);
      if (res.data.message) {
        setMessage(res.data.message);
        setRecipes([]);
      } else {
        setRecipes(res.data.map((r) => ({ ...r, likedByUser: false })));
        setMessage("");
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to fetch category.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTrendingAndFavorites = async () => {
    try {
      const trendingRes = await API.get("/trending");
      setTrending(trendingRes.data);

      const favRes = await API.get("/favorites");
      setFavorites(favRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) {
      navigate("/login");
    } else {
      fetchRecipes();
      fetchTrendingAndFavorites();
    }
  }, [navigate]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSelectedCategory("");
    setLoading(true);
    fetchRecipes(search);
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading recipes...</p>;

  return (
    <div style={{ fontFamily: "Arial, sans-serif", minHeight: "100vh", background: "linear-gradient(to right, #fdfbfb, #ebedee)", paddingBottom: "50px" }}>
      
      {/* Header */}
      <div style={{ backgroundColor: "#4CAF50", padding: "20px 0", textAlign: "center", color: "#fff", boxShadow: "0 3px 6px rgba(0,0,0,0.1)", marginBottom: "20px" }}>
        <h1 style={{
            textAlign: "center",
            fontSize: "48px",
            fontWeight: "bold",
            color: "#fff",                    // visible on green background
            fontFamily: "'Gloria Hallelujah', cursive",
            textShadow: "2px 2px 5px rgba(0,0,0,0.5)",  // subtle pop
            margin: "30px 0"
            }}>
            👩‍🍳 Yori It 🍜
        </h1>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Logout button */}
        <div style={{ textAlign: "right", marginBottom: "20px" }}>
          <button
            onClick={handleLogout}
            style={{
              padding: "8px 15px",
              cursor: "pointer",
              backgroundColor: "#f44336",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              fontWeight: "bold"
            }}
          >
            Logout
          </button>
        </div>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          style={{ display: "flex", justifyContent: "center", marginBottom: "20px", gap: "10px" }}
        >
          <input
            type="text"
            placeholder="Search recipes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: "10px", width: "250px", borderRadius: "25px", border: "1px solid #ccc", outline: "none" }}
          />
          <button type="submit" style={{ padding: "10px 20px", borderRadius: "25px", border: "none", backgroundColor: "#4CAF50", color: "#fff", fontWeight: "bold", cursor: "pointer" }}>
            Search
          </button>
        </form>

        {/* Categories */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => fetchByCategory(cat)}
              style={{
                margin: "0 5px 5px 0",
                padding: "6px 14px",
                borderRadius: "20px",
                border: "none",
                cursor: "pointer",
                backgroundColor: selectedCategory === cat ? "#4CAF50" : "#e0e0e0",
                color: selectedCategory === cat ? "#fff" : "#000",
                fontWeight: "bold",
                boxShadow: "1px 1px 3px rgba(0,0,0,0.1)"
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Trending */}
        {trending.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ marginBottom: "10px", color: "#4CAF50" }}>🔥 Trending Recipes</h3>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {trending.map((r) => (
                <div key={r._id} style={{ border: "1px solid #ccc", borderRadius: "10px", padding: "10px", width: "180px", backgroundColor: "#fff", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
                  <Link to={`/recipe/${r._id}`} style={{ textDecoration: "none", fontWeight: "bold", color: "#333" }}>
                    {r.name}
                  </Link>
                  <p style={{ fontSize: "12px", marginTop: "5px" }}>{r.likes} Likes</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Favorites */}
        {favorites.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ marginBottom: "10px", color: "#e91e63" }}>💖 Favorite Recipes</h3>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {favorites.map((r) => (
                <div key={r._id} style={{ border: "1px solid #ccc", borderRadius: "10px", padding: "10px", width: "180px", backgroundColor: "#fff", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
                  <Link to={`/recipe/${r._id}`} style={{ textDecoration: "none", fontWeight: "bold", color: "#333" }}>
                    {r.name}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recipe List */}
        {message && <p style={{ textAlign: "center", color: "red" }}>{message}</p>}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
          {recipes.map((recipe) => (
            <div key={recipe._id} style={{ flex: "1 1 250px", border: "1px solid #ccc", borderRadius: "10px", padding: "15px", backgroundColor: "#fff", boxShadow: "0 3px 7px rgba(0,0,0,0.1)" }}>
              <Link to={`/recipe/${recipe._id}`} style={{ textDecoration: "none", fontWeight: "bold", color: "#333", fontSize: "18px" }}>
                {recipe.name}
              </Link>
              <p style={{ fontSize: "12px", color: "#666" }}>{recipe.category}</p>

              <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                {/* Like/Unlike */}
                <button
                  onClick={async () => {
                    try {
                      if (recipe.likedByUser) {
                        const res = await API.post(`/${recipe._id}/unlike`);
                        setRecipes((prev) =>
                          prev.map((r) =>
                            r._id === recipe._id
                              ? { ...r, likes: res.data.recipe.likes, likedByUser: false }
                              : r
                          )
                        );
                      } else {
                        const res = await API.post(`/${recipe._id}/like`);
                        setRecipes((prev) =>
                          prev.map((r) =>
                            r._id === recipe._id
                              ? { ...r, likes: res.data.recipe.likes, likedByUser: true }
                              : r
                          )
                        );
                      }
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                  style={{
                    padding: "5px 10px",
                    borderRadius: "5px",
                    border: "none",
                    backgroundColor: "#ff9800",
                    color: "#fff",
                    cursor: "pointer",
                    fontWeight: "bold"
                  }}
                >
                  👍 {recipe.likes || 0}
                </button>

                {/* Favorite */}
                <button
                  onClick={async () => {
                    try {
                      if (recipe.isFavorite) {
                        await API.delete(`/${recipe._id}/favorite`);
                      } else {
                        await API.post(`/${recipe._id}/favorite`);
                      }
                      setRecipes((prev) =>
                        prev.map((r) => (r._id === recipe._id ? { ...r, isFavorite: !r.isFavorite } : r))
                      );
                      const favRes = await API.get("/favorites");
                      setFavorites(favRes.data);
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                  style={{
                    padding: "5px 10px",
                    borderRadius: "5px",
                    border: "none",
                    backgroundColor: recipe.isFavorite ? "#e91e63" : "#9e9e9e",
                    color: "#fff",
                    cursor: "pointer",
                    fontWeight: "bold"
                  }}
                >
                  {recipe.isFavorite ? "💖" : "♡"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Recipe Link */}
        <div style={{ textAlign: "center", marginTop: "25px" }}>
          <Link to="/add" style={{ textDecoration: "none", fontWeight: "bold", color: "#4CAF50", fontSize: "18px" }}>
            + Add New Recipe
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
