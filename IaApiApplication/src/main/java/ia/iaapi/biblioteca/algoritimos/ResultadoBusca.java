package ia.iaapi.biblioteca.algoritimos;


import java.util.List;

public class ResultadoBusca {
    private List<String> caminho;
    private int custoTotal;

    public ResultadoBusca(List<String> caminho, int custoTotal) {
        this.caminho = caminho;
        this.custoTotal = custoTotal;
    }

    public List<String> getCaminho() { return caminho; }
    public int getCustoTotal() { return custoTotal; }
}
