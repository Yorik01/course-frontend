import { EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { TestOption } from 'src/app/shared/models/Test';
import { TestAnswerType } from '../../../models/TestAnswerType';

@Component({
  selector: 'app-choice-form',
  templateUrl: './choice-form.component.html',
  styleUrls: ['./choice-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChoiceFormComponent implements OnInit {
  @Input() type: TestAnswerType;
  @Input() option: TestOption;
  @Input() answer: boolean;
  @Output() onRadioChange = new EventEmitter<number>();

  radioChecked = false;

  constructor() {}

  ngOnInit(): void {
    if (this.type === TestAnswerType.Short) {
      this.option.isRight = true;
    }
    if (this.type === TestAnswerType.Single && this.option.isRight) {
      this.radioChecked = true;
    }
  }

  changeRadio() {
    if (!this.answer) {
      this.onRadioChange.emit(this.option.value);
    } else {
      this.onRadioChange.emit(this.option.id);
    }
  }
}
