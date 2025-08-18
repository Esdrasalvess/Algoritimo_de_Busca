package IA.biblioteca.algoritimos;

import IA.biblioteca.Grafo;
import java.util.*;

public class Dijkstra {
    private final Grafo grafo;

    public Dijkstra(Grafo grafo) {
        this.grafo = grafo;
    }

    public ResultadoBusca buscar(String inicio, String destino) {
        Map<String, Integer> dist = new HashMap<>();
        Map<String, String> anterior = new HashMap<>();
        Set<String> visitado = new HashSet<>();

        //Starta todos os nós (inclusive os que só aparecem como destino)
        for (String no : grafo.getNos()) {
            dist.put(no, Integer.MAX_VALUE);
            anterior.put(no, null);
        }
        dist.put(inicio, 0);

        PriorityQueue<String> fila = new PriorityQueue<>(
                Comparator.comparingInt(n -> dist.getOrDefault(n, Integer.MAX_VALUE))
        );
        fila.add(inicio);

        while (!fila.isEmpty()) {
            String atual = fila.poll();
            if (!visitado.add(atual)) continue;      // já processado
            if (atual.equals(destino)) break;

            for (Map.Entry<String, Integer> viz : grafo.getVizinhos(atual).entrySet()) {
                String v = viz.getKey();
                int w = viz.getValue();

                int custoAtual = dist.getOrDefault(atual, Integer.MAX_VALUE);
                if (custoAtual == Integer.MAX_VALUE) continue; // inacessível

                int novaDist = custoAtual + w;
                if (novaDist < dist.getOrDefault(v, Integer.MAX_VALUE)) {
                    dist.put(v, novaDist);
                    anterior.put(v, atual);
                    fila.add(v);
                }
            }
        }

        // Refaz o caminho
        List<String> caminho = new ArrayList<>();
        if (dist.getOrDefault(destino, Integer.MAX_VALUE) == Integer.MAX_VALUE) {
            // sem caminho: retorna lista vazia e custo "infinito" (-1)
            return new ResultadoBusca(caminho, -1);
        }

        for (String no = destino; no != null; no = anterior.get(no)) {
            caminho.add(no);
        }
        Collections.reverse(caminho);

        return new ResultadoBusca(caminho, dist.get(destino));
    }
}