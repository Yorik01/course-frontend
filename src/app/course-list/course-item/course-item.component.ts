import { Component, Input, OnInit } from '@angular/core';
import { CourseWithImage } from 'src/app/shared/models/CourseWithImage';

@Component({
  selector: 'app-course-item',
  templateUrl: './course-item.component.html',
  styleUrls: ['./course-item.component.scss'],
})
export class CourseItemComponent implements OnInit {
  @Input() course: CourseWithImage;

  constructor() {}

  ngOnInit() {}
}
