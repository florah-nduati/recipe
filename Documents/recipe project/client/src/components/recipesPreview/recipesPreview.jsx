import React from 'react';
import { useQuery } from 'react-query';
import PersonalRecipePreview from '../personalRecipePreview/personalRecipePreview';
import { Link } from 'react-router-dom';
import apiBase from '../../utils/api';
import usePersonalRecipesStore from '../../store/personalRecipeStore';

function PersonalRecipesPreview() {
    const recipes = usePersonalRecipesStore((state) => state.recipes);
    const setRecipes = usePersonalRecipesStore((state) => state.setRecipes);

    const { isLoading, isError, error } = useQuery({
        queryKey: ["personalRecipes"],
        queryFn: async () => {
            const response = await fetch(`${apiBase}/recipes/user`, { credentials: "include" });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch recipes");
            }
            return await response.json();
        },
        onSuccess: (data) => {
            if (Array.isArray(data)) {
                setRecipes(data);
            } else {
                setRecipes([]); // Ensure no crash if response isn't an array
            }
        }
    });

    if (isLoading) {
        return <h2 className="loading">Loading...</h2>;
    }

    if (isError) {
        return <h2 className="error">{error.message}</h2>;
    }

    if (!recipes || recipes.length === 0) {
        return (
            <div className="no-recipes">
                <h3>You don't have any recipes</h3>
                <Link to="/create" className="create-link">Create one</Link>
            </div>
        );
    }

    return (
        <React.Fragment>
            <h2 className="header">Your Personal Recipes</h2>
            <div className="recipes-container">
                {recipes.map((recipe) => (
                    <PersonalRecipePreview
                        key={recipe.id}
                        id={recipe.id}
                        title={recipe.title}
                        imageUrl={recipe.imageUrl}
                        category={recipe.category}
                        cookingTime={recipe.cookingTime}
                    />
                ))}
            </div>
        </React.Fragment>
    );
}

export default PersonalRecipesPreview;

