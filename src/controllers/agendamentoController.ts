import { isValid, parseISO } from "date-fns";
import { Request, Response } from 'express';
import {
	alterarStatus,
	criarAgendamento,
	listarAgendamentos,
	removerAgendamentosAntigos
} from "../services/agendamentoService";

export const criarNovoAgendamento = (req: Request, res: Response) => {
	try {
		const { agendamento } = req.body;

		if (!agendamento) {
			return res.status(400).json('Erro ao criar novo agendamento');
		}
		const novoAgendamento = criarAgendamento(agendamento);
		res.status(201).json(novoAgendamento);
	} catch (error: any) {
		console.error('Erro ao criar agendamento:', error.message);
		res.status(400).json({ erro: error.message || 'Erro ao criar novo agendamento' });
	}
};

export const atualizarStatusAgendamento = (req: Request, res: Response) => {
	try {
		const { id, status } = req.body
		if (!id || !status) {
			res.status(400).json('Erro ao atualizar novo status');
		}
		const novoStatus = alterarStatus(id, status)
		res.status(200).send(novoStatus)
	} catch (error: any) {
		console.error('Erro ao criar agendamento:', error.message);
		res.status(400).json({ erro: error.message || 'Erro ao atualizar novo status' });
	}
};

export const listarTodosAgendamentos = (req: Request, res: Response) => {
	try {
		const data = req.query.data as string | undefined;
		const status = req.query.status as string | undefined;
		const motoristaCpf = req.query.motoristaCpf as string | undefined;

		let df: Date | undefined = undefined;

		if (data) {
			const parsed = parseISO(data);
			if (isValid(parsed)) {
				df = parsed;
			} else {
				return res.status(400).json({ erro: "Data inválida." });
			}
		}

		const agendamentos = listarAgendamentos(df, status, motoristaCpf);
		res.status(200).json(agendamentos);
	} catch (error: any) {
		console.error("Erro ao listar agendamentos:", error);
		res.status(500).json({ erro: "Ocorreu um erro ao listar os agendamentos." });
	}
};

export const deletarAgendamentosAntigos = (req: Request, res: Response) => {
	try {
		removerAgendamentosAntigos();
		res.status(204).send("Agendamentos com mais de 3 dias foram removidos");
	} catch (error: any) {
		console.error("Erro ao remover agendamentos antigos:", error);
		res.status(500).send("Ocorreu um erro ao tentar remover os agendamentos antigos");
	}
};