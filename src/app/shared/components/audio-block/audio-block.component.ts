import { Component, OnInit, ViewChild } from '@angular/core';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { BlockComponent } from '../../models/BlockComponent';

@Component({
  selector: 'app-audio-block',
  templateUrl: './audio-block.component.html',
  styleUrls: ['./audio-block.component.scss'],
})
export class AudioBlockComponent extends BlockComponent implements OnInit {
  @ViewChild('file') file;

  audioToUpload: File = null;
  url = null;

  constructor() {
    super();
  }

  ngOnInit(): void {
    if (this.block.value) {
      this.loadFile(this.block.value as File);
      this.audioToUpload = this.block.value as File;
    }
  }

  onAudioUpload(): void {
    this.file.nativeElement.click();
  }

  onFileAdded(files: FileList): void {
    this.audioToUpload = files.item(0);
    this.block.value = this.audioToUpload;
    this.loadFile(this.audioToUpload);
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
