import { Component } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Component({
  template: '',
})
export class BaseFormComponent {
  form: FormGroup;

  constructor() {}

  getControl(name: string): AbstractControl {
    return this.form.get(name);
  }

  isValid(name: string): boolean {
    const e = this.getControl(name);
    return e && e.valid;
  }

  isChanged(name: string): boolean {
    const e = this.getControl(name);
    return e && (e.dirty || e.touched);
  }

  hasError(name: string): boolean {
    const e = this.getControl(name);
    return e && (e.dirty || e.touched) && e.invalid;
  }

  getValue(name: string): any {
    return this.getControl(name).value;
  }

  setValue(name: string, value: any): void {
    this.getControl(name).setValue(value);
  }
}
