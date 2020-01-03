import {Subject} from "rxjs";
import {Injectable} from "@angular/core";

import {Ingrediant} from "../shared/ingrediant.model";
import {EntityService} from "../shared/services/entity.service";
import {BusinessRule, Entity, EntityProperty} from "../shared/entity.model";

@Injectable()
export class ShoppingListService{
  private ingrediants : Ingrediant[] = [
    new Ingrediant('Apples',5),
    new Ingrediant('Tomatoes',10)
  ];


  constructor(private entityService: EntityService){

    let thisObject:any;
    let thisSessionObject:any;
    //let businessRule02:BusinessRule = this.entityService.getBusinessRule('calculateAllowanceFixed');
    this.entityService.setSampleBusinessRule();
    let entity:Entity = this.entityService.getEntity('Salary'); //new Entity('','Salary','basic');
    thisObject = this.entityService.generateEntityData(entity);
    console.log(thisObject);

    let entitySession:Entity = this.entityService.getEntity('Session'); //new Entity('','Salary','basic');
    thisSessionObject = this.entityService.generateSessionData(entitySession);
    console.log(thisSessionObject);
    //{basicSalary:40000,allowanceFixed:0, DA:200,grossSalary:0}
    this.entityService.extractRule([thisObject], entity);
    console.log(thisObject);
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
