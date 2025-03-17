import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IAluno } from 'app/entities/aluno/aluno.model';
import { AlunoService } from 'app/entities/aluno/service/aluno.service';
import { MetaNotaService } from '../service/meta-nota.service';
import { IMetaNota } from '../meta-nota.model';
import { MetaNotaFormService } from './meta-nota-form.service';

import { MetaNotaUpdateComponent } from './meta-nota-update.component';

describe('MetaNota Management Update Component', () => {
  let comp: MetaNotaUpdateComponent;
  let fixture: ComponentFixture<MetaNotaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let metaNotaFormService: MetaNotaFormService;
  let metaNotaService: MetaNotaService;
  let alunoService: AlunoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MetaNotaUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(MetaNotaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MetaNotaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    metaNotaFormService = TestBed.inject(MetaNotaFormService);
    metaNotaService = TestBed.inject(MetaNotaService);
    alunoService = TestBed.inject(AlunoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Aluno query and add missing value', () => {
      const metaNota: IMetaNota = { id: 12298 };
      const aluno: IAluno = { id: 15328 };
      metaNota.aluno = aluno;

      const alunoCollection: IAluno[] = [{ id: 15328 }];
      jest.spyOn(alunoService, 'query').mockReturnValue(of(new HttpResponse({ body: alunoCollection })));
      const additionalAlunos = [aluno];
      const expectedCollection: IAluno[] = [...additionalAlunos, ...alunoCollection];
      jest.spyOn(alunoService, 'addAlunoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ metaNota });
      comp.ngOnInit();

      expect(alunoService.query).toHaveBeenCalled();
      expect(alunoService.addAlunoToCollectionIfMissing).toHaveBeenCalledWith(
        alunoCollection,
        ...additionalAlunos.map(expect.objectContaining),
      );
      expect(comp.alunosSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const metaNota: IMetaNota = { id: 12298 };
      const aluno: IAluno = { id: 15328 };
      metaNota.aluno = aluno;

      activatedRoute.data = of({ metaNota });
      comp.ngOnInit();

      expect(comp.alunosSharedCollection).toContainEqual(aluno);
      expect(comp.metaNota).toEqual(metaNota);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMetaNota>>();
      const metaNota = { id: 20191 };
      jest.spyOn(metaNotaFormService, 'getMetaNota').mockReturnValue(metaNota);
      jest.spyOn(metaNotaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ metaNota });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: metaNota }));
      saveSubject.complete();

      // THEN
      expect(metaNotaFormService.getMetaNota).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(metaNotaService.update).toHaveBeenCalledWith(expect.objectContaining(metaNota));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMetaNota>>();
      const metaNota = { id: 20191 };
      jest.spyOn(metaNotaFormService, 'getMetaNota').mockReturnValue({ id: null });
      jest.spyOn(metaNotaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ metaNota: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: metaNota }));
      saveSubject.complete();

      // THEN
      expect(metaNotaFormService.getMetaNota).toHaveBeenCalled();
      expect(metaNotaService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMetaNota>>();
      const metaNota = { id: 20191 };
      jest.spyOn(metaNotaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ metaNota });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(metaNotaService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareAluno', () => {
      it('Should forward to alunoService', () => {
        const entity = { id: 15328 };
        const entity2 = { id: 9303 };
        jest.spyOn(alunoService, 'compareAluno');
        comp.compareAluno(entity, entity2);
        expect(alunoService.compareAluno).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
