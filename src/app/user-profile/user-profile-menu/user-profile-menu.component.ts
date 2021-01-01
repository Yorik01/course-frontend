import { Component, Input, OnInit } from '@angular/core';
import { ProfileMenuItem } from '../../shared/models/ProfileMenuItem';

@Component({
  selector: 'app-user-profile-menu',
  templateUrl: './user-profile-menu.component.html',
  styleUrls: ['./user-profile-menu.component.scss'],
})
export class UserProfileMenuComponent implements OnInit {
  @Input() items: ProfileMenuItem[];
  constructor() {}

  ngOnInit(): void {}

  onItemClick(item: ProfileMenuItem) {
    this.items.forEach((i) => (i.isActive = false));
    item.isActive = true;
  }
}
