package ia.iaapi.biblioteca;

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