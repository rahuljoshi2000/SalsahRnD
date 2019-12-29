
import {BusinessPolicy, BusinessRule, Parameter, Entity, EntityProperty} from "../entity.model";
import {Subject} from "rxjs";

const maxEntity:number=1000;

export class EntityService{
  private businessPolicy: BusinessPolicy;
  private entityArray: Entity[];
  private eventEmitterArray:  Subject<any>[];

  constructor(){
    this.businessPolicy = new BusinessPolicy();
    this.entityArray = Entity[maxEntity];
    this.addSampleData();
  }

  private addSampleData(){
    let businessRule01:BusinessRule =
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

    let businessRule02:BusinessRule =
      {
        businessRule_Name:'calculateAllowanceFixed',
        businessRule_function_Name: 'multiply',
        paramArray:[
          //new Parameter('calculateGrossSalary', 'businessrule', businessRule01),
          {parameter_Name:'calculateGrossSalary',parameter_Type:'businessrule', businessRule:businessRule01,parameter_Value:null},
          new Parameter('multiplier', 'value', null, 0.3),
          new Parameter('allowanceFixed', 'write', null, null)
        ],
        returnValue:null,
      };

    this.businessPolicy.addBusinessRule(businessRule01);
    this.businessPolicy.addBusinessRule(businessRule02);
    this.execRule([{basicSalary:40000,allowanceFixed:0, DA:200,grossSalary:0}], businessRule02);
  }

  public addParameter(paramAdd: Parameter, policyRule: BusinessRule){
    policyRule.paramArray.push(paramAdd);
    return null;
  }

  public addEntity(entityAdd: Entity){
    this.entityArray.push(entityAdd);
  }

  public addEntityProperty(entityAdd: Entity, entityPropertyAdd: EntityProperty){

    let subjectProperty: Subject<any>;
    subjectProperty = new Subject<any>();
    entityPropertyAdd.subscribeEvent(subjectProperty);
    this.eventEmitterArray.push(subjectProperty);
    entityAdd.addEntityProperty(entityPropertyAdd);
  }

  public execRule(thisObjectArray:any[], policyRule: BusinessRule){
    let numbReturn:any[];
    let valueParam: number[]=[0];
    let returnParam:Parameter=null;
    let indexParam = 0;
    //let policyRule: BusinessRule = this;

    console.log("Entering Rule : " + policyRule.businessRule_Name);

    for(let thisObject of thisObjectArray.slice()){
      for(let pararamEach of policyRule.paramArray.slice()){
        if (pararamEach.parameter_Type === 'businessrule'){
          this.execRule([thisObject], pararamEach.businessRule);
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

}
