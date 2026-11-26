import fs from "fs"
import { fileURLToPath } from "url"
import { conn } from "./config/conn.js"
import { materiaModel, projetoModel, reflexaoModel } from "./models/index.js"

// Lê um arquivo da pasta data/
const lerJson = (arquivo) => {
    return JSON.parse(fs.readFileSync(new URL(`../data/${arquivo}`, import.meta.url), "utf-8"))
}

export const popular = async () => {
    await materiaModel.bulkCreate(lerJson("materias.json"))
    await projetoModel.bulkCreate(lerJson("projetos.json"))
    await reflexaoModel.bulkCreate(lerJson("reflexoes.json"))
}

// Usada pelo server.js: só popula se as tabelas estiverem vazias
export const popularSeVazio = async () => {
    const total = (await materiaModel.count()) + (await projetoModel.count()) + (await reflexaoModel.count())

    if (total === 0) {
        await popular()
        console.log("✔ Banco criado com o conteúdo de data/*.json")
    }
}

// "npm run seed" → apaga as tabelas e recria tudo a partir de data/
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    await conn.sync({ force: true })
    await popular()
    console.log("✔ Banco recriado com o conteúdo de data/*.json")
    await conn.close()
}
