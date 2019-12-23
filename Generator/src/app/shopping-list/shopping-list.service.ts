import {Ingrediant, Salary, BusinessPolicyRule, Parameter} from "../shared/ingrediant.model";
import {Subject} from "rxjs";

export class ShoppingListService{
  private ingrediants : Ingrediant[] = [
    new Ingrediant('Apples',5),
    new Ingrediant('Tomatoes',10)
  ];

  private salaries : Salary[] = [
    new Salary(30000),
    new Salary(40000)
  ];

  constructor(){
    let businessRule01 =
      {
        businessRule_Name:'calculateGrossSalary',
        businessRule_function_Name: 'add',
        paramArray:[
          //new Parameter('basicSalary','attribute'),new Parameter('DA','attribute')
          {parameter_Name:'basicSalary',parameter_Type:'attribute', businessRule:null,parameter_Value:''},
          {parameter_Name:'DA',parameter_Type:'attribute', businessRule:null,parameter_Value:''},
          {parameter_Name:'grossSalary',parameter_Type:'write', businessRule:null,parameter_Value:''}
        ],
        returnValue:null,
      };
    let businessRule02 =
      {
        businessRule_Name:'calculateAllowanceFixed',
        businessRule_function_Name: 'multiply',
        paramArray:[
          //new Parameter('calculateGrossSalary', 'businessrule', businessRule01),
          {parameter_Name:'calculateGrossSalary',parameter_Type:'businessrule', businessRule:businessRule01,parameter_Value:null},
          new Parameter('multiplier', 'value', null, 0.3),
          new Parameter('allowanceFixed', 'write')
        ],
        returnValue:null,
      };
    BusinessPolicyRule.execRule([{basicSalary:40000,allowanceFixed:0, DA:200,grossSalary:0}],businessRule02);
  }

  getIngrediants(){
    //this.salaries[0].calculateAllowanceFixed();
    //new Parameter('grossSalary','attribute')
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
