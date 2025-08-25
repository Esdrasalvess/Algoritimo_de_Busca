# Simulador de Algoritmo de Busca - Dijkstra

Este projeto é um ambiente de simulação para estudar e aplicar algoritmos de busca em grafos, desenvolvido como parte da atividade prática do Bloco Formativo 2 da disciplina de Inteligência Artificial.  

O foco principal foi a implementação do **algoritmo de Dijkstra**, também conhecido como busca de custo uniforme, garantindo sempre o menor caminho em termos de custo acumulado.

---

## 🔹 Estrutura do Projeto

O sistema foi dividido em **backend** e **frontend**, tornando a aplicação modular e fácil de entender:

### Backend
- **Linguagem:** Java  
- **Framework:** Spring Boot  
- **Função:** Recebe arquivos JSON que representam grafos, executa o algoritmo de busca e retorna os resultados via API REST.  
- **Estrutura de pastas:**
  - `biblioteca/` - Classes principais (`Grafo`, `Dijkstra`, `ResultadoBusca`, etc.).
  - `entrada/` - Arquivos JSON com os grafos.
  - `controller/` - Controladores Spring que expõem as rotas da API (`LabirintoController`).

### Frontend
- **Linguagem:** TypeScript  
- **Framework:** Angular  
- **Função:** Interface gráfica interativa que consome a API, permite upload de arquivos JSON, seleção de nós inicial e final, e visualiza os resultados da busca.
- **Componentes principais:**
  - `grafo` - Formulário de upload, seleção de nós e botões de controle.
  - `graph` - Visualização do grafo com animação do caminho encontrado.

### Arquivos de Entrada
- Os grafos são representados em **JSON**, facilitando a leitura e alteração dos dados.
- Estrutura do JSON:
```json
{
  "Arad": { "Zerind": 75, "Timisoara": 118, "Sibiu": 140 },
  "Bucareste": { "Fagaras": 211, "Pitesti": 101 }
}

