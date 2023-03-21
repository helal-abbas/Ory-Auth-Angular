import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { KratosService } from './../kratos.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  registrationForm: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public kratos: KratosService,
  ) {
    this.registrationForm = this.formBuilder.group({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      passwordAgain: new FormControl('', [Validators.required]),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.kratos.initRegistrationFlow();
  }

  onBack(): void {
    this.router.navigate(['/login']);
  }

  async onRegister(): Promise<void> {
    if (await this.kratos.registration(this.registrationForm.value.username, this.registrationForm.value.password, this.registrationForm.value.firstName, this.registrationForm.value.lastName)) {
      this.router.navigate(['/dashboard']);
    }
  }
}
