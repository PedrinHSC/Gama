import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../meta-nota.test-samples';

import { MetaNotaFormService } from './meta-nota-form.service';

describe('MetaNota Form Service', () => {
  let service: MetaNotaFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetaNotaFormService);
  });

  describe('Service methods', () => {
    describe('createMetaNotaFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMetaNotaFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            area: expect.any(Object),
            meta: expect.any(Object),
            aluno: expect.any(Object),
          }),
        );
      });

      it('passing IMetaNota should create a new form with FormGroup', () => {
        const formGroup = service.createMetaNotaFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            area: expect.any(Object),
            meta: expect.any(Object),
            aluno: expect.any(Object),
          }),
        );
      });
    });

    describe('getMetaNota', () => {
      it('should return NewMetaNota for default MetaNota initial value', () => {
        const formGroup = service.createMetaNotaFormGroup(sampleWithNewData);

        const metaNota = service.getMetaNota(formGroup) as any;

        expect(metaNota).toMatchObject(sampleWithNewData);
      });

      it('should return NewMetaNota for empty MetaNota initial value', () => {
        const formGroup = service.createMetaNotaFormGroup();

        const metaNota = service.getMetaNota(formGroup) as any;

        expect(metaNota).toMatchObject({});
      });

      it('should return IMetaNota', () => {
        const formGroup = service.createMetaNotaFormGroup(sampleWithRequiredData);

        const metaNota = service.getMetaNota(formGroup) as any;

        expect(metaNota).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IMetaNota should not enable id FormControl', () => {
        const formGroup = service.createMetaNotaFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMetaNota should disable id FormControl', () => {
        const formGroup = service.createMetaNotaFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
