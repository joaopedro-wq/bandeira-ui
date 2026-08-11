import { Routes } from '@angular/router';
import { DocsShellComponent } from './layout/docs-shell.component';

const T = 'bandeira-ui';

export const routes: Routes = [
  {
    path: '',
    component: DocsShellComponent,
    children: [
      {
        path: '',
        title: `${T} — design system em Angular`,
        loadComponent: () => import('./pages/intro.component').then((m) => m.IntroComponent),
      },
      {
        path: 'instalacao',
        title: `Instalação · ${T}`,
        loadComponent: () =>
          import('./pages/instalacao.component').then((m) => m.InstalacaoComponent),
      },
      {
        path: 'tokens',
        title: `Tokens e temas · ${T}`,
        loadComponent: () => import('./pages/tokens.component').then((m) => m.TokensComponent),
      },

      /* Componentes */
      {
        path: 'componentes/button',
        title: `Button · ${T}`,
        loadComponent: () =>
          import('./pages/componentes/button.page').then((m) => m.ButtonPageComponent),
      },
      {
        path: 'componentes/card',
        title: `Card · ${T}`,
        loadComponent: () =>
          import('./pages/componentes/card.page').then((m) => m.CardPageComponent),
      },
      {
        path: 'componentes/chip',
        title: `Chip · ${T}`,
        loadComponent: () =>
          import('./pages/componentes/chip.page').then((m) => m.ChipPageComponent),
      },
      {
        path: 'componentes/field',
        title: `Field & Input · ${T}`,
        loadComponent: () =>
          import('./pages/componentes/field.page').then((m) => m.FieldPageComponent),
      },
      {
        path: 'componentes/tabs',
        title: `Tabs · ${T}`,
        loadComponent: () =>
          import('./pages/componentes/tabs.page').then((m) => m.TabsPageComponent),
      },
      {
        path: 'componentes/modal',
        title: `Modal · ${T}`,
        loadComponent: () =>
          import('./pages/componentes/modal.page').then((m) => m.ModalPageComponent),
      },
      {
        path: 'componentes/metric',
        title: `Metric · ${T}`,
        loadComponent: () =>
          import('./pages/componentes/metric.page').then((m) => m.MetricPageComponent),
      },

      /* Diretivas */
      {
        path: 'diretivas/reveal',
        title: `Reveal · ${T}`,
        loadComponent: () =>
          import('./pages/diretivas/reveal.page').then((m) => m.RevealPageComponent),
      },
      {
        path: 'diretivas/count-up',
        title: `CountUp · ${T}`,
        loadComponent: () =>
          import('./pages/diretivas/count-up.page').then((m) => m.CountUpPageComponent),
      },

      { path: '**', redirectTo: '' },
    ],
  },
];
