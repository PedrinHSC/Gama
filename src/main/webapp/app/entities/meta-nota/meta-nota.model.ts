import { IAluno } from 'app/entities/aluno/aluno.model';

export interface IMetaNota {
  id: number;
  area?: string | null;
  meta?: number | null;
  aluno?: IAluno | null;
}

export type NewMetaNota = Omit<IMetaNota, 'id'> & { id: null };
