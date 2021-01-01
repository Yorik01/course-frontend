import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MediaService } from '../services/media.service';
import { UpdateProfileRequest, UserService } from '../services/user.service';
import { ProfileMenuItem } from '../shared/models/ProfileMenuItem';
import { UserProfile } from '../shared/models/UserProfile';
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  menuItems: ProfileMenuItem[] = [
    new ProfileMenuItem('My profile', true, '/user/profile'),
    new ProfileMenuItem('My courses', false, '/user/courses'),
    new ProfileMenuItem('Certificates', false, '/user/certificates'),
  ];

  @ViewChild('file') file;

  imageToUpload: File;

  editMode = false;

  profile: UserProfile;

  form: FormGroup = this.fb.group({});

  constructor(
    private mediaService: MediaService,
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.reloadProfile();
  }

  onEditIconClick() {
    this.changeEditIcon();

    this.initForm();
  }

  onSaveIconClick() {
    this.changeEditIcon();

    const request = <UpdateProfileRequest>{
      email: this.form.controls['emailControl'].value,
      birthday: this.form.controls['dateBirthControl'].value,
      bio: this.form.controls['biographyControl'].value,
      mediaId: this.profile.mediaId,
      name: this.form.controls['nameControl'].value,
    };

    if (this.imageToUpload) {
      this.mediaService.createMedia(this.imageToUpload).subscribe((result) => {
        request.mediaId = result.id;

        this.userService.updateProfile(request).subscribe(() => {
          this.reloadProfile();
          this.imageToUpload = null;
        });
      });
    } else {
      this.userService.updateProfile(request).subscribe(() => {
        this.reloadProfile();
        this.imageToUpload = null;
      });
    }
  }

  onImageUpload(): void {
    this.file.nativeElement.click();
  }

  onFileAdded(files: FileList): void {
    this.imageToUpload = files.item(0);
    this.loadFile(this.imageToUpload);
  }

  loadFile(file: File) {
    const reader = new FileReader();
    of(file)
      .pipe(delay(500))
      .subscribe((data) => {
        reader.readAsDataURL(data);
        reader.onload = (event) => {
          this.avatar.setValue((event.target as FileReader).result);
        };
      });
  }

  get avatar() {
    return this.form.controls['avatarControl'];
  }

  private changeEditIcon() {
    this.editMode = !this.editMode;
  }

  private initForm() {
    this.form = this.fb.group({
      emailControl: [
        this.profile.email,
        [Validators.required, Validators.email],
      ],
      dateBirthControl: [this.profile.birthday, [Validators.required]],
      biographyControl: [this.profile.bio],
      avatarControl: [null, [Validators.required]],
      nameControl: [this.profile.name, [Validators.required]],
    });
  }

  private reloadProfile() {
    this.userService.getProfile().subscribe((profile) => {
      this.profile = profile;

      this.mediaService
        .getMediaById(this.profile.mediaId)
        .subscribe((image) => {
          this.profile.loadImage(image);
        });
      this.userService.getCourses(this.profile.id).subscribe((courses) => {
        this.userService.getCreatedCourses().subscribe((createdCourses) => {
          this.profile.courseCreated = createdCourses.length;
          this.profile.courseStarted = courses.filter(
            (c) => c.status === 'started'
          ).length;
          this.profile.courseCompleted = courses.filter(
            (c) => c.status === 'finished'
          ).length;
        });
      });
    });
  }
}
