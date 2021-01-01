import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { CourseService } from 'src/app/services/course.service';
import { MediaService } from 'src/app/services/media.service';
import { UserCourseItem, UserService } from 'src/app/services/user.service';
import { Certificate } from 'src/app/shared/models/Certificate';
import { Course, CourseLesson } from 'src/app/shared/models/Course';
import { CourseWithImage } from 'src/app/shared/models/CourseWithImage';
import { ProfileMenuItem } from 'src/app/shared/models/ProfileMenuItem';
import { UserProfile } from 'src/app/shared/models/UserProfile';

@Component({
  selector: 'app-user-profile-courses',
  templateUrl: './user-profile-courses.component.html',
  styleUrls: ['./user-profile-courses.component.scss'],
})
export class UserProfileCoursesComponent implements OnInit {
  menuItems: ProfileMenuItem[] = [
    new ProfileMenuItem('My profile', false, '/user/profile'),
    new ProfileMenuItem('My courses', true, '/user/courses'),
    new ProfileMenuItem('Certificates', false, '/user/certificates'),
  ];

  profile: UserProfile;

  started: CourseWithImage[] = [];
  created: CourseWithImage[] = [];
  completed: CourseWithImage[] = [];

  startedFiltered: CourseWithImage[] = [];
  createdFiltered: CourseWithImage[] = [];
  completedFiltered: CourseWithImage[] = [];

  all = [...this.started, ...this.created, ...this.completed];

  searchCtrl: FormControl = new FormControl('');

  constructor(
    private mediaService: MediaService,
    private courseService: CourseService,
    public router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.getProfile().subscribe((profile) => {
      this.profile = profile;

      this.mediaService
        .getMediaById(this.profile.mediaId)
        .subscribe((image) => {
          this.profile.loadImage(image);
        });
      this.reloadCoursesByProfile();
    });

    this.searchCtrl.valueChanges.subscribe((value) => {
      if (!value) {
        this.startedFiltered = this.started;
        this.createdFiltered = this.created;
        this.completedFiltered = this.completed;
      }

      this.startedFiltered = this.started.filter((c) => c.name.includes(value));
      this.completedFiltered = this.completed.filter((c) =>
        c.name.includes(value)
      );
      this.createdFiltered = this.created.filter((c) => c.name.includes(value));
    });
  }

  private getCoursesByType(
    courses: UserCourseItem[],
    type: 'started' | 'finished'
  ) {
    return courses
      .filter((c) => c.status === type && c.course)
      .map(
        (c) =>
          new CourseWithImage(
            c.course.id,
            c.course.name,
            c.course.description,
            c.course.mediaId,
            c.course.lessons ? c.course.lessons.length : 0,
            '',
            c.course.lessons,
            c.score
          )
      );
  }

  onCourseDelete(id: number) {
    this.courseService.deleteCourse(id).subscribe(() => {
      this.reloadCoursesByProfile();
    });
  }

  reloadCoursesByProfile() {
    this.userService.getCourses(this.profile.id).subscribe((courses) => {
      this.userService.getCreatedCourses().subscribe((createdCourses) => {
        this.created = createdCourses.map(
          (x) => new CourseWithImage(x.id, x.name, '', x.mediaId, 0)
        );
        this.started = this.getCoursesByType(courses, 'started');
        this.completed = this.getCoursesByType(courses, 'finished');

        this.started.forEach((c) =>
          this.courseService
            .getMaxScore(c.id)
            .subscribe((max) => (c.maxScore = max.maxScore))
        );
        this.completed.forEach((c) =>
          this.courseService
            .getMaxScore(c.id)
            .subscribe((max) => (c.maxScore = max.maxScore))
        );

        this.profile.courseCreated = this.created.length;
        this.profile.courseCompleted = this.completed.length;
        this.profile.courseStarted = this.started.length;

        this.startedFiltered = this.started;
        this.completedFiltered = this.completed;
        this.createdFiltered = this.created;
        this.reloadCourses();
      });
    });
  }

  reloadCourses() {
    from([...this.started, ...this.completed, ...this.created]).subscribe(
      (val) => {
        this.mediaService
          .getMediaById(val.mediaId)
          .subscribe((result) => val.loadImage(result));
      }
    );
  }

  onCourseItemClick(courseId: number, coursePage: boolean = false) {
    if (coursePage) {
      this.router.navigateByUrl('course/enrollment/' + courseId);
    } else {
      this.router.navigateByUrl('course/view/' + courseId);
    }
  }

  getFinishedLessonsCount(course: Course) {
    if (!course.lessons) {
      return;
    }
    const ids = course.lessons.map((l) => l.id);
    const lessonsLength = this.userService.user.value.passedLessons.filter(
      (l) => ids.includes(l)
    ).length;

    return lessonsLength;
  }
}
