package ia.iaapi.controller;

import ia.iaapi.biblioteca.*;
import ia.iaapi.biblioteca.algoritimos.AEstrela;
import ia.iaapi.biblioteca.algoritimos.BuscaGulosa;
import ia.iaapi.biblioteca.algoritimos.Dijkstra;
import ia.iaapi.biblioteca.algoritimos.ResultadoBusca;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/labirinto")
public class LabirintoController {

    private Grafo grafoAtual;


    @GetMapping
    public ResponseEntity<Map<String, Map<String, Integer>>> getLabirinto() {
        try {
            this.grafoAtual = LeitorGrafo.carregarDeJson("src/main/java/ia/iaapi/entrada/grafo_romenia_heuristica.json");
            return ResponseEntity.ok(grafoAtual.getAdjacencias());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }


    @PostMapping("/resolver")
    public ResponseEntity<ResultadoJson> resolver(@RequestBody Map<String, Object> body) {
        try {
            String origem = (String) body.get("origem");
            String destino = (String) body.get("destino");
            String algoritmo = (String) body.get("algoritmo");
            Double peso = body.get("peso") != null ? ((Number) body.get("peso")).doubleValue() : 1.5;


            Grafo grafoParaResolver;
            if (body.containsKey("grafo")) {
                ObjectMapper mapper = new ObjectMapper();
                String grafoJson = mapper.writeValueAsString(body.get("grafo"));

                java.nio.file.Path tempFile = java.nio.file.Files.createTempFile("temp_grafo", ".json");
                java.nio.file.Files.writeString(tempFile, grafoJson);
                grafoParaResolver = LeitorGrafo.carregarDeJson(tempFile.toString());
                java.nio.file.Files.delete(tempFile);
            } else {
                if (this.grafoAtual == null) {
                    getLabirinto();
                }
                grafoParaResolver = this.grafoAtual;
            }

            ResultadoBusca resultadoBusca;


            switch (algoritmo.toLowerCase()) {
                case "gulosa":
                    BuscaGulosa gulosa = new BuscaGulosa(grafoParaResolver);
                    resultadoBusca = gulosa.buscar(origem, destino);
                    break;
                case "a_estrela":
                    AEstrela aEstrela = new AEstrela(grafoParaResolver);
                    resultadoBusca = aEstrela.buscar(origem, destino);
                    break;
                case "a_estrela_ponderado":
                    AEstrela aEstrelaPonderado = new AEstrela(grafoParaResolver, peso);
                    resultadoBusca = aEstrelaPonderado.buscar(origem, destino);
                    break;
                case "dijkstra":
                default:
                    Dijkstra dijkstra = new Dijkstra(grafoParaResolver);
                    resultadoBusca = dijkstra.buscar(origem, destino);
                    break;
            }

            return ResponseEntity.ok(formatarResultado(grafoParaResolver, origem, destino, resultadoBusca));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(null);
        }
    }

    private ResultadoJson formatarResultado(Grafo grafo, String origem, String destino, ResultadoBusca resultadoBusca) {
        List<Passo> passos = new ArrayList<>();
        List<String> caminho = resultadoBusca.getCaminho();

        if (caminho != null && caminho.size() > 1) {
            for (int i = 0; i < caminho.size() - 1; i++) {
                String de = caminho.get(i);
                String para = caminho.get(i + 1);
                int custo = grafo.getPeso(de, para);
                passos.add(new Passo(de, para, custo));
            }
        }

        return new ResultadoJson(origem, destino, resultadoBusca.getCustoTotal(), passos);
    }
}
