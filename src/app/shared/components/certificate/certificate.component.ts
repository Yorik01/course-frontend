import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { User, UserService } from 'src/app/services/user.service';
import { Certificate } from '../../models/Certificate';

declare var jsPDF: any;

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.scss'],
})
export class CertificateComponent implements OnInit {
  certificate: Certificate;
  userName: string;

  @ViewChild('certificateRef') certificateRef: ElementRef;
  @ViewChild('image') imageRef: ElementRef;

  constructor(route: ActivatedRoute, private userService: UserService) {
    this.certificate = new Certificate(
      null,
      route.snapshot.paramMap.get('certName'),
      <Date>(<unknown>route.snapshot.paramMap.get('certDate'))
    );
    console.log(this.certificate);
  }

  ngOnInit(): void {
    this.userService.user
      .pipe(
        filter((x) => !!x),
        map((x) => x.name)
      )
      .subscribe((name) => (this.userName = name));
  }

  onDownoload() {
    let content = this.certificateRef.nativeElement as HTMLDivElement;
    let image = this.imageRef.nativeElement as HTMLImageElement;
    let fileName = `${this.certificate.name}-${this.userName}.pdf`;
    let doc = new jsPDF('l', 'mm', [250, 192]);
    doc.addHTML(content, () => doc.save(fileName));
  }
}
