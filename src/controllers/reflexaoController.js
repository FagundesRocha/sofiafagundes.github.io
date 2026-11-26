import { reflexaoModel } from "../models/index.js"

export const listarReflexoes = async (request, response) => {

    try {

        const reflexoes = await reflexaoModel.findAll({
            order: [["id", "ASC"]]
        });

        response.status(200).json(reflexoes);

    } catch (error) {

        response.status(500).json({
            mensagem: "Erro interno do servidor."
        });

    }

}

export const cadastrarReflexao = async (request, response) => {
    const { titulo, itens } = request.body;

    try {

        const reflexao = await reflexaoModel.create({
            titulo, itens
        });

        response.status(201).json({
            mensagem: "Reflexão cadastrada com sucesso.",
            reflexao
        });

    } catch (error) {

        response.status(400).json({
            mensagem: error.message
        });

    }

}

export const buscarReflexaoPorId = async (request, response) => {

    try {

        const { id } = request.params;

        const reflexao = await reflexaoModel.findByPk(id);

        if (!reflexao) {
            return response.status(404).json({
                mensagem: "Reflexão não encontrada."
            });
        }

        response.status(200).json(reflexao);

    } catch (error) {

        response.status(500).json({
            mensagem: "Erro interno do servidor."
        });

    }

}

export const atualizarReflexao = async (request, response) => {

    try {

        const { id } = request.params;
        const { titulo, itens } = request.body;

        const reflexao = await reflexaoModel.findByPk(id);

        if (!reflexao) {
            return response.status(404).json({
                mensagem: "Reflexão não encontrada."
            });
        }

        if (titulo !== undefined) {
            reflexao.titulo = titulo;
        }

        if (itens !== undefined) {
            reflexao.itens = itens;
        }

        await reflexao.save();

        response.status(200).json({
            mensagem: "Reflexão atualizada com sucesso.",
            reflexao
        });

    } catch (error) {

        response.status(400).json({
            mensagem: error.message
        });

    }

}

export const deletarReflexao = async (request, response) => {
    const { id } = request.params;

    try {

        const reflexao = await reflexaoModel.findByPk(id);

        if (!reflexao) {
            return response.status(404).json({
                mensagem: "Reflexão não encontrada."
            });
        }

        await reflexao.destroy();

        response.status(200).json({
            mensagem: "Reflexão removida com sucesso."
        });

    } catch (error) {

        response.status(500).json({
            mensagem: "Erro interno do servidor."
        });

    }

}
