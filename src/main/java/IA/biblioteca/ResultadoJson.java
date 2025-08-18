package IA.biblioteca;

import java.util.List;


import java.util.List;

public class ResultadoJson {
    private String noInicio;
    private String noFim;
    private int custoTotal;
    private List<Passo> caminhoPassoAPasso;

    public ResultadoJson(String noInicio, String noFim, int custoTotal, List<Passo> caminhoPassoAPasso) {
        this.noInicio = noInicio;
        this.noFim = noFim;
        this.custoTotal = custoTotal;
        this.caminhoPassoAPasso = caminhoPassoAPasso;
    }

    public String getNoInicio() { return noInicio; }
    public String getNoFim() { return noFim; }
    public int getCustoTotal() { return custoTotal; }
    public List<Passo> getCaminhoPassoAPasso() { return caminhoPassoAPasso; }
}

/*
public class ResultadoJson {
    private String noInicio;
    private String noFim;
    private int custoTotal;
    private List<Passo> caminhoPassoAPasso;

    public ResultadoJson(String noInicio, String noFim, int custoTotal, List<Passo> caminhoPassoAPasso) {
        this.noInicio = noInicio;
        this.noFim = noFim;
        this.custoTotal = custoTotal;
        this.caminhoPassoAPasso = caminhoPassoAPasso;
    }

    public String getNoInicio() { return noInicio; }
    public void setNoInicio(String noInicio) { this.noInicio = noInicio; }

    public String getNoFim() { return noFim; }
    public void setNoFim(String noFim) { this.noFim = noFim; }

    public int getCustoTotal() { return custoTotal; }
    public void setCustoTotal(int custoTotal) { this.custoTotal = custoTotal; }

    public List<Passo> getCaminhoPassoAPasso() { return caminhoPassoAPasso; }
    public void setCaminhoPassoAPasso(List<Passo> caminhoPassoAPasso) { this.caminhoPassoAPasso = caminhoPassoAPasso; }
}

 */