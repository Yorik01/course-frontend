import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { UserProfile } from '../shared/models/UserProfile';
import { CourseLessonResponse } from './course.service';
import { Course } from '../shared/models/Course';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public user: BehaviorSubject<User | null> = new BehaviorSubject(null);

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string
  ) {
    if (this.isAuthenticated) {
      this.reloadUserValue();
    }
  }

  get isAuthenticated() {
    return localStorage.getItem('token') !== null;
  }

  getProfile(): Observable<UserProfile> {
    const url = `${this.baseUrl}/user`;

    return this.http
      .get<UserProfile>(url)
      .pipe(
        map(
          (r) =>
            new UserProfile(
              r.id,
              r.name,
              r.email,
              r.birthday,
              null,
              null,
              null,
              r.bio,
              r.mediaId
            )
        )
      );
  }

  updateProfile(request: UpdateProfileRequest): Observable<any> {
    const url = `${this.baseUrl}/user`;

    return this.http.put<any>(url, request);
  }

  register(request: RegisterRequest): Observable<string> {
    const url = `${this.baseUrl}/user`;

    return this.http.post<any>(url, request).pipe(
      map((r) => r.token),
      tap((t) => this.saveToken(t))
    );
  }

  login(request: LoginRequest): Observable<string> {
    const url = `${this.baseUrl}/user/login`;

    return this.http.post<any>(url, request).pipe(
      map((r) => r.token),
      tap((t) => this.saveToken(t))
    );
  }

  enrollCourse(courseId: number, userId: number) {
    const url = `${this.baseUrl}/course/${courseId}/user/${userId}/join`;

    return this.http.post(url, null).pipe(tap(() => this.reloadUserValue()));
  }

  leaveCourese(courseId: number, userId: number) {
    const url = `${this.baseUrl}/course/${courseId}/user/${userId}/quit`;

    return this.http.post(url, null).pipe(tap(() => this.reloadUserValue()));
  }

  finishLesson(lessonId: number, userId: number) {
    const url = `${this.baseUrl}/user/${userId}/lesson/${lessonId}/finish`;

    return this.http.post(url, null).pipe(tap(() => this.reloadUserValue()));
  }

  finishCourse(courseId: number, userId: number) {
    const url = `${this.baseUrl}/course/${courseId}/user/${userId}/complete`;

    return this.http.post(url, null).pipe(tap(() => this.reloadUserValue()));
  }

  getCourses(id: number): Observable<UserCourseItem[]> {
    const url = `${this.baseUrl}/user/courses?userId=${id}`;

    return this.http.get<UserCourseItem[]>(url);
  }

  getCreatedCourses(): Observable<OwnUserCourse[]> {
    const url = `${this.baseUrl}/course/self`;

    return this.http.get<OwnUserCourse[]>(url);
  }

  logout() {
    localStorage.removeItem('token');
  }

  private saveToken(token: string) {
    localStorage.setItem('token', token);
    this.reloadUserValue();
  }

  reloadUserValue() {
    this.getProfile().subscribe((p) => {
      this.getCourses(p.id).subscribe((c) => {
        let allLessons: number[] = [];
        c.map((c) => c.passedLessons.map((r) => r.id)).forEach((l) =>
          allLessons.push(...l)
        );
        let notShowingCourses = c
          .filter((c) => c.status !== 'created')
          .map((c) => c.courseId);

        this.user.next({
          id: p.id,
          email: p.email,
          name: p.name,
          passedLessons: allLessons,
          notShowingCourses: notShowingCourses,
        });
      });
    });
  }
}

export interface RegisterRequest {
  name: string;
  surname: string;
  email: string;
  birthday: Date;
  bio: string;
  mediaId?: number;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UpdateProfileRequest {
  email: string;
  birthday: Date;
  bio: string;
  mediaId: number;
  name: string;
}

export interface UserCourseItem {
  status: 'started' | 'created' | 'finished';
  score: number;
  courseId: number;
  passedLessons: CourseLessonResponse[];
  course: Course;
}

export interface OwnUserCourse {
  id: number;
  name: string;
  mediaId: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  notShowingCourses: number[];
  passedLessons: number[];
}
