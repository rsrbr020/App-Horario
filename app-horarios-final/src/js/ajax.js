$(document).ready(function () {
    let paginaAtual= "";
    let paginaTroca= "";
    function requisaoPaginas(arquivo, local){
        if(paginaAtual!= paginaTroca){
            console.log("trocou pagina");
            paginaAtual= paginaTroca;
            $("#"+local).html("");
            $.ajax({
                type: "GET",
                url: arquivo,
                success: (data)=>{
                    $("#"+local).html(data);
                },
                error: (data)=>{
                    alert("erro");
                },
                complete: ()=>{
                    // $("#"+local).html("Carregando");
                }
            });
        }else{
            console.log("paginas iguais")
        }
    }
    $(document).on("click", ".requisaoPaginas", (e)=>{
        e.preventDefault();
        if(e.target.getAttribute("href")== null){
            paginaTroca= "indexCopia.html";
            requisaoPaginas("indexCopia.html", "corpoApp");
        }else{
            paginaTroca= e.target.getAttribute("href");
            requisaoPaginas(e.target.getAttribute("href"), "corpoApp");
        }
    });
});