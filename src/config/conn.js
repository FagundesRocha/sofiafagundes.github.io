import { Sequelize } from "sequelize"

//Comente essa instrução de conexão
export const conn = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false
})

//Descomente essa instrução e ajuste a base de dados
// export const conn = new Sequelize("banco_portfolio", "root", "", {
//     host: 'localhost',
//     dialect: "mysql"
// })
