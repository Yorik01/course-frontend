import { Component, Input, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { ImageBlock } from 'src/app/shared/models/ImageBlock';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
})
export class ImageViewerComponent implements OnInit {
  @Input() imageBlock: ImageBlock;

  constructor() {}

  ngOnInit(): void {
    const reader = new FileReader();
    of(this.imageBlock.value).subscribe((data) => {
      reader.readAsDataURL(data as Blob);
      reader.onload = (event) => {
        this.imageBlock.url = (event.target as FileReader).result;
      };
    });
  }
}
