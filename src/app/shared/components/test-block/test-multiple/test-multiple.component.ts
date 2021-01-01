import { Component, Input, OnInit } from '@angular/core';
import { Test } from 'src/app/shared/models/Test';

@Component({
  selector: 'app-test-multiple',
  templateUrl: './test-multiple.component.html',
})
export class TestMultipleComponent implements OnInit {
  @Input() test: Test;
  @Input() answer: boolean;
  @Input() courseId: number;
  constructor() {}

  ngOnInit(): void {}
}
