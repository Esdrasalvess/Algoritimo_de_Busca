package IA.biblioteca;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.File;
import java.util.Map;


public class LeitorGrafo {

    @SuppressWarnings("unchecked")
    public static Grafo carregarDeJson(String caminho) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        Map<String, Map<String, Object>> data = mapper.readValue(new File(caminho), Map.class);

        Grafo grafo = new Grafo();

        int contador = 0; // para coordenadas automáticas
        int espacamento = 100; // distância entre nós no grid

        for (Map.Entry<String, Map<String, Object>> entry : data.entrySet()) {
            String no = entry.getKey();

            // gera coordenadas automáticas
            int x = (contador % 10) * espacamento;       // até 10 nós por linha
            int y = (contador / 10) * espacamento;       // aumenta a linha a cada 10 nós
            contador++;

            grafo.adicionarNo(no, x, y); // garante o nó de origem com coordenadas

            Map<String, Object> info = entry.getValue();
            Object arestasObj = info.get("arestas");
            if (arestasObj instanceof Map<?, ?> arestas) {
                for (Map.Entry<?, ?> e : arestas.entrySet()) {
                    String vizinho = String.valueOf(e.getKey());
                    int custo = ((Number) e.getValue()).intValue();
                    // adiciona aresta; o destino será garantido quando o loop chegar nele
                    grafo.adicionarAresta(no, vizinho, custo);
                }
            }
        }
        return grafo;
    }
}

/*
public class LeitorGrafo {
    @SuppressWarnings("unchecked")
    public static Grafo carregarDeJson(String caminho) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        Map<String, Map<String, Object>> data = mapper.readValue(new File(caminho), Map.class);

        Grafo grafo = new Grafo();

        for (Map.Entry<String, Map<String, Object>> entry : data.entrySet()) {
            String no = entry.getKey();
            grafo.adicionarNo(no);

            Map<String, Object> info = entry.getValue();
            Object arestasObj = info.get("arestas");
            if (arestasObj instanceof Map<?, ?> arestas) {
                for (Map.Entry<?, ?> e : arestas.entrySet()) {
                    String vizinho = String.valueOf(e.getKey());
                    int custo = ((Number) e.getValue()).intValue();
                    grafo.adicionarAresta(no, vizinho, custo);
            }
        }
        return grafo;
    }
}

 */