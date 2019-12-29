import {Subject} from "rxjs";

import {Ingrediant} from "../shared/ingrediant.model";

export class ShoppingListService{
  private ingrediants : Ingrediant[] = [
    new Ingrediant('Apples',5),
    new Ingrediant('Tomatoes',10)
  ];


  constructor(){
  }

  getIngrediants(){
    return this.ingrediants.slice();
  }

  getIngrediant(index:number){
    return this.ingrediants[index];
  }

  deleteIngredient(index:number){
    this.ingrediants.splice(index, 1);
    this.ingredientsChanged.next(this.ingrediants.slice());
  }

  addIngrediant(ingrediant: Ingrediant){
    this.ingrediants.push(ingrediant);
    this.ingredientsChanged.next(this.ingrediants.slice());
  }

  editIngrediant(index: number, newIngredient: Ingrediant) {
    this.ingrediants[index] = newIngredient;
    this.ingredientsChanged.next(this.ingrediants.slice());
  }

  addIngrediantsToShoppingList(ingrediants: Ingrediant[]){
    this.ingrediants.push(...ingrediants);
  }
  onIngrediantAdded = new Subject<void>();
  onIngrediantEdited = new Subject<number>();
  ingredientsChanged = new Subject<Ingrediant[]>();

}
