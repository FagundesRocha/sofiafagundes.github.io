import { DataTypes } from "sequelize"
import { conn } from "../config/conn.js"

// bimestres é um JSON: { "1": [ { titulo, perguntas: [ { pergunta, resposta } ] } ], "2": [...] }
const materiaModel = conn.define(
    "materias",
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
        professores: {
            type: DataTypes.STRING(150),
            allowNull: false,
            validate: {
                notEmpty: { msg: "Os professores são obrigatórios." }
            }
        },
        bimestres: {
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: {}
        }
    },
    {
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
)

export default materiaModel
