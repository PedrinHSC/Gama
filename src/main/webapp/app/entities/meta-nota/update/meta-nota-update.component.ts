import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IAluno } from 'app/entities/aluno/aluno.model';
import { AlunoService } from 'app/entities/aluno/service/aluno.service';
import { IMetaNota } from '../meta-nota.model';
import { MetaNotaService } from '../service/meta-nota.service';
import { MetaNotaFormGroup, MetaNotaFormService } from './meta-nota-form.service';

@Component({
  selector: 'jhi-meta-nota-update',
  templateUrl: './meta-nota-update.component.html',
  styleUrl: './meta-nota-update.component.css',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class MetaNotaUpdateComponent implements OnInit {
  isSaving = false;
  metaNota: IMetaNota | null = null;

  alunosSharedCollection: IAluno[] = [];
  areasDisponiveis: string[] = [
    'Linguagens',
    'Códigos e suas Tecnologias',
    'Ciências Humanas e suas Tecnologias',
    'Ciências da Natureza e suas Tecnologias',
    'Matemática e suas Tecnologias',
  ];

  protected metaNotaService = inject(MetaNotaService);
  protected metaNotaFormService = inject(MetaNotaFormService);
  protected alunoService = inject(AlunoService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: MetaNotaFormGroup = this.metaNotaFormService.createMetaNotaFormGroup();

  compareAluno = (o1: IAluno | null, o2: IAluno | null): boolean => this.alunoService.compareAluno(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ metaNota }) => {
      this.metaNota = metaNota;
      if (metaNota) {
        this.updateForm(metaNota);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const metaNota = this.metaNotaFormService.getMetaNota(this.editForm);
    if (metaNota.id !== null) {
      this.subscribeToSaveResponse(this.metaNotaService.update(metaNota));
    } else {
      this.subscribeToSaveResponse(this.metaNotaService.create(metaNota));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMetaNota>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(metaNota: IMetaNota): void {
    this.metaNota = metaNota;
    this.metaNotaFormService.resetForm(this.editForm, metaNota);

    this.alunosSharedCollection = this.alunoService.addAlunoToCollectionIfMissing<IAluno>(this.alunosSharedCollection, metaNota.aluno);
  }

  protected loadRelationshipsOptions(): void {
    this.alunoService
      .query()
      .pipe(map((res: HttpResponse<IAluno[]>) => res.body ?? []))
      .pipe(map((alunos: IAluno[]) => this.alunoService.addAlunoToCollectionIfMissing<IAluno>(alunos, this.metaNota?.aluno)))
      .subscribe((alunos: IAluno[]) => (this.alunosSharedCollection = alunos));
  }
}
