function auxInseCarga(idDis){
    // $('#disTabelaTurmas input').each(function(index, element) {
    //     console.log($(element).attr("id") + ' : ' + $(element).val());
    // });
    let idProf= $("#disIdProf option:selected").val();
    let cod= (idDis+"-"+idProf)
    $('#disTabelaTurmas input').each(function(index, element) {
        let idTur= $(element).attr("id").split("-");
        console.log("IdTur-"+ idTur[1] + ' Valor-' + $(element).val()+ " IdDis- "+ idDis);
        inserirCarga($(element).val(), idTur[1], idDis, cod);
    });
}

function inserirCarga(carQtde, carIdTurma, carIdDis, carCod){
    let obj= {carQtde: carQtde, carIdTurma: carIdTurma, carIdDis: carIdDis, carCod: carCod}
    let store= getObjectStore("stCarga", "readwrite");
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
        console.log("Carga inserida com sucesso");
        // displayActionSuccess();
        // displayPubList(store);
    };
    req.onerror= ()=>{
        console.error("Erro: ", this.error);
        // displayActionFailure(this.error);
    };
}

function listaTurmasDisc(){
    let store= getObjectStore("stTurmas", "readonly");
    let html= "";
    html+= "<tr>";
        html+= "<td>Quantidade</td>";
        html+= "<td>Turma</td>";
        html+= "<td>Ano</td>";
    html+= "</tr>";
    let qtde= store.count();
    qtde.onsuccess= (e)=>{
        qtde= e.target.result;
        let req = store.openCursor();
        req.onsuccess = (e)=>{
            let cursor= e.target.result;
            if(cursor){
                req= store.get(cursor.key);
                req.onsuccess= (e)=>{
                    let value= e.target.result;
                    html+= "<tr>";
                        html+= "<td><input id='turId-"+cursor.key+"' class='turmasDis' type='number' min='0' max='100' value='0'></td>";
                        html+= "<td>"+value.turNome+"</td>";
                        html+= "<td>"+value.turAno+"</td>";
                    html+= "</tr>";
                    cursor.continue();
                };
                req.onerror= (e)=>{
                    console.log("Erro: "+ e.target.codeError);
                };
            }
            $("#disTabelaTurmas").html(html);
        };
        req.onerror= (e)=>{
            console.log("erro: "+ e.target.codeError);
        };
    };
}

$(document).on("click", "#testeT", (e)=>{
    e.preventDefault();
    let aux= 0;
    $('#disTabelaTurmas input').each(function(index, element) {
        console.log($(element).attr("id") + ' : ' + $(element).val());
    });
    // $(".turmasDis").find("*").each(()=>{
    //   // console.log(Number($(e).val()))
    //   console.log($(this).attr("class"))
    //   console.log($(this).attr("id"))
    // });
});

function inserirDisciplina(nome, disCor, idProf){
    let obj= {disNome: nome, disCor: disCor, disProfId: idProf}
    let store= getObjectStore("stDisciplinas", "readwrite");
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
        auxInseCarga(e.target.result);
        // displayActionSuccess();
        // displayPubList(store);
    };
    req.onerror= ()=>{
        console.error("Erro: ", this.error);
        // displayActionFailure(this.error);
    };
}

$(document).ready(function () {
    $(document).on("click", "#cadDisciplina", (e)=>{
        e.preventDefault();
        let nome= $("#disNome").val();
        let disCor= $("#disCor").val();
        let idProf= $("#disIdProf option:selected").val();
        inserirDisciplina(nome, disCor, idProf);
    });
});