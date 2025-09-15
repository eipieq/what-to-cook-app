import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { databases, DATABASE_ID, RECIPES_COLLECTION_ID, INGREDIENTS_COLLECTION_ID, RECIPE_INGREDIENTS_COLLECTION_ID } from '../appwrite';
import { Query } from 'appwrite';
import './RecipePage.css';

const RecipePage = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecipeData();
  }, [id]);

  const fetchRecipeData = async () => {
    try {
      setLoading(true);
      
      // Fetch recipe
      const recipeResponse = await databases.getDocument(
        DATABASE_ID,
        RECIPES_COLLECTION_ID,
        id
      );
      
      // Fetch recipe ingredients
      const recipeIngredientsResponse = await databases.listDocuments(
        DATABASE_ID,
        RECIPE_INGREDIENTS_COLLECTION_ID,
        [Query.equal('recipeId', id)]
      );
      
      // Fetch ingredient details for each recipe ingredient
      const ingredientPromises = recipeIngredientsResponse.documents.map(async (recipeIngredient) => {
        try {
          const ingredientResponse = await databases.getDocument(
            DATABASE_ID,
            INGREDIENTS_COLLECTION_ID,
            recipeIngredient.ingredientId
          );
          
          return {
            ...ingredientResponse,
            quantity: recipeIngredient.quantity,
            unit: recipeIngredient.unit,
            notes: recipeIngredient.notes
          };
        } catch (ingredientError) {
          console.error(`Failed to fetch ingredient ${recipeIngredient.ingredientId}:`, ingredientError);
          // Return placeholder data if ingredient fetch fails
          return {
            name: `Unknown ingredient (${recipeIngredient.ingredientId})`,
            quantity: recipeIngredient.quantity,
            unit: recipeIngredient.unit,
            notes: recipeIngredient.notes
          };
        }
      });
      
      const ingredientsData = await Promise.all(ingredientPromises);
      
      setRecipe(recipeResponse);
      setIngredients(ingredientsData);
      
    } catch (err) {
      setError(err.message);
      console.error('Error fetching recipe:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading recipe...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!recipe) return <div className="error">Recipe not found</div>;

  return (
    <div className="recipe-container">
      <div className="recipe-header">
        <h1 className="recipe-title">{recipe.title}</h1>
        <p className="recipe-description">{recipe.description}</p>
        
        <div className="recipe-meta">
          <div className="meta-item">
            <span className="meta-label">Prep Time:</span>
            <span className="meta-value">{recipe.prepTime} min</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Cook Time:</span>
            <span className="meta-value">{recipe.cookTime} min</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Total Time:</span>
            <span className="meta-value">{recipe.totalTime} min</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Servings:</span>
            <span className="meta-value">{recipe.servings}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Difficulty:</span>
            <span className="meta-value">{recipe.difficulty}/5</span>
          </div>
        </div>

        <div className="recipe-tags">
          <span className="tag cuisine-tag">{recipe.cuisineType}</span>
          <span className="tag meal-tag">{recipe.mealType}</span>
          {recipe.dietaryTags && recipe.dietaryTags.map((tag, index) => (
            <span key={index} className="tag dietary-tag">{tag}</span>
          ))}
        </div>
      </div>

      <div className="recipe-content">
        <div className="ingredients-section">
          <h2>Ingredients</h2>
          <ul className="ingredients-list">
            {ingredients.map((ingredient, index) => (
              <li key={index} className="ingredient-item">
                <span className="ingredient-amount">
                  {ingredient.quantity} {ingredient.unit}
                </span>
                <span className="ingredient-name">{ingredient.name}</span>
                {ingredient.notes && (
                  <span className="ingredient-notes">({ingredient.notes})</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="instructions-section">
          <h2>Instructions</h2>
          <div className="instructions">
            {recipe.instructions}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipePage;