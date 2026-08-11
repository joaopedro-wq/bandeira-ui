import { DOCUMENT, Injectable, effect, inject, signal } from '@angular/core';

const STORAGE_KEY = 'bd-docs-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);

  readonly isDark = signal(this.temaInicial());

  constructor() {
    effect(() => {
      const tema = this.isDark() ? 'dark' : 'light';
      this.document.documentElement.setAttribute('data-theme', tema);
      try {
        localStorage.setItem(STORAGE_KEY, tema);
      } catch {
        /* modo privado: segue sem persistir */
      }
    });
  }

  toggle() {
    this.isDark.update((v) => !v);
  }

  /** Preferência salva > preferência do sistema > escuro. */
  private temaInicial(): boolean {
    try {
      const salvo = localStorage.getItem(STORAGE_KEY);
      if (salvo) return salvo === 'dark';
    } catch {
      /* ignora */
    }
    return !this.document.defaultView?.matchMedia('(prefers-color-scheme: light)').matches;
  }
}
