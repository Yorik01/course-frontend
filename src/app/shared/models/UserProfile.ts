import { WithImage } from './WithImage';

export class UserProfile extends WithImage {
  constructor(
    public id: number,
    public name: string,
    public email: string,
    public birthday: Date,
    public courseCreated?: number,
    public courseStarted?: number,
    public courseCompleted?: number,
    public bio?: string,
    public mediaId?: number
  ) {
    super();
  }
}
