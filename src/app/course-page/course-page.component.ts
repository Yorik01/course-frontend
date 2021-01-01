import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {
  CourseCategories,
  CourseCategory,
} from '../shared/models/CourseCategory';
import { Lesson } from '../shared/models/Lesson';
import { ActivatedRoute, Router } from '@angular/router';
import { Guid } from '../guid';
import { Course } from '../shared/models/Course';
import {
  CourseService,
  CreateCourseRequest,
  UpdateCourseRequest,
} from '../services/course.service';
import { MediaService } from '../services/media.service';
import {
  LessonMaterialResponse,
  LessonMaterialType,
  LessonService,
} from '../services/lesson.service';
import { forkJoin, from, of } from 'rxjs';
import { Block } from '../shared/models/Block';
import { TipBlock } from '../shared/models/TipBlock';
import { TextBlock } from '../shared/models/TextBlock';
import { AudioBlock } from '../shared/models/AudioBlock';
import { ImageBlock } from '../shared/models/ImageBlock';
import { VideoBlock } from '../shared/models/VideoBlock';
import { TestBlock } from '../shared/models/TestBlock';
import { Test, TestOption, TestType } from '../shared/models/Test';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-course-page',
  templateUrl: './course-page.component.html',
  styleUrls: ['./course-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CoursePageComponent implements OnInit {
  categories: string[] = CourseCategories;
  categorySelect: FormControl = new FormControl('', [Validators.required]);
  category: CourseCategory;
  lessons: Lesson[] = [];
  constructorMode = false;
  lessonEdit: Lesson;
  imageLoaded = false;
  url: any;
  image: File | Blob;

  @Input() course: Course;

  @ViewChild('file') file;

  constructor(
    private courseService: CourseService,
    activeRoute: ActivatedRoute,
    private mediaService: MediaService,
    private lessonService: LessonService
  ) {
    let id = Number.parseInt(activeRoute.snapshot.params['id']);
    if (id) {
      this.course = new Course();
      this.course.id = id;
    }
  }

  ngOnInit(): void {
    if (this.course.id) {
      this.reloadData();
    }
  }

  onAddLesson(): void {
    const lessonName = `Lesson ${this.lessons.length + 1} - ...`;
    this.lessons.push(new Lesson(null, lessonName));
  }

  onEditLesson(lesson: Lesson): void {
    this.constructorMode = true;
    this.lessonEdit = lesson;
  }

  onDeleteLesson(lesson: Lesson, callback?: () => void): void {
    this.lessonService.deleteLesson(lesson.id).subscribe(() => {
      this.lessons = this.lessons.filter((l) => l.guid !== lesson.guid);
      if (callback) {
        callback();
      }
    });
  }

  onSaveLesson(deleteLessonId?: number): void {
    if (deleteLessonId) {
      let lesson = this.lessons.find((l) => l.id === deleteLessonId);
      this.lessons = [];
      this.onDeleteLesson(lesson, () => {
        this.reloadData();
        this.constructorMode = false;
      });
    } else {
      this.lessons = [];
      this.constructorMode = false;
      this.reloadData();
    }
  }

  onSaveCourse(): void {
    if (!this.image) {
      return;
    }
    if (!this.course.id) {
      this.mediaService.createMedia(this.image).subscribe((data) => {
        let request: CreateCourseRequest = {
          name: this.course.name,
          description: this.course.description,
          mediaId: data.id,
          category: this.category,
        };

        this.courseService.createCourse(request).subscribe((data) => {
          this.course.id = data.id;
        });
      });
    } else {
      let request: UpdateCourseRequest = {
        id: this.course.id,
        description: this.course.description,
        mediaId: this.course.mediaId,
      };
      this.courseService.updateCourse(request).subscribe((data) => {
        this.course.description = data.description;
      });
    }
  }

  onImageUpload(): void {
    this.file.nativeElement.click();
  }

  onFileAdded(files: FileList): void {
    this.loadFile(files.item(0));
  }

  loadFile(file: File | Blob) {
    this.image = file;
    const reader = new FileReader();
    of(file).subscribe((data) => {
      reader.readAsDataURL(data);
      reader.onload = (event) => {
        this.imageLoaded = true;
        this.url = (event.target as FileReader).result;
      };
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

  private reloadData() {
    this.courseService.getCourseById(this.course.id).subscribe((course) => {
      if (!course) {
        this.course = new Course();
      }

      this.mediaService.getMediaById(course.media.id).subscribe((data) => {
        this.loadFile(data);
      });

      this.course.name = course.name;
      this.course.description = course.description;

      course.lessons.forEach((_lesson) => {
        let lesson = new Lesson(_lesson.id, null, _lesson.title);

        this.lessons.push(lesson);

        if (_lesson.materials) {
          from(_lesson.materials).subscribe((material) => {
            this.lessonService
              .getLessonMaterial(material.id)
              .subscribe((material) => {
                lesson.blocks.push(this.getBlockByMaterialResponse(material));
              });
          });
        }
      });
    });
  }
}
