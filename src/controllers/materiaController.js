import { materiaModel } from "../models/index.js"

export const listarMaterias = async (request, response) => {

    try {

        const materias = await materiaModel.findAll({
            order: [["id", "ASC"]]
        });

        response.status(200).json(materias);

    } catch (error) {

        response.status(500).json({
            mensagem: "Erro interno do servidor."
        });

    }

}

export const cadastrarMateria = async (request, response) => {
    const { nome, classe, icone, professores, bimestres } = request.body;

    try {

        const materia = await materiaModel.create({
            nome, classe, icone, professores, bimestres
        });

        response.status(201).json({
            mensagem: "Matéria cadastrada com sucesso.",
            materia
        });

    } catch (error) {

        response.status(400).json({
            mensagem: error.message
        });

    }

}

export const buscarMateriaPorId = async (request, response) => {

    try {

        const { id } = request.params;

        const materia = await materiaModel.findByPk(id);

        if (!materia) {
            return response.status(404).json({
                mensagem: "Matéria não encontrada."
            });
        }

        response.status(200).json(materia);

    } catch (error) {

        response.status(500).json({
            mensagem: "Erro interno do servidor."
        });

    }

}

export const atualizarMateria = async (request, response) => {

    try {

        const { id } = request.params;
        const { nome, classe, icone, professores, bimestres } = request.body;

        const materia = await materiaModel.findByPk(id);

        if (!materia) {
            return response.status(404).json({
                mensagem: "Matéria não encontrada."
            });
        }

        if (nome !== undefined) {
            materia.nome = nome;
        }

        if (classe !== undefined) {
            materia.classe = classe;
        }

        if (icone !== undefined) {
            materia.icone = icone;
        }

        if (professores !== undefined) {
            materia.professores = professores;
        }

        if (bimestres !== undefined) {
            materia.bimestres = bimestres;
        }

        await materia.save();

        response.status(200).json({
            mensagem: "Matéria atualizada com sucesso.",
            materia
        });

    } catch (error) {

        response.status(400).json({
            mensagem: error.message
        });

    }

}

export const deletarMateria = async (request, response) => {
    const { id } = request.params;

    try {

        const materia = await materiaModel.findByPk(id);

        if (!materia) {
            return response.status(404).json({
                mensagem: "Matéria não encontrada."
            });
        }

        await materia.destroy();

        response.status(200).json({
            mensagem: "Matéria removida com sucesso."
        });

    } catch (error) {

        response.status(500).json({
            mensagem: "Erro interno do servidor."
        });

    }

}
