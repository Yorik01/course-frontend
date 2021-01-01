import { Pipe, PipeTransform } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'safeHtml' })
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(html: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(html);
  }
}
