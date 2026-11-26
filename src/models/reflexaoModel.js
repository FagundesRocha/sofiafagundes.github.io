import { DataTypes } from "sequelize"
import { conn } from "../config/conn.js"

// itens é um JSON: [ { rotulo: "Aprendizado", texto: "..." } ]
const reflexaoModel = conn.define(
    "reflexoes",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        titulo: {
            type: DataTypes.STRING(120),
            allowNull: false,
            validate: {
                notEmpty: { msg: "O título é obrigatório." }
            }
        },
        itens: {
            type: DataTypes.JSON,
            allowNull: false
        }
    },
    {
        tableName: "reflexoes",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
)

export default reflexaoModel
