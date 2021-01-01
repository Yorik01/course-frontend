export class MenuItem {
  constructor(
    public name: string,
    public isActive: boolean,
    public path: string,
    public onlyAuth: boolean
  ) {}
}
