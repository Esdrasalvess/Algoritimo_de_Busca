package IA;

import IA.biblioteca.*;
import IA.biblioteca.algoritimos.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.File;
import java.util.ArrayList;
import java.util.List;


public class Main {
    public static void main(String[] args) throws Exception {

        String arquivoGrafo = "src/main/java/IA/entrada/grafo.json";
        String inicio = "no_A";
        String fim = "no_L";

        Grafo grafo = LeitorGrafo.carregarDeJson(arquivoGrafo);
        Dijkstra dijkstra = new Dijkstra(grafo);
        ResultadoBusca resultado = dijkstra.buscar(inicio, fim);

        List<String> caminho = resultado.getCaminho();
        List<Passo> passos = new ArrayList<>();

        for (int i = 0; i < caminho.size() - 1; i++) {
            String de = caminho.get(i);
            String para = caminho.get(i + 1);
            int custo = grafo.getPeso(de, para);
            int[] coordDe = grafo.getCoordenadas(de);
            int[] coordPara = grafo.getCoordenadas(para);
            passos.add(new Passo(de, para, custo, coordDe, coordPara));
        }

        ResultadoJson saida = new ResultadoJson(inicio, fim, resultado.getCustoTotal(), passos);

        File pastaSaida = new File("src/main/java/IA/saida");
        if (!pastaSaida.exists()) pastaSaida.mkdirs();

        File arquivoSaida = new File(pastaSaida, "resultado.json");
        ObjectMapper mapper = new ObjectMapper();
        mapper.writerWithDefaultPrettyPrinter().writeValue(arquivoSaida, saida);

        System.out.println("JSON de saída gerado em: " + arquivoSaida.getAbsolutePath());
    }
}

/*
public class Main {
    public static void main(String[] args) throws Exception {

        String arquivoGrafo = "src/main/java/IA/entrada/grafo.json";
        String inicio = "no_A";
        String fim = "no_L";

        Grafo grafo = LeitorGrafo.carregarDeJson(arquivoGrafo);
        Dijkstra dijkstra = new Dijkstra(grafo);
        ResultadoBusca resultado = dijkstra.buscar(inicio, fim);

        List<String> caminho = resultado.getCaminho();
        List<Passo> passos = new ArrayList<>();

        // Para podermos fazer uma animação
        for (int i = 0; i < caminho.size() - 1; i++) {
            String de = caminho.get(i);
            String para = caminho.get(i + 1);
            int custo = grafo.getPeso(de, para); 
            passos.add(new Passo(de, para, custo));
        }

        ResultadoJson saida = new ResultadoJson(inicio, fim, resultado.getCustoTotal(), passos);

        File pastaSaida = new File("src/main/java/IA/saida");
        if (!pastaSaida.exists()) pastaSaida.mkdirs();

        File arquivoSaida = new File(pastaSaida, "resultado.json");
        ObjectMapper mapper = new ObjectMapper();
        mapper.writerWithDefaultPrettyPrinter().writeValue(arquivoSaida, saida);

        System.out.println("JSON de saída gerado em: " + arquivoSaida.getAbsolutePath());
    }
}

 */

/*
Teste simples antes de gerar o arquivo de saída
import IA.biblioteca.*;
import IA.biblioteca.algoritimos.*;

public class Main {
    public static void main(String[] args) throws Exception {
        Grafo grafo = LeitorGrafo.carregarDeJson("src/main/java/IA/entrada/grafo.json");
        Dijkstra dijkstra = new Dijkstra(grafo);
        ResultadoBusca r = dijkstra.buscar("no_A", "no_L");
        System.out.println("Caminho: " + r.getCaminho());
        System.out.println("Custo: " + r.getCustoTotal());
    }
}

 */
