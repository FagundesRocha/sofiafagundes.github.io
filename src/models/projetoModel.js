import { DataTypes } from "sequelize"
import { conn } from "../config/conn.js"

// evidencias é um JSON: [ { imagem: null ou "assets/foto.jpg", legenda: "..." } ]
const projetoModel = conn.define(
    "projetos",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        nome: {
            type: DataTypes.STRING(80),
            allowNull: false,
            validate: {
                notEmpty: { msg: "O nome é obrigatório." }
            }
        },
        classe: {
            type: DataTypes.STRING(30),
            allowNull: false,
            validate: {
                notEmpty: { msg: "A classe (cor do card) é obrigatória." }
            }
        },
        icone: {
            type: DataTypes.STRING(60),
            allowNull: false,
            validate: {
                notEmpty: { msg: "O ícone é obrigatório." }
            }
        },
        descricao: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: { msg: "A descrição é obrigatória." }
            }
        },
        pergunta: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        atuacao: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: { msg: "A atuação é obrigatória." }
            }
        },
        evidencias: {
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: []
        }
    },
    {
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
)

export default projetoModel
