import { Component } from '@angular/core';
import { response } from 'express';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  activeMenu: string = 'inicio';
  data: any = null;
  isMenuOpen = false;
  toggleMenu() {
    if (this.isMenuOpen) {
      setTimeout(() => {
        this.isMenuOpen = false;
      }, 1000);
    } else {
      this.isMenuOpen = true;
    }
  }
  constructor(private apiService: ApiService) { }

  setActive(menu: string): void {
    this.activeMenu = menu;
  }

  ngOnInit() {
    this.apiService.data$.subscribe(response => {
      this.data = response; // Actualiza los datos en el header
    });
  }
}
