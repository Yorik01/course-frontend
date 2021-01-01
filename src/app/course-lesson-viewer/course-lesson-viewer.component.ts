import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, from, of } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';
import {
  CourseService,
  SaveCertificateRequest,
} from '../services/course.service';
import {
  LessonMaterialResponse,
  LessonMaterialType,
  LessonService,
} from '../services/lesson.service';
import { MediaService } from '../services/media.service';
import { UserService } from '../services/user.service';
import { AudioBlock } from '../shared/models/AudioBlock';
import { Block } from '../shared/models/Block';
import { Course } from '../shared/models/Course';
import { ImageBlock } from '../shared/models/ImageBlock';
import { Lesson } from '../shared/models/Lesson';
import { Test, TestOption, TestType } from '../shared/models/Test';
import { TestBlock } from '../shared/models/TestBlock';
import { TextBlock } from '../shared/models/TextBlock';
import { TipBlock } from '../shared/models/TipBlock';
import { VideoBlock } from '../shared/models/VideoBlock';

@Component({
  selector: 'app-course-lesson-viewer',
  templateUrl: './course-lesson-viewer.component.html',
  styleUrls: ['./course-lesson-viewer.component.scss'],
})
export class CourseLessonViewerComponent implements OnInit {
  lessonToView: Lesson;
  course: Course;
  public imageSrc?: string;

  constructor(
    private lessonService: LessonService,
    private mediaService: MediaService,
    private coursService: CourseService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.realoadLessons();
  }

  private loadImage(image: Blob) {
    let reader = new FileReader();
    reader.onload = (event) => {
      this.imageSrc = (event.target as FileReader).result as string;
    };
    reader.readAsDataURL(image);
  }

  onLessonView(lesson: Lesson) {
    this.loadLessonDetails(lesson.id);
  }

  loadLessonDetails(lessonId: number) {
    this.lessonService.getLessonById(lessonId).subscribe((data) => {
      this.lessonToView = new Lesson();
      this.lessonToView.name = data.title;
      this.lessonToView.desciption = data.description;
      this.lessonToView.id = data.id;

      if (data.materials) {
        from(data.materials).subscribe((material) => {
          this.lessonService
            .getLessonMaterial(material.id)
            .subscribe((material) => {
              this.lessonToView.blocks.push(
                this.getBlockByMaterialResponse(material)
              );
            });
        });
      }
    });
  }

  getBlockByMaterialResponse(matResponse: LessonMaterialResponse): Block {
    let block: Block;

    switch (matResponse.type) {
      case LessonMaterialType.Text:
        if (matResponse.textContent.isTip) {
          block = new TipBlock();
        } else {
          block = new TextBlock();
        }
        block.value = matResponse.textContent.text;
        break;
      case LessonMaterialType.Test:
        block = new TestBlock();
        block.value = new Test(
          matResponse.test.task,
          matResponse.test.score,
          this.getTestTypeByOptions(matResponse.test.options)
        );
        block.value.testOptions = matResponse.test.options;
        break;
      case LessonMaterialType.Audio:
        block = new AudioBlock();

        this.getMediaById(matResponse.media.id, block);
        break;
      case LessonMaterialType.Image:
        block = new ImageBlock();

        this.getMediaById(matResponse.media.id, block);
        break;
      case LessonMaterialType.Video:
        block = new VideoBlock();

        this.getMediaById(matResponse.media.id, block);
        break;
    }

    return block;
  }

  private getMediaById(mediaId: number, block: Block) {
    this.mediaService.getMediaById(mediaId).subscribe((data) => {
      block.value = data;
    });
  }

  private getTestTypeByOptions(testOptions: TestOption[]) {
    if (testOptions.length === 1 && testOptions[0].isRight) {
      return TestType.Short;
    } else if (testOptions.filter((t) => t.isRight).length === 1) {
      return TestType.Radio;
    } else {
      return TestType.Checkbox;
    }
  }

  onGoBackByAnchor() {
    this.lessonToView = undefined;
  }

  leaveCourse() {
    this.userService
      .leaveCourese(this.course.id, this.userService.user.value.id)
      .subscribe(() => this.router.navigateByUrl('/user/courses'));
  }

  isLessonFinished(lessonId: number) {
    return this.userService.user.value.passedLessons.includes(lessonId);
  }

  get isCourseFinished() {
    let sorted = this.course.lessons.map((l) => l.id).sort((n1, n2) => n1 - n2);
    let sorted2 = this.userService.user.value.passedLessons.sort(
      (n1, n2) => n1 - n2
    );

    return sorted.every((val, index) => val === sorted2[index]);
  }

  private realoadLessons() {
    this.coursService
      .getCourseById(Number.parseInt(this.activatedRoute.snapshot.params['id']))
      .subscribe((course) => {
        this.course = course;
        this.course.mediaId = course.media.id;
        this.mediaService
          .getMediaById(this.course.mediaId)
          .subscribe((result) => this.loadImage(result));
      });
  }
}
