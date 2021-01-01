import { Component, OnInit, ViewChild } from '@angular/core';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { BlockComponent } from '../../models/BlockComponent';

@Component({
  selector: 'app-image-block',
  templateUrl: './image-block.component.html',
  styleUrls: ['./image-block.component.scss'],
})
export class ImageBlockComponent extends BlockComponent implements OnInit {
  @ViewChild('file') file;

  url: string | ArrayBuffer;
  imageToUpload: File;

  constructor() {
    super();
  }

  ngOnInit(): void {
    if (this.block.value) {
      this.loadFile(this.block.value as File);
      this.imageToUpload = this.block.value as File;
    }
  }

  onImageUpload(): void {
    this.file.nativeElement.click();
  }

  onFileAdded(files: FileList): void {
    this.imageToUpload = files.item(0);
    this.block.value = this.imageToUpload;
    this.loadFile(this.imageToUpload);
  }

  loadFile(file: File) {
    const reader = new FileReader();
    of(file)
      .pipe(delay(500))
      .subscribe((data) => {
        reader.readAsDataURL(data);
        reader.onload = (event) => {
          this.url = (event.target as FileReader).result;
        };
      });
  }
}
