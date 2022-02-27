import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  registrationForm: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
  ) {
    this.registrationForm = this.formBuilder.group({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      passwordAgain: new FormControl('', [Validators.required]),
    });
  }

  onBack(): void {
    this.router.navigate(['/login']);
  }

  onRegister(): void {
    console.log(this.registrationForm.getRawValue());
  }
}
