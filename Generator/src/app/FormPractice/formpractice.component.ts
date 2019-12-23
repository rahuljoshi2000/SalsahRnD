import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators, FormArray} from "@angular/forms";
import { CustomValidators } from './custom-validators';

@Component({
  selector: 'app-formpractice',
  templateUrl: './formpractice.component.html',
  styleUrls: ['./formpractice.component.css']
})
export class FormPracticeComponent implements OnInit{
  projectForm: FormGroup;
  projectStatuses: string[] = ['Stable', 'Critical', 'Finished'];
  ngOnInit(){
    this.projectForm = new FormGroup({
      'projectName': new FormControl(
        null,
        [Validators.required, CustomValidators.invalidProjectName.bind(this)],[ CustomValidators.asyncInvalidProjectName.bind(this)]
      ),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'projectStatus': new FormControl('critical'),
      'hobbies': new FormArray([])
    });
  }

  onSubmit() {
    console.log(this.projectForm.value);
    (<FormArray>this.projectForm.get('hobbies')).clear();
    this.projectForm.reset();
  }

  onAddHobby(){
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.projectForm.get('hobbies')).push(control);
  }
}
