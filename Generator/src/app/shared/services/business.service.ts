import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {BusinessPolicy, BusinessRule, Parameter, Entity, EntityProperty} from "../entity.model";
import {EntityService} from "./entity.service";
import {HttpClient} from "@angular/common/http";
import { map } from 'rxjs/operators';

const maxEntity:number=1000;

@Injectable()
export class BusinessService{
  private businessPolicy: BusinessPolicy;
  private businessEntitities : Entity;
  private rootEntity:Entity;

  constructor(private entityService: EntityService, private http: HttpClient){
    this.businessPolicy = new BusinessPolicy();
    this.generateEntity();
  }
  generateEntity(){

    let entity1:Entity;
    let entity2:Entity;

    this.rootEntity = new Entity('','Root','basic');
    this.businessEntitities = new Entity('','BusinessEntities','basic');
    this.rootEntity.child_Entity.push(this.businessEntitities);


    entity1 = new Entity('','Employee','basic');
    entity2 = new Entity('','Salary','basic');
    this.businessEntitities.child_Entity.push(entity1);
    //this.businessEntitities.child_Entity.push(entity2);

    this.entityService.addEntityProperty(entity1,new EntityProperty('','accessEntity','','','','isUserInSuperUserRole'))
    this.entityService.addEntityProperty(entity1,new EntityProperty('','basicSalary','','',''))
    this.entityService.addEntityProperty(entity1,new EntityProperty('','DA','','',''))
    this.entityService.addEntityProperty(entity1,new EntityProperty('','grossSalary','','','calculateGrossSalary'))

    this.entityService.addEntityProperty(entity2,new EntityProperty('','accessEntity','','','','isUserInSuperUserRole'))
    this.entityService.addEntityProperty(entity2,new EntityProperty('','basicSalary','','',''))
    this.entityService.addEntityProperty(entity2,new EntityProperty('','allowanceFixed','','','setFinalAllowanceFixed'))
    this.entityService.addEntityProperty(entity2,new EntityProperty('','DA','','',''))
    this.entityService.addEntityProperty(entity2,new EntityProperty('','grossSalary','','','calculateGrossSalary'))

    entity1.child_Entity.push(entity2);

    this.entityService.addEntity(entity1);
    this.entityService.addEntity(entity2);

    //console.log(entity1)
    //console.log(entity2)

    let entitySession:Entity;
    let entityUser:Entity;
    let entityRoles:Entity;
    let entityConfiguration:Entity;

    entitySession = new Entity('','Session','basic');
    entityConfiguration = new Entity('','SystemConfiguration','basic');
    entityUser = new Entity('','User','basic');
    entityRoles = new Entity('','Roles','basic');
    this.entityService.addEntityProperty(entityUser,new EntityProperty('','userID','','',''))
    this.entityService.addEntityProperty(entityUser,new EntityProperty('','userName','','',''))
    this.entityService.addEntityProperty(entityUser,new EntityProperty('','userEmail','','',''))

    this.entityService.addEntityProperty(entityRoles,new EntityProperty('','roleID','','',''))
    this.entityService.addEntityProperty(entityRoles,new EntityProperty('','roleName','','',''))

    this.entityService.addEntityProperty(entityConfiguration,new EntityProperty('','multiplierAllowanceFixed','','',''))
    this.entityService.addEntityProperty(entityConfiguration,new EntityProperty('','maxAllowanceFixed','','',''))
    this.entityService.addEntityProperty(entityConfiguration,new EntityProperty('','superUserRole','','',''))

    entityUser.child_Entity.push(entityRoles);
    entitySession.child_Entity.push(entityUser);
    entitySession.child_Entity.push(entityConfiguration);

    this.entityService.addEntity(entitySession);
    this.entityService.addEntity(entityUser);
    this.entityService.addEntity(entityRoles);
    this.entityService.addEntity(entityConfiguration);

  }

