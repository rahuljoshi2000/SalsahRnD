
import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {ShoppingListService} from "../shopping-list/shopping-list.service";
import {Ingrediant} from "../shared/ingrediant.model";
import {Recipe} from "./recipe.model";

@Injectable()
export class RecipeService {
  private recipes: Recipe[] = [
    new Recipe(
      'Burger'
      ,'Burger'
      ,'https://www.seriouseats.com/recipes/images/2017/06/20170617-bulgogi-burger-matt-clifton-1.jpg'
      ,[new Ingrediant('mango',10), new Ingrediant('cauliflower',2)]
    ),
    new Recipe(
      'Pasta'
      ,'Pasta'
      ,'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT76pYaTHNZFPDBFs_ZrNeBAtBSgasgoll7sM26JrqzGM0g39gw'
      ,[new Ingrediant('pepper',10), new Ingrediant('zuchini',2)]
    )
  ];

  constructor(private shoppingListService: ShoppingListService){}

  getRecipes(){
    return this.recipes.slice();
  }

  getRecipe(recipeId: number){
    return this.recipes[recipeId];
  }
  onItemSelection = new Subject<Recipe>();

  addIngrediantsToShoppingList(ingrediants: Ingrediant[]){
    this.shoppingListService.addIngrediantsToShoppingList(ingrediants);
  }
}
