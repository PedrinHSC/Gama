import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IMetaNota } from '../meta-nota.model';

@Component({
  selector: 'jhi-meta-nota-detail',
  templateUrl: './meta-nota-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class MetaNotaDetailComponent {
  metaNota = input<IMetaNota | null>(null);

  previousState(): void {
    window.history.back();
  }
}
