import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConstructorComponent } from './constructor/constructor.component';
import { CourseCreateComponent } from './course-create/course-create.component';
import { CourseEnrollmentComponent } from './course-enrollment/course-enrollment.component';
import { CourseLessonViewerComponent } from './course-lesson-viewer/course-lesson-viewer.component';
import { CourseListComponent } from './course-list/course-list.component';
import { CoursePageComponent } from './course-page/course-page.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { RegistrationComponent } from './registration/registration.component';
import { UserProfileCoursesComponent } from './user-profile/user-profile-courses/user-profile-courses.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AuthorizeGuard } from './shared/guards/AuthorizeGuard';
import { UserProfileCertificatesComponent } from './user-profile/user-profile-certificates/user-profile-certificates.component';
import { CertificateComponent } from './shared/components/certificate/certificate.component';

const routes: Routes = [
  {
    path: 'constructor',
    component: ConstructorComponent,
    canActivate: [AuthorizeGuard],
  },
  {
    path: 'course/edit/:id',
    component: CoursePageComponent,
    canActivate: [AuthorizeGuard],
  },
  {
    path: 'course/create',
    component: CourseCreateComponent,
    canActivate: [AuthorizeGuard],
  },
  {
    path: 'course/all',
    component: CourseListComponent,
    canActivate: [AuthorizeGuard],
  },
  {
    path: 'course/enrollment/:id',
    component: CourseEnrollmentComponent,
    canActivate: [AuthorizeGuard],
  },
  { path: 'user/register', component: RegistrationComponent },
  { path: 'user/login', component: LoginComponent },
  {
    path: 'user/profile',
    component: UserProfileComponent,
    canActivate: [AuthorizeGuard],
  },
  {
    path: 'user/courses',
    component: UserProfileCoursesComponent,
    canActivate: [AuthorizeGuard],
  },
  {
    path: 'course/view/:id',
    component: CourseLessonViewerComponent,
    canActivate: [AuthorizeGuard],
  },
  {
    path: 'user/certificates',
    component: UserProfileCertificatesComponent,
    canActivate: [AuthorizeGuard],
  },
  {
    path: 'cert/:certId',
    component: CertificateComponent,
    canActivate: [AuthorizeGuard],
  },
  { path: '', component: MainComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
