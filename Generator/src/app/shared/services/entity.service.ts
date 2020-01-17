
import {BusinessPolicy, BusinessRule, Parameter, Entity, EntityProperty} from "../entity.model";
import {Subject} from "rxjs";

const maxEntity:number=1000;

export interface entityBusinessRule{
  entityThis: any,
  businessRuleName:string,
}
export class EntityService{
  private entityArray: Entity[]=[];
  private eventEmitterArray:  Subject<any>[]=[];

  constructor(){
    //this.entityArray = Entity[1000];
    //this.setSampleBusinessRule();
  }

  // START : Sample data to be generated from UI

  // Push object for screen currently working on
  // In case of EDIT/DELETE view get data from database and push
  // In case of ADD create object empty and set data submitted from UI Form and calculate business rules or calculated fields.
  // On completion need to remove the object

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
    for (let entityNode of entity.entityPropertyArray) {
      if (entityNode.entity_property_Name === propertyName){
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
  public getEntityPropertyValue(thisObject:any, entity:Entity, propertyName: string){
    let returnObject:any;
    for (let entityNode of entity.entityPropertyArray) {
      if (entityNode.entity_property_Name === propertyName){
        returnObject = thisObject[entity.entity_Name][entityNode.entity_property_Name];
        return returnObject;
      }
    }
    for(let entityNodeChild of entity.child_Entity){
      let thisChildEntity:Entity;
      let thisChildObject:any;

      for(let entityValuieNode of thisObject[entity.entity_Name][entityNodeChild.entity_Name]) {
        if (entityValuieNode) {
          for (let entityNode of entityNodeChild.entityPropertyArray) {
            if (entityNode.entity_property_Name === propertyName) {
              returnObject = entityValuieNode[entityNodeChild.entity_Name][entityNode.entity_property_Name];
              return returnObject;
            }
          }
        }
      }
    }
  }
  public getEntityPropertyValues(thisObject:any, entity:Entity, propertyName: string, returnObject:any[]){
    //let returnObject:any[];
    //console.log(thisObject);
    //console.log(entity);
    if (returnObject == undefined)
      returnObject = [];
    for (let entityNode of entity.entityPropertyArray) {
      if (entityNode.entity_property_Name === propertyName){
        //console.log("Found Object");
        //console.log(thisObject[entity.entity_Name][entityNode.entity_property_Name]);
        returnObject.push(thisObject[entity.entity_Name][entityNode.entity_property_Name]);
        //return returnObject;
      }
    }
    for(let entityNodeChild of entity.child_Entity){
      let thisChildEntity:Entity;
      let thisChildObject:any;

      for(let entityValuieNode of thisObject[entity.entity_Name][entityNodeChild.entity_Name]) {
        if (entityValuieNode) {
          for (let entityNode of entityNodeChild.entityPropertyArray) {
            if (entityNode.entity_property_Name === propertyName) {
              //console.log("Found Object");
              //console.log(entityValuieNode[entityNodeChild.entity_Name][entityNode.entity_property_Name]);
              returnObject.push(entityValuieNode[entityNodeChild.entity_Name][entityNode.entity_property_Name]);
            }
          }
        }
        //console.log(entityValuieNode);
        for(let entityNodeChildNext of entityNodeChild.child_Entity){
          for(let entityValueNodeChildNext of entityValuieNode[entityNodeChild.entity_Name][entityNodeChildNext.entity_Name]){
            this.getEntityPropertyValues(entityValueNodeChildNext, entityNodeChildNext,propertyName, returnObject);
          }
        }
      }
    }
    return returnObject;
  }
  public getEntityByPropertyValue(thisObject:any, entity:Entity, propertyName: string, valueFind:any){
    //let returnObject:any[];
    for (let entityNode of entity.entityPropertyArray) {
      if (entityNode.entity_property_Name === propertyName){
        if (thisObject[entity.entity_Name][entityNode.entity_property_Name] == valueFind)
          return thisObject[entity.entity_Name];
        //return returnObject;
      }
    }
    for(let entityNodeChild of entity.child_Entity){
      let thisChildEntity:Entity;
      let thisChildObject:any;

      for(let entityValuieNode of thisObject[entity.entity_Name][entityNodeChild.entity_Name]) {
        //console.log("User To Find : ");
        //console.log(propertyName);
        //console.log(valueFind);
        if (entityValuieNode) {
          for (let entityNode of entityNodeChild.entityPropertyArray) {
            //console.log(entityValuieNode[entityNodeChild.entity_Name][entityNode.entity_property_Name]);
            if (entityNode.entity_property_Name === propertyName) {
              if (entityValuieNode[entityNodeChild.entity_Name][entityNode.entity_property_Name] == valueFind)
                //console.log(entityValuieNode[entityNodeChild.entity_Name]);
                return entityValuieNode;
            }
          }
        }
        for(let entityNodeChildNext of entityNodeChild.child_Entity){
          for(let entityValueNodeChildNext of entityValuieNode[entityNodeChild.entity_Name][entityNodeChildNext.entity_Name]){
            //console.log(entityValueNodeChildNext);
            //console.log(entityNodeChildNext);
            this.getEntityByPropertyValue(entityValueNodeChildNext, entityNodeChildNext,propertyName, valueFind);
          }
        }
      }
    }
    //return returnObject;
  }

  // Can add entity as parametr or business rule as parameter only
  public addParameter(paramAdd: Parameter, policyRule: BusinessRule){
    policyRule.paramArray.push(paramAdd);
    return null;
  }

  public addEntity(entityAdd: Entity){
    this.entityArray.push(entityAdd);
  }


 public getEntityBusinessRuleFromEntity(thisObject:any, entity:Entity):entityBusinessRule[]{
   let someObject:entityBusinessRule;
   let someObjectArray: entityBusinessRule[] = [];
   /*if (entity.entity_access_rule != '' && entity.entity_access_rule != undefined){

   }
   */
   for (let entityProperty of entity.entityPropertyArray) {
     if (entityProperty.entity_property_business_rule && entityProperty.entity_property_business_rule != '') {
       someObjectArray.push({entityThis:thisObject[entity.entity_Name],businessRuleName:entityProperty.entity_property_business_rule});
     }
     if (entityProperty.entity_property_validation_rule && entityProperty.entity_property_validation_rule != '') {
       someObjectArray.push({entityThis:thisObject[entity.entity_Name],businessRuleName:entityProperty.entity_property_business_rule});
     }
     if (entityProperty.entity_access_rule && entityProperty.entity_access_rule != '') {
       someObjectArray.push({entityThis:thisObject[entity.entity_Name],businessRuleName:entityProperty.entity_access_rule});
     }
   }
   for (let entityChild of entity.child_Entity) {
     for (let entityProperty of entityChild.entityPropertyArray) {
       if (entityProperty.entity_property_business_rule && entityProperty.entity_property_business_rule != '') {
         for(let childNode of thisObject[entity.entity_Name][entityChild.entity_Name]){
           someObjectArray.push({entityThis:childNode[entityChild.entity_Name],businessRuleName:entityProperty.entity_property_business_rule});
         }
       }
       if (entityProperty.entity_property_validation_rule && entityProperty.entity_property_validation_rule != '') {
         for(let childNode of thisObject[entity.entity_Name][entityChild.entity_Name]){
           someObjectArray.push({entityThis:childNode[entityChild.entity_Name],businessRuleName:entityProperty.entity_property_business_rule});
         }
       }
       if (entityProperty.entity_access_rule && entityProperty.entity_access_rule != '') {
         for(let childNode of thisObject[entity.entity_Name][entityChild.entity_Name]){
           someObjectArray.push({entityThis:childNode[entityChild.entity_Name],businessRuleName:entityProperty.entity_access_rule});
         }
       }
     }
   }
   return someObjectArray;
 }
}
