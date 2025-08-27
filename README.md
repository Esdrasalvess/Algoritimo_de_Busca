# Simulador de Algoritmo de Busca - Dijkstra

Este projeto é um ambiente de simulação para estudo e aplicação de algoritmos de busca em grafos, desenvolvido como parte da atividade prática do Bloco Formativo 2 da disciplina de Inteligência Artificial.  

O foco principal do projeto foi a implementação do **algoritmo de Dijkstra**, também conhecido como busca de custo uniforme, que garante sempre o caminho de menor custo entre dois nós em um grafo.

1º Maria Letícia Almeida Gonçalves
Vitória da Conquista , Bahia
leticiaw.g.a@gmail.com

2º Esdrás Alves dos Santos
Vitória da Conquista , Bahia
esdrasalvesdossantos2002@gmail.com


---

## 🔹 Objetivo do Projeto

O objetivo desta atividade foi criar um ambiente completo e modular que permitisse:

- Testar e visualizar algoritmos de busca em grafos.
- Trabalhar com grafos dinâmicos carregados de arquivos JSON.
- Oferecer uma API que permita a conexão com qualquer frontend ou sistema externo.
- Mostrar o caminho passo a passo, o custo total e animar visualmente os resultados.
  
O algoritmo de Dijkstra foi escolhido por sua relevância prática e capacidade de encontrar sempre a solução ótima em termos de custo acumulado, sendo uma base sólida para futuras implementações de outros algoritmos de busca.


## 🔹 Estrutura do Sistema

O sistema foi dividido em **backend** e **frontend**, de forma modular e escalável.

### Backend

- **Linguagem:** Java 17  
- **Framework:** Spring Boot 3.5.4  
- **Função:** Recebe grafos em JSON, executa o algoritmo de busca e retorna os resultados via API REST.

#### Estrutura de pastas:

- **Rota `/labirinto` (GET)**: Retorna o grafo carregado.  
- **Rota `/labirinto/resolver` (POST)**: Recebe nós inicial e final e retorna o caminho ótimo com base no grafo atual.  
- **Rota `/labirinto/resolver-com-json` (POST)**: Recebe um grafo JSON customizado e retorna o caminho ótimo.

Essa estrutura permite que o backend funcione como uma **API modular**, que pode ser consumida por qualquer frontend ou sistema que envie JSONs compatíveis.


### Frontend

- **Linguagem:** TypeScript  
- **Framework:** Angular 17  
- **Função:** Interface gráfica interativa que permite:
  - Upload de arquivos JSON contendo grafos.
  - Seleção de nós inicial e final.
  - Exibição do caminho passo a passo.
  - Animação do caminho encontrado.
  - Reset da animação.

#### Estrutura de pastas:


- O frontend consome a API de forma genérica, permitindo que qualquer aplicação compatível com JSON utilize o backend.


### Arquivos de Entrada

Os grafos são representados em JSON, o que facilita:

- Alterar e testar diferentes cenários de busca.
- Mapear a estrutura de nós e arestas de forma clara.

**Exemplo de JSON:**

{
  "Arad": { "Zerind": 75, "Timisoara": 118, "Sibiu": 140 },
  "Zerind": { "Arad": 75, "Oradea": 71 },
  "Oradea": { "Zerind": 71, "Sibiu": 151 },
  "Timisoara": { "Arad": 118, "Lugoj": 111 },
  "Lugoj": { "Timisoara": 111, "Mehadia": 70 },
  "Mehadia": { "Lugoj": 70, "Drobeta": 75 },
  "Drobeta": { "Mehadia": 75, "Craiova": 120 },
}

## Fluxo sistema 
[Arquivo JSON] → [Backend Java / Spring Boot] → [Algoritmo Dijkstra] → [API REST] → [Frontend Angular] → [Usuário]

## Sistema em produção
https://front-production-dd9b.up.railway.app/
