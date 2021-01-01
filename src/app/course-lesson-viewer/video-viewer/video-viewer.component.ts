import { Component, Input, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { VideoBlock } from 'src/app/shared/models/VideoBlock';

@Component({
  selector: 'app-video-viewer',
  templateUrl: './video-viewer.component.html',
})
export class VideoViewerComponent implements OnInit {
  @Input() videoBlock: VideoBlock;

  constructor() {}

  ngOnInit(): void {
    const reader = new FileReader();
    of(this.videoBlock.value)
      .pipe(delay(500))
      .subscribe((data) => {
        reader.readAsDataURL(data as Blob);
        reader.onload = (event) => {
          this.videoBlock.url = (event.target as FileReader).result;
        };
      });
  }
}
