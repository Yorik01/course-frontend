import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CourseLessonResponse } from './course.service';
import { MediaResponse } from './media.service';

@Injectable({
  providedIn: 'root',
})
export class LessonService {
  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string
  ) {}

  createLesson(request: CreateLessonRequest): Observable<CourseLessonResponse> {
    return this.http.post<CourseLessonResponse>(
      `${this.baseUrl}/lesson`,
      request
    );
  }

  deleteLesson(lessonId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/lesson/${lessonId}`);
  }

  getLessonById(lessonId: number): Observable<CourseLessonResponse> {
    return this.http.get<CourseLessonResponse>(
      `${this.baseUrl}/lesson/${lessonId}`
    );
  }

  getLessonMaterial(
    lessonMaterialId: number
  ): Observable<LessonMaterialResponse> {
    return this.http.get<LessonMaterialResponse>(
      `${this.baseUrl}/lesson/material/${lessonMaterialId}`
    );
  }
}

export interface LessonMaterialResponse {
  type?: LessonMaterialType;
  id?: number;
  media?: MediaResponse;
  textContent?: TextContentResponse;
  test?: TestResponse;
}

export interface TextContentResponse {
  id: number;
  text: string;
  isTip: boolean;
}

export interface TestResponse {
  id: number;
  task: string;
  score: number;
  options: TestOptionResponse[];
}

export interface TestOptionResponse {
  id: number;
  title: string;
  isRight: boolean;
}

export interface CreateLessonRequest {
  courseId: number;
  title: string;
  lessonMaterials: CreateLessonMaterialRequest[];
  description: string;
}

export interface CreateLessonMaterialRequest {
  type?: LessonMaterialType;
  mediaId?: number;
  textContent?: CreateTextContentRequest;
  test?: CreateTestRequest;
  order: number;
}

export interface CreateTextContentRequest {
  text: string;
  isTip: boolean;
}

export interface CreateTestRequest {
  task: string;
  score: number; //1-10
  testOptions: CreateTestOptionRequest[];
}

export interface CreateTestOptionRequest {
  title: string;
  isRight: boolean;
}

export enum LessonMaterialType {
  Text = 'text',
  Image = 'image',
  Video = 'video',
  Test = 'test',
  Audio = 'audio',
}
