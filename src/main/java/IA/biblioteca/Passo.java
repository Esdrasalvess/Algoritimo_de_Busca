package IA.biblioteca;


public class Passo {
    private String de;
    private String para;
    private int custo;
    private int[] coordDe;
    private int[] coordPara;

    public Passo(String de, String para, int custo, int[] coordDe, int[] coordPara) {
        this.de = de;
        this.para = para;
        this.custo = custo;
        this.coordDe = coordDe;
        this.coordPara = coordPara;
    }

    public String getDe() { return de; }
    public String getPara() { return para; }
    public int getCusto() { return custo; }
    public int[] getCoordDe() { return coordDe; }
    public int[] getCoordPara() { return coordPara; }
}

/*
public class Passo {
    private String de;
    private String para;
    private int custo;

    public Passo(String de, String para, int custo) {
        this.de = de;
        this.para = para;
        this.custo = custo;
    }

    public String getDe() { return de; }
    public void setDe(String de) { this.de = de; }

    public String getPara() { return para; }
    public void setPara(String para) { this.para = para; }

    public int getCusto() { return custo; }
    public void setCusto(int custo) { this.custo = custo; }
}


 */