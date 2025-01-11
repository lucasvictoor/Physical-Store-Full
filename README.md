# Physical Store Full API

## 📖 Sobre o Projeto

A **Physical Store Full API** é uma aplicação desenvolvida para gerenciar lojas físicas de forma eficiente e organizada. Esta API permite criar, listar, editar, buscar e excluir informações sobre lojas, além de integrar serviços externos para enriquecer os dados fornecidos.

---

## 🛠️ Tecnologias Utilizadas

- **Node.js**
- **NestJS**
- **Swagger**
- **TypeScript**
- **APIs Externas**:
  - [ViaCEP](https://viacep.com.br/): Para consulta de endereços a partir de CEPs.
  - [Google Maps Geocoding API](https://developers.google.com/maps/documentation/geocoding/overview): Para geocodificação e geocodificação reversa.
  - [Correios API](https://www.correios.com.br/atendimento/developers): Para cálculo de fretes.

---

## 🚀 Funcionalidades

### **Endpoints Principais**

1. **Gerenciamento de Lojas**:

   - Criar uma loja.
   - Listar todas as lojas com paginação.
   - Editar informações de uma loja.
   - Excluir uma loja pelo ID.
   - Buscar lojas por ID, estado ou CEP.

2. **APIs Externas**:

   - Consulta de endereço via CEP.
   - Geocodificação de endereços com Google Maps.
   - Cálculo de fretes com os Correios.

3. **Documentação Integrada**:
   - Documentação no Swagger.
   - Informações sobre códigos de status HTTP e histórico de alterações da API.

---

## 📂 Estrutura do Projeto

```plaintext
src/
├── app/                   # Configuração principal da aplicação
│   ├── app.controller.ts  # Controlador principal
│   ├── app.service.ts     # Serviço principal
│   ├── app.module.ts      # Módulo principal
├── common/
│   └── dto/               # DTOs (Data Transfer Objects)
│       ├── create-store.dto.ts
│       ├── store-response.dto.ts
├── swagger/               # Configurações e controladores do Swagger
│   ├── changelog.controller.ts
│   ├── external-apis.controller.ts
│   ├── status-codes.controller.ts
│   ├── store-schemas.ts
│   └── swagger-config.ts
├── utils/                 # Funções utilitárias
│   ├── config.ts
│   ├── conv-distance.ts
│   ├── delivery-time.ts
│   └── logger.ts
├── database/              # Configuração do banco de dados
│   └── models/            # Modelos do banco de dados
│       ├── conn.ts
│       └── store.model.ts
├── modules/
│   └── store/             # Módulo Store
│       ├── controllers/   # Controladores do módulo
│       │   └── store.controller.ts
│       ├── services/      # Serviços do módulo
│       │   ├── correios.service.ts
│       │   ├── geocoding.service.ts
│       │   ├── store.service.ts
│       │   └── viacep.service.ts
│       └── store.module.ts
├── test/                  # Testes
├── main.ts                # Arquivo principal
└── .env                   # Variáveis de ambiente
```

---

## 📖 Documentação da API

Acesse a documentação completa no Swagger:

- URL: [http://localhost:4000/api](http://localhost:4000/api)

A documentação inclui:

- Descrição de cada endpoint.
- Exemplo de entrada e saída de dados.
- Códigos de status HTTP retornados.
- Histórico de versões da API.

---

## 🌐 Instalação e Execução

### **Pré-requisitos**

- **Node.js** v14+.
- **NPM** ou **Yarn**.

### **Passo a Passo**

1. Clone o repositório:

   ```bash
   git clone <url-do-repositorio>
   ```

2. Navegue até o diretório do projeto:

   ```bash
   cd physical-store-full-api
   ```

3. Instale as dependências:

   ```bash
   npm install
   ```

4. Configure as variáveis de ambiente no arquivo `.env`:

   ```plaintext
   PORT=4000
   GOOGLE_API_KEY=<sua-chave>
   MONGO_URI
   ```

5. Execute o servidor em modo de desenvolvimento:

   ```bash
   npm run start:dev
   ```

6. Acesse a API em: [http://localhost:4000](http://localhost:4000)

---

## 🛠️ Testes

Execute os testes para validar as funcionalidades:

```bash
npm run test
```

---

## 👨‍💻 Autor

Desenvolvido por [Lucas Victor]. Entre em contato:

- Email: [lucasvfeuer@gmail.com](mailto:seu-email@example.com)
- LinkedIn: [lucasvictoor](https://linkedin.com/in/seu-perfil)
