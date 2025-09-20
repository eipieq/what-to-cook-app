import { Client, Databases } from 'appwrite';

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('what-to-cook');

export const databases = new Databases(client);

export const DATABASE_ID = 'main';
export const RECIPES_COLLECTION_ID = 'recipes';
export const INGREDIENTS_COLLECTION_ID = 'ingredients';
export const RECIPE_INGREDIENTS_COLLECTION_ID = 'recipeingredients';