import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BlockComponent } from '../../models/BlockComponent';

@Component({
  selector: 'app-tip-block',
  templateUrl: './tip-block.component.html',
  styleUrls: ['./tip-block.component.scss'],
})
export class TipBlockComponent extends BlockComponent implements OnInit {
  editorStyle = {
    height: '100px',
    background: '#FEE983',
  };

  modules = {
    toolbar: [
      [{ size: ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline'],
      [
        { align: null },
        { align: 'center' },
        { align: 'right' },
        { align: 'justify' },
      ],
    ],
  };

  constructor() {
    super();
  }

  ngOnInit(): void {}
}
