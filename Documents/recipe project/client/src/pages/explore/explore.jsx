import React, { useState } from "react";
import { useQuery } from "react-query";
import "./explore.css";
import RecipePreview from "../../components/recipePreview/RecipePreview";
import fetchMealDBRecipes from "../../hooks/useFetchMealDB";
import apiBase from "../../utils/api";

function Explore() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCriteria, setFilterCriteria] = useState({
    category: "",
    area: "",
  });

  const {
    isLoading: isLoadingBackend,
    isError: isErrorBackend,
    error: backendError,
    data: backendRecipes,
  } = useQuery({
    queryKey: ["allRecipes", searchQuery, filterCriteria],
    queryFn: async () => {
      const response = await fetch(`${apiBase}/recipes`, {
        credentials: "include",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      return response.json();
    },
  });

  const {
    data: externalRecipes,
    isLoading: isLoadingExternal,
    isError: isErrorExternal,
    error: externalError,
  } = fetchMealDBRecipes(searchQuery, filterCriteria);

  // Like and Save handlers
  const handleLikeBackend = async (id) => {
    await fetch(`${apiBase}/recipes/${id}/like`,
       { method: "POST" });
  };

  const handleSaveBackend = async (id) => {
    await fetch(`${apiBase}/recipes/${id}/save`,
       { method: "POST" });
  };

  // Search and filter handlers
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterCriteria((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  // Loading or error handling
  if (isLoadingBackend || isLoadingExternal) {
    return <h2 className="loading-text">Loading...</h2>;
  }

  if (isErrorBackend || isErrorExternal) {
    return (
      <div className="error-text">
        {backendError?.message || externalError?.message}
      </div>
    );
  }

  return (
    <div className="explore">
      <div className="explore-container">
        <h2>Explore Recipes</h2>
        <p>
          Discover a world of flavors with our Recipe Explore page! From
          mouthwatering classics to creative culinary twists, dive into a
          collection of recipes crafted by passionate food lovers just like you.
          Whether you are seeking inspiration or sharing your own creations,
          this is your go-to hub for all things delicious!
        </p>

        {/* Search and filter inputs */}
        <div className="search-filter">
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <select
            name="category"
            onChange={handleFilterChange}
            value={filterCriteria.category}
            className="filter"
          >
            <option value="">Select Category</option>
            <option value="Dessert">Dessert</option>
            <option value="Main Course">Main Course</option>
            <option value="Appetizer">Appetizer</option>
          </select>
          <select
            name="area"
            onChange={handleFilterChange}
            value={filterCriteria.area}
            className="category"
          >
            <option value="">Select Area</option>
            <option value="American">American</option>
            <option value="Italian">Italian</option>
            <option value="Chinese">Chinese</option>
          </select>
        </div>

        {/* Display fetched recipes */}
        <div className="explore-content">
          {/* Render Backend Recipes */}
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
                isExternal={false}
                onLike={handleLikeBackend}
                onSave={handleSaveBackend}
              />
            ))}

          {/* Render External Recipes */}
          {externalRecipes &&
            externalRecipes.map((recipe, i) => (
              <RecipePreview
                key={i}
                title={recipe.strMeal}
                authorName={recipe.strArea || "Unknown"}
                imageUrl={recipe.strMealThumb}
                category={recipe.strCategory}
                cookingTime="N/A"
                cuisine={recipe.strArea}
                id={recipe.idMeal}
                isExternal={true}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

export default Explore;
