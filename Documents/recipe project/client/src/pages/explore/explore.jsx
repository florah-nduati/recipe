import React, { useState, useEffect } from "react";
import "./explore.css";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import RecipePreview from "../../components/recipePreview/recipePreview";
import apiBase from "../../utils/api";

const apiKey = "2571f69dbe754661a9c1366cc078e2f7"; // Spoonacular API Key

function Explore() {
  const [query, setQuery] = useState(""); // Search query
  const [filters, setFilters] = useState({
    cuisine: "",
    mealType: "",
    diet: "",
  });
  const [externalRecipes, setExternalRecipes] = useState([]); // External API recipes
  const [loadingExternal, setLoadingExternal] = useState(false);
  const [errorExternal, setErrorExternal] = useState("");

  const navigate = useNavigate();

  // Fetch recipes from the backend
  const {
    isLoading: loadingBackend,
    isError: errorBackend,
    data: backendRecipes,
  } = useQuery({
    queryKey: ["allRecipes"],
    queryFn: async () => {
      const response = await fetch(`${apiBase}/Recipes`, {
        credentials: "include",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      const data = await response.json();
      return data;
    },
  });

  // Fetch recipes from the external API
  const fetchExternalRecipes = async () => {
    setLoadingExternal(true);
    setErrorExternal("");
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?query=${query}&cuisine=${filters.cuisine}&type=${filters.mealType}&diet=${filters.diet}&apiKey=${apiKey}&number=10`,
      );
      const data = await response.json();
      setExternalRecipes(data.results || []);
    } catch (err) {
      setErrorExternal(
        "Error fetching recipes from external API. Please try again.",
      );
    } finally {
      setLoadingExternal(false);
    }
  };

  // Fetch external recipes when filters or query changes
  useEffect(() => {
    fetchExternalRecipes();
  }, [query, filters]);

  // Handle search input changes
  const handleSearch = (e) => {
    e.preventDefault();
    fetchExternalRecipes();
  };

  // Handle navigation to full recipe page
  const viewFullRecipe = (id) => {
    navigate(`/full-recipe/${id}`);
  };

  return (
    <div className="explore-container">
      <h2>Explore Recipes</h2>

      {/* Search and Filters */}
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for recipes"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" disabled={loadingExternal || loadingBackend}>
          {loadingExternal || loadingBackend ? "Searching..." : "Search"}
        </button>
      </form>

      <div className="filters">
        <select
          onChange={(e) => setFilters({ ...filters, cuisine: e.target.value })}
          value={filters.cuisine}
        >
          <option value="">All Cuisines</option>
          <option value="Italian">Italian</option>
          <option value="American">American</option>
          <option value="Chinese">Chinese</option>
          <option value="Mexican">Mexican</option>
        </select>

        <select
          onChange={(e) => setFilters({ ...filters, mealType: e.target.value })}
          value={filters.mealType}
        >
          <option value="">All Meal Types</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
        </select>

        <select
          onChange={(e) => setFilters({ ...filters, diet: e.target.value })}
          value={filters.diet}
        >
          <option value="">All Diets</option>
          <option value="Vegetarian">Vegetarian</option>
          <option value="Vegan">Vegan</option>
          <option value="Gluten-Free">Gluten-Free</option>
        </select>
      </div>

      {/* Errors */}
      {errorBackend && <p className="error">Error fetching backend recipes.</p>}
      {errorExternal && <p className="error">{errorExternal}</p>}

      {/* Display Recipes */}
      <div className="recipe-cards">
        {/* Backend Recipes */}
        {loadingBackend ? (
          <p>Loading backend recipes...</p>
        ) : (
          backendRecipes &&
          backendRecipes.map((recipe, i) => (
            <RecipePreview
              key={`backend-${i}`}
              title={recipe.title}
              authorName={`${recipe.user.firstName} ${recipe.user.middleName}`}
              imageUrl={recipe.imageUrl}
              description={recipe.description}
              cookingTime={recipe.cookingTime}
              category={recipe.category}
              id={recipe.id}
            />
          ))
        )}

        {/* External Recipes */}
        {loadingExternal ? (
          <p>Loading external recipes...</p>
        ) : (
          externalRecipes.map((recipe) => (
            <div className="recipe-card" key={`external-${recipe.id}`}>
              <img src={recipe.image} alt={recipe.title} />
              <h3>{recipe.title}</h3>
              <p>Cooking Time: {recipe.readyInMinutes} minutes</p>
              <button onClick={() => viewFullRecipe(recipe.id)}>
                Read More
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Explore;
