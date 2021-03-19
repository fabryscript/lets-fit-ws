import { createSelector, createSlice } from "@reduxjs/toolkit";
import { IngredientModel } from "../../models/IngredientModel";

const slice = createSlice({
  name: "ingredients",
  initialState: [],
  reducers: {
    addIngredient: (ingredients: any, action) => {
      const payload: IngredientModel = action.payload;
      const { name, macronut, phase, price, vegan, vegetarian, imageURI } = payload;
      ingredients.push({
        name,
        macronut,
        phase,
        price,
        vegan,
        vegetarian,
        imageURI
      });
    },
    removeAllIngredients: (ingredients: any) => {
      ingredients.length = 0;
    }
  },
});

export const { addIngredient, removeAllIngredients } = slice.actions;

export default slice.reducer;

export const getCurrentIngredients = createSelector(
  (state: any) => state.ingredients,
  (ingredients: any[]) => ingredients.map((ingredient) => ingredient)
);