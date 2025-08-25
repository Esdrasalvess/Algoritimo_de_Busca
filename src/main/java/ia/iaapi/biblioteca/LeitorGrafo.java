package ia.iaapi.biblioteca;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.File;
import java.util.Map;

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
        }
        return grafo;
    }
}
