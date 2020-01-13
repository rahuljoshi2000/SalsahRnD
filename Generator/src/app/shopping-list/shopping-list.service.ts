import {Subject} from "rxjs";
import {Injectable} from "@angular/core";

import {Ingrediant} from "../shared/ingrediant.model";
import {EntityService} from "../shared/services/entity.service";
import {SessionService} from "../shared/services/session.service";
import {BusinessService} from "../shared/services/business.service";
import {BusinessRule, Entity, EntityProperty} from "../shared/entity.model";

@Injectable()
export class ShoppingListService{
  private ingrediants : Ingrediant[] = [
    new Ingrediant('Apples',5),
    new Ingrediant('Tomatoes',10)
  ];


  constructor(private entityService: EntityService, private sessionService: SessionService , private businessService: BusinessService){

    let thisObject:any;
    let thisSessionObject:any;
    //let businessRule02:BusinessRule = this.entityService.getBusinessRule('calculateAllowanceFixed');
    this.businessService.setSampleBusinessRule();

    let entityEmployee:Entity = this.entityService.getEntity('Employee'); //new Entity('','Salary','basic');
    thisObject = this.businessService.generateEntityData(entityEmployee);
    console.log(thisObject);

    thisSessionObject = this.sessionService.generateSessionData();

    //this.entityService.sessionData = thisSessionObject;
    //this.entityService.sessionEntity = entitySession;

    console.log(thisSessionObject);
    //{basicSalary:40000,allowanceFixed:0, DA:200,grossSalary:0}
    this.sessionService.extractAndExecuteRule([thisObject], entityEmployee, thisSessionObject);
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
