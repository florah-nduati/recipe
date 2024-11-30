import { useQuery } from 'react-query';

function useFetchMealDB(searchQuery, filterCriteria) {
    const getApiUrl = () => {
        let apiUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`;
        if (filterCriteria.category) {
            apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${filterCriteria.category}`;
        }
        if (filterCriteria.area) {
            apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${filterCriteria.area}`;
        }
        return apiUrl;
    };

    const { isLoading, isError, error, data } = useQuery({
        queryKey: ["mealDBRecipes", searchQuery, filterCriteria],
        queryFn: async () => {
            const response = await fetch(getApiUrl());
            if (!response.ok) {
                throw new Error("Failed to fetch recipes from TheMealDB");
            }
            const data = await response.json();
            return data.meals || []; // Returns an array of meals or an empty array
        },
    });

    return {
        isLoading,
        isError,
        error,
        data,
    };
}

export default useFetchMealDB;
