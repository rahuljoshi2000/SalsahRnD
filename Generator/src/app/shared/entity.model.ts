
import {Subject} from "rxjs";
export class Entity {
  constructor(
    public entity_ID:string='',
    public entity_Name:string='',
    //public entity_Dispaly_Type:string, // Text, TextArea, DatePicker, Dropdown, Search --> should have one associated control for it?
    //public entity_Data_Type:string, // numeric, string, datetime,
    public entity_Group:string='', // entity
    public child_Entity:Entity[]=null,
    public entityPropertyArray: EntityProperty[],
  ){}

  public addEntityProperty(entityProerty: EntityProperty){
      this.entityPropertyArray.push(entityProerty);
  }
  public getEntityProperty(propertyName: string):EntityProperty{
    let entityPropertyReturn:EntityProperty  = null;
    for(let propertyEntity of this.entityPropertyArray.slice()){
      if (propertyEntity.entity_property_Name === propertyName){
        entityPropertyReturn=  propertyEntity;
      }
    }
    if (entityPropertyReturn === null) {
      for(let nodeChild of this.child_Entity){
        entityPropertyReturn = nodeChild.getEntityProperty(propertyName);
      }
    }
    return entityPropertyReturn;
  }
}

export class EntityProperty {
  constructor(
    public entity_property_ID:string='',
    public entity_property_Name:string='',
    public entity_property_Display_Type:string='', // Text, TextArea, DatePicker, Radio, Checkbox, Dropdown, Search --> should have one associated control for it?
    public entity_property_Data_Type:string='', // numeric, string, datetime, BISON, JSON
    public entity_property_Group:string='', // entity
    public entity_property_Html:string='', // HTML template url
    public entity_property_validation_rule: BusinessRule=null, // used for input validation
    public entity_property_business_rule: BusinessRule=null, // used for calculation, even for dropdowns it will bring out values based on filtering criteria
    //    public onChange = new Subject<any>(),
    //    public onFocus = new Subject<void>(),
  ){

  }


  subscribeEvent(eventEmitter: Subject<any>){
    eventEmitter.subscribe(
      (value: any) => {

      }
    )
  }

  unSubscribeEvent(eventEmitter: Subject<any>){
    eventEmitter.unsubscribe();
  }

  onChange(eventEmitter: Subject<any>){
    eventEmitter.next(value);
  }
}

export class Parameter{

  constructor(
    public parameter_Name:string,
    public parameter_Type:string,
    public businessRule:BusinessRule=null,
    public parameter_Value:any=null,
  ){}
}

export class BusinessPolicy{
  private businessPolicyRuleArray:BusinessRule[];
  constructor(){}
  addBusinessRule(addBusinessRule:BusinessRule){
    this.businessPolicyRuleArray.push(addBusinessRule);
  }
}

export class BusinessRule{
  constructor(
    public businessRule_Name:string,
    public businessRule_function_Name:string,
    public paramArray: Parameter[], // entity property name or business rule name
    //public returnValueType: string,
    public returnValue: any[]=null, // array of string, number, date, boolean supported for now.
  ){
  }
}

export class Salary{
  constructor(
    public basicSalary:number,  //
    public dearnessAllowance:number=0, //
    public allowanceFixed:number=0, // 30% of basic and maximum 1,00,000
    public grossSalary:number=0, // basic+DA+allowanceFixed
    public allowanceVariable:number=0, // 15% of basic + DA and maximum 40,000. It is paid based on performance.
    public employeePF:number=0, //12% of Basic + DA : deduction
    public esi:number=0, //1.45% of gross salary : deduction
    public professionalTax:number=0, //5% of basic + DA : deduction
    public deductions:number=0, //all deductions
    public netSalary:number=0, // grossSalary - deductions
    public noOfLeaves:number=0,
    public monthLOP:number=0 // (grossSalary / noOfDaysOfMonth) * noOfLeaves for current month, noOfDaysOfMonth: coming from calendar table, noOfLeaves coming from leaves table
  ){}


  calculateAllowanceFixed(){
    this.allowanceFixed = Math.abs(this['basicSalary'] * 0.3);
    console.log(this.allowanceFixed);
  }

  validateAllowanceFixed():boolean{
    let notValid:boolean;
    notValid = this.lessThanOrEqualTo(this.allowanceFixed ,0);
    notValid = notValid || this.greaterThan(this.allowanceFixed , 100000);
    return !notValid;
  }

  lessThanOrEqualTo(inputNumber:number, compareValue:number){
    return inputNumber <= compareValue;
  }
  greaterThanOrEqualTo(inputNumber:number, compareValue:number){
    return inputNumber >= compareValue;
  }

  greaterThan(inputNumber:number, compareValue:number){
    return inputNumber > compareValue;
  }
}
