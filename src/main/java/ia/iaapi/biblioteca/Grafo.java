package ia.iaapi.biblioteca;

import java.util.*;

public class Grafo {
    private final Map<String, Map<String, Integer>> adjacencias = new HashMap<>();

    public void adicionarNo(String no) {
        adjacencias.putIfAbsent(no, new HashMap<>());
    }

    public void adicionarAresta(String origem, String destino, int custo) {
        // Acá garantimos a origem e o destino do bagui
        adjacencias.putIfAbsent(origem, new HashMap<>());
        adjacencias.putIfAbsent(destino, new HashMap<>());
        adjacencias.get(origem).put(destino, custo);
    }

    public Map<String, Integer> getVizinhos(String no) {
        return adjacencias.getOrDefault(no, Collections.emptyMap());
    }

    public Set<String> getNos() {
        Set<String> todos = new HashSet<>(adjacencias.keySet());
        for (Map<String, Integer> viz : adjacencias.values()) {
            todos.addAll(viz.keySet());
        }
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
