import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { from } from 'rxjs/internal/observable/from';
import { filter, map, switchMap } from 'rxjs/operators';
import { CourseService } from 'src/app/services/course.service';
import { MediaService } from 'src/app/services/media.service';
import { UserCourseItem, UserService } from 'src/app/services/user.service';
import { Certificate } from 'src/app/shared/models/Certificate';
import { CourseWithImage } from 'src/app/shared/models/CourseWithImage';
import { ProfileMenuItem } from 'src/app/shared/models/ProfileMenuItem';
import { UserProfile } from 'src/app/shared/models/UserProfile';

@Component({
  selector: 'app-user-profile-certificates',
  templateUrl: './user-profile-certificates.component.html',
  styleUrls: ['./user-profile-certificates.component.scss'],
})
export class UserProfileCertificatesComponent implements OnInit {
  certificates: Certificate[] = [];

  menuItems: ProfileMenuItem[] = [
    new ProfileMenuItem('My profile', false, '/user/profile'),
    new ProfileMenuItem('My courses', false, '/user/courses'),
    new ProfileMenuItem('Certificates', true, '/user/certificates'),
  ];

  profile: UserProfile;

  constructor(
    private userService: UserService,
    private mediaService: MediaService,
    private router: Router,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.userService.getProfile().subscribe((profile) => {
      this.profile = profile;

      this.mediaService
        .getMediaById(this.profile.mediaId)
        .subscribe((image) => {
          this.profile.loadImage(image);
        });
      this.userService.getCourses(this.profile.id).subscribe((courses) => {
        this.userService.getCreatedCourses().subscribe((createdCourses) => {
          this.profile.courseCreated = createdCourses.map(
            (x) => new CourseWithImage(x.id, x.name, '', x.mediaId, 0)
          ).length;
          this.profile.courseCompleted = this.getCoursesByType(
            courses,
            'finished'
          ).length;
          this.profile.courseStarted = this.getCoursesByType(
            courses,
            'started'
          ).length;
        });
      });
    });
    this.userService.user.pipe(filter((u) => !!u)).subscribe((data) => {
      this.courseService
        .getCertificates(data.id)
        .pipe(
          switchMap((c) => from(c)),
          map((cert) => {
            let c = new Certificate(
              cert.id,
              '',
              cert.date,
              cert.userCourse.score,
              Math.round(
                (cert.userCourse.score / cert.userCourse.course.maxScore) * 1000
              ) / 10
            );
            this.courseService
              .getCourseById(cert.userCourse.course.course.id)
              .subscribe((data) => (c.name = data.name));
            return c;
          })
        )
        .subscribe((data) => this.certificates.push(data));
    });
  }

  private getCoursesByType(
    courses: UserCourseItem[],
    type: 'started' | 'finished' | 'created'
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
            c.course.lessons
          )
      );
  }

  onCertificateClick(cert: Certificate) {
    this.router.navigate([
      '/cert',
      cert.id,
      { certName: cert.name, certDate: cert.date },
    ]);
  }
}
