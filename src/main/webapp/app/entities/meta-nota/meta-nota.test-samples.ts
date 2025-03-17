import { IMetaNota, NewMetaNota } from './meta-nota.model';

export const sampleWithRequiredData: IMetaNota = {
  id: 20240,
  area: 'eek',
  meta: 291,
};

export const sampleWithPartialData: IMetaNota = {
  id: 22621,
  area: 'even swiftly',
  meta: 379,
};

export const sampleWithFullData: IMetaNota = {
  id: 22468,
  area: 'barring',
  meta: 683,
};

export const sampleWithNewData: NewMetaNota = {
  area: 'energetic shirk likewise',
  meta: 616,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
