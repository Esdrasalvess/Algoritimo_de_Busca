package ia.iaapi.biblioteca.algoritimos;

import java.util.List;

public class ResultadoBusca {
    private final List<String> caminho;
    private final int custoTotal;
    private int nosExpandidos;

    public ResultadoBusca(List<String> caminho, int custoTotal) {
        this.caminho = caminho;
        this.custoTotal = custoTotal;
        this.nosExpandidos = 0;
    }

    public ResultadoBusca(List<String> caminho, int custoTotal, int nosExpandidos) {
        this.caminho = caminho;
        this.custoTotal = custoTotal;
        this.nosExpandidos = nosExpandidos;
    }


    public List<String> getCaminho() { return caminho; }
    public int getCustoTotal() { return custoTotal; }
    public int getNosExpandidos() { return nosExpandidos; }
    public void setNosExpandidos(int nosExpandidos) { this.nosExpandidos = nosExpandidos; }
}
