import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from '../shared/models/Course';
import { CourseCategory } from '../shared/models/CourseCategory';
import { LessonMaterialType } from './lesson.service';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string
  ) {}

  getCourses(): Observable<CourseResponse[]> {
    return this.http.get<CourseResponse[]>(`${this.baseUrl}/course`);
  }

  getCoursesWithFilter(
    category?: CourseCategory,
    name?: string
  ): Observable<CourseResponse[]> {
    let params = new HttpParams();
    if (category) {
      params = params.append('category', category);
    }

    if (name) {
      params = params.append('name', name);
    }

    return this.http.get<CourseResponse[]>(`${this.baseUrl}/course/filter`, {
      params,
    });
  }

  createCourse(course: CreateCourseRequest): Observable<CourseResponse> {
    return this.http.post<CourseResponse>(`${this.baseUrl}/course`, course);
  }

  updateCourse(course: UpdateCourseRequest): Observable<CourseResponse> {
    return this.http.patch<CourseResponse>(
      `${this.baseUrl}/course/${course.id}`,
      course
    );
  }

  deleteCourse(courseId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/course/${courseId}`);
  }

  getCourseById(courseId: number): Observable<CourseResponse> {
    return this.http.get<CourseResponse>(`${this.baseUrl}/course/${courseId}`);
  }

  savePoints(request: SavePointsRequest): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/incrementScore`, request);
  }

  createCertificate(
    request: SaveCertificateRequest
  ): Observable<SaveCertificateResponse> {
    return this.http.post<SaveCertificateResponse>(
      `${this.baseUrl}/certificate`,
      request
    );
  }

  deleteCertificate(certificateId: number): Observable<any> {
    return this.http.delete<any>(
      `${this.baseUrl}/certificate/${certificateId}`
    );
  }

  getCertificate(certificateId: number): Observable<CertificateResponse> {
    return this.http.get<CertificateResponse>(
      `${this.baseUrl}/certificate/${certificateId}`
    );
  }
  getCertificates(userId: number): Observable<CertificateResponse[]> {
    return this.http.get<CertificateResponse[]>(
      `${this.baseUrl}/certificate/userCertificates?userId=${userId}`
    );
  }

  getMaxScore(courseId: number): Observable<MaxScoreResponse> {
    return this.http.get<MaxScoreResponse>(
      `${this.baseUrl}/course/maxScore?courseId=${courseId}`
    );
  }
}

export interface MaxScoreResponse {
  maxScore: number;
}

export interface CreateCourseRequest {
  name: string;
  description: string;
  mediaId: number;
  category: CourseCategory;
}

export interface CourseResponse {
  id: number;
  name: string;
  description: string;
  media: {
    id: number;
    fileName: string;
    mimetype: string;
    title: string;
  };
  lessons: CourseLessonResponse[];
}

export interface UpdateCourseRequest {
  id: number;
  description: string;
  mediaId: number;
}

export interface CourseLessonResponse {
  id: number;
  title: string;
  description: string;
  materials: CourseLessonMaterialResponse[];
}

export interface CourseLessonMaterialResponse {
  id: number;
  type: LessonMaterialType;
  order: number;
}

export interface SavePointsRequest {
  userId: number;
  courseId;
  score: number;
}

export interface SaveCertificateRequest {
  userId: number;
  courseId: number;
}

export interface SaveCertificateResponse {
  id: number;
  date: Date;
}

export interface CertificateResponse {
  id: number;
  date: Date;
  userCourseId: number;
  userCourse: {
    id: number;
    status: string;
    score: number;
    course: {
      course: {
        id: number;
      };
      maxScore: number;
    };
  };
}
