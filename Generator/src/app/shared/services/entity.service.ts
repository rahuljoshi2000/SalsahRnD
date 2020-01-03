
import {BusinessPolicy, BusinessRule, Parameter, Entity, EntityProperty} from "../entity.model";
import {Subject} from "rxjs";

const maxEntity:number=1000;

export class EntityService{
  private businessPolicy: BusinessPolicy;
  private entityArray: Entity[]=[];
  private eventEmitterArray:  Subject<any>[]=[];

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

    this.addEntityProperty(entity1,new EntityProperty('','basicSalary','','',''))
    this.addEntityProperty(entity1,new EntityProperty('','DA','','',''))
    this.addEntityProperty(entity1,new EntityProperty('','grossSalary','','','calculateGrossSalary'))

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

    entitySession = new Entity('','Session','basic');
    entityUser = new Entity('','User','basic');
    entityRoles = new Entity('','Roles','basic');
    this.addEntityProperty(entityUser,new EntityProperty('','userID','','',''))
    this.addEntityProperty(entityUser,new EntityProperty('','userName','','',''))
    this.addEntityProperty(entityUser,new EntityProperty('','userEmail','','',''))

    this.addEntityProperty(entityRoles,new EntityProperty('','roleID','','',''))
    this.addEntityProperty(entityRoles,new EntityProperty('','roleName','','',''))

    entitySession.child_Entity.push(entityUser);
    entityUser.child_Entity.push(entityRoles);

    this.addEntity(entitySession);
    this.addEntity(entityUser);
    this.addEntity(entityRoles);

  }

  // How to set data submitted from UI Form and calculate business rules or calculated fields.
  generateSessionData(entity:Entity){
    let thisObject:any;
    let returnObject:any;

    thisObject = this.getEntityObject(entity);
    this.setEntityPropertyValue(thisObject, entity,'userName','Rahul Joshi',0);
    //thisObject['basicSalary'] = 4000;
    returnObject = this.setEntityPropertyValue(thisObject, entity,'userEmail','rahul.joshi@abc.com',0);
    //thisObject['allowanceFixed'] = 0;
    console.log("Returned Object");
    console.log(returnObject);
    this.setEntityPropertyValue(returnObject, entity,'roleName','Admin',0);
    this.setEntityPropertyValue(returnObject, entity,'roleName','FA',1);

    this.setEntityPropertyValue(thisObject, entity,'userName','Sahil Joshi',1);
    returnObject = this.setEntityPropertyValue(thisObject, entity,'userEmail','sahil.joshi@abc.com',1);
    console.log("Returned Object");
    console.log(returnObject);
    this.setEntityPropertyValue(returnObject, entity,'roleName','FA',0);
    //thisObject['DA'] = 200;
    //thisObject['grossSalary'] = 0;
    return thisObject;
  }

  // How to set data submitted from UI Form and calculate business rules or calculated fields.
  generateEntityData(entity:Entity){
    let thisObject:any;
    thisObject = this.getEntityObject(entity);
    this.setEntityPropertyValue(thisObject, entity,'basicSalary',4000);
    //thisObject['basicSalary'] = 4000;
    this.setEntityPropertyValue(thisObject, entity,'allowanceFixed',0);
    //thisObject['allowanceFixed'] = 0;
    this.setEntityPropertyValue(thisObject, entity,'DA',200);
    //thisObject['DA'] = 200;
    this.setEntityPropertyValue(thisObject, entity,'grossSalary',0);
    //thisObject['grossSalary'] = 0;
    return thisObject;
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
          new Parameter('multiplierAllowanceFixed', 'value', null, 0.3,'read'),
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
          new Parameter('maxAllowanceFixed', 'value', null, 1260,'read')
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
          new Parameter('maxAllowanceFixed', 'value', null, 1260,'read'),
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

  public getEntityObject(entity:Entity){
    let thisObject:any={};
    {
      thisObject[entity.entity_Name]={};
      for (let entityNode of entity.entityPropertyArray) {
        thisObject[entity.entity_Name][entityNode.entity_property_Name]='';
      }
      //console.log(thisObject);
      for(let entityNodeChild of entity.child_Entity){
        let returnObject:any= this.getEntityObject(entityNodeChild);
        thisObject[entity.entity_Name][entityNodeChild.entity_Name] =returnObject;
      }
    }
    return thisObject;
  }

  setEntityPropertyValue(thisObject:any, entity:Entity, propertyName:string, value:any, index:number=0){
    let returnObject:any;
    //console.log(thisObject);
    for (let entityNode of entity.entityPropertyArray) {
      if (entityNode.entity_property_Name ===propertyName){
        console.log(thisObject[entity.entity_Name][entityNode.entity_property_Name]);
        returnObject = thisObject[entity.entity_Name][entityNode.entity_property_Name];
        thisObject[entity.entity_Name][entityNode.entity_property_Name]=value;
      }
    }
    for(let entityNodeChild of entity.child_Entity){
      let thisChildEntity:Entity;
      let thisChildObject:any;

      console.log("Entity Output ");
      console.log(thisObject[entity.entity_Name][entityNodeChild.entity_Name].length);



      if (thisObject[entity.entity_Name][entityNodeChild.entity_Name] == null || thisObject[entity.entity_Name][entityNodeChild.entity_Name].length == undefined){
        thisObject[entity.entity_Name][entityNodeChild.entity_Name] = [];
      }
      console.log(thisObject[entity.entity_Name][entityNodeChild.entity_Name].length);
      if (thisObject[entity.entity_Name][entityNodeChild.entity_Name].length < index+1){
          console.log("inside");
          thisChildEntity = this.getEntity(entityNodeChild.entity_Name);
          thisChildObject = this.getEntityObject(thisChildEntity);
          console.log("Child Object");
          console.log(thisChildEntity.child_Entity.length);
          if (thisChildEntity.child_Entity.length > 0)
          {
            returnObject =  this.setEntityPropertyValue(thisChildObject, entityNodeChild, propertyName, value, index);
          }
          thisObject[entity.entity_Name][entityNodeChild.entity_Name].push(thisChildObject);
      }
      for (let entityNode of entityNodeChild.entityPropertyArray) {
        //console.log(entityNodeChild.entity_Name);
        if (entityNode.entity_property_Name ===propertyName) {
          console.log(thisObject[entity.entity_Name][entityNodeChild.entity_Name][index][entityNodeChild.entity_Name][entityNode.entity_property_Name]);
          returnObject = thisObject[entity.entity_Name][entityNodeChild.entity_Name][index][entityNodeChild.entity_Name][entityNode.entity_property_Name];
            thisObject[entity.entity_Name][entityNodeChild.entity_Name][index][entityNodeChild.entity_Name][entityNode.entity_property_Name] = value;
        }
      }

    }
    return returnObject;
  }

  public getBusinessRule(businessRuleName:string){
    for (let businessRule of this.businessPolicy.businessPolicyRuleArray){
      if (businessRule.businessRule_Name === businessRuleName){
        return businessRule;
      }
    }
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
          valueParam[indexParam] = pararamEach.parameter_Value;
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
