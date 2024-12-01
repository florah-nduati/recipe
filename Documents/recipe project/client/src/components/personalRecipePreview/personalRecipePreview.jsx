import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import "./PersonalRecipePreview.css";
import apiBase from "../../utils/api";
import usePersonalRecipesStore from "../../store/personalRecipeStore";

function PersonalRecipePreview({ id, title, imageUrl, description, category }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const recipes = usePersonalRecipesStore((state) => state.recipes);
  const setRecipes = usePersonalRecipesStore((state) => state.setRecipes);

  const { isLoading, mutate } = useMutation({
    mutationKey: ["deletedRecipe", id],
    mutationFn: async (recipeId) => {
      try {
        console.log("Attempting to delete recipe with ID:", recipeId);
        const response = await fetch(`${apiBase}/recipes/${recipeId}`, {
          method: "DELETE",
          credentials: "include",
        });

        console.log("Full response:", response);

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ message: "Failed to parse error response" }));
          console.error("Delete error:", errorData);
          throw new Error(errorData.message || "Unknown error occurred");
        }

        const data = await response.json();
        console.log("Deletion successful:", data);
        return data;
      } catch (error) {
        console.error("Fetch error during deletion:", error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log("Deletion successful, removing recipe from UI");
      setRecipes(recipes.filter((recipe) => recipe.id !== id));
      setSuccessMessage("Recipe deleted successfully");
      queryClient.invalidateQueries("personalRecipes");

      setTimeout(() => setSuccessMessage(""), 2000);
    },
    onError: (error) => {
      console.error("Error in delete mutation:", error.message);
      setErrorMessage(error.message || "Something went wrong during deletion");
      setTimeout(() => setErrorMessage(""), 3000);
    },
  });

  const handleEditingRedirect = () => {
    if (!id) return;
    navigate(`/edit/${id}`);
  };

  const handleDelete = () => {
    if (!id) {
      setErrorMessage("Recipe ID is missing!");
      return;
    }

    console.log("Initiating delete for recipe with ID:", id);
    mutate(id);
  };

  return (
    <div className="recipes">
      <div className="recipe-preview">
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <div className="recipe-header">
          <h2 className="recipe-title">{title}</h2>
        </div>
        {imageUrl && (
          <img src={imageUrl} alt={title} className="recipe-preview-image" />
        )}

        <p className="recipe-excerpt">{description}</p>
        <p className="recipe-excerpt">{category}</p>

        <div className="recipe-actions">
          <button className="update-button" onClick={handleEditingRedirect}>
            <span>Update</span>
          </button>
          <button
            className="delete-button"
            disabled={isLoading}
            onClick={handleDelete}
          >
            <span>{isLoading ? "Please wait..." : "Delete"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default PersonalRecipePreview;
