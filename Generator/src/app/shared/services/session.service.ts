import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {BusinessPolicy, BusinessRule, Parameter, Entity, EntityProperty} from "../entity.model";
import {EntityService, entityBusinessRule} from "./entity.service";
import {BusinessService} from "./business.service";

const maxEntity:number=1000;

@Injectable()
export class SessionService{
  private sessionData:any;
  private sessionEntity:Entity;
  private currentLoggedInUser:string = 'SahilJoshi';
  constructor(private entityService:EntityService, private businessService:BusinessService){
    this.sessionEntity = this.entityService.getEntity('Session'); //new Entity('','Salary','basic');
    this.sessionData =  this.generateSessionData();
  }
  generateSessionData(){
    let thisObject:any;
    let thisObjectUser:any;
    let thisObjectConfig:any;
    let thisObjectSC:any;
    let thisObjectRoles:any;
    let entity:Entity = this.sessionEntity;

    thisObject = this.entityService.getEntityObject(entity, true);
    //this.rootEntity.child_Entity.push(thisObject);

    let entityUser:Entity = this.entityService.getEntity('User'); //new Entity('','Salary','basic');

    let entityRoles:Entity = this.entityService.getEntity('Roles'); //new Entity('','Salary','basic');

    let entityConfig:Entity = this.entityService.getEntity('SystemConfiguration'); //new Entity('','Salary','basic');
    thisObjectConfig = this.entityService.getEntityObject(entityConfig, true);
    this.entityService.setEntityPropertyValue(thisObjectConfig, entityConfig,'multiplierAllowanceFixed',0.3,0);
    this.entityService.setEntityPropertyValue(thisObjectConfig, entityConfig,'maxAllowanceFixed',2500,0);
    this.entityService.setEntityPropertyValue(thisObjectConfig, entityConfig,'superUserRole',['SU','SA'],0);

    this.entityService.setChildValue(entity, thisObject, 'SystemConfiguration', thisObjectConfig);

    let sessionContext:Entity = this.entityService.getEntity('SessionContext'); //new Entity('','Salary','basic');
    thisObjectSC = this.entityService.getEntityObject(sessionContext, true);
    this.entityService.setEntityPropertyValue(thisObjectSC, sessionContext,'currentLoggedInUser','SahilJoshi',0);


    this.entityService.setChildValue(entity, thisObject, 'SessionContext', thisObjectSC);

    thisObjectUser = this.entityService.getEntityObject(entityUser, true);
    this.entityService.setEntityPropertyValue(thisObjectUser, entityUser,'userName','RahulJoshi',0);
    this.entityService.setEntityPropertyValue(thisObjectUser, entityUser,'userEmail','rahul.joshi@abc.com',0);

    thisObjectRoles = this.entityService.getEntityObject(entityRoles, true);
    this.entityService.setEntityPropertyValue(thisObjectRoles, entityRoles,'roleName','Admin',0);

    this.entityService.setChildValue(entityUser, thisObjectUser, 'Roles', thisObjectRoles);

    thisObjectRoles = this.entityService.getEntityObject(entityRoles, true);
    this.entityService.setEntityPropertyValue(thisObjectRoles, entityRoles,'roleName','FA',1);

    this.entityService.setChildValue(entityUser, thisObjectUser, 'Roles', thisObjectRoles);

    this.entityService.setChildValue(entity, thisObject, 'User', thisObjectUser);

    thisObjectUser = this.entityService.getEntityObject(entityUser, true);
    this.entityService.setEntityPropertyValue(thisObjectUser, entityUser,'userName','SahilJoshi',1);

    this.entityService.setEntityPropertyValue(thisObjectUser, entityUser,'userEmail','sahil.joshi@abc.com',1);

    thisObjectRoles = this.entityService.getEntityObject(entityRoles, true);
    this.entityService.setEntityPropertyValue(thisObjectRoles, entityRoles,'roleName','SA',0);

    this.entityService.setChildValue(entityUser, thisObjectUser, 'Roles', thisObjectRoles);

    this.entityService.setChildValue(entity, thisObject, 'User', thisObjectUser);


    return thisObject;
  }

