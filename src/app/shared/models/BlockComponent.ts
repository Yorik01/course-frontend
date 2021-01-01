import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Block } from './Block';

@Component({
  template: '',
})
export class BlockComponent {
  @Input() block: Block;
  @Output() onDelete = new EventEmitter<string>();

  delete() {
    this.onDelete.emit(this.block.id);
  }
}
