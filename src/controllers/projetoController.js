import { projetoModel } from "../models/index.js"

export const listarProjetos = async (request, response) => {

    try {

        const projetos = await projetoModel.findAll({
            order: [["id", "ASC"]]
        });

        response.status(200).json(projetos);

    } catch (error) {

        response.status(500).json({
            mensagem: "Erro interno do servidor."
        });

    }

}

export const cadastrarProjeto = async (request, response) => {
    const { nome, classe, icone, descricao, pergunta, atuacao, evidencias } = request.body;

    try {

        const projeto = await projetoModel.create({
            nome, classe, icone, descricao, pergunta, atuacao, evidencias
        });

        response.status(201).json({
            mensagem: "Projeto cadastrado com sucesso.",
            projeto
        });

    } catch (error) {

        response.status(400).json({
            mensagem: error.message
        });

    }

}

export const buscarProjetoPorId = async (request, response) => {

    try {

        const { id } = request.params;

        const projeto = await projetoModel.findByPk(id);

        if (!projeto) {
            return response.status(404).json({
                mensagem: "Projeto não encontrado."
            });
        }

        response.status(200).json(projeto);

    } catch (error) {

        response.status(500).json({
            mensagem: "Erro interno do servidor."
        });

    }

}

export const atualizarProjeto = async (request, response) => {

    try {

        const { id } = request.params;
        const { nome, classe, icone, descricao, pergunta, atuacao, evidencias } = request.body;

        const projeto = await projetoModel.findByPk(id);

        if (!projeto) {
            return response.status(404).json({
                mensagem: "Projeto não encontrado."
            });
        }

        if (nome !== undefined) {
            projeto.nome = nome;
        }

        if (classe !== undefined) {
            projeto.classe = classe;
        }

        if (icone !== undefined) {
            projeto.icone = icone;
        }

        if (descricao !== undefined) {
            projeto.descricao = descricao;
        }

        if (pergunta !== undefined) {
            projeto.pergunta = pergunta;
        }

        if (atuacao !== undefined) {
            projeto.atuacao = atuacao;
        }

        if (evidencias !== undefined) {
            projeto.evidencias = evidencias;
        }

        await projeto.save();

        response.status(200).json({
            mensagem: "Projeto atualizado com sucesso.",
            projeto
        });

    } catch (error) {

        response.status(400).json({
            mensagem: error.message
        });

    }

}

export const deletarProjeto = async (request, response) => {
    const { id } = request.params;

    try {

        const projeto = await projetoModel.findByPk(id);

        if (!projeto) {
            return response.status(404).json({
                mensagem: "Projeto não encontrado."
            });
        }

        await projeto.destroy();

        response.status(200).json({
            mensagem: "Projeto removido com sucesso."
        });

    } catch (error) {

        response.status(500).json({
            mensagem: "Erro interno do servidor."
        });

    }

}
