# Simulador de Algoritmos de Busca em Grafos

[![Java](https://img.shields.io/badge/Java-17+-orange.svg)](https://www.java.com) [![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-brightgreen.svg)](https://spring.io/projects/spring-boot) [![Angular](https://img.shields.io/badge/Angular-17-red.svg)](https://angular.io) [![Status](https://img.shields.io/badge/status-concluído-blue.svg)](https://github.com)

Uma aplicação web interativa para visualização e comparação de algoritmos de busca cega e informada, permitindo ao usuário encontrar o caminho de menor custo em um grafo de forma dinâmica.

**Acesse a aplicação em produção:** <https://buscas.up.railway.app/>

---

## ✨ Funcionalidades Principais

* **Visualização Interativa:** Renderiza grafos a partir de arquivos JSON utilizando D3.js, com um layout dirigido por força que melhora a legibilidade.
* **Seleção de Algoritmos:** Permite ao usuário escolher entre diferentes algoritmos de busca:
    * **Busca Cega:** Dijkstra
    * **Busca Informada:** Busca Gulosa, A\* (A-Estrela) e A\* Ponderado.
* **Animação de Resultados:** Destaca e anima o caminho encontrado, mostrando o percurso passo a passo.
* **Seleção Dinâmica:** O usuário pode selecionar os nós de origem e destino diretamente na interface.
* **Cálculo de Custo:** Exibe o custo total do caminho encontrado pelo algoritmo.
* **Arquitetura Desacoplada:** Backend (API RESTful) e Frontend (Single Page Application) completamente independentes.

## 🛠️ Tecnologias Utilizadas

### **Backend**

* **Java 17**
* **Spring Boot 3**
* **Maven** (Gerenciador de Dependências)

### **Frontend**

* **Angular 17**
* **TypeScript**
* **D3.js** (Para visualização dos grafos)

## 🚀 Como Executar o Projeto

Siga os passos abaixo para configurar e executar o projeto em seu ambiente local.

### **Pré-requisitos**

* **Java 17+** (JDK)
* **Apache Maven**
* **Node.js** e **npm**
* **Angular CLI** (`npm install -g @angular/cli`)

### **1. Clonar o Repositório**

```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd <NOME_DA_PASTA_DO_PROJETO>
```

### **2. Executar o Backend (API)

Navegue até a pasta do backend e execute o comando do Maven para iniciar a aplicação Spring Boot.

```bash
# Assumindo que a pasta do backend está na raiz do projeto
cd <PASTA_DO_BACKEND>
mvn spring-boot:run
```

### **3. Executar o Frontend (Interface)

Em outro terminal, navegue até a pasta do frontend, instale as dependências e inicie o servidor de desenvolvimento do Angular.

```bash
# Assumindo que a pasta do frontend está na raiz do projeto
cd <PASTA_DO_FRONTEND>
npm install
ng serve
```
    A aplicação estará acessível em http://localhost:4200.


## 📖 Uso da API

O principal endpoint do sistema é responsável por processar a busca. Ele recebe a origem, o destino e o algoritmo a ser utilizado.

    URL: /labirinto/resolver

    Método: POST

    Headers: Content-Type: application/json

Exemplo de Corpo da Requisição (Request Body)

O corpo da requisição deve especificar a origem, o destino e o algoritmo. Para o a_estrela_ponderado, o campo peso é opcional (padrão 1.5).

```JSON
{
    "origem": "Arad",
    "destino": "Bucareste",
    "algoritmo": "a_estrela_ponderado",
    "peso": 2.0
}
```
Valores possíveis para algoritmo: dijkstra, gulosa, a_estrela, a_estrela_ponderado.

Exemplo de Corpo da Resposta (Response Body)

A API retorna o caminho detalhado, passo a passo, e o custo total da solução encontrada.

```JSON
{
    "noInicio": "Arad",
    "noFim": "Bucareste",
    "custoTotal": 418,
    "caminhoPassoAPasso": [
        {
            "de": "Arad",
            "para": "Sibiu",
            "custo": 140
        },
        {
            "de": "Sibiu",
            "para": "Rimnicu Vilcea",
            "custo": 80
        },
        {
            "de": "Rimnicu Vilcea",
            "para": "Pitesti",
            "custo": 97
        },
        {
            "de": "Pitesti",
            "para": "Bucareste",
            "custo": 101
        }
    ]
}

```

## 👨‍💻 Autores

1º Maria Letícia Almeida Gonçalves
Vitória da Conquista , Bahia
leticiaw.g.a@gmail.com

2º Esdrás Alves dos Santos
Vitória da Conquista , Bahia
esdrasalvesdossantos2002@gmail.com
