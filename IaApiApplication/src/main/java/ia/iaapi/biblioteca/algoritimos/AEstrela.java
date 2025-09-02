package ia.iaapi.biblioteca.algoritimos;

import ia.iaapi.biblioteca.Grafo;
import java.util.*;

public class AEstrela {
    private final Grafo grafo;
    private final double peso; // Esse aqui fizemos para ser usado no A* e A* Ponderado

    public AEstrela(Grafo grafo) {
        this.grafo = grafo;
        this.peso = 1.0; // A* normal tem peso 1
    }

    public AEstrela(Grafo grafo, double peso) {
        this.grafo = grafo;
        this.peso = peso; // A* Ponderado
    }

    public ResultadoBusca buscar(String inicio, String destino) {

        Map<String, Integer> gScore = new HashMap<>();
        Map<String, Double> fScore = new HashMap<>();
        Map<String, String> anterior = new HashMap<>();
        int nosExpandidos = 0;

        for (String no : grafo.getNos()) {
            gScore.put(no, Integer.MAX_VALUE);
            fScore.put(no, Double.MAX_VALUE);
        }

        gScore.put(inicio, 0);
        fScore.put(inicio, peso * grafo.getHeuristica(inicio, destino));

        PriorityQueue<String> fila = new PriorityQueue<>(Comparator.comparingDouble(fScore::get));
        fila.add(inicio);

        while (!fila.isEmpty()) {
            String atual = fila.poll();
            nosExpandidos++;

            if (atual.equals(destino)) {
                return reconstruirCaminho(anterior, destino, gScore.get(destino), nosExpandidos);
            }

            for (Map.Entry<String, Integer> vizinhoEntry : grafo.getVizinhos(atual).entrySet()) {
                String vizinho = vizinhoEntry.getKey();
                int custoAresta = vizinhoEntry.getValue();
                int gScoreTentativo = gScore.get(atual) + custoAresta;

                if (gScoreTentativo < gScore.getOrDefault(vizinho, Integer.MAX_VALUE)) {
                    anterior.put(vizinho, atual);
                    gScore.put(vizinho, gScoreTentativo);
                    double h = grafo.getHeuristica(vizinho, destino);
                    fScore.put(vizinho, gScoreTentativo + (peso * h));
                    if (!fila.contains(vizinho)) {
                        fila.add(vizinho);
                    }
                }
            }
        }
        // num encontrou caminho
        return new ResultadoBusca(Collections.emptyList(), -1, nosExpandidos);
    }

    private ResultadoBusca reconstruirCaminho(Map<String, String> anterior, String atual, int custo, int nosExpandidos) {
        List<String> caminho = new ArrayList<>();
        while (anterior.containsKey(atual)) {
            caminho.add(atual);
            atual = anterior.get(atual);
        }
        caminho.add(atual);
        Collections.reverse(caminho);
        return new ResultadoBusca(caminho, custo, nosExpandidos);
    }
}
