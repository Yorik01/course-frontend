import { Component, Input, OnInit } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { timestamp } from 'rxjs/operators';
import {
  CourseService,
  SavePointsRequest,
} from 'src/app/services/course.service';
import { UserService } from 'src/app/services/user.service';
import { Test, TestOption } from 'src/app/shared/models/Test';
import { TestAnswerType } from '../../../models/TestAnswerType';
import { Option } from '../test-block.component';

@Component({
  selector: 'app-test-form',
  templateUrl: './test-form.component.html',
  styleUrls: ['./test-form.component.scss'],
})
export class TestFormComponent implements OnInit {
  @Input() type: TestAnswerType;
  @Input() test: Test;
  @Input() answer: boolean;
  @Input() courseId: number;

  rightOptions: Option[];

  answerError = false;

  constructor(
    private courseService: CourseService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    if (this.answer) {
      switch (this.type) {
        case TestAnswerType.Single:
          const optionSingle = new Option(
            this.test.testOptions.find((f) => f.isRight).id,
            true
          );
          this.rightOptions = [optionSingle];
          break;
        case TestAnswerType.Multiple:
          const options = this.test.testOptions
            .filter((o) => o.isRight)
            .map((o) => new Option(o.id, true));
          this.rightOptions = options;
          break;
        case TestAnswerType.Short:
          const optionShort = new Option(0, this.test.testOptions[0].title);
          this.rightOptions = [optionShort];
          break;
      }
    }

    if (!this.answer) {
      if (this.test.testOptions.length === 0) {
        this.addOption();

        if (this.type !== TestAnswerType.Short) {
          this.addOption();
        }
      } else if (
        this.test.testOptions.length === 2 &&
        this.type === TestAnswerType.Short
      ) {
        this.test.testOptions = [];
        this.addOption();
      }
    } else {
      this.test.testOptions.forEach((t) => (t.isRight = false));

      if (this.type === TestAnswerType.Short) {
        this.test.testOptions[0].title = '';
      }
    }
  }

  addOption(): void {
    this.test.testOptions.push(
      new TestOption(null, false, '', this.test.testOptions.length)
    );
  }

  onRadioChange(index: number) {
    this.test.testOptions.forEach((option) => (option.isRight = false));
    if (!this.answer) {
      this.test.testOptions[index].isRight = true;
    } else {
      this.test.testOptions.find((t) => t.id === index).isRight = true;
    }
  }

  savePoints() {
    if (!this.checkAnswer()) {
      this.answerError = true;
      return;
    } else {
      this.answerError = false;
      this.test.answered = true;
    }
    const request = <SavePointsRequest>{
      score: this.test.score,
      userId: this.userService.user.value.id,
      courseId: this.courseId,
    };
    this.test.answerCallback = this.courseService.savePoints(request);
  }

  checkAnswer(): boolean {
    switch (this.type) {
      case TestAnswerType.Single:
        const t = this.test.testOptions.find((f) => f.isRight);
        if (!t) return false;
        return this.rightOptions[0].index === t.id;
      case TestAnswerType.Multiple:
        const options = this.test.testOptions
          .filter((o) => o.isRight)
          .map((o) => o.id);
        console.log(options, this.rightOptions);
        if (options.length !== this.rightOptions.length) {
          return false;
        }
        for (let i = 0; i < options.length; i++) {
          if (options[i] !== this.rightOptions[i].index) {
            return false;
          }
        }
        return true;
      case TestAnswerType.Short:
        return this.rightOptions[0].value === this.test.testOptions[0].title;
    }
  }
}
