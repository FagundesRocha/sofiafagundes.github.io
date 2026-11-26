import app from "./app.js"
import { conn } from "./config/conn.js"
import { popularSeVazio } from "./seed.js"

const PORT = process.env.PORT || 3000

// Cria as tabelas (se ainda não existirem) e, no primeiro uso, coloca o conteúdo de data/ no banco
await conn.sync()
await popularSeVazio()

app.listen(PORT, () => {
    console.log("==================================================");
    console.log("🚀 SERVIDOR INICIADO COM SUCESSO!");
    console.log("==================================================");
    console.log(`🌐 Site: http://localhost:${PORT}`);
    console.log("");

    console.log("📚 MATÉRIAS");
    console.log(`POST   http://localhost:${PORT}/api/materias`);
    console.log(`GET    http://localhost:${PORT}/api/materias`);
    console.log(`GET    http://localhost:${PORT}/api/materias/:id`);
    console.log(`PUT    http://localhost:${PORT}/api/materias/:id`);
    console.log(`DELETE http://localhost:${PORT}/api/materias/:id`);
    console.log("");

    console.log("🧩 PROJETOS");
    console.log(`POST   http://localhost:${PORT}/api/projetos`);
    console.log(`GET    http://localhost:${PORT}/api/projetos`);
    console.log(`GET    http://localhost:${PORT}/api/projetos/:id`);
    console.log(`PUT    http://localhost:${PORT}/api/projetos/:id`);
    console.log(`DELETE http://localhost:${PORT}/api/projetos/:id`);
    console.log("");

    console.log("💭 REFLEXÕES");
    console.log(`POST   http://localhost:${PORT}/api/reflexoes`);
    console.log(`GET    http://localhost:${PORT}/api/reflexoes`);
    console.log(`GET    http://localhost:${PORT}/api/reflexoes/:id`);
    console.log(`PUT    http://localhost:${PORT}/api/reflexoes/:id`);
    console.log(`DELETE http://localhost:${PORT}/api/reflexoes/:id`);
    console.log("");

    console.log("==================================================");
    console.log("✅ API pronta para receber requisições.");
    console.log("==================================================");
})
