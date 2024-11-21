import { create } from "zustand";

function personalRecipesStore(set) {
    return{
        recipes: [],

        setRecipes: (recipes) => {
            set((state) =>{
                return { recipes: recipes};
            });
        },
    };
}

const usePersonalRecipesStore = create (personalRecipesStore);
export default usePersonalRecipesStore;
