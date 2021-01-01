import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginRequest, UserService } from '../services/user.service';
import { BaseFormComponent } from '../shared/models/BaseFormComponent';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends BaseFormComponent implements OnInit {
  form = this.fb.group({
    emailControl: ['', [Validators.required, Validators.email]],
    passwordControl: ['', [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {}

  onSubmit() {
    const request = <LoginRequest>{
      email: this.form.controls['emailControl'].value,
      password: this.form.controls['passwordControl'].value,
    };

    this.userService.login(request).subscribe(() => {
      this.router.navigateByUrl('/user/courses');
    });
  }
}
