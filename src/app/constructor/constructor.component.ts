import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import {
  CreateLessonMaterialRequest,
  LessonService,
  LessonMaterialType,
  CreateTestRequest,
  CreateLessonRequest,
  CreateTestOptionRequest,
} from '../services/lesson.service';
import { MediaRequest, MediaService } from '../services/media.service';
import { Block } from '../shared/models/Block';
import { Lesson } from '../shared/models/Lesson';
import { Test } from '../shared/models/Test';

@Component({
  selector: 'app-constructor',
  templateUrl: './constructor.component.html',
  styleUrls: ['./constructor.component.scss'],
})
export class ConstructorComponent implements OnInit {
  @Input() lesson: Lesson;
  @Input() courseId: number;
  @Output() saveLesson = new EventEmitter<number | undefined>();

  constructor(
    private mediaService: MediaService,
    private lessonService: LessonService
  ) {}

  ngOnInit(): void {}

  onAddBlock(block: Block): void {
    this.lesson.blocks.push(block);
  }

  onDeleteBlock(id: string): void {
    this.lesson.blocks = this.lesson.blocks.filter((b) => b.id !== id);
  }

  onSaveLesson(): void {
    let request: CreateLessonRequest = {
      title: this.lesson.name,
      lessonMaterials: [],
      courseId: this.courseId,
      description: this.lesson.desciption,
    };

    let files: MediaRequest[] = [];

    this.lesson.blocks.forEach((b, index) => {
      let value = b.value;

      switch (b.name) {
        case 'text':
          request.lessonMaterials.push(
            this.getLessonMaterialTextRequest(value as string, false, index)
          );
          break;
        case 'tip':
          request.lessonMaterials.push(
            this.getLessonMaterialTextRequest(value as string, true, index)
          );
          break;
        case 'test':
          request.lessonMaterials.push(
            this.getLessonMaterialTestRequest(value as Test, index)
          );
          break;
        case 'audio':
          files.push({
            type: LessonMaterialType.Audio,
            value: value as File,
            order: index,
          });
          break;
        case 'video':
          files.push({
            type: LessonMaterialType.Video,
            value: value as File,
            order: index,
          });
          break;
        case 'image':
          files.push({
            type: LessonMaterialType.Image,
            value: value as File,
            order: index,
          });
          break;
      }
    });

    if (files.length !== 0) {
      this.mediaService.createMediaMany(files).subscribe((data) => {
        data.forEach((b) => {
          request.lessonMaterials.splice(
            b.order,
            0,
            this.getLessonMaterialBlobRequest(b.mediaId, b.order, b.type)
          );
        });

        this.createLesson(request);
      });
    } else {
      this.createLesson(request);
    }
  }

  private createLesson(request: CreateLessonRequest) {
    this.lessonService.createLesson(request).subscribe((data) => {
      if (this.lesson.id) {
        this.saveLesson.emit(this.lesson.id);
      } else {
        this.saveLesson.emit();
      }
    });
  }

  private getLessonMaterialTestRequest(
    test: Test,
    order: number
  ): CreateLessonMaterialRequest {
    return {
      type: LessonMaterialType.Test,
      order: order,
      test: {
        task: test.task,
        score: test.score,
        testOptions: test.testOptions.map(
          (t) =>
            <CreateTestOptionRequest>{
              isRight: t.isRight,
              title: t.title,
            }
        ),
      },
    };
  }

  private getLessonMaterialBlobRequest(
    mediaId: number,
    order: number,
    type:
      | LessonMaterialType.Video
      | LessonMaterialType.Image
      | LessonMaterialType.Audio
  ): CreateLessonMaterialRequest {
    return {
      type: type,
      mediaId: mediaId,
      order: order,
    };
  }

  private getLessonMaterialTextRequest(
    value: string,
    isTip: boolean,
    order: number
  ): CreateLessonMaterialRequest {
    return {
      type: LessonMaterialType.Text,
      order: order,
      textContent: {
        text: value,
        isTip: isTip,
      },
    };
  }
}
