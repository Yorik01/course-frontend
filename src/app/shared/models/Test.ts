import { Observable } from 'rxjs';

export class Test {
  public testOptions: TestOption[] = [];
  public answered = false;
  public answerCallback: Observable<any>;

  constructor(
    public task?: string,
    public score?: number,
    public type?: TestType
  ) {}
}

export class TestOption {
  constructor(
    public id?: number,
    public isRight?: boolean,
    public title?: string,
    public value?: number
  ) {}
}

export enum TestType {
  Checkbox,
  Radio,
  Short,
}
