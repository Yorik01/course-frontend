import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { MenuItem } from './MenuItem';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './app-nav-menu.component.html',
  styleUrls: ['./app-nav-menu.component.scss'],
})
export class AppNavMenuComponent implements OnInit {
  items: MenuItem[] = [
    new MenuItem('Home', true, '', false),
    new MenuItem('Catalog', false, 'course/all', false),
    new MenuItem('Create', false, 'course/create', true),
    new MenuItem('My courses', false, 'user/courses', true),
    new MenuItem('Profile', false, 'user/profile', true),
  ];

  loginitems: MenuItem[] = [
    new MenuItem('Log in', false, 'user/login', false),
    new MenuItem('Register', false, 'user/register', false),
  ];

  constructor(private router: Router, public userService: UserService) {}

  ngOnInit(): void {
    this.router.events.subscribe((value) => {
      if (value instanceof NavigationStart) {
        this.setItemActiveByName(value.url);
      }
    });

    console.log(this.items);
  }

  setItemActive(item: MenuItem) {
    this.items.forEach((i) => (i.isActive = false));
    this.loginitems.forEach((i) => (i.isActive = false));
    item.isActive = true;
  }

  private setItemActiveByName(name: string) {
    this.items.forEach((i) => (i.isActive = false));
    this.loginitems.forEach((i) => (i.isActive = false));

    if (name.includes('constructor')) {
      this.items[2].isActive = true;
    } else if (name.includes('course/edit')) {
      this.items[2].isActive = true;
    } else if (name.includes('course/create')) {
      this.items[2].isActive = true;
    } else if (name.includes('course/all')) {
      this.items[1].isActive = true;
    } else if (name.includes('course/enrollment')) {
      this.items[1].isActive = true;
    } else if (name.includes('user/register')) {
      this.loginitems[1].isActive = true;
    } else if (name.includes('user/login')) {
      this.loginitems[0].isActive = true;
    } else if (name.includes('user/profile')) {
      this.items[4].isActive = true;
    } else if (name.includes('user/courses')) {
      this.items[3].isActive = true;
    } else if (name.includes('course/view')) {
      this.items[3].isActive = true;
    } else if (name.includes('course/certi')) {
      this.items[4].isActive = true;
    } else {
      this.items[0].isActive = true;
    }
  }

  get isLogin() {
    return this.userService.isAuthenticated;
  }

  logout() {
    this.userService.logout();

    window.location.reload();
  }
}
