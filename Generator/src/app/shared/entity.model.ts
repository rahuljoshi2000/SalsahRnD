
import {Subject} from "rxjs";
export class Entity {
  constructor(
    public entity_ID:string='',
    public entity_Name:string='',
    //public entity_Dispaly_Type:string, // Text, TextArea, DatePicker, Dropdown, Search --> should have one associated control for it?
    //public entity_Data_Type:string, // numeric, string, datetime,
    public entity_Group:string='', // entity
    public child_Entity:Entity[]=[],
    public entityPropertyArray: EntityProperty[]=[],
  ){}
}

export class EntityProperty {
  constructor(
    public entity_property_ID:string='',
    public entity_property_Name:string='',
    public entity_property_Group:string='', // entity
    public entity_property_validation_rule: string='', // used for input validation
    public entity_property_business_rule: string='', // used for calculation, even for dropdowns it will bring out values based on filtering criteria
    public entity_property_Display_Type:string='', // Text, TextArea, DatePicker, Radio, Checkbox, Dropdown, Search --> should have one associated control for it?
    public entity_property_Data_Type:string='', // numeric, string, datetime, BISON, JSON
    public entity_property_Html:string='', // HTML template url
    //    public onChange = new Subject<any>(),
    //    public onFocus = new Subject<void>(),
  ){

  }


  // subscribeEvent(eventEmitter: Subject<any>){
  //   eventEmitter.subscribe(
  //     (value: any) => {
  //
  //     }
  //   )
  // }
  //
  // unSubscribeEvent(eventEmitter: Subject<any>){
  //   eventEmitter.unsubscribe();
  // }
  //
  //
  // onChange(value:any, eventEmitter: Subject<any>){
  //   eventEmitter.next(value);
  // }

}

export class Parameter{

  constructor(
    public parameter_Name:string,
    public parameter_Type:string,
    public businessRule:string='',
    public parameter_Value:any=null,
    public parameter_Direction:string='read',
  ){}
}

export class BusinessPolicy{
  public businessPolicyRuleArray:BusinessRule[]=[];
  constructor(){
    //this.businessPolicyRuleArray
  }

  addBusinessRule(addBusinessRule:BusinessRule){
    this.businessPolicyRuleArray.push(addBusinessRule);
  }
}

export class BusinessRule{
  constructor(
    public businessRule_Name:string,
    public businessRule_function_Name:string,
    public paramArray: Parameter[]=[], // entity property name or business rule name
    //public returnValueType: string,
    public returnValue: any[]=[], // array of string, number, date, boolean supported for now.
  ){
  }

  // getBusinessRuleValue():any{
  //     if (this.returnValue.length >= 1 &&  this.returnValue[0]){
  //         return  this.returnValue[0];
  //     }
  //     return null;
  // }
}

