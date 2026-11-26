# Portfólio — Theodor Fagundes (3º D — Informática)

Portfólio escolar com **front-end** (HTML/CSS/JS) e **back-end** próprio: uma **API REST** feita com **Node.js, Express e Sequelize**, com banco de dados **SQL (SQLite)**. O site busca as matérias, projetos e reflexões na API usando `fetch`.

---

## Estrutura do projeto

```
.
├── data/                 conteúdo inicial (matérias, projetos, reflexões em JSON)
├── public/               o site (index.html, styles.css, script.js, assets/)
├── src/
│   ├── config/conn.js    conexão com o banco
│   ├── models/           as tabelas (materiaModel, projetoModel, reflexaoModel)
│   ├── controllers/      a lógica de cada rota
│   ├── routes/           qual URL chama qual controller
│   ├── app.js            configura o Express
│   ├── server.js         liga o servidor
│   └── seed.js           copia o conteúdo de data/ para o banco
└── package.json
```

**Caminho de uma requisição:** site → `fetch` → `routes` → `controllers` → `models` → banco → JSON.

---

## Instalação e execução

```bash
npm install
npm start
```

Abra **http://localhost:3000**. Na primeira vez o banco (`database.sqlite`) é criado sozinho com o conteúdo de `data/`.

Para desenvolvimento: `npm run dev` (reinicia ao salvar).

> Não abra o `index.html` com duplo clique: o site precisa do servidor para buscar os dados.

---

## Configuração do banco

Em `src/config/conn.js` já vem o **SQLite** (um arquivo, não precisa instalar nada).
Para usar **MySQL**, comente a conexão do SQLite, descomente a do MySQL e ajuste o nome do banco, usuário e senha.

---

## Rotas da API

| Método | Endpoint | O que faz |
|--------|----------|-----------|
| GET | /api/materias | Lista as matérias |
| GET | /api/materias/:id | Busca uma matéria |
| POST | /api/materias | Cadastra |
| PUT | /api/materias/:id | Atualiza (só os campos enviados) |
| DELETE | /api/materias/:id | Remove |

`/api/projetos` e `/api/reflexoes` têm exatamente as mesmas 5 rotas.

**Códigos:** 200 ok · 201 criado · 400 dados inválidos · 404 não encontrado · 500 erro do servidor.
Respostas de erro/sucesso trazem `{ "mensagem": "..." }`.

### Campos

| Recurso | Campos |
|---------|--------|
| matéria | `nome`, `classe`, `icone`, `professores`, `bimestres` |
| projeto | `nome`, `classe`, `icone`, `descricao`, `pergunta` (opcional), `atuacao`, `evidencias` |
| reflexão | `titulo`, `itens` |

`bimestres`, `evidencias` e `itens` são JSON (veja os arquivos de `data/`).

### Exemplo de cadastro de projeto

```json
{
    "nome": "Feira de Ciências",
    "classe": "feira",
    "icone": "fa-solid fa-flask",
    "descricao": "Descrição do card.",
    "atuacao": "Meu papel no projeto.",
    "evidencias": [{ "imagem": null, "legenda": "Foto 1" }]
}
```

---

## Como editar o conteúdo

O conteúdo "de fábrica" fica em `data/`. O servidor só lê esses arquivos para **criar o banco**; depois disso, quem manda é o banco. Para mudar um texto:

1. Edite o arquivo em `data/` (atenção à sintaxe JSON: aspas duplas e vírgulas).
2. Rode `npm run seed` (**apaga e recria** as tabelas com o conteúdo de `data/`).
3. Reinicie o servidor.

Para colocar uma imagem num projeto: copie o arquivo para `public/assets/` e troque `"imagem": null` por `"imagem": "assets/nome-do-arquivo.jpg"`.
