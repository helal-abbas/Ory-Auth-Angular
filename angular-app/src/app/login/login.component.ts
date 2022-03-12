import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { KratosService } from './../kratos.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public kratos: KratosService,
  ) {
    this.loginForm = this.formBuilder.group({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.kratos.initLoginFlow();
  }

  onLogin(): void {
    const formValue = this.loginForm.getRawValue();
    this.kratos.doLogin(formValue.username, formValue.password);
  }

  onRegister(): void {
    this.router.navigate(['/registration']);
  }
}
