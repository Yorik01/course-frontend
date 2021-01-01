import { Guid } from 'src/app/guid';
import { Block } from './Block';

export class Lesson {
  public blocks: Block[] = [];
  public readonly guid: string;

  constructor(
    public id?: number,
    public desciption?: string,
    public name?: string
  ) {
    this.guid = Guid.newGuid();
  }
}
