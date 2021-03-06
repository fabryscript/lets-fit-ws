import { createSelector, createSlice } from "@reduxjs/toolkit";
import { IngredientModel } from "../../models/IngredientModel";

const slice = createSlice({
  name: "ingredients",
  initialState: [],
  reducers: {
    addIngredient: (ingredients: any, action) => {
      const payload: IngredientModel = action.payload;
      const { name, macronut, phase, price, vegan, vegetarian } = payload;
      ingredients.push({
        name,
        macronut,
        phase,
        price,
        vegan,
        vegetarian,
      });
    },
  },
});

export const { addIngredient } = slice.actions;

export default slice.reducer;

export const getCurrentIngredients = createSelector(
  (state: any) => state.ingredients,
  (ingredients: any[]) => ingredients.map((ingredient) => ingredient)
);
