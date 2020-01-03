
import {BusinessPolicy, BusinessRule, Parameter, Entity, EntityProperty} from "../entity.model";
import {Subject} from "rxjs";

const maxEntity:number=1000;

export class EntityService{
  private businessPolicy: BusinessPolicy;
  private entityArray: Entity[]=[];
  private eventEmitterArray:  Subject<any>[]=[];
  public sessionData:any;
  public sessionEntity:Entity;

  constructor(){
    this.businessPolicy = new BusinessPolicy();
    this.generateEntity();

    //this.entityArray = Entity[1000];
    //this.setSampleBusinessRule();
  }

  // START : Sample data to be generated from UI
  generateEntity(){

    let entity1:Entity;
    let entity2:Entity;
    entity1 = new Entity('','Employee','basic');

    entity2 = new Entity('','Salary','basic');

    this.addEntityProperty(entity1,new EntityProperty('','basicSalary1','','',''))
    this.addEntityProperty(entity1,new EntityProperty('','DA1','','',''))
    this.addEntityProperty(entity1,new EntityProperty('','grossSalary1','','','calculateGrossSalary'))

    this.addEntityProperty(entity2,new EntityProperty('','basicSalary','','',''))
    this.addEntityProperty(entity2,new EntityProperty('','allowanceFixed','','','setFinalAllowanceFixed'))
    this.addEntityProperty(entity2,new EntityProperty('','DA','','',''))
    this.addEntityProperty(entity2,new EntityProperty('','grossSalary','','','calculateGrossSalary'))

    entity1.child_Entity.push(entity2);

    this.addEntity(entity1);
    this.addEntity(entity2);

    //console.log(entity1)
    //console.log(entity2)

    let entitySession:Entity;
    let entityUser:Entity;
    let entityRoles:Entity;
    let entityConfiguration:Entity;

    entitySession = new Entity('','Session','basic');
    entityConfiguration = new Entity('','Configuration','basic');
    entityUser = new Entity('','User','basic');
    entityRoles = new Entity('','Roles','basic');
    this.addEntityProperty(entityUser,new EntityProperty('','userID','','',''))
    this.addEntityProperty(entityUser,new EntityProperty('','userName','','',''))
    this.addEntityProperty(entityUser,new EntityProperty('','userEmail','','',''))

    this.addEntityProperty(entityRoles,new EntityProperty('','roleID','','',''))
    this.addEntityProperty(entityRoles,new EntityProperty('','roleName','','',''))

    this.addEntityProperty(entityConfiguration,new EntityProperty('','multiplierAllowanceFixed','','',''))
    this.addEntityProperty(entityConfiguration,new EntityProperty('','maxAllowanceFixed','','',''))

    entityUser.child_Entity.push(entityRoles);
    entitySession.child_Entity.push(entityUser);
    entitySession.child_Entity.push(entityConfiguration);

    this.addEntity(entitySession);
    this.addEntity(entityUser);
    this.addEntity(entityRoles);
    this.addEntity(entityConfiguration);

  }

