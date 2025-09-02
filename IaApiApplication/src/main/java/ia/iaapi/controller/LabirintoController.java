
import ia.iaapi.biblioteca.*;
import ia.iaapi.biblioteca.algoritimos.Dijkstra;
import ia.iaapi.biblioteca.algoritimos.ResultadoBusca;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/labirinto")
public class LabirintoController {

    private Grafo grafoAtual;

    @GetMapping
    public ResponseEntity<Map<String, Map<String, Integer>>> getLabirinto() {
        try {
            this.grafoAtual = LeitorGrafo.carregarDeJson("src/main/java/ia/iaapi/entrada/grafo_da_romenia.json");
            // this.grafoAtual = LeitorGrafo.carregarDeJson("src/main/java/ia/iaapi/entrada/grafo.json"); //FIQUEI COM PREGUIÇA DE TER QUE FICAR MUADANDO O CAMINHO ENTRE OS GRAFOS E JÁ DEIXEI PRONTO
            return ResponseEntity.ok(grafoAtual.getAdjacencias()); // Acá devolve o grafo que fizemo na pasta la de cima
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    //Acá nois podemos mandar um novo gráfo temporário e já mandar qual será a origem e qual será o destido
    @PostMapping("/resolver-com-json")
    public ResponseEntity<ResultadoJson> resolverComJson(@RequestBody Map<String, Object> body) {
        try {
            Map<String, Map<String, Integer>> grafoMap = (Map<String, Map<String, Integer>>) body.get("grafo");
            String origem = (String) body.get("origem");
            String destino = (String) body.get("destino");

            Grafo grafo = new Grafo();
            for (String no : grafoMap.keySet()) {
                grafo.adicionarNo(no);
                for (Map.Entry<String, Integer> viz : grafoMap.get(no).entrySet()) {
                    grafo.adicionarAresta(no, viz.getKey(), viz.getValue());
                }
            }

            return ResponseEntity.ok(resolverInterno(grafo, origem, destino));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    //Nessa parte acá tu manda apenas o nó de origem e o nó final pq ele usará o carai(grafo) que já está no banco
    @PostMapping("/resolver")
    public ResponseEntity<ResultadoJson> resolver(@RequestBody Map<String, String> body) {
        if (grafoAtual == null) {
            return ResponseEntity.badRequest().build();
        }

        String origem = body.get("origem");
        String destino = body.get("destino");

        return ResponseEntity.ok(resolverInterno(grafoAtual, origem, destino));
    }

    // Aqui temos um metódo auxiliar que roda Dijkstra e monta ResultadoJson
    private ResultadoJson resolverInterno(Grafo grafo, String origem, String destino) {
        Dijkstra dijkstra = new Dijkstra(grafo);
        ResultadoBusca resultadoBusca = dijkstra.buscar(origem, destino);

        List<Passo> passos = new ArrayList<>();
        List<String> caminho = resultadoBusca.getCaminho();

        for (int i = 0; i < caminho.size() - 1; i++) {
            String de = caminho.get(i);
            String para = caminho.get(i + 1);
            int custo = grafo.getPeso(de, para);
            passos.add(new Passo(de, para, custo));
        }

        return new ResultadoJson(origem, destino, resultadoBusca.getCustoTotal(), passos);
    }
}