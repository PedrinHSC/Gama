import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IMetaNota } from '../meta-nota.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../meta-nota.test-samples';

import { MetaNotaService } from './meta-nota.service';

const requireRestSample: IMetaNota = {
  ...sampleWithRequiredData,
};

describe('MetaNota Service', () => {
  let service: MetaNotaService;
  let httpMock: HttpTestingController;
  let expectedResult: IMetaNota | IMetaNota[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(MetaNotaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a MetaNota', () => {
      const metaNota = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(metaNota).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a MetaNota', () => {
      const metaNota = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(metaNota).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a MetaNota', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of MetaNota', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a MetaNota', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addMetaNotaToCollectionIfMissing', () => {
      it('should add a MetaNota to an empty array', () => {
        const metaNota: IMetaNota = sampleWithRequiredData;
        expectedResult = service.addMetaNotaToCollectionIfMissing([], metaNota);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(metaNota);
      });

      it('should not add a MetaNota to an array that contains it', () => {
        const metaNota: IMetaNota = sampleWithRequiredData;
        const metaNotaCollection: IMetaNota[] = [
          {
            ...metaNota,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addMetaNotaToCollectionIfMissing(metaNotaCollection, metaNota);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a MetaNota to an array that doesn't contain it", () => {
        const metaNota: IMetaNota = sampleWithRequiredData;
        const metaNotaCollection: IMetaNota[] = [sampleWithPartialData];
        expectedResult = service.addMetaNotaToCollectionIfMissing(metaNotaCollection, metaNota);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(metaNota);
      });

      it('should add only unique MetaNota to an array', () => {
        const metaNotaArray: IMetaNota[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const metaNotaCollection: IMetaNota[] = [sampleWithRequiredData];
        expectedResult = service.addMetaNotaToCollectionIfMissing(metaNotaCollection, ...metaNotaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const metaNota: IMetaNota = sampleWithRequiredData;
        const metaNota2: IMetaNota = sampleWithPartialData;
        expectedResult = service.addMetaNotaToCollectionIfMissing([], metaNota, metaNota2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(metaNota);
        expect(expectedResult).toContain(metaNota2);
      });

      it('should accept null and undefined values', () => {
        const metaNota: IMetaNota = sampleWithRequiredData;
        expectedResult = service.addMetaNotaToCollectionIfMissing([], null, metaNota, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(metaNota);
      });

      it('should return initial array if no MetaNota is added', () => {
        const metaNotaCollection: IMetaNota[] = [sampleWithRequiredData];
        expectedResult = service.addMetaNotaToCollectionIfMissing(metaNotaCollection, undefined, null);
        expect(expectedResult).toEqual(metaNotaCollection);
      });
    });

    describe('compareMetaNota', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareMetaNota(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 20191 };
        const entity2 = null;

        const compareResult1 = service.compareMetaNota(entity1, entity2);
        const compareResult2 = service.compareMetaNota(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 20191 };
        const entity2 = { id: 12298 };

        const compareResult1 = service.compareMetaNota(entity1, entity2);
        const compareResult2 = service.compareMetaNota(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 20191 };
        const entity2 = { id: 20191 };

        const compareResult1 = service.compareMetaNota(entity1, entity2);
        const compareResult2 = service.compareMetaNota(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