  // How to set data submitted from UI Form and calculate business rules or calculated fields.
  generateSessionData(entity:Entity){
    let thisObject:any;
    let returnObject:any;
    let thisObjectUser:any;
    let thisObjectSession:any;
    let thisObjectConfig:any;
    let thisObjectRoles:any;

    thisObjectSession = this.getEntityObject(entity, true);
    thisObject = thisObjectSession;

    let entityUser:Entity = this.getEntity('User'); //new Entity('','Salary','basic');

    let entityRoles:Entity = this.getEntity('Roles'); //new Entity('','Salary','basic');

    let entityConfig:Entity = this.getEntity('Configuration'); //new Entity('','Salary','basic');
    thisObjectConfig = this.getEntityObject(entityConfig, true);
    this.setEntityPropertyValue(thisObjectConfig, entityConfig,'multiplierAllowanceFixed',0.3,0);
    this.setEntityPropertyValue(thisObjectConfig, entityConfig,'maxAllowanceFixed',2500,0);
    this.setChildValue(entity, thisObject, 'Configuration', thisObjectConfig);

    thisObjectUser = this.getEntityObject(entityUser, true);
    this.setEntityPropertyValue(thisObjectUser, entityUser,'userName','Rahul Joshi',0);
    //thisObject['basicSalary'] = 4000;
    this.setEntityPropertyValue(thisObjectUser, entityUser,'userEmail','rahul.joshi@abc.com',0);

    //this.setChildValue(entity, thisObject, 'User', thisObjectUser);

    //thisObject['allowanceFixed'] = 0;
    //console.log("Returned Object");
    //console.log(returnObject);
    thisObjectRoles = this.getEntityObject(entityRoles, true);
    this.setEntityPropertyValue(thisObjectRoles, entityRoles,'roleName','Admin',0);

    this.setChildValue(entityUser, thisObjectUser, 'Roles', thisObjectRoles);

    thisObjectRoles = this.getEntityObject(entityRoles, true);
    this.setEntityPropertyValue(thisObjectRoles, entityRoles,'roleName','FA',1);

    this.setChildValue(entityUser, thisObjectUser, 'Roles', thisObjectRoles);

    this.setChildValue(entity, thisObject, 'User', thisObjectUser);

    thisObjectUser = this.getEntityObject(entityUser, true);
    this.setEntityPropertyValue(thisObjectUser, entityUser,'userName','Sahil Joshi',1);
    //returnObject =

    //thisObjectUser = this.getEntityObject(entityUser, true);
    this.setEntityPropertyValue(thisObjectUser, entityUser,'userEmail','sahil.joshi@abc.com',1);

    //console.log("Returned Object");
    //console.log(returnObject);

    thisObjectRoles = this.getEntityObject(entityRoles, true);
    this.setEntityPropertyValue(thisObjectRoles, entityRoles,'roleName','FA',0);

    this.setChildValue(entityUser, thisObjectUser, 'Roles', thisObjectRoles);

    this.setChildValue(entity, thisObject, 'User', thisObjectUser);
    //thisObject['DA'] = 200;
    //thisObject['grossSalary'] = 0;


    return thisObjectSession;
  }

  // How to set data submitted from UI Form and calculate business rules or calculated fields.
  generateEntityData(entityEmployee:Entity){
    let thisObjectEmployee:any;
    let thisObjectSalary:any;

    //'Employee'
    thisObjectEmployee = this.getEntityObject(entityEmployee, true);

    let entitySalary:Entity = this.getEntity('Salary'); //new Entity('','Salary','basic');
    thisObjectSalary = this.getEntityObject(entitySalary, true);

    //entityEmployee.child_Entity.push(entitySalary);

    this.setEntityPropertyValue(thisObjectSalary, entitySalary,'basicSalary',4000);
    //thisObject['basicSalary'] = 4000;
    this.setEntityPropertyValue(thisObjectSalary, entitySalary,'allowanceFixed',0);
    //thisObject['allowanceFixed'] = 0;
    this.setEntityPropertyValue(thisObjectSalary, entitySalary,'DA',200);
    //thisObject['DA'] = 200;
    this.setEntityPropertyValue(thisObjectSalary, entitySalary,'grossSalary',0);
    //thisObject['grossSalary'] = 0;

    console.log(thisObjectEmployee);
    //)['Employee']['Salary'].push(thisObjectSalary)
    this.setChildValue(entityEmployee, thisObjectEmployee, 'Salary', thisObjectSalary);

    thisObjectSalary = this.getEntityObject(entitySalary, true);
    //entityEmployee.child_Entity.push(entitySalary);

    this.setEntityPropertyValue(thisObjectSalary, entitySalary,'basicSalary',8000,1);
    //thisObject['basicSalary'] = 4000;
    this.setEntityPropertyValue(thisObjectSalary, entitySalary,'allowanceFixed',0,1);
    //thisObject['allowanceFixed'] = 0;
    this.setEntityPropertyValue(thisObjectSalary, entitySalary,'DA',500,1);
    //thisObject['DA'] = 200;
    this.setEntityPropertyValue(thisObjectSalary, entitySalary,'grossSalary',0,1);

    //thisObjectEmployee['Employee']['Salary'].push(thisObjectSalary);
    this.setChildValue(entityEmployee, thisObjectEmployee, 'Salary', thisObjectSalary);

    return thisObjectEmployee;

  }

