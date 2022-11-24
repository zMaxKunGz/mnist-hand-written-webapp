import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import {Router} from "@angular/router"

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent {

  nameForm = new FormGroup({
    "name": new FormControl("", Validators.required),
  });

  constructor(private router: Router) { }

  protected onSubmit() {
    sessionStorage.setItem('name', JSON.stringify(this.nameForm.value));
    this.router.navigate(['writer']);
  }

}