  public getSessionConfigurationData(propertyName:string){
    let returnObject:any;
    let thisObject:any;
    let entity:Entity;

    thisObject = this.sessionData;
    entity = this.sessionEntity;
    returnObject = this.entityService.getEntityPropertyValue(thisObject, entity, propertyName);
    return returnObject;
  }
  public getSessionUserData(thisObject:any, propertyName:string){
    let returnObject:any[];
    let thisUserObject:any;
    let entity:Entity;
    let thisUserEntity:Entity;

    thisObject = this.sessionData;
    entity = this.sessionEntity;
    thisUserEntity = entity; //this.entityService.getEntity("User");
    thisUserObject = thisObject; //this.getLoggedInUserData(thisObject);
    returnObject = this.entityService.getEntityPropertyValues(thisUserObject, thisUserEntity, propertyName, undefined);
    return returnObject;
  }
  public getLoggedInUserData(thisObject:any){
    let returnObject:any[];
    //let thisObject:any;
    let entity:Entity;

    thisObject = this.sessionData;
    entity = this.sessionEntity;
    returnObject = this.entityService.getEntityByPropertyValue(thisObject, entity, 'userName', this.currentLoggedInUser);
    return returnObject;
  }

  public extractAndExecuteRule(thisObjectArray:any[], entity: Entity, sessionObject:any){
    this.sessionData = sessionObject;

    for(let thisObject of thisObjectArray.slice()) {
      for (let entityBusinessRuleNode of this.entityService.getEntityBusinessRuleFromEntity(thisObject, entity)){
        this.execRule(entityBusinessRuleNode.entityThis, this.businessService.getBusinessRule(entityBusinessRuleNode.businessRuleName));
      }
    }
  }

  private execRule(thisObject:any, policyRule: BusinessRule){
    let numbReturn:any[]=[];
    let valueParam: any[]=[];
    let returnParam:Parameter=null;
    let indexParam = 0;

    for(let pararamEach of policyRule.paramArray.slice()) {
      if (pararamEach.parameter_Type === 'businessrule') {
        let businessRule:BusinessRule = this.businessService.getBusinessRule(pararamEach.businessRule);

        this.execRule(thisObject, businessRule);
        valueParam[indexParam] = businessRule.returnValue[0];
      }
      else if(pararamEach.parameter_Type === 'configuration') {
        let paramValue = this.getSessionConfigurationData(pararamEach.parameter_Name);
        valueParam[indexParam] = paramValue;
        //console.log(pararamEach.parameter_Name);
        //console.log(paramValue);
      }
      else if(pararamEach.parameter_Type === 'value') {
        //let paramValue = this.getSessionConfigurationData(pararamEach.parameter_Name);
        valueParam[indexParam] = pararamEach.parameter_Value;
        //console.log(pararamEach.parameter_Name);
        //console.log(paramValue);
      }
      else if(pararamEach.parameter_Type === 'attribute' &&  pararamEach.parameter_Direction === 'write') {
        returnParam = pararamEach;
      }
      else{
        //console.log(pararamEach.parameter_Name);
        //console.log(thisObject[pararamEach.parameter_Name]);
        if (thisObject[pararamEach.parameter_Name] != undefined){
          valueParam[indexParam] = thisObject[pararamEach.parameter_Name];
        }
        else{
          //console.log("Checking in session");
          let paramValue:any[] = this.getSessionUserData(null ,pararamEach.parameter_Name);
          if (paramValue != undefined && paramValue.length > 0){
            valueParam[indexParam] = paramValue;
          }
          //console.log(pararamEach.parameter_Name);
          //console.log(paramValue);
        }
      }
      indexParam++;
    }
    numbReturn = this.businessService.callRuleFunction(policyRule, valueParam);
    if (returnParam) {
      thisObject[returnParam.parameter_Name] = numbReturn[0];
    }
    policyRule.returnValue = numbReturn;
  }

}
