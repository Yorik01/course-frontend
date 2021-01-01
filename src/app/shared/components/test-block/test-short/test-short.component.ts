import { Component, Input, OnInit } from '@angular/core';
import { Test } from 'src/app/shared/models/Test';

@Component({
  selector: 'app-test-short',
  templateUrl: './test-short.component.html',
})
export class TestShortComponent implements OnInit {
  @Input() test: Test;
  @Input() answer: boolean;
  @Input() courseId: number;
  constructor() {}

  ngOnInit(): void {}
}
