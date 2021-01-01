import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Block } from '../../shared/models/Block';
import { TextBlock } from '../../shared/models/TextBlock';
import { ImageBlock } from '../../shared/models/ImageBlock';
import { TipBlock } from '../../shared/models/TipBlock';
import { VideoBlock } from '../../shared/models/VideoBlock';
import { AudioBlock } from '../../shared/models/AudioBlock';
import { TestBlock } from '../../shared/models/TestBlock';

@Component({
  selector: 'app-blocks-menu',
  templateUrl: './blocks-menu.component.html',
  styleUrls: ['./blocks-menu.component.scss']
})
export class BlocksMenuComponent implements OnInit {
  @Output() addBlock = new EventEmitter<Block>();

  items = [
      { name: 'Text', icon: 'text_format', onClick: () => this.addBlock.emit(new TextBlock()) },
      { name: 'Video', icon: 'video_library', onClick: () => this.addBlock.emit(new VideoBlock()) },
      { name: 'Audio', icon: 'audiotrack', onClick: () => this.addBlock.emit(new AudioBlock()) },
      { name: 'Image', icon: 'image', onClick: () => this.addBlock.emit(new ImageBlock()) },
      { name: 'Tip', icon: 'priority_high', onClick: () => this.addBlock.emit(new TipBlock()) },
      { name: 'Test', icon: 'fact_check', onClick: () => this.addBlock.emit(new TestBlock()) }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
