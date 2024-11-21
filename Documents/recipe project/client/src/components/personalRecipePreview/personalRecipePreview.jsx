import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import './personalRecipePreview.css';
import apiBase from '../../utils/api';
import usePersonalRecipesStore from '../../store/personalRecipeStore';

function PersonalRecipePreview({ id, title, imageUrl, category, cookingTime }) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const recipes = usePersonalRecipesStore((state) => state.recipes);
    const setRecipes = usePersonalRecipesStore((state) => state.setRecipes);

    const [isDeleting, setIsDeleting] = useState(false);

    const { mutate } = useMutation({
        mutationKey: ['deletedRecipe', id],
        mutationFn: async () => {
            setIsDeleting(true);
            const response = await fetch(`${apiBase}/recipes/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to delete recipe");
            }
            setIsDeleting(false);
        },
        onSuccess: () => {
            setRecipes(recipes.filter((recipe) => recipe.id !== id));
            queryClient.invalidateQueries('personalRecipes'); // Refresh cache
        },
        onError: (error) => {
            console.error("Delete failed:", error.message);
            setIsDeleting(false);
        }
    });

    const handleEdit = () => {
        navigate(`/edit/${id}`);
    };

    const handleDelete = () => {
        mutate();
    };

    return (
        <div className="recipe-card">
            <h2 className="recipe-title">{title}</h2>
            {imageUrl && (
        <img src={imageUrl} alt={title} className="recipe-preview-image" />
           )}
            <p className="recipe-category">Category: {category}</p>
            <p className="recipe-time">Cooking Time: {cookingTime} mins</p>
            <div className="recipe-actions">
                <button className="update-button" onClick={handleEdit}>
                    Update
                </button>
                <button
                    className="delete-button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                >
                    {isDeleting ? "Deleting..." : "Delete"}
                </button>
            </div>
        </div>
    );
}

export default PersonalRecipePreview;

