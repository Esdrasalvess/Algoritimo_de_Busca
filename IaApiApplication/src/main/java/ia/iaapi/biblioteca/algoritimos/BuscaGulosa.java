package ia.iaapi.biblioteca.algoritimos;

import ia.iaapi.biblioteca.Grafo;
import java.util.*;

public class BuscaGulosa {
    private final Grafo grafo;

    public BuscaGulosa(Grafo grafo) {
        this.grafo = grafo;
    }

    public ResultadoBusca buscar(String inicio, String destino) {
        Map<String, String> anterior = new HashMap<>();
        Map<String, Integer> custoCaminho = new HashMap<>();
        Set<String> visitados = new HashSet<>();
        int nosExpandidos = 0;

        // Acá temos uma fila de prioridade baseada apenas na heurística
        PriorityQueue<String> fila = new PriorityQueue<>(
                Comparator.comparingInt(no -> grafo.getHeuristica(no, destino))
        );

        fila.add(inicio);
        custoCaminho.put(inicio, 0);
        anterior.put(inicio, null);

        while (!fila.isEmpty()) {
            String atual = fila.poll();
            nosExpandidos++;

            if (atual.equals(destino)) {
                return reconstruirCaminho(anterior, destino, custoCaminho, nosExpandidos);
            }

            visitados.add(atual);

            for (Map.Entry<String, Integer> vizinhoEntry : grafo.getVizinhos(atual).entrySet()) {
                String vizinho = vizinhoEntry.getKey();
                if (!visitados.contains(vizinho)) {
                    anterior.put(vizinho, atual);
                    int novoCusto = custoCaminho.get(atual) + grafo.getPeso(atual, vizinho);
                    custoCaminho.put(vizinho, novoCusto);
                    fila.add(vizinho);
                }
            }
        }
        // Já sabe né, num encontrou o caminho 
        return new ResultadoBusca(Collections.emptyList(), -1, nosExpandidos);
    }

    private ResultadoBusca reconstruirCaminho(Map<String, String> anterior, String destino, Map<String, Integer> custoCaminho, int nosExpandidos) {
        List<String> caminho = new ArrayList<>();
        String atual = destino;
        while (atual != null) {
            caminho.add(atual);
            atual = anterior.get(atual);
        }
        Collections.reverse(caminho);
        return new ResultadoBusca(caminho, custoCaminho.get(destino), nosExpandidos);
    }
}
