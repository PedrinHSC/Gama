import { IAluno, NewAluno } from './aluno.model';

export const sampleWithRequiredData: IAluno = {
  id: 8806,
  nome: 'boo tomorrow',
  email: 'Henrique_Souza15@hotmail.com',
};

export const sampleWithPartialData: IAluno = {
  id: 22223,
  nome: 'wetly',
  email: 'Silas.Martins60@bol.com.br',
  telefone: 'passionate sedately',
};

export const sampleWithFullData: IAluno = {
  id: 25732,
  nome: 'oof near likewise',
  email: 'Lavinia_Souza75@yahoo.com',
  telefone: 'dazzling',
};

export const sampleWithNewData: NewAluno = {
  nome: 'energetically yet webbed',
  email: 'Fabricia_Nogueira@live.com',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
