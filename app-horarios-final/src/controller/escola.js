function insereDados(escNome, qtdeAulas){
    let obj= {escNome: escNome, escQtdeAulas: qtdeAulas}
    let store= getObjectStore("stEscola", "readwrite");
    let req;
    try{
        req= store.add(obj);
    }catch(e){
        if (e.name == 'DataCloneError'){
            console.log("erro no if");
            throw e;
        }
        // displayActionFailure("This engine doesn't know how to clone a Blob, " +
                            // "use Firefox");
    }
    req.onsuccess= (e)=>{
        console.log("Inserido com sucesso");
        // displayActionSuccess();
        // displayPubList(store);
    };
    req.onerror= ()=>{
        console.error("Erro: ", this.error);
        // displayActionFailure(this.error);
    };
}

$(document).on("click", "#cadEscola", (e)=>{
    e.preventDefault();
    insereDados($("#escNome").val(), $("#escQtdeAulas").val());
});