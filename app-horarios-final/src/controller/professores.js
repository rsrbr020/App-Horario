function inserirProfessor(nome){
    let obj= {proNome: nome}
    let store= getObjectStore("stProfessores", "readwrite");
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

function listaProfessoresSelect(){
    let store= getObjectStore("stProfessores", "readonly");
    let html= "<option value='0'>Escolha o professor</option>";
    let qtde= store.count();
    // console.log(qtde)
    let req = store.openCursor();
    req.onsuccess = (e)=>{
        let cursor= e.target.result;
        if(cursor){
            req= store.get(cursor.key);
            req.onsuccess= (e)=>{
                let value= e.target.result;
                html+= "<option value='"+cursor.key+"'>"+value.proNome+"</option>";
                cursor.continue();
            };
            req.onerror= (e)=>{
                console.log("Erro: "+ e.target.codeError);
            };
        }
        $("#disIdProf").html(html);
    };
    req.onerror= (e)=>{
        console.log("erro: "+ e.target.codeError);
    };
}


$(document).ready(function () {
    $(document).on("click", "#cadProfessor", (e)=>{
        e.preventDefault();
        let nome= $("#proNome").val();
        $("#proNome").val("");
        inserirProfessor(nome);
    });
});