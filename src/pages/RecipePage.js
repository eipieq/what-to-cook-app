import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { databases, DATABASE_ID, RECIPES_COLLECTION_ID, INGREDIENTS_COLLECTION_ID, RECIPE_INGREDIENTS_COLLECTION_ID } from '../appwrite'
import { Query } from 'appwrite';
import '../styles/RecipePage.css';
import Navigation from '../components/Navigation';
import { ChefHatIcon, XIcon, ImageIcon } from '@phosphor-icons/react';

const RecipePage = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [ingredients, setIngredients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showIngredients, setShowIngredients] = useState(false);

    useEffect(() => {
        fetchRecipeData();
    }, [id]);

    const fetchRecipeData = async () => {
        try {
            setLoading(true);

            const recipeResponse = await databases.getDocument(
                DATABASE_ID,
                RECIPES_COLLECTION_ID,
                id
            );

            const recipeIngredientsResponse = await databases.listDocuments(
                DATABASE_ID,
                RECIPE_INGREDIENTS_COLLECTION_ID,
                [Query.equal('recipeId', id)] // using query for all records where recipeId matches our recipe
            );

            const IngredientPromises = recipeIngredientsResponse.documents.map(async (recipeIngredient) => {
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
                    console.error(`Error fetching ingredient ${recipeIngredient.ingredientId}:`, ingredientError);
                    return {
                        name: `Unknown Ingredient (${recipeIngredient.ingredientId})`,
                        quantity: recipeIngredient.quantity,
                        unit: recipeIngredient.unit,
                        notes: recipeIngredient.notes
                    };
                }
            });

            const ingredientsData = await Promise.all(IngredientPromises);

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
    if (!recipe) return <div className="not-found">Recipe not found</div>;

    return (
        <div className='main-recipe'>
            <Navigation />
            <div className='recipe'>
                <h1>{recipe.title}</h1>
                <div className='recipe-meta'>
                    <img className='recipe-image' src={recipe.imageURL} alt={recipe.title} />
                    <div className='stats'>
                        <div className='stat-clip'>
                            <img src='/icons/clock.png' />
                            <p>{recipe.totalTime} <span>minutes</span></p>
                        </div>
                        <div className='stat-clip'>
                            <img src='/icons/serving-dish.png' />
                            <p>{recipe.servings} <span>servings</span></p>
                        </div>
                        <div className='stat-clip'>
                            <img src='/icons/fresh-leaves.png' />
                            <p><span>fresh and healthy</span></p>
                        </div>
                    </div>
                    <div>
                        <p className='description'>{recipe.description}</p>
                    </div>

                    {!showIngredients && (
                        <div className='section1'>
                        <div className='CTA'>
                            <button
                                className='button button--primary'
                                onClick={() => setShowIngredients(true)}
                            >
                                <ChefHatIcon />
                                I'll cook this!
                            </button>
                            <button
                                className='button button--secondary-2ndary'
                            >
                                <XIcon />
                            </button>
                        </div>
                        </div>
                    )}

                    {showIngredients && (
                        <div className='section-accept'>
                            <div className='CTA'>
                                <button
                                className='button button--secondary'
                                >
                                    Read Recipe
                                </button>
                                <button
                                    className='button button--secondary'
                                >
                                    Watch Video
                                </button>
                                <button
                                className='button button--primary'
                                >
                                    <ImageIcon />
                                    Share Your Cooking!
                                </button>
                            </div>
                            <div className='ingredients-section'>
                                <h2>Ingredients</h2>
                                <ul className='ingredients-list'>
                                    {ingredients.map((ingredient, index) => (
                                        <li key={index} className='ingredient-item'>
                                            <span className='ingredient-amount'>
                                                {ingredient.quantity} {ingredient.unit}
                                            </span>
                                            <span className='ingredient-name'>{ingredient.name}</span>
                                            {ingredient.notes && (
                                                <span className='ingredient-notes'>({ingredient.notes})</span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

};

export default RecipePage;