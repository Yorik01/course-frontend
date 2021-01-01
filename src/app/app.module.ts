import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './app-material.module';
import { QuillModule } from 'ngx-quill';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConstructorComponent } from './constructor/constructor.component';
import { TextBlockComponent } from './shared/components/text-block/text-block.component';
import { BlocksMenuComponent } from './constructor/blocks-menu/blocks-menu.component';
import { AppNavMenuComponent } from './app-nav-menu/app-nav-menu.component';
import { ImageBlockComponent } from './shared/components/image-block/image-block.component';
import { TipBlockComponent } from './shared/components/tip-block/tip-block.component';
import { VideoBlockComponent } from './shared/components/video-block/video-block.component';
import { AudioBlockComponent } from './shared/components/audio-block/audio-block.component';
import { SafeHtmlPipe } from './shared/pipes/safe-html.pipe';
import { TestBlockComponent } from './shared/components/test-block/test-block.component';
import { TestMultipleComponent } from './shared/components/test-block/test-multiple/test-multiple.component';
import { TestOneComponent } from './shared/components/test-block/test-one/test-one.component';
import { TestShortComponent } from './shared/components/test-block/test-short/test-short.component';
import { ChoiceFormComponent } from './shared/components/test-block/choice-form/choice-form.component';
import { QuestionFormComponent } from './shared/components/test-block/question-form/question-form.component';
import { TestFormComponent } from './shared/components/test-block/test-form/test-form.component';
import { CoursePageComponent } from './course-page/course-page.component';
import { LessonFormComponent } from './lesson-form/lesson-form.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MainComponent } from './main/main.component';
import { LessonService } from './services/lesson.service';
import { CourseService } from './services/course.service';
import { MediaService } from './services/media.service';
import { FormsModule } from '@angular/forms';
import { CourseListComponent } from './course-list/course-list.component';
import { CourseItemComponent } from './course-list/course-item/course-item.component';
import { CourseEnrollmentComponent } from './course-enrollment/course-enrollment.component';
import { AppFooterComponent } from './app-footer/app-footer.component';
import { CourseCreateComponent } from './course-create/course-create.component';
import { CourseLessonViewerComponent } from './course-lesson-viewer/course-lesson-viewer.component';
import { CourseLessonViewerItemComponent } from './course-lesson-viewer/course-lesson-viewer-item/course-lesson-viewer-item.component';
import { VideoViewerComponent } from './course-lesson-viewer/video-viewer/video-viewer.component';
import { RegistrationComponent } from './registration/registration.component';
import { UserService } from './services/user.service';
import { LoginComponent } from './login/login.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserProfileMenuComponent } from './user-profile/user-profile-menu/user-profile-menu.component';
import { UserProfileViewComponent } from './user-profile/user-profile-view/user-profile-view.component';
import { UserProfileCoursesComponent } from './user-profile/user-profile-courses/user-profile-courses.component';
import { ImageViewerComponent } from './course-lesson-viewer/image-viewer/image-viewer.component';
import { AuthInterceptor } from './shared/interceptor/AuthInterceptor';
import { CertificateComponent } from './shared/components/certificate/certificate.component';
import { UserProfileCertificatesComponent } from './user-profile/user-profile-certificates/user-profile-certificates.component';

@NgModule({
  declarations: [
    AppComponent,
    ConstructorComponent,
    TextBlockComponent,
    BlocksMenuComponent,
    AppNavMenuComponent,
    ImageBlockComponent,
    TipBlockComponent,
    VideoBlockComponent,
    AudioBlockComponent,
    SafeHtmlPipe,
    TestBlockComponent,
    TestMultipleComponent,
    TestOneComponent,
    TestShortComponent,
    ChoiceFormComponent,
    QuestionFormComponent,
    TestFormComponent,
    CoursePageComponent,
    LessonFormComponent,
    MainComponent,
    CourseListComponent,
    CourseItemComponent,
    CourseEnrollmentComponent,
    AppFooterComponent,
    CourseCreateComponent,
    CourseLessonViewerComponent,
    CourseLessonViewerItemComponent,
    VideoViewerComponent,
    RegistrationComponent,
    LoginComponent,
    UserProfileComponent,
    UserProfileMenuComponent,
    UserProfileViewComponent,
    UserProfileCoursesComponent,
    ImageViewerComponent,
    CertificateComponent,
    UserProfileCertificatesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    QuillModule.forRoot(),
    HttpClientModule,
    FormsModule,
  ],
  providers: [
    SafeHtmlPipe,
    { provide: 'BASE_URL', useValue: 'http://localhost:8000' },
    CourseService,
    LessonService,
    MediaService,
    UserService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
