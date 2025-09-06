package ia.iaapi.biblioteca;

import java.util.*;

public class Grafo {
    private final Map<String, Map<String, Integer>> adjacencias = new HashMap<>();
    // AQUI TEMOS UM NOVISSISSIMO  Mapa para armazenar as heurísticas de um nó para um destino
    private final Map<String, Map<String, Integer>> heuristicas = new HashMap<>();

    public void adicionarNo(String no) {
        adjacencias.putIfAbsent(no, new HashMap<>());
        heuristicas.putIfAbsent(no, new HashMap<>());
    }

    public void adicionarAresta(String origem, String destino, int custo) {
        adjacencias.putIfAbsent(origem, new HashMap<>());
        adjacencias.putIfAbsent(destino, new HashMap<>());
        adjacencias.get(origem).put(destino, custo);
    }

    public void adicionarHeuristica(String no, String destino, int valor) {
        heuristicas.putIfAbsent(no, new HashMap<>());
        heuristicas.get(no).put(destino, valor);
    }

    public Map<String, Integer> getVizinhos(String no) {
        return adjacencias.getOrDefault(no, Collections.emptyMap());
    }

    public int getHeuristica(String no, String destino) {
        return heuristicas.getOrDefault(no, Collections.emptyMap()).getOrDefault(destino, 0);
    }

    public Set<String> getNos() {
        Set<String> todos = new HashSet<>(adjacencias.keySet());
        adjacencias.values().forEach(vizinhos -> todos.addAll(vizinhos.keySet()));
        return todos;
    }

    public int getPeso(String de, String para) {
        Map<String, Integer> vizinhos = adjacencias.get(de);
        if (vizinhos != null && vizinhos.containsKey(para)) {
            return vizinhos.get(para);
        } else {
            throw new IllegalArgumentException("Aresta não existe: " + de + " -> " + para);
        }
    }

    public Map<String, Map<String, Integer>> getAdjacencias() {
        return adjacencias;
    }
}
