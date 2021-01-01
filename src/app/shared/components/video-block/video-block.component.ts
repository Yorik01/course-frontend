import { Component, OnInit, ViewChild } from '@angular/core';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { BlockComponent } from '../../models/BlockComponent';

@Component({
  selector: 'app-video-block',
  templateUrl: './video-block.component.html',
  styleUrls: ['./video-block.component.scss'],
})
export class VideoBlockComponent extends BlockComponent implements OnInit {
  @ViewChild('file') file;

  videoToUpload: File = null;
  url = null;

  constructor() {
    super();
  }

  ngOnInit(): void {
    if (this.block.value) {
      this.loadFile(this.block.value as File);
      this.videoToUpload = this.block.value as File;
    }
  }

  loadVideo(): void {
    this.file.nativeElement.click();
  }

  onFileAdded(files: FileList): void {
    this.videoToUpload = files.item(0);
    this.block.value = this.videoToUpload;
    this.loadFile(this.videoToUpload);
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