  // Set business rule data
  public setSampleBusinessRule(){
    let businessRule01:BusinessRule =
      {
        businessRule_Name:'calculateGrossSalary',
        businessRule_function_Name: 'add',
        paramArray:[
          //new Parameter('basicSalary','attribute'),new Parameter('DA','attribute')
          {parameter_Name:'basicSalary',parameter_Type:'attribute', businessRule:null,parameter_Value:'', parameter_Direction:'read'},
          {parameter_Name:'DA',parameter_Type:'attribute', businessRule:null,parameter_Value:'', parameter_Direction:'read'},
          {parameter_Name:'grossSalary',parameter_Type:'attribute', businessRule:null,parameter_Value:'', parameter_Direction:'write'}
        ],
        returnValue:null,
      };

    let businessRule02:BusinessRule =
      {
        businessRule_Name:'calculateAllowanceFixed',
        businessRule_function_Name: 'multiply',
        paramArray:[
          //new Parameter('calculateGrossSalary', 'businessrule', businessRule01),
          {parameter_Name:'calculateGrossSalary',parameter_Type:'businessrule', businessRule:'calculateGrossSalary',parameter_Value:null,parameter_Direction:'read'},
          new Parameter('multiplierAllowanceFixed', 'value', null, null,'read'),
          new Parameter('allowanceFixed', 'attribute', null, null,'write')
        ],
        returnValue:null,
      };

    let businessRule03:BusinessRule =
      {
        businessRule_Name:'compareAllowanceFixed',
        businessRule_function_Name: 'greaterthanequalto',
        paramArray:[
          //new Parameter('calculateGrossSalary', 'businessrule', businessRule01),
          {parameter_Name:'calculateAllowanceFixed',parameter_Type:'businessrule', businessRule:'calculateAllowanceFixed',parameter_Value:null,parameter_Direction:'read'},
          new Parameter('maxAllowanceFixed', 'value', null, null,'read')
        ],
        returnValue:null,
      };

    let businessRule04:BusinessRule =
      {
        businessRule_Name:'setFinalAllowanceFixed',
        businessRule_function_Name: 'if',
        paramArray:[
          //new Parameter('calculateGrossSalary', 'businessrule', businessRule01),
          {parameter_Name:'compareAllowanceFixed',parameter_Type:'businessrule', businessRule:'compareAllowanceFixed',parameter_Value:null,parameter_Direction:'read'},
          new Parameter('maxAllowanceFixed', 'value', null, null,'read'),
          {parameter_Name:'calculateAllowanceFixed',parameter_Type:'businessrule', businessRule:'calculateAllowanceFixed',parameter_Value:null,parameter_Direction:'read'},
          new Parameter('allowanceFixed', 'attribute', null, null,'write')
        ],
        returnValue:null,
      };

    this.businessPolicy.addBusinessRule(businessRule01);
    this.businessPolicy.addBusinessRule(businessRule02);
    this.businessPolicy.addBusinessRule(businessRule03);
    this.businessPolicy.addBusinessRule(businessRule04);
    //this.execRule([{basicSalary:40000,allowanceFixed:0, DA:200,grossSalary:0}], businessRule02);
  }

  // END : Sample data to be generated from UI

  getEntity(entityName:string){
    for(let entity of this.entityArray){
      if(entity.entity_Name === entityName){
        return entity;
      }
    }
  }

  public setChildValue(entity:Entity, thisObject:any, childEntity:string, childObject:any){
    {
        for(let entityNodeChild of entity.child_Entity){
          if (entityNodeChild.entity_Name  == childEntity){
            thisObject[entity.entity_Name][entityNodeChild.entity_Name].push(childObject);
          }
          //let returnObject:any= this.getEntityObject(entityNodeChild, depthFirst);
        }
    }
  }

  public getEntityObject(entity:Entity, depthFirst:boolean){
    let thisObject:any={};
    {
      thisObject[entity.entity_Name]={};
      for (let entityNode of entity.entityPropertyArray) {
        thisObject[entity.entity_Name][entityNode.entity_property_Name]='';
      }

      //console.log(thisObject);
      if (depthFirst){
        for(let entityNodeChild of entity.child_Entity){
          //let returnObject:any= this.getEntityObject(entityNodeChild, depthFirst);
          thisObject[entity.entity_Name][entityNodeChild.entity_Name] =[];
        }
      }

    }
    return thisObject;
  }