  generateEntityData(entityEmployee:Entity){
    let thisObjectEmployee:any;
    let thisObjectSalary:any;

    //'Employee'
    thisObjectEmployee = this.entityService.getEntityObject(entityEmployee, true);

    let entitySalary:Entity = this.entityService.getEntity('Salary'); //new Entity('','Salary','basic');
    thisObjectSalary = this.entityService.getEntityObject(entitySalary, true);

    //entityEmployee.child_Entity.push(entitySalary);

    this.entityService.setEntityPropertyValue(thisObjectSalary, entitySalary,'basicSalary',4000);
    //thisObject['basicSalary'] = 4000;
    this.entityService.setEntityPropertyValue(thisObjectSalary, entitySalary,'allowanceFixed',0);
    //thisObject['allowanceFixed'] = 0;
    this.entityService.setEntityPropertyValue(thisObjectSalary, entitySalary,'DA',200);
    this.entityService.setEntityPropertyValue(thisObjectSalary, entitySalary,'grossSalary',0);

    //console.log(thisObjectEmployee);
    this.entityService.setChildValue(entityEmployee, thisObjectEmployee, 'Salary', thisObjectSalary);

    thisObjectSalary = this.entityService.getEntityObject(entitySalary, true);

    this.entityService.setEntityPropertyValue(thisObjectSalary, entitySalary,'basicSalary',8000,1);
    this.entityService.setEntityPropertyValue(thisObjectSalary, entitySalary,'allowanceFixed',0,1);
    this.entityService.setEntityPropertyValue(thisObjectSalary, entitySalary,'DA',500,1);
    this.entityService.setEntityPropertyValue(thisObjectSalary, entitySalary,'grossSalary',0,1);

    this.entityService.setChildValue(entityEmployee, thisObjectEmployee, 'Salary', thisObjectSalary);

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

    let businessRule05:BusinessRule =
      {
        businessRule_Name:'isUserInSuperUserRole',
        businessRule_function_Name: 'in',
        paramArray:[
          new Parameter('roleName', 'attribute', null, null,'read'),
          new Parameter('superUserRole', 'value', null, null,'read'),
          new Parameter('accessEntity', 'attribute', null, null,'write')
        ],
        returnValue:null,
      };
    this.businessPolicy.addBusinessRule(businessRule01);
    this.businessPolicy.addBusinessRule(businessRule02);
    this.businessPolicy.addBusinessRule(businessRule03);
    this.businessPolicy.addBusinessRule(businessRule04);
    this.businessPolicy.addBusinessRule(businessRule05);
    //this.execRule([{basicSalary:40000,allowanceFixed:0, DA:200,grossSalary:0}], businessRule02);
  }

  public getBusinessRule(businessRuleName:string){
    for (let businessRule of this.businessPolicy.businessPolicyRuleArray){
      if (businessRule.businessRule_Name === businessRuleName){
        return businessRule;
      }
    }
  }

  public callRuleFunction(policyRule: BusinessRule, valueParam: any[]){
    let numbReturn:any[]=[];
    switch(policyRule.businessRule_function_Name){
      case 'apiget':
        numbReturn.push(
          this.http
            .get(
              valueParam[0]
              ,
              valueParam[1]
            )
        );
        break;
      case 'apipost':
        numbReturn.push(
          this.http
          .post(
            valueParam[0]
            ,
            valueParam[1]
          )
        );
        break;
      case 'in':
        //console.log("Calling In");
        //console.log(valueParam);
        let valueExists:boolean = false;
        let inArray:any[]=[];
        let outArray:any[]=[];
        inArray = valueParam[1];
        outArray = valueParam[0];
        for(let value of inArray){
          for(let value1 of outArray){
            if (value == value1){
              valueExists = true;
              break;
            }
          }
        }
        //console.log("Calling In " + valueExists);
        numbReturn.push(valueExists);
        break;
      case 'if':
        //console.log("Value of if condition : " + valueParam[0]);
        //console.log("Value of after if condition true : " + valueParam[1]);
        //console.log("Value of after if condition false : " + valueParam[2]);
        numbReturn.push(valueParam[0]  ? valueParam[1]:valueParam[2]);
        break;
      case 'equalto':
        numbReturn.push((valueParam[0] == valueParam[1]) ? true:false );
        break;
      case 'lessthanequalto':
        numbReturn.push((valueParam[0] <= valueParam[1]) ? true:false );
        break;
      case 'lessthan':
        numbReturn.push((valueParam[0] < valueParam[1]) ? true:false );
        break;
      case 'greaterthanequalto':
        numbReturn.push((valueParam[0] >= valueParam[1]) ? true:false );
        break;
      case 'greaterthan':
        numbReturn.push((valueParam[0] > valueParam[1]) ? true:false );
        break;
      case 'or':
        numbReturn.push(valueParam[0] | valueParam[1] ? true:false );
        break;
      case 'and':
        numbReturn.push(valueParam[0] & valueParam[1] ? true:false );
        break;
      case 'add':
        numbReturn.push(Math.abs(valueParam[0] + valueParam[1]));
        break;
      case 'multiply':
        numbReturn = [0];
        numbReturn[0] = Math.abs(valueParam[0] * valueParam[1]);
        break;
    }
    return numbReturn;
  }
}
