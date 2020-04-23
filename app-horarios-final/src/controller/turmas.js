// var db= openDatabase("banco", "3.0", "banco de dados da aplicacao de horarios", 4);

// db.transaction((criar)=>{
//     criar.executeSql("CREATE TABLE tb_turmas(tur_id INTEGER PRIMARY KEY AUTOINCREMENT, tur_nome TEXT, tur_ano INTEGER)");
// });

// $(document).ready(()=> {
//     $(document).on("click", "#cadTurmas", (e)=>{
//         e.preventDefault();
//         let nome= $("#nomeTur").val();
//         let ano= $("#anoTur").val();
//         console.log(nome);
//         db.transaction((inserir)=>{
//             inserir.executeSql("INSERT INTO tb_turmas(tur_nome, tur_nome) VALUES(?, ?)", nome, ano);
//         });
//         trazerProfessores();
//     });
//     function trazerProfessores(){
//         let tabela= "";
//         db.transaction((select)=>{
//             select.executeSql("SELECT * FROM tb_professores", [], (tx, resultado)=>{
//                 let linhas= resultado.rows;
//                 for(let i= 0; i< linhas.length; i++){
//                     tabela+= "<tr>";
//                         tabela+= "<td>"+linhas[i].pro_id+"</td>";
//                         tabela+= "<td>"+linhas[i].pro_nome+"</td>";
//                         tabela+= "<td><button class='deletar' id='prof-"+linhas[i].pro_id+"'>Deletar</button></td>";
//                     tabela+= "</tr>";
//                 }
//                 $("#professoresCad").html(tabela);
//             });
//         });
//     }
//     $(document).on("click", "#trazer", (e)=>{
//         e.preventDefault();
//         trazerProfessores();
//     });

//     function deletarProf(id){
//         let vet= id.split("-");
//         db.transaction((deletar)=>{
//             deletar.executeSql("DELETE FROM tb_professores WHERE pro_id="+vet[1]);
//         });
//     }

//     $(document).on("click", ".deletar", (e)=>{
//         deletarProf(e.target.getAttribute("id"));
//         trazerProfessores();
//     });
// });

function inserirTurma(nome, ano){
    let obj= {turNome: nome, turAno: ano}
    let store= getObjectStore("stTurmas", "readwrite");
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

// export function listaTurmasMatriz(){
//     let store= getObjectStore("stTurmas", "readonly");
//     let html= "";
//     html+= "<tr>";
//         html+= "<td>Quantidade</td>";
//         html+= "<td>Turma</td>";
//         html+= "<td>Ano</td>";
//     html+= "</tr>";
//     let turmas= [];
//     let qtde= store.count();
//     let aux= 0;
//     qtde.onsuccess= (e)=>{
//         qtde= e.target.result;
//         turmas= criaMatriz(parseInt(qtde), 3, 0);
//         let req = store.openCursor();
//         req.onsuccess = (e)=>{
//             let cursor= e.target.result;
//             if(cursor){
//                 req= store.get(cursor.key);
//                 req.onsuccess= (e)=>{
//                     let value= e.target.result;
//                     turmas[aux][0]= cursor.key;
//                     turmas[aux][1]= value.turNome;
//                     turmas[aux][2]= value.turAno;
//                     cursor.continue();
//                     aux++;
//                 };
//                 req.onerror= (e)=>{
//                     console.log("Erro: "+ e.target.codeError);
//                 };
//             }
//             // return turmas;
//             // return 1;
//             // escreveMatriz(turmas, "testete")
//         };
//         req.onerror= (e)=>{
//             console.log("erro: "+ e.target.codeError);
//         };
//     };
// }

$(document).ready(function () {
    $(document).on("click", "#cadTurma", (e)=>{
        e.preventDefault();
        let nome= $("#nomeTurma").val();
        $("#nomeTurma").val("");
        let ano= $("#selectAno option:selected").val();
        inserirTurma(nome, ano);
    });
});