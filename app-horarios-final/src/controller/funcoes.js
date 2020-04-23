function inserirDadosGenerica(objStore, dados){
    // let obj= {escNome: escNome, escQtdeAulas: qtdeAulas}
    let store= getObjectStore(objStore, "readwrite");
    let req;
    try{
        req= store.add(dados);
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
        mensagemCadastros("#divMensagens", "Cadastrado com sucesso");
        // displayActionSuccess();
        // displayPubList(store);
    };
    req.onerror= ()=>{
        console.error("Erro: ", this.error);
        mensagemCadastros("#divMensagens", "Desculpe, não foi possível cadastrar, tente novamente");
        // displayActionFailure(this.error);
    };
}

function inserirDadosGenerica2(objStore, dados, funcao){
    // let obj= {proNome: nome}
    let store= getObjectStore(objStore, "readwrite");
    let req;
    try{
        req= store.add(dados);
    }catch(e){
        if (e.name == 'DataCloneError'){
            console.log("erro no if");
            throw e;
        }
    }
    req.onsuccess= (e)=>{
        console.log("Inserido com sucesso");
        funcao(e.target.result);
        mensagemCadastros("#divMensagens", "Cadastrado com sucesso");
        // displayActionSuccess();
        // displayPubList(store);
    };
    req.onerror= ()=>{
        console.error("Erro: ", this.error);
        mensagemCadastros("#divMensagens", "Desculpe, não foi possível cadastrar, tente novamente");
        // displayActionFailure(this.error);
    };
}

function auxInsereDias(idProf){
    $('.diaSemana input').each(function(index, elDia) {
        if($(elDia).is(":checked")){
            let valorDia= $(elDia).val();
            $("#div"+ valorDia+" input").each((index, elAula)=>{
                if($(elAula).is(":checked")){
                    let valorAula= $(elAula).val();
                    // console.log("O professor id: "+ idProf+ " nao tera aula "+ valorDia+ " na "+ valorAula+ "ª aula");
                    insereDia(idProf, valorAula);
                }
            });
        }
    });
}

function insereDia(idProf, diaSemanaAula){
    let obj= {diaIdProf: idProf, diaSemanaAula: diaSemanaAula};
    let store= getObjectStore("stDiasSemAula", "readwrite");
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

function auxInseCarga(idDis){
    // $('#disTabelaTurmas input').each(function(index, element) {
    //     console.log($(element).attr("id") + ' : ' + $(element).val());
    // });
    let idProf= $("#disIdProf option:selected").val();
    let cod= (idDis+"-"+idProf)
    $('#disTabelaTurmas input').each(function(index, element) {
        let idTur= $(element).attr("id").split("-");
        // console.log("IdTur-"+ idTur[1] + ' Valor-' + $(element).val()+ " IdDis- "+ idDis);
        inserirCarga($(element).val(), idTur[1], idDis, cod, idProf);
    });
}

function inserirCarga(carQtde, carIdTurma, carIdDis, carCod, idProf){
    let obj= {carQtde: carQtde, carIdTurma: carIdTurma, carIdDis: carIdDis, carCod: carCod, carProfId: idProf};
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
        html+= "<td style = 'background-color: #8DD5BD; color: black; border: 2px none;'><p style = 'font-size: 15pt; text-align: center !important; padding-top:  4px; font-family: 'Oswald', sans-serif; color: black;'>Quantidade</p></td>";
        html+= "<td style = 'background-color: #8DD5BD; color: black; border: 2px none;'><p style = 'font-size: 15pt; text-align: center !important; padding-top:  4px; font-family: 'Oswald', sans-serif; color: black;'>Turma</p></td>";
        html+= "<td style = 'background-color: #8DD5BD; color: black; border: 2px none;'><p style = 'font-size: 15pt; text-align: center !important; padding-top:  4px; font-family: 'Oswald', sans-serif; color: black;'>Ano</p></td>";
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
                        html+= "<td>"+(ano- value.turAno+ 1)+"º</td>";
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

function deletaGenerico(storage, index, id){
  var transaction = db.transaction([storage], 'readwrite');
  var objectStore = transaction.objectStore(storage);

  objectStore.openCursor().onsuccess = function(event) {
    var cursor = event.target.result;
    if(cursor) {
      if(cursor.value[index] == id) {
        var request = cursor.delete();
        request.onsuccess = function() {
          console.log('Deletado com sucesso');
        };
    }else{
        console.log("no else");
    }
    cursor.continue();        
} else {
    console.log("valor nao achado");
    }
  };
}

// function deletaGenerico(storage, index, id){
//     let store= getObjectStore(storage, "readwrite");
//     let req= store.get(id);
//     console.log(req);
//     req.onsuccess = function(evt) {
//         let record = evt.target.result;
//         if (typeof record == 'undefined') {
//             console.log("No matching record found");
//             return;
//         }
//         // Warning: The exact same key used for creation needs to be passed for
//         // the deletion. If the key was a Number for creation, then it needs to
//         // be a Number for deletion.
//         req = store.delete(id);
//         req.onsuccess = function(evt) {
//             // console.log("evt:", evt);
//             // console.log("evt.target:", evt.target);
//             // console.log("evt.target.result:", evt.target.result);
//             console.log("deletado com sucesso");
//         };
//         req.onerror = function (evt) {
//             console.error("deletePublication:", evt.target.errorCode);
//         };
//     };
//     req.onerror= ()=>{
//         console.error("Erro: ", this.error);
//         // displayActionFailure(this.error);
//     };
// }

$(document).ready(()=>{
    // professores
    $(document).on("click", "#cadProfessor", (e)=>{
        e.preventDefault();
        let obj= {
            proNome: $("#proNome").val(),
        };
        $("#proNome").val("");
        // inserirProfessor(nome);
        verificaParaInserir("stProfessores", obj, auxInsereDias);
        // inserirDadosGenerica2("stProfessores", obj, auxInsereDias)
        // auxInsereDias(1);
        trazProfessoresApagar("#tabelaProfessores", "stProfessores");
    });
    // professores fim
    // turmas
    $(document).on("click", "#cadTurma", (e)=>{
        e.preventDefault();
        // let nome= $("#nomeTurma").val();
        // let ano= $("#selectAno option:selected").val();
        // inserirTurma(nome, ano);
        let obj= {
            turNome: $("#nomeTurma").val(), 
            turAno: $("#selectAno option:selected").val()
        };
        $("#nomeTurma").val("");
        verificaParaInserir("stTurmas", obj, null);
        trazTurmasApagar("#tabelaTurmas", "stTurmas");
    });
    // turmas fim
    // escola
    $(document).on("click", "#cadEscola", (e)=>{
        e.preventDefault();
        let obj= {
            escNome: $("#escNome").val(), 
            escQtdeAulas: $("#escQtdeAulas option:selected").val()
        };
        if($("#escNome").val()!= ""&& $("#escQtdeAulas option:selected").val()!= 0){
            if(idEscola!= undefined){
                deletaGenerico("stEscola", "escNome", idEscola);
            }
        }
        verificaParaInserir("stEscola", obj, null);
        trazQtdeAulas();
    });
    // escola fim
    // disciplinas
    $(document).on("click", "#cadDisciplina", (e)=>{
        e.preventDefault();
        let obj= {
            disNome: $("#disNome").val(), 
            disCor: $("#disCor").val(), 
            disProfId: $("#disIdProf option:selected").val()
        };
        $("#disNome").val("");
        verificaParaInserir("stDisciplinas", obj, auxInseCarga);
        // inserirDisciplina(nome, disCor, idProf);
        trazDisciplinaApagar("#tabelaDisciplinas", "stDisciplinas");
    });
    // disciplinas fim
});