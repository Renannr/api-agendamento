import { isValid, parseISO } from "date-fns";
import { Request, Response } from 'express';
import {
	alterarStatus,
	criarAgendamento,
	listarAgendamentos,
	removerAgendamentosAntigos
} from "../services/agendamentoService";

export const criarNovoAgendamento = (req: Request, res: Response) => {
	const { agendamento } = req.body;

	try {
		const novoAgendamento = criarAgendamento(agendamento);
		res.status(201).json(novoAgendamento);
	} catch (error: any) {
		console.error('Erro ao criar agendamento:', error.message);
		res.status(400).json({ erro: error.message || 'Erro ao criar novo agendamento' });
	}
};

export const atualizarStatusAgendamento = (req: Request, res: Response) => {
	const { id, status } = req.body

	try {
		const novoStatus = alterarStatus(id, status)
		res.status(200).send(novoStatus)
	} catch (error: any) {
		console.error('Erro ao criar agendamento:', error.message);
		res.status(400).json({ erro: error.message || 'Erro ao atualizar novo status' });
	}
};

export const listarTodosAgendamentos = (req: Request, res: Response) => {
	const data = req.query.data as string | undefined;
	const status = req.query.status as string | undefined;
	const motoristaCpf = req.query.motoristaCpf as string | undefined;

	let df: Date | undefined = undefined;

	if (data) {
		const parsed = parseISO(data as string);
		if (isValid(parsed)) {
			df = parsed;
		} else {
			return res.status(400).json({ erro: "Data inválida." });
		}
	}

	const agendamentos = listarAgendamentos(df, status, motoristaCpf);
	res.status(200).json(agendamentos);
};

export const deletarAgendamentosAntigos = (req: Request, res: Response) => {
	removerAgendamentosAntigos();
	res.status(204).send("Agendamentos com mais de 3 dias foram removidos");
};