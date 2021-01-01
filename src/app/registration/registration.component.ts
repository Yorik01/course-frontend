import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterRequest, UserService } from '../services/user.service';
import { BaseFormComponent } from '../shared/models/BaseFormComponent';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent extends BaseFormComponent implements OnInit {
  form = this.fb.group({
    nameControl: ['', [Validators.required]],
    surnameControl: ['', [Validators.required]],
    emailControl: ['', [Validators.required, Validators.email]],
    dateControl: ['', [Validators.required]],
    passwordControl: ['', [Validators.required]],
    passwordReapeatControl: ['', [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {}

  onSumbit() {
    const request = <RegisterRequest>{
      name: this.form.controls['nameControl'].value,
      email: this.form.controls['emailControl'].value,
      surname: this.form.controls['surnameControl'].value,
      birthday: this.form.controls['dateControl'].value,
      password: this.form.controls['passwordControl'].value,
      bio: '',
      mediaId: 282,
    };

    this.userService.register(request).subscribe(() => {
      this.router.navigateByUrl('/user/courses');
    });
  }
}
