import { CourseLesson } from './Course';
import { WithImage } from './WithImage';

export class CourseWithImage extends WithImage {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public mediaId: number,
    public lessonCount: number,
    public createdBy?: string,
    public lessons?: CourseLesson[],
    public score?: number,
    public maxScore?: number
  ) {
    super();
  }
}
