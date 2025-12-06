# Google Drive XLS/XLSX Upload API
API backend para upload e leitura de arquivos de planilha (XLS/XLSX) no Google Drive, usando Node.js, Express, TypeScript, OAuth2 e Google Drive API.

Este guia contém todas as etapas necessárias para rodar o projeto após realizar o clone.

---

# 1. Instalar dependências

Após clonar o repositório:

npm install

---

# 2. Criar o arquivo .env a partir do .env.example

cp .env.example .env

Edite o .env e configure:

GOOGLE_DRIVE_REPORTS_FOLDER_ID=<ID_da_pasta_no_Drive>
DEFAULT_SERVER_PORT=3000
ALTERNATIVE_SERVER_PORT=3001

Como obter o ID da pasta no Google Drive:
Abra a pasta e copie o trecho final da URL:

https://drive.google.com/drive/folders/<AQUI_FICA_O_ID>

---

# 3. Criar credenciais OAuth2 no Google Cloud

3.1 Acessar o console:
https://console.cloud.google.com/apis/credentials

3.2 Criar (ou usar) um projeto:
Qualquer nome, por exemplo:
sisagenda-drive-api

3.3 Ativar Google Drive API:
APIs e serviços → Biblioteca → Google Drive API → Ativar

3.4 Criar OAuth Client ID:
APIs e serviços → Credenciais → Criar credenciais → ID do cliente OAuth

Se solicitado, configure a Tela de Consentimento:
Tipo de usuário: Externo
Nome do app: qualquer nome
Salvar

Tipo de aplicativo:
Aplicativo para computador (Desktop App)

Baixe o JSON gerado.

Renomeie para:
credentials.json

Salve em:
src/config/credentials.json

---

# 4. Gerar o token.json

Execute:

npx tsx scripts/initGoogleOAuth.ts

O script exibirá uma URL.
Abra a URL → faça login na sua conta do Google → permita acesso.

Depois do login, será redirecionado para uma URL como:

http://localhost/?code=XXXXXXXXX

Copie somente o valor de code= e cole no terminal.

Isso criará:

src/config/token.json

---

# 5. Verificar se o .env está carregando

Execute:

npm run dev

Se aparecer no console:

ENV ID: <o id da pasta>

O ambiente está configurado corretamente.

---

# 6. Rodar o servidor

Ambiente de desenvolvimento:
npm run dev

Ambiente de produção:
npm run build
npm start

---

# 7. Endpoints da API

POST /files/upload
Envia um arquivo XLS/XLSX para a pasta configurada no Google Drive.

No Postman:
Body → form-data
file (type File)

GET /files/list
Lista todos os arquivos armazenados na pasta destino no Drive.

---

# 8. Estrutura de pastas essencial

/src
  /config
    credentials.json
    token.json
    env.ts
  /controllers
  /services
  /routes
/scripts
  initGoogleOAuth.ts
.env
.env.example

---

# 9. Arquivos ignorados pelo Git (segurança)

node_modules
.env
dist
tmp
src/config/credentials.json
src/config/token.json

---

# 10. Testando upload no Postman

POST http://localhost:3000/files/upload

Body → form-data:
file: selecione um arquivo .xls ou .xlsx

Resposta esperada:

{
  "message": "file uploaded successfully",
  "file": {
    "id": "xxxx",
    "name": "planilha.xlsx"
  }
}

---

# Pronto! Sistema configurado e funcional.
