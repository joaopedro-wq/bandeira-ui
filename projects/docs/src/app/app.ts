import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BdTourComponent } from 'bandeira-ui';

@Component({
  selector: 'app-root',
  standalone: true,
  // O <bd-tour /> fica montado uma vez, aqui na raiz — é assim que se usa.
  imports: [RouterOutlet, BdTourComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <router-outlet />
    <bd-tour />
  `,
})
export class App {}
