import { differenceInDays } from 'date-fns';
import { Agendamento, Status } from '../models/agendamento';

export var agendamentos: Agendamento[] = [];

export const criarAgendamento = (novoAgendamento: Agendamento): Agendamento => {
  const agendamento: Agendamento = novoAgendamento;

  const conflitoStatus = agendamentos.filter(
    (item) => item.motoristaCpf === agendamento.motoristaCpf,
  );
  if (conflitoStatus.length > 0) {
    let conflito = agendamentos.find(
      (item) => item.status === 'pendente' || item.status === 'atrasado',
    );
    if (conflito) {
      throw new Error('Conflito de agendamento');
    }
  }

  const conflitoHorario = agendamentos.find(
    (item) => item.dataHora === agendamento.dataHora,
  );
  if (conflitoHorario) {
    throw new Error('Conflito de agendamento');
  }

  agendamentos.push(agendamento);
  return agendamento;
};

export const alterarStatus = (id: string, novoStatus: Status): Agendamento => {
  const agendamento = agendamentos.find((item) => item.id === id);

  if (!agendamento) {
    throw new Error('Agendamento não encontrado');
  }

  if (agendamento.status === 'cancelado') {
    throw new Error('Não é possível alterar um agendamento cancelado');
  }

  if (agendamento.status === 'concluido' && novoStatus === 'cancelado') {
    throw new Error('Não é possível cancelar um agendamento já concluído');
  }

  agendamento.status = novoStatus;
  return agendamento;
};

export const listarAgendamentos = (
  data?: Date,
  status?: string,
  motoristaCpf?: string,
): Agendamento[] => {
  return agendamentos.filter((item) => {
    let mesmaData = true;

    if (data) {
      const dataItem = new Date(item.dataHora);
      const dataFiltro = new Date(data);
      mesmaData =
        dataItem.getUTCFullYear() === dataFiltro.getUTCFullYear() &&
        dataItem.getUTCMonth() === dataFiltro.getUTCMonth() &&
        dataItem.getUTCDate() === dataFiltro.getUTCDate();
    }
    const mesmoStatus = status ? item.status === status : true;
    const mesmoCpf = motoristaCpf ? item.motoristaCpf === motoristaCpf : true;

    return mesmaData && mesmoStatus && mesmoCpf;
  });
};

export const removerAgendamentosAntigos = (): void => {
  agendamentos = agendamentos.filter((agendamento) => {
    const diasDeDiferenca = differenceInDays(new Date(), agendamento.dataHora);
    return diasDeDiferenca <= 3;
  });
};
