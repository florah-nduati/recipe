import React from "react";
import PersonalRecipesPreview from "../../components/recipesPreview/recipesPreview";
import PersonalRecipePreview from "../../components/personalRecipePreview/personalRecipePreview";

function Recipes() {
  return (
    <div className="recipe">
      <PersonalRecipesPreview />
      <PersonalRecipePreview />
    </div>
  );
}

export default Recipes;
