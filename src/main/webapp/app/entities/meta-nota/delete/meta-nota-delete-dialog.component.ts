import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IMetaNota } from '../meta-nota.model';
import { MetaNotaService } from '../service/meta-nota.service';

@Component({
  templateUrl: './meta-nota-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class MetaNotaDeleteDialogComponent {
  metaNota?: IMetaNota;

  protected metaNotaService = inject(MetaNotaService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.metaNotaService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
