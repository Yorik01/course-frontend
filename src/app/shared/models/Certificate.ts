export class Certificate {
  constructor(
    public id?: number,
    public name?: string,
    public date?: Date,
    public score?: number,
    public completeness?: number
  ) {}
}
