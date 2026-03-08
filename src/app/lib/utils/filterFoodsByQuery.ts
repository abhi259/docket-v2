export const filterFoodsByQuery = (foods: any[], query: string) => {
    return foods.filter((food) => {
        return food.name.toLowerCase().includes(query.toLowerCase()) ||
        food.category.toLowerCase().includes(query.toLowerCase()) ||
        food.description.toLowerCase().includes(query.toLowerCase()) ||
        food.ingredients.some((ingredient: string) =>
            ingredient.toLowerCase().includes(query.toLowerCase()),
        );
    });
};