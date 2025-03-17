export interface IAluno {
  id: number;
  nome?: string | null;
  email?: string | null;
  telefone?: string | null;
}

export type NewAluno = Omit<IAluno, 'id'> & { id: null };