  setEntityPropertyValue(thisObject:any, entity:Entity, propertyName:string, value:any, index:number=0):any{
    let returnObject:any;
    console.log("Property : " + propertyName + " Value: " + value);
    console.log(thisObject);
    console.log(entity);
    for (let entityNode of entity.entityPropertyArray) {
      if (entityNode.entity_property_Name === propertyName){
        //console.log(thisObject[entity.entity_Name][entityNode.entity_property_Name]);
        //console.log(thisObject);
        thisObject[entity.entity_Name][entityNode.entity_property_Name]=value;
        returnObject = {ReturnObject: thisObject[entity.entity_Name], Entity: entity};
        return returnObject;
      }
    }
    /*
    for(let entityNodeChild of entity.child_Entity){
      let thisChildEntity:Entity;
      let thisChildObject:any;

      console.log("Entity Output ");
      console.log(thisObject[entity.entity_Name]);
      if (1) {
        if (thisObject[entity.entity_Name][entityNodeChild.entity_Name] == undefined || thisObject[entity.entity_Name][entityNodeChild.entity_Name].length == undefined) {
          thisObject[entity.entity_Name][entityNodeChild.entity_Name] = [];
        }
        console.log(thisObject[entity.entity_Name][entityNodeChild.entity_Name].length);
        if (thisObject[entity.entity_Name][entityNodeChild.entity_Name].length < index + 1) {
          console.log("inside");
          thisChildEntity = this.getEntity(entityNodeChild.entity_Name);
          thisChildObject = this.getEntityObject(thisChildEntity, false);
          //returnObject =thisChildObject;
          //console.log(returnObject);
          console.log("Child Object");
          console.log(thisChildEntity);
          console.log(thisChildObject);
          thisObject[entity.entity_Name][entityNodeChild.entity_Name].push(thisChildObject);
        }
        for (let entityNode of entityNodeChild.entityPropertyArray) {
          //console.log(entityNodeChild.entity_Name);
          if (entityNode.entity_property_Name === propertyName) {
            thisObject[entity.entity_Name][entityNodeChild.entity_Name][index][entityNodeChild.entity_Name][entityNode.entity_property_Name] = value;
            returnObject = {ReturnObject: thisObject[entity.entity_Name][entityNodeChild.entity_Name][index], Entity: entityNodeChild};
            return returnObject;
            //console.log(thisObject[entity.entity_Name][entityNodeChild.entity_Name][index][entityNodeChild.entity_Name]);
          }
        }
        if (entityNodeChild.child_Entity.length != undefined) {
          this.setEntityPropertyValue(returnObject, entityNodeChild, propertyName, value, index);
        }
      }
    }
    */
    return returnObject;
  }

  public getBusinessRule(businessRuleName:string){
    for (let businessRule of this.businessPolicy.businessPolicyRuleArray){
      if (businessRule.businessRule_Name === businessRuleName){
        return businessRule;
      }
    }
  }

  public getSessionConfigurationData(propertyName:string){
    let returnObject:any;
    let thisObject:any;
    let entity:Entity;

    thisObject = this.sessionData;
      entity = this.sessionEntity;

    console.log("Inside GetSession Property : " + propertyName );
    console.log(thisObject);
    console.log(entity);
    for (let entityNode of entity.entityPropertyArray) {
      if (entityNode.entity_property_Name === propertyName){
        //console.log(thisObject[entity.entity_Name][entityNode.entity_property_Name]);
        //console.log(thisObject);
        returnObject = thisObject[entity.entity_Name][entityNode.entity_property_Name];
        return returnObject;
      }
    }
    for(let entityNodeChild of entity.child_Entity){
      let thisChildEntity:Entity;
      let thisChildObject:any;

      //console.log("Entity Output ");
      //console.log(thisObject[entity.entity_Name]);
      for(let entityValuieNode of thisObject[entity.entity_Name][entityNodeChild.entity_Name]) {
        //console.log(entityValuieNode);
        if (entityValuieNode) {
          //console.log("inside");
          //console.log("Child Object");
          for (let entityNode of entityNodeChild.entityPropertyArray) {
            //console.log(entityNodeChild.entity_Name);
            if (entityNode.entity_property_Name === propertyName) {
              //thisObject[entity.entity_Name][entityNodeChild.entity_Name][index][entityNodeChild.entity_Name][entityNode.entity_property_Name] = value;
              //console.log(entityValuieNode[entityNodeChild.entity_Name][entityNode.entity_property_Name]);
              returnObject = entityValuieNode[entityNodeChild.entity_Name][entityNode.entity_property_Name];
              return returnObject;
              //console.log(thisObject[entity.entity_Name][entityNodeChild.entity_Name][index][entityNodeChild.entity_Name]);
            }
          }
          // if (entityNodeChild.child_Entity.length != undefined) {
          //   this.getSessionConfigurationData(propertyName);
          // }
        }
      }
    }
    return returnObject;
  }
  // public addEntityProperty(entityAdd: Entity, entityPropertyAdd: EntityProperty){
  //   let subjectProperty: Subject<any>;
  //   subjectProperty = new Subject<any>();
  //   entityPropertyAdd.subscribeEvent(subjectProperty);
  //   this.eventEmitterArray.push(subjectProperty);
  //   entityAdd.addEntityProperty(entityPropertyAdd);
  // }

