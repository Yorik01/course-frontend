import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BaseFormComponent } from '../shared/models/BaseFormComponent';
import { Lesson } from '../shared/models/Lesson';

@Component({
  selector: 'app-lesson-form',
  templateUrl: './lesson-form.component.html',
  styleUrls: ['./lesson-form.component.scss'],
})
export class LessonFormComponent extends BaseFormComponent implements OnInit {
  @Input() lesson: Lesson;
  @Output() deleteLesson = new EventEmitter<Lesson>();
  @Output() editLesson = new EventEmitter<Lesson>();

  form = this.fb.group({
    nameControl: ['', [Validators.required]],
    descriptionControl: [''],
  });

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.setValue('nameControl', this.lesson.name);
    this.setValue('descriptionControl', this.lesson.desciption);
  }

  onEditLesson(): void {
    this.lesson.name = this.getValue('nameControl');
    this.lesson.desciption = this.getValue('descriptionControl');
    this.editLesson.emit(this.lesson);
  }

  onDeleteLesson(): void {
    this.deleteLesson.emit(this.lesson);
  }
}
