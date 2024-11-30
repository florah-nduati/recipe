import React, { useState } from "react";
import { useQuery } from "react-query";
import "./explore.css";
import RecipePreview from "../../components/recipePreview/RecipePreview";
import fetchMealDBRecipes from "../../hooks/useFetchMealDB";
import apiBase from "../../utils/api";

function Explore() {
  // Manage search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCriteria, setFilterCriteria] = useState({
    category: "",
    area: "",
  });

  // Fetch backend recipes
  const { isLoading: isLoadingBackend, isError: isErrorBackend, error: backendError, data: backendRecipes } = useQuery({
    queryKey: ["allRecipes", searchQuery, filterCriteria],
    queryFn: async () => {
      const response = await fetch(`${apiBase}/recipes`, { credentials: "include" });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      return response.json();
    },
  });

  // Fetch external recipes using the custom hook with search and filter params
  const { data: externalRecipes, isLoading: isLoadingExternal, isError: isErrorExternal, error: externalError } = fetchMealDBRecipes(searchQuery, filterCriteria);

  // Like and Save handlers for backend recipes
  const handleLikeBackend = async (id) => {
    // Call backend API to like a recipe
    await fetch(`${apiBase}/recipes/${id}/like`, { method: "POST" });
  };

  const handleSaveBackend = async (id) => {
    // Call backend API to save a recipe
    await fetch(`${apiBase}/recipes/${id}/save`, { method: "POST" });
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Handle filter change
  const handleFilterChange = (event) => {
    setFilterCriteria((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  // Check if loading or errors exist
  if (isLoadingBackend || isLoadingExternal) {
    return <h2 className="loading-text">Loading...</h2>;
  }
  if (isErrorBackend || isErrorExternal) {
    return <div className="error-text">{backendError?.message || externalError?.message}</div>;
  }

  return (
    <div className="explore">
      <div className="explore-container">
        <h2>Explore Recipes</h2>

        {/* Search and Filter Section */}
        <div className="search-filter">
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <select name="category" onChange={handleFilterChange} value={filterCriteria.category}>
            <option value="">Select Category</option>
            <option value="Dessert">Dessert</option>
            <option value="Main Course">Main Course</option>
            <option value="Appetizer">Appetizer</option>
            {/* Add more categories here */}
          </select>
          <select name="area" onChange={handleFilterChange} value={filterCriteria.area}>
            <option value="">Select Area</option>
            <option value="American">American</option>
            <option value="Italian">Italian</option>
            <option value="Chinese">Chinese</option>
            {/* Add more areas here */}
          </select>
        </div>

        <div className="explore-content">
          {/* Backend Recipes */}
          {backendRecipes &&
            backendRecipes.map((recipe, i) => (
              <RecipePreview
                key={i}
                title={recipe.title}
                authorName={`${recipe.user.firstName} ${recipe.user.middleName}`}
                imageUrl={recipe.imageUrl}
                category={recipe.category}
                cookingTime={recipe.cookingTime}
                cuisine={recipe.cuisine}
                id={recipe.id}
                isExternal={false} // Backend recipe
                onLike={handleLikeBackend}
                onSave={handleSaveBackend}
              />
            ))}

          {/* External Recipes */}
          {externalRecipes &&
            externalRecipes.map((recipe, i) => (
              <RecipePreview
                key={i}
                title={recipe.strMeal}
                authorName={recipe.strArea || "Unknown"}
                imageUrl={recipe.strMealThumb}
                category={recipe.strCategory}
                cookingTime="N/A" // MealDB does not provide cooking time
                cuisine={recipe.strArea}
                id={recipe.idMeal}
                isExternal={true} // External recipe
                
              />
            ))}
        </div>
      </div>
    </div>
  );
}

export default Explore;
