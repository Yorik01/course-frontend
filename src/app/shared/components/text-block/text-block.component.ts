import { Component, OnInit } from '@angular/core';
import { BlockComponent } from '../../models/BlockComponent';

@Component({
  selector: 'app-text-block',
  templateUrl: './text-block.component.html',
  styleUrls: ['./text-block.component.scss'],
})
export class TextBlockComponent extends BlockComponent implements OnInit {
  modules = {
    toolbar: [
      [{ font: [] }],
      [{ size: ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline'],
      [
        { align: null },
        { align: 'center' },
        { align: 'right' },
        { align: 'justify' },
      ],
      [{ header: 1 }],
    ],
  };

  editorStyle = {
    height: 'auto',
    background: '#FFFFFF',
    border: '1px solid #F4F4F4',
    boxSizing: 'border-box',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  };

  constructor() {
    super();
  }

  getEditorInstance(editorInstance: any) {
    const toolbar = editorInstance.getModule('toolbar');
    toolbar.addHandler('header', this.closeHandler);

    let lastNode =
      toolbar.container.childNodes[toolbar.container.childNodes.length - 1];
    lastNode.className = 'ql-formats last';

    let closeBtn = toolbar.controls.find((c) => c[0] === 'header');
    closeBtn[1].innerHTML = 'X';
  }

  closeHandler = () => {
    this.onDelete.emit(this.block.id);
  };

  ngOnInit(): void {}
}
