import React, { useState, useEffect } from "react";
import "./explore.css";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import RecipePreview from "../../components/recipePreview/recipePreview";
import apiBase from "../../utils/api";

function Explore() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    area: "",
    ingredient: "",
  });
  const [externalRecipes, setExternalRecipes] = useState([]);
  const [loadingExternal, setLoadingExternal] = useState(false);
  const [errorExternal, setErrorExternal] = useState("");
  const [categories, setCategories] = useState([]);
  const [areas, setAreas] = useState([]);
  const [ingredients, setIngredients] = useState([]);

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

  // Fetch recipes from TheMealDB API
  const fetchExternalRecipes = async () => {
    setLoadingExternal(true);
    setErrorExternal("");
    try {
      let url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;
      if (!query) {
        if (filters.category) {
          url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${filters.category}`;
        } else if (filters.area) {
          url = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${filters.area}`;
        } else if (filters.ingredient) {
          url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${filters.ingredient}`;
        } else {
          url = `https://www.themealdb.com/api/json/v1/1/search.php?f=a`; // Default to meals starting with 'a'
        }
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch recipes from TheMealDB API.");
      }

      const data = await response.json();
      setExternalRecipes(data.meals || []);
    } catch (err) {
      setErrorExternal(
        "Error fetching recipes from TheMealDB API. Please try again."
      );
    } finally {
      setLoadingExternal(false);
    }
  };

  // Fetch categories, areas, and ingredients for filters
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [categoriesRes, areasRes, ingredientsRes] = await Promise.all([
          fetch("https://www.themealdb.com/api/json/v1/1/list.php?c=list"),
          fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list"),
          fetch("https://www.themealdb.com/api/json/v1/1/list.php?i=list"),
        ]);

        const categoriesData = await categoriesRes.json();
        const areasData = await areasRes.json();
        const ingredientsData = await ingredientsRes.json();

        setCategories(categoriesData.meals || []);
        setAreas(areasData.meals || []);
        setIngredients(ingredientsData.meals || []);
      } catch (err) {
        console.error("Error fetching filter options:", err);
      }
    };

    fetchFilterOptions();
  }, []);

  // Fetch external recipes when query or filters change
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
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          value={filters.category}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.strCategory} value={cat.strCategory}>
              {cat.strCategory}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => setFilters({ ...filters, area: e.target.value })}
          value={filters.area}
        >
          <option value="">All Areas</option>
          {areas.map((area) => (
            <option key={area.strArea} value={area.strArea}>
              {area.strArea}
            </option>
          ))}
        </select>

        <select
          onChange={(e) =>
            setFilters({ ...filters, ingredient: e.target.value })
          }
          value={filters.ingredient}
        >
          <option value="">All Ingredients</option>
          {ingredients.slice(0, 20).map((ing) => ( // Limit options for performance
            <option key={ing.strIngredient} value={ing.strIngredient}>
              {ing.strIngredient}
            </option>
          ))}
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
            <div className="recipe-card" key={`external-${recipe.idMeal}`}>
              <img src={recipe.strMealThumb} alt={recipe.strMeal} />
              <h3>{recipe.strMeal}</h3>
              <p>Category: {recipe.strCategory}</p>
              <p>Area: {recipe.strArea}</p>
              <button onClick={() => viewFullRecipe(recipe.idMeal)}>
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

