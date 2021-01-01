import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { delay } from 'rxjs/operators';
import {
  CourseService,
  SaveCertificateRequest,
} from 'src/app/services/course.service';
import { UserService } from 'src/app/services/user.service';
import { Course } from 'src/app/shared/models/Course';
import { Lesson } from 'src/app/shared/models/Lesson';
import { Test } from 'src/app/shared/models/Test';

@Component({
  selector: 'app-course-lesson-viewer-item',
  templateUrl: './course-lesson-viewer-item.component.html',
  styleUrls: ['./course-lesson-viewer-item.component.scss'],
})
export class CourseLessonViewerItemComponent implements OnInit {
  @Input() lesson: Lesson;
  @Input() course: Course;
  @Output() onGoBackByAnchor: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private router: Router,
    private userService: UserService,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {}

  onFinishLesson() {
    this.userService
      .finishLesson(this.lesson.id, this.userService.user.value.id)
      .pipe(delay(1000))
      .subscribe(() => {
        this.onGoBackByAnchor.emit();

        this.lesson.blocks
          .filter((b) => b.value as Test)
          .forEach((b) => {
            const test = b.value as Test;
            if (test && test.answerCallback) {
              test.answerCallback.subscribe();
            }
          });

        of(this.course.lessons.length)
          .pipe(delay(1000))
          .subscribe((data) => {
            const ids = this.course.lessons.map((l) => l.id);
            const lessonsLength = this.userService.user.value.passedLessons.filter(
              (l) => ids.includes(l)
            ).length;

            if (lessonsLength === data) {
              const request = <SaveCertificateRequest>{
                userId: this.userService.user.value.id,
                courseId: this.course.id,
              };
              const observables = {
                finishCourse: this.userService.finishCourse(
                  this.course.id,
                  this.userService.user.value.id
                ),
                createCertificate: this.courseService.createCertificate(
                  request
                ),
              };
              forkJoin(
                observables
              ).subscribe(({ finishCourse, createCertificate }) => {});
            }
          });
      });
  }
}
