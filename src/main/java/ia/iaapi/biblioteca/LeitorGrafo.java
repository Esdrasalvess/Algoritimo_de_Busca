package ia.iaapi.biblioteca;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.File;
import java.util.Map;

public class LeitorGrafo {

    @SuppressWarnings("unchecked")
    public static Grafo carregarDeJson(String caminho) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        // Usamos um TypeReference para lidar com a estrutura aninhada complexa
        TypeReference<Map<String, Map<String, Object>>> typeRef = new TypeReference<>() {};
        Map<String, Map<String, Object>> data = mapper.readValue(new File(caminho), typeRef);

        Grafo grafo = new Grafo();

        for (Map.Entry<String, Map<String, Object>> entry : data.entrySet()) {
            String no = entry.getKey();
            grafo.adicionarNo(no);

            Map<String, Object> info = entry.getValue();

            // Carrega as arestas
            if (info.get("arestas") instanceof Map<?, ?> arestas) {
                for (Map.Entry<?, ?> e : arestas.entrySet()) {
                    String vizinho = String.valueOf(e.getKey());
                    int custo = ((Number) e.getValue()).intValue();
                    grafo.adicionarAresta(no, vizinho, custo);
                }
            }

            // ESSE AQUI É NOVO PARA CARREGAR AS HEURISTICAS
            if (info.get("heuristica") instanceof Map<?, ?> heuristicas) {
                for (Map.Entry<?, ?> e : heuristicas.entrySet()) {
                    String destino = String.valueOf(e.getKey());
                    int valor = ((Number) e.getValue()).intValue();
                    grafo.adicionarHeuristica(no, destino, valor);
                }
            }
        }
        return grafo;
    }
}
