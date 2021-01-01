import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { from } from 'rxjs';
import {
  debounceTime,
  delay,
  filter,
  finalize,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';
import { CourseService } from '../services/course.service';
import { MediaService } from '../services/media.service';
import { UserService } from '../services/user.service';
import {
  CourseCategories,
  CourseCategory,
} from '../shared/models/CourseCategory';
import { CourseWithImage } from '../shared/models/CourseWithImage';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss'],
})
export class CourseListComponent implements OnInit {
  courses: CourseWithImage[] = [];
  categories: string[] = CourseCategories;
  categorySelect: FormControl = new FormControl('');
  nameControl: FormControl = new FormControl('');
  loading = true;

  constructor(
    private courseService: CourseService,
    private mediaService: MediaService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadCourses();

    this.categorySelect.valueChanges
      .pipe(debounceTime(300))
      .subscribe((value) => {
        this.loadCourses(value, this.nameControl.value);
      });

    this.nameControl.valueChanges.pipe(debounceTime(300)).subscribe((value) => {
      this.loadCourses(this.categorySelect.value, value);
    });
  }

  private loadCourses(category?: CourseCategory, name?: string) {
    this.courses = [];
    this.loading = true;
    this.courseService
      .getCoursesWithFilter(category, name)
      .pipe(
        switchMap((data) => from(data)),
        map(
          (data) =>
            new CourseWithImage(
              data.id,
              data.name,
              data.description,
              data.media.id,
              data.lessons ? data.lessons.length : 0
            )
        ),
        delay(500),
        finalize(() => (this.loading = false))
      )
      .subscribe((course) => {
        this.userService.user.pipe(filter((val) => !!val)).subscribe((val) => {
          if (!val.notShowingCourses.includes(course.id)) {
            this.courses.push(course);
            this.mediaService.getMediaById(course.mediaId).subscribe((src) => {
              course.loadImage(src);
            });
          }
        });
      });
  }
}
