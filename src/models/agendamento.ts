export type Status = 'pendente' | 'concluido' | 'atrasado' | 'cancelado';

export interface Agendamento {
  id: string;
  dataHora: Date;
  numeroContrato: string;
  motoristaNome: string;
  motoristaCpf: string;
  placaCaminhao: string;
  status: Status;
}