import React, { useState, useEffect } from "react";
import { FaRegSave } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
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
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState(new Set());
  const [likedRecipes, setLikedRecipes] = useState(new Set()); // State for likes
  const [likesCount, setLikesCount] = useState({}); // Track likes count for each recipe
  const [searchTriggered, setSearchTriggered] = useState(false); // To track when the search is triggered

  const navigate = useNavigate();

  // Fetch backend recipes
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

  // Fetch external recipes based on query and filters
  const fetchExternalRecipes = async () => {
    if (!searchTriggered) return; // Only fetch when search is triggered

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

  // Fetch filter options for categories, areas, and ingredients
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

  // Fetch external recipes only when searchTriggered is true
  useEffect(() => {
    fetchExternalRecipes();
  }, [searchTriggered, query, filters]);

  // Fetch all bookmarked recipes on initial load
  useEffect(() => {
    const fetchBookmarkedRecipes = async () => {
      try {
        const response = await fetch(`${apiBase}/bookmarked-recipes`, {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch bookmarked recipes.");
        }

        const data = await response.json();
        const bookmarkedIds = new Set(data.bookmarks.map((recipe) => recipe.id));
        setBookmarkedRecipes(bookmarkedIds);
      } catch (err) {
        console.error("Error fetching bookmarks:", err);
      }
    };

    fetchBookmarkedRecipes();
  }, []);

  // Handle search input changes
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTriggered(true); // Trigger search when button is clicked
  };

  // Handle navigation to full recipe page
  const viewFullRecipe = (id) => {
    navigate(`/full-recipe/${id}`);
  };

  // Toggle bookmark status
  const toggleBookmark = async (recipeId, isExternal) => {
    try {
      if (bookmarkedRecipes.has(recipeId)) {
        // Remove bookmark
        await fetch(`${apiBase}/recipes/${recipeId}/bookmark`, {
          method: "DELETE",
          credentials: "include",
        });
        setBookmarkedRecipes((prev) => {
          const updated = new Set(prev);
          updated.delete(recipeId);
          return updated;
        });
      } else {
        // Add bookmark
        await fetch(`${apiBase}/recipes/${recipeId}/bookmark`, {
          method: "POST",
          credentials: "include",
        });
        setBookmarkedRecipes((prev) => new Set(prev.add(recipeId)));
      }
    } catch (err) {
      console.error("Error updating bookmark:", err);
    }
  };

  // Toggle like status and increase like count
  const toggleLike = (recipeId) => {
    if (!likedRecipes.has(recipeId)) {
      // Add like for the recipe
      setLikedRecipes((prevLikes) => {
        const newLikes = new Set(prevLikes);
        newLikes.add(recipeId);
        return newLikes;
      });
      // Increment the like count for the recipe
      setLikesCount((prevLikesCount) => ({
        ...prevLikesCount,
        [recipeId]: (prevLikesCount[recipeId] || 0) + 1,
      }));
    }
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
          {categories.length > 0 ? (
            categories.map((cat) => (
              <option key={cat.strCategory} value={cat.strCategory}>
                {cat.strCategory}
              </option>
            ))
          ) : (
            <option value="">Loading categories...</option>
          )}
        </select>

        <select
          onChange={(e) => setFilters({ ...filters, area: e.target.value })}
          value={filters.area}
        >
          <option value="">All Areas</option>
          {areas.length > 0 ? (
            areas.map((area) => (
              <option key={area.strArea} value={area.strArea}>
                {area.strArea}
              </option>
            ))
          ) : (
            <option value="">Loading areas...</option>
          )}
        </select>

        <select
          onChange={(e) =>
            setFilters({ ...filters, ingredient: e.target.value })
          }
          value={filters.ingredient}
        >
          <option value="">All Ingredients</option>
          {ingredients.length > 0 ? (
            ingredients.slice(0, 20).map((ing) => (
              <option key={ing.strIngredient} value={ing.strIngredient}>
                {ing.strIngredient}
              </option>
            ))
          ) : (
            <option value="">Loading ingredients...</option>
          )}
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
              isBookmarked={bookmarkedRecipes.has(recipe.id)}
              toggleBookmark={() => toggleBookmark(recipe.id, false)}
              likesCount={likesCount[recipe.id] || 0}
              toggleLike={() => toggleLike(recipe.id)}
            />
          ))
        )}

        {/* External Recipes */}
        {loadingExternal ? (
          <p>Loading external recipes...</p>
        ) : (
          externalRecipes.length > 0 &&
          externalRecipes.map((recipe) => (
            <RecipePreview
              key={recipe.idMeal}
              title={recipe.strMeal}
              authorName="External Author"
              imageUrl={recipe.strMealThumb}
              cookingTime="N/A"
              category="N/A"
              id={recipe.idMeal}
              isBookmarked={bookmarkedRecipes.has(recipe.idMeal)}
              toggleBookmark={() => toggleBookmark(recipe.idMeal, true)}
              likesCount={likesCount[recipe.idMeal] || 0}
              toggleLike={() => toggleLike(recipe.idMeal)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Explore;



