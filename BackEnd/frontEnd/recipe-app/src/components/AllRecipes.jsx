import React from 'react'
import axios from 'axios';
import { useState, useEffect } from 'react';
import { HiMiniHeart } from "react-icons/hi2";

function AllRecipes() {
      const [recipes, setRecipes] = useState([]);

      useEffect(() => {
        axios.get('http://localhost:5000/recipe')
            .then(response => {
              setRecipes(response.data);
            })
            .catch(error => {
              console.log(error);
            });
       
      }, [])
  return (
    <div className='recipes-container'>
        <h2>All Recipes</h2>
        <div className='carde-wrapper'>
         {recipes?.map((recipe, index) => (
            <div className='recipe-card' key={index}>
                <h4>{recipe?.title}</h4>
                <p>{recipe?.ingredients}</p>
                <small>{recipe?.instructions}</small>
                <div className='icons'>
                <HiMiniHeart />
                </div>
            </div>))}
    </div>
</div>
  )
}

export default AllRecipes