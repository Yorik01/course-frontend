import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { empty, forkJoin, Observable, zip } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { LessonMaterialType } from './lesson.service';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string
  ) {}

  createMockImage(): Observable<MediaResponse> {
    return this.getMediaById(1).pipe(
      switchMap((data) => this.createMedia(data))
    );
  }

  createMedia(file: Blob | File): Observable<MediaResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<MediaResponse>(`${this.baseUrl}/media`, formData);
  }

  getMediaById(mediaId: number): Observable<Blob> {
    return this.http.get<Blob>(`${this.baseUrl}/media/${mediaId}`, {
      responseType: 'blob' as 'json',
    });
  }

  createMediaMany(blobs: MediaRequest[]): Observable<MediaOrderResponse[]> {
    let requests = blobs.map((blob) =>
      this.createMedia(blob.value).pipe(
        map((response) => {
          return {
            mediaId: response.id,
            order: blob.order,
            type: blob.type,
          } as MediaOrderResponse;
        })
      )
    );

    return forkJoin(requests);
  }
}

export interface MediaResponse {
  id: number;
  fileName: string;
  mimetype: string;
  title: string;
}

export interface MediaOrderResponse {
  mediaId: number;
  order: number;
  type:
    | LessonMaterialType.Video
    | LessonMaterialType.Image
    | LessonMaterialType.Audio;
}

export interface MediaRequest {
  type:
    | LessonMaterialType.Video
    | LessonMaterialType.Image
    | LessonMaterialType.Audio;
  value: Blob | File;
  order: number;
}
