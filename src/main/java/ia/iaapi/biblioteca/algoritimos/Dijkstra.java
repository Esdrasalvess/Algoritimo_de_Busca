package ia.iaapi.biblioteca.algoritimos;


import ia.iaapi.biblioteca.Grafo;
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
        int nosExpandidos = 0;

        for (String no : grafo.getNos()) {
            dist.put(no, Integer.MAX_VALUE);
            anterior.put(no, null);
        }
        dist.put(inicio, 0);

        PriorityQueue<String> fila = new PriorityQueue<>(Comparator.comparingInt(dist::get));
        fila.add(inicio);

        while (!fila.isEmpty()) {
            String atual = fila.poll();
            nosExpandidos++; // AQCÁ INCREMENTA O CONTADOR

            if (atual.equals(destino)) break;
            if (!visitado.add(atual)) continue;


            for (Map.Entry<String, Integer> vizinhoEntry : grafo.getVizinhos(atual).entrySet()) {
                String vizinho = vizinhoEntry.getKey();
                int pesoAresta = vizinhoEntry.getValue();
                int novaDist = dist.get(atual) + pesoAresta;

                if (novaDist < dist.getOrDefault(vizinho, Integer.MAX_VALUE)) {
                    dist.put(vizinho, novaDist);
                    anterior.put(vizinho, atual);
                    fila.add(vizinho);
                }
            }
        }

        List<String> caminho = new ArrayList<>();
        if (anterior.get(destino) == null && !destino.equals(inicio)) {
            return new ResultadoBusca(caminho, -1, nosExpandidos); // DEU RUIM AQUI, NUM TEM CAMINHO
        }

        String noAtual = destino;
        while (noAtual != null) {
            caminho.add(noAtual);
            noAtual = anterior.get(noAtual);
        }
        Collections.reverse(caminho);

        return new ResultadoBusca(caminho, dist.get(destino), nosExpandidos);
    }
}