  public addEntityProperty(entity:Entity, entityProperty: EntityProperty){
    let subjectProperty: Subject<any>;
    subjectProperty = new Subject<any>();
    //entityProperty.subscribeEvent(subjectProperty);
    this.eventEmitterArray.push(subjectProperty);
    entity.entityPropertyArray.push(entityProperty);
  }

  public getEntityProperty(entity:Entity, propertyName: string):EntityProperty{
    let entityPropertyReturn:EntityProperty  = null;
    for(let propertyEntity of entity.entityPropertyArray.slice()){
      if (propertyEntity.entity_property_Name === propertyName){
        entityPropertyReturn=  propertyEntity;
      }
    }
    if (entityPropertyReturn === null) {
      for(let nodeChild of entity.child_Entity){
        entityPropertyReturn = this.getEntityProperty(nodeChild, propertyName);
      }
    }
    return entityPropertyReturn;
  }


  // Can add entity as parametr or business rule as parameter only
  public addParameter(paramAdd: Parameter, policyRule: BusinessRule){
    policyRule.paramArray.push(paramAdd);
    return null;
  }

  public addEntity(entityAdd: Entity){
    this.entityArray.push(entityAdd);
  }

  public extractRule(thisObjectArray:any[], entity: Entity){
    console.log(thisObjectArray);
    for(let thisObject of thisObjectArray.slice()) {
      for (let entityProperty of entity.entityPropertyArray) {
        if (entityProperty.entity_property_business_rule && entityProperty.entity_property_business_rule != '') {
          this.execRule(thisObject[entity.entity_Name], this.getBusinessRule(entityProperty.entity_property_business_rule));
        }
        if (entityProperty.entity_property_validation_rule && entityProperty.entity_property_validation_rule != '') {
          this.execRule(thisObject[entity.entity_Name], this.getBusinessRule(entityProperty.entity_property_validation_rule));
        }
      }
      for (let entityChild of entity.child_Entity) {
        for (let entityProperty of entityChild.entityPropertyArray) {
          if (entityProperty.entity_property_business_rule && entityProperty.entity_property_business_rule != '') {
            console.log("No Of Objects : " + thisObject[entity.entity_Name][entityChild.entity_Name].length);
            for(let childNode of thisObject[entity.entity_Name][entityChild.entity_Name]){
              //this.execRule(thisObject[entity.entity_Name][entityChild.entity_Name], this.getBusinessRule(entityProperty.entity_property_business_rule));
              this.execRule(childNode[entityChild.entity_Name], this.getBusinessRule(entityProperty.entity_property_business_rule));
            }
          }
          if (entityProperty.entity_property_validation_rule && entityProperty.entity_property_validation_rule != '') {
            for(let childNode of thisObject[entity.entity_Name][entityChild.entity_Name]){
              //this.execRule(thisObject[entity.entity_Name][entityChild.entity_Name], this.getBusinessRule(entityProperty.entity_property_validation_rule));
              this.execRule(childNode[entityChild.entity_Name], this.getBusinessRule(entityProperty.entity_property_validation_rule));
            }
          }
        }
      }
    }
  }
  public execRule(thisObject:any, policyRule: BusinessRule){
    let numbReturn:any[]=[];
    let valueParam: any[]=[];
    let returnParam:Parameter=null;
    let indexParam = 0;
    //let policyRule: BusinessRule = this;

    //console.log("Entering Rule : " + policyRule.businessRule_Name);
    //console.log(thisObject);

//    for(let thisObject of thisObjectArray.slice()){
      // console.log(thisObject);
      /*for(let pararamEach of policyRule.paramArray.slice()){
        if (pararamEach.parameter_Type === 'businessrule'){
        }
      }*/

      for(let pararamEach of policyRule.paramArray.slice()) {
        if (pararamEach.parameter_Type === 'businessrule') {
          let businessRule:BusinessRule = this.getBusinessRule(pararamEach.businessRule);
          if (businessRule.returnValue == null) {
            //&& !businessRule.returnValue[0]
            this.execRule(thisObject, businessRule);
            valueParam[indexParam] = businessRule.returnValue[0];
          }
          else{
            console.log("Skipping Rule : " + policyRule.businessRule_Name);
            this.execRule(thisObject, businessRule);
            valueParam[indexParam] = businessRule.returnValue[0];
            //valueParam[indexParam] =thisObject[pararamEach.parameter_Name];
          }

          //console.log("Rule Return : " + pararamEach.businessRule.returnValue[0]);
        }
        else if(pararamEach.parameter_Type === 'value') {
          let paramValue = this.getSessionConfigurationData(pararamEach.parameter_Name);
          //console.log("Parameter Value" + paramValue);
          valueParam[indexParam] = paramValue; //pararamEach.parameter_Value;
        }
        else if(pararamEach.parameter_Type === 'attribute' &&  pararamEach.parameter_Direction === 'write') {
          returnParam = pararamEach;
        }
        else{
          valueParam[indexParam] = thisObject[pararamEach.parameter_Name];
        }
        indexParam++;
      }
      switch(policyRule.businessRule_function_Name){
        case 'in':
          let valueExists:boolean = false;
          let inArray:any[]=[];
          inArray = valueParam[1];
          for(let value of inArray){
            if (valueParam[0] == value){
              valueExists = true;
              break;
            }
          }
          numbReturn.push(valueExists);
          //thisObject[policyRule.paramArray[2].parameter_Name]=numbReturn[0];
          break;
        case 'if':
          numbReturn.push(valueParam[0]  ? valueParam[1]:valueParam[2]);
          //thisObject[policyRule.paramArray[2].parameter_Name]=numbReturn[0];
          break;
        case 'equalto':
          numbReturn.push((valueParam[0] == valueParam[1]) ? true:false );
          //thisObject[policyRule.paramArray[2].parameter_Name]=numbReturn[0];
          break;
        case 'lessthanequalto':
          numbReturn.push((valueParam[0] <= valueParam[1]) ? true:false );
          //thisObject[policyRule.paramArray[2].parameter_Name]=numbReturn[0];
          break;
        case 'lessthan':
          numbReturn.push((valueParam[0] < valueParam[1]) ? true:false );
          //thisObject[policyRule.paramArray[2].parameter_Name]=numbReturn[0];
          break;
        case 'greaterthanequalto':
          numbReturn.push((valueParam[0] >= valueParam[1]) ? true:false );
          //thisObject[policyRule.paramArray[2].parameter_Name]=numbReturn[0];
          break;
        case 'greaterthan':
          numbReturn.push((valueParam[0] > valueParam[1]) ? true:false );
          //thisObject[policyRule.paramArray[2].parameter_Name]=numbReturn[0];
          break;
        case 'or':
          numbReturn.push(valueParam[0] | valueParam[1] ? true:false );
          //thisObject[policyRule.paramArray[2].parameter_Name]=numbReturn[0];
          break;
        case 'and':
          numbReturn.push(valueParam[0] & valueParam[1] ? true:false );
          //thisObject[policyRule.paramArray[2].parameter_Name]=numbReturn[0];
          break;
        case 'add':
          numbReturn.push(Math.abs(valueParam[0] + valueParam[1]));
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
      //console.log(policyRule);
//    }
  }

}
