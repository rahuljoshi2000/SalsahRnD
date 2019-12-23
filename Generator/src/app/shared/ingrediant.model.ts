export class Ingrediant{
  constructor(public name: string
    , public amount:number){}
}

export class Entity {
  constructor(
    public entity_ID:string='',
    public entity_Name:string='',
    //public entity_Dispaly_Type:string, // Text, TextArea, DatePicker, Dropdown, Search --> should have one associated control for it?
    //public entity_Data_Type:string, // numeric, string, datetime,
    public entity_Group:string='', // entity
    public parent_entity_ID:string='',
    public entityProperty: EntityProperty[],
  ){}
}

export class EntityProperty {
  constructor(
    public entity_property_ID:string='',
    public entity_property_Name:string='',
    public entity_property_Dispaly_Type:string='', // Text, TextArea, DatePicker, Dropdown, Search --> should have one associated control for it?
    public entity_property_Data_Type:string='', // numeric, string, datetime, BISON, JSON
    public entity_property_Group:string='', // entity
    public entity_property_validation_rule: BusinessPolicyRule=null, // used for input validation
    public entity_property_business_rule: BusinessPolicyRule=null, // used for calculation, even for dropdowns it will bring out values based on filtering criteria
  ){}
}

export class Parameter{
  constructor(
    public parameter_Name:string,
    public parameter_Type:string,
    public businessRule:BusinessPolicyRule=null,
    public parameter_Value:any=null,
  ){}
}
export class BusinessPolicyRule{
  constructor(
    public businessRule_Name:string,
    public businessRule_function_Name:string,
    public paramArray: Parameter[], // entity property name or business rule name
    //public returnValueType: string,
    public returnValue: any[]=null, // array of string, number, date, boolean supported for now.
  ){}

  public static execRule(thisObjectArray:any[], policyRule: BusinessPolicyRule){
    let numbReturn:any[];
    let valueParam: number[]=[0];
    let returnParam:Parameter=null;
    let indexParam = 0;

    console.log("Entering Rule : " + policyRule.businessRule_Name);

    for(let thisObject of thisObjectArray.slice()){
        for(let pararamEach of policyRule.paramArray.slice()){
          if (pararamEach.parameter_Type === 'businessrule'){
            BusinessPolicyRule.execRule([thisObject], pararamEach.businessRule);
          }
        }
        for(let pararamEach of policyRule.paramArray.slice()) {
          if (pararamEach.parameter_Type === 'businessrule') {
            valueParam[indexParam] = pararamEach.businessRule.returnValue[0];
            //console.log("Rule Return : " + pararamEach.businessRule.returnValue[0]);
          }
          else if(pararamEach.parameter_Type === 'value') {
            valueParam[indexParam] = pararamEach.parameter_Value;
          }
          else if(pararamEach.parameter_Type === 'write') {
            returnParam = pararamEach;
          }
          else{
            valueParam[indexParam] = thisObject[pararamEach.parameter_Name];
          }
          indexParam++;
        }
        switch(policyRule.businessRule_function_Name){
           case 'add':
             numbReturn = [0];
             numbReturn[0] = Math.abs(valueParam[0] + valueParam[1]);
             //thisObject[policyRule.paramArray[2].parameter_Name]=numbReturn[0];
             break;
           case 'multiply':
             numbReturn = [0];
             numbReturn[0] = Math.abs(valueParam[0] * valueParam[1]);
             //console.log(numbReturn[0]);
             //policyRule.returnValue = numbReturn;
             break;
        }
        if (returnParam) {
          thisObject[returnParam.parameter_Name] = numbReturn[0];
        }
        policyRule.returnValue = numbReturn;
        console.log(policyRule);
    }
  }

  public static add(){

  }
}

export class UtilityFunctions{
  constructor(
    public businessRule_function_Name:string,
    //public functionToCall:
  ){}


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
