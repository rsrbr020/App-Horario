var $= require("jquery");
var fs = require("fs");
var conversion = require("phantom-html-to-pdf")();
// var saveAs = require('file-saver');

var escola;

var idEscola;

var tema;

var ano= (new Date()).getFullYear();

var calendarioCriado= [];

var turmas= [];

var disciplinas= [];

var professores= [];

var carga= [];

var diaHorarioSemAula= [];

var qtdeTurmas= 0;

var qtdeAulas= 0;

var vetorTroca= [0, 0, 0];

var varTroca= null;

var auxTroca= 1;

var cursorX= 0;

var cursorY= 0;

/*
    ajeitar a parte dos professores que nao podem ter aula no dia
*/

function distribuiAulas(noCal, noCar){
    // nLCal = len(noCal)
    // nCCal = len(noCal[0])
    // nLCarT = len(noCar)
    let aux= 0;
    let aux2= false;
    let codigoTurma= 0;
    for(let lCal= 1; lCal< noCal.length; lCal++){
        for(let cCal= 1; cCal< noCal[0].length; cCal++){
            if(noCal[lCal][cCal]== "0000"){
                // anterior
                if(noCal[lCal- 1][0]== "2222"|| noCal[lCal- 1][1]== "3333"|| noCal[lCal- 1][0]== "Segunda"){
                    // console.log("1 if "+ noCal[lCal]);
                    codigoTurma = noCal[0][cCal];
                    aux= 0;
                    for(let lCarT= 0; lCarT< noCar.length; lCarT++){
                        // verifica se tem disciplinas com mais de 1 aula
                        if((noCar[lCarT][1]== codigoTurma)&& (noCar[lCarT][0]> 1)){
                            // console.log(noCar[lCarT][2]+ " "+ noCal[lCal][0]);
                            aux++;
                            // aux++;
                        }
                    }
                    // aux+= verificaDias(diaHorarioSemAula, )
                    if(aux> 0){
                        for(let lCarT= 0; lCarT< noCar.length; lCarT++){
                            if((noCar[lCarT][1]== codigoTurma)&& (noCar[lCarT][0]> 1)){
                                if(verificaDias(diaHorarioSemAula, noCar[lCarT][2].split("-")[1], noCal[lCal][0])== 0){
                                    noCal[lCal][cCal]= noCar[lCarT][2];
                                    noCar[lCarT][0]-= 1;
                                    // print("Codigo: ", noCar2[lCarT][3], " - L:", lCal, " - C:", cCal)
                                    break;
                                }
                            }
                        }
                    }else{
                        for(let lCarT= 0; lCarT< noCar.length; lCarT++){
                            if((noCar[lCarT][1]== codigoTurma)&& (noCar[lCarT][0]> 0)){
                                if(verificaDias(diaHorarioSemAula, noCar[lCarT][2].split("-")[1], noCal[lCal][0])== 0){
                                    noCal[lCal][cCal]= noCar[lCarT][2];
                                    noCar[lCarT][0]-= 1;
                                    // print("Codigo: ", noCar2[lCarT][3], " - L:", lCal, " - C:", cCal)
                                    break;
                                }
                            }
                        }
                    }
                // proximo
                }else if(noCal[lCal+ 1][0]== "2222"|| noCal[lCal+ 1][1]== "3333"){
                    // console.log("2 if "+ noCal[lCal]);
                    codigoTurma = noCal[0][cCal];
                    aux= false;
                    aux2= false;
                    for(let lCarT= 0; lCarT< noCar.length; lCarT++){
                        // se tem aula faltando so uma
                        if((noCar[lCarT][1]== codigoTurma)&& (noCar[lCarT][0]== 1)){
                            aux= true;
                        }
                        // verifica se tem igual
                        if(noCar[lCarT][1]== codigoTurma&& noCar[lCarT][0]> 0&& noCar[lCarT][2]== noCal[lCal- 1][cCal]){
                            aux2= true;
                        }
                    }
                    if(aux2== true){
                        for(let lCarT= 0; lCarT< noCar.length; lCarT++){
                            if(noCar[lCarT][1]== codigoTurma&& noCar[lCarT][0]> 0&& noCar[lCarT][2]== noCal[lCal- 1][cCal]){
                                noCal[lCal][cCal]= noCar[lCarT][2];
                                noCar[lCarT][0]-= 1;
                                // print("Codigo: ", noCar[lCarT][3], " - L:", lCal, " - C:", cCal)
                                break;
                            }
                        }
                    }else if(aux== true&& aux2!= true){
                        for(let lCarT= 0; lCarT< noCar.length; lCarT++){
                            if((noCar[lCarT][1]== codigoTurma)&& (noCar[lCarT][0]== 1)){
                                noCal[lCal][cCal]= noCar[lCarT][2];
                                noCar[lCarT][0]-= 1;
                                // print("Codigo: ", noCar2[lCarT][3], " - L:", lCal, " - C:", cCal)
                                break;
                            }
                        }
                    }else{
                        for(let lCarT= 0; lCarT< noCar.length; lCarT++){
                            if((noCar[lCarT][1]== codigoTurma)&& (noCar[lCarT][0]> 0)){
                                noCal[lCal][cCal]= noCar[lCarT][2];
                                noCar[lCarT][0]-= 1;
                                // print("Codigo: ", noCar2[lCarT][3], " - L:", lCal, " - C:", cCal)
                                break;
                            }
                        }
                    }
                // no meio
                }else{
                    codigoTurma = noCal[0][cCal];
                    aux= false;
                    // console.log("Else "+noCal[lCal]);
                    for(let lCarT= 0; lCarT< noCar.length; lCarT++){
                        if(noCar[lCarT][1]== codigoTurma&& noCar[lCarT][0]> 0&& noCar[lCarT][2]== noCal[lCal- 1][cCal]){
                            aux= true;
                        }
                    }
                    if(aux== true){
                        for(let lCarT= 0; lCarT< noCar.length; lCarT++){
                            if(noCar[lCarT][1]== codigoTurma&& noCar[lCarT][0]> 0&& noCar[lCarT][2]== noCal[lCal- 1][cCal]){
                                noCal[lCal][cCal]= noCar[lCarT][2];
                                noCar[lCarT][0]-= 1;
                                // print("Codigo: ", noCar[lCarT][3], " - L:", lCal, " - C:", cCal)
                                break;
                            }
                        }
                    }else{
                        for(let lCarT= 0; lCarT< noCar.length; lCarT++){
                            if(noCar[lCarT][1]== codigoTurma&& noCar[lCarT][0]> 0){
                                noCal[lCal][cCal]= noCar[lCarT][2];
                                noCar[lCarT][0]-= 1;
                                // print("Codigo: ", noCar[lCarT][3], " - L:", lCal, " - C:", cCal)
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
}

function verificaDias(noDia, idProf, diaAula){
    let lDia= noDia.length;
    let valor= 0;
    for(let l= 0; l< lDia; l++){
        if(idProf== noDia[l][0] && diaAula== noDia[l][1]){
            // console.log("idProf-"+ idProf+ " == IdMatriz-"+ noDia[l][0]+ " && "+ "DiaAula-"+diaAula +" == DiaMatriz-"+ noDia[l][1])
            valor++;
        }
    }
    return valor;
}

let vet= [],
    vet2= [],
    troca= [0, 0, 0],
    troca2= [0, 0, 0],
    nLCal,
    nCCal,
    aux1 = [0, 0, 0],
    aux2 = [0, 0, 0],
    conflito = false,
    conflito2 = false,
    aux = true,
    auxNum = 0,
    auxNum2 = 0,
    disciplina = 0;

function tiraConflitos(noCal){
    nLCal= noCal.length;
    nCCal= noCal[0].length;
    for (let cCal = 1; cCal < nCCal; cCal++) {
        for (let lCal = 1; lCal < nLCal; lCal++) {
            vet = noCal[lCal];
            aux = true;
            conflito = false;
            conflito2 = false;
            auxNum = 0;
            auxNum2 = 0;
            if(noCal[lCal][cCal].indexOf("-")>= 0){
                disciplina = noCal[lCal][cCal];
                for (let c = 1; c < vet.length; c++) {
                    if(disciplina.split("-")[1]== vet[c].split("-")[1]){
                        auxNum+= 1;
                    }
                }
                // auxNum+= verificaDias(diaHorarioSemAula, disciplina.split("-")[1], noCal[lCal][0]);
                if(auxNum> 1){
                    conflito= true;
                }else{
                    conflito= false;
                }
                if(conflito== true){
                    troca[0]= noCal[lCal][cCal];
                    troca[1]= lCal;
                    troca[2]= cCal;
                    for (let tLCal= 1; tLCal< nLCal; tLCal++) {
                        vet2= noCal[tLCal];
                        auxNum2= 0;
                        if(noCal[tLCal][cCal].indexOf("-")>= 0){
                            for (let tC= 1; tC< vet2.length; tC++) {
                                if(vet2[tC].split("-")[1]== troca[0].split("-")[1]){
                                    auxNum2+= 1;
                                }
                            }
                            // auxNum2+= verificaDias(diaHorarioSemAula, disciplina.split("-")[1], noCal[tLCal][0]);
                            if(auxNum2 == 0){
                                conflito2 = false;
                            }else{
                                conflito2 = true;
                            }
                            if((conflito2 == false) && (aux == true)){
                                troca2[0] = noCal[tLCal][cCal];
                                noCal[tLCal][cCal] = troca[0];
                                noCal[troca[1]][troca[2]] = troca2[0];
                                aux = false;
                            }
                        }
                    }
                }
            }
        }   
    }
}

function tiraConflitos2(noCal){
    let numLinCal= noCal.length,
        numColCal= noCal[0].length,
        linha,
        linhaTroca,
        auxConflito2,
        conflito,
        conflito2,
        contadorConflito,
        contadorConflito2,
        disciplina,
        numLinLinha,
        troca1= [0, 0, 0],
        troca1Par= [0, 0, 0],
        troca2,
        troca2Par;

    for(let cCal= 1; cCal< numColCal; cCal++){
        for(let lCal= 1; lCal< numLinCal; lCal++){
            // verificar se a posicao corresponde a uma aula
            if(noCal[lCal][cCal].indexOf("-")>= 0){
                // console.log("Aula");
                linha= noCal[lCal];
                auxConflito2= true;
                conflito= false;
                conflito2= false;
                contadorConflito= 0;
                contadorConflito2= 0;
                // troca1= [null, null, null];
                // troca1Par= [null, null, null];
                disciplina= noCal[lCal][cCal];
                //  verificar se a conflitos na linha
                for(let l= 1; l< linha.length; l++){
                    if(disciplina.split("-")[1]== linha[l].split("-")[1]){
                        contadorConflito++;
                    }
                }
                // console.log(contadorConflito)
                // se existir conflito
                if(contadorConflito> 1){
                    // console.log("Conflito linha-"+ lCal+ " coluna-"+ cCal);
                    troca1[0]= noCal[lCal][cCal];
                    troca1[1]= lCal;
                    troca1[2]= cCal;
                    // se for duas aulas iguais juntas
                    if(noCal[lCal][cCal]== noCal[lCal+ 1][cCal]&& (noCal[lCal- 1][0]== "Segunda"|| noCal[lCal- 1][cCal]== "2222"|| noCal[lCal- 1][cCal]== "3333")){
                        // se for preciso colocar um for aqui pra verificar se ainda tem aulas juntas na coluna
                        // console.log("duas aulas juntas 1(linha- "+ lCal+ " col-"+ cCal+ ") 2(lin-"+ (lCal+ 1)+ " col-"+ cCal);
                        troca1Par[0]= noCal[lCal+ 1][cCal];
                        troca1Par[1]= lCal+ 1;
                        troca1Par[2]= cCal;
                        let auxDuasJuntas= 0;
                        let duasJuntas= false;
                        let linhaVerificaDupla;
                        contadorConflito2= 0;
                        // for para verificar se ainda tem aulas juntas
                        for(let l= 1; l< numLinCal; l++){
                            if(noCal[l][cCal].indexOf("-")>= 0){
                                if(noCal[l][cCal]== noCal[l+ 1][cCal]&& (noCal[lCal- 1][0]== "Segunda"|| noCal[lCal- 1][cCal]== "2222"|| noCal[lCal- 1][cCal]== "3333")){
                                    linhaVerificaDupla= noCal[l];
                                    auxDuasJuntas= 0;
                                    for(let l2= 1; l2< linhaVerificaDupla.length; l2++){
                                        if(troca1[0].split("-")[1]== linhaVerificaDupla[l2].split("-")[1]){
                                            auxDuasJuntas++;
                                        }
                                    }
                                    // console.log(auxDuasJuntas+ " auxDuasJuntas");
                                    if(auxDuasJuntas== 0){
                                        // console.log("duas aulas juntas que nao dao conflito 1(linha- "+ l+ " col-"+ cCal+ ") 2(lin-"+ (l+ 1)+ " col-"+ cCal);
                                        duasJuntas= true;
                                        break;
                                    }
                                }
                            }
                        }
                        if(duasJuntas== true){ // se tiver duas juntas
                            // for para trocar as duas aulas
                            // console.log("Entrou para trocar aula dupla");
                            for(let l= 1; l< numLinCal; l++){
                                if(noCal[l][cCal].indexOf("-")>= 0){
                                    if(noCal[l][cCal]== noCal[l+ 1][cCal]&& (noCal[lCal- 1][0]== "Segunda"|| noCal[lCal- 1][cCal]== "2222"|| noCal[lCal- 1][cCal]== "3333")){
                                        linhaTroca= noCal[l];
                                        contadorConflito2= 0;
                                        for(let l2= 1; l2< linhaTroca.length; l2++){
                                            if(troca1[0].split("-")[1]== linhaTroca[l2].split("-")[1]){
                                                contadorConflito2++;
                                            }
                                        }
                                        // console.log(contadorConflito2+ " contadorConflito2");
                                        if(contadorConflito2== 0&& auxConflito2== true){
                                            // console.log("Trocando as aulas");

                                            troca2= noCal[l][cCal];
                                            // console.log("troca2 = "+ noCal[l][cCal]);

                                            noCal[l][cCal]= troca1[0];
                                            // console.log("Calendario l-"+ l+ " c-"+ cCal+ " recebe "+ troca1[0]);

                                            noCal[troca1[1]][troca1[2]]= troca2;
                                            // console.log("Calendario l-"+ troca1[1]+ " c-"+ troca1[2]+ " recebe "+ troca2);

                                            troca2Par= noCal[l+ 1][cCal];
                                            // console.log("troca2Par = "+ noCal[l+ 1][cCal]);

                                            noCal[l+ 1][cCal]= troca1Par[0];
                                            // console.log("Calendario l-"+ (l+ 1)+ " c-"+ cCal+ " recebe "+ troca1Par[0]);

                                            noCal[troca1Par[1]][troca1Par[2]]= troca2Par;
                                            // console.log("Calendario l-"+ troca1Par[1]+ " c-"+ troca1Par[2]+ " recebe "+ troca2Par);
                                            auxConflito2= false;
                                            break;
                                        }
                                    }
                                }
                            }
                        }else{ // se nao tiver
                            // for para trocar uma
                            for(let l= 1; l< numLinCal; l++){
                                if(noCal[l][cCal].indexOf("-")>= 0){
                                    linhaTroca= noCal[l];
                                    contadorConflito2= 0;
                                    for(let l2= 1; l2< linhaTroca.length; l2++){
                                        if(troca1[0].split("-")[1]== linhaTroca[l2].split("-")[1]){
                                            contadorConflito2++;
                                        }
                                    }
                                    // console.log(contadorConflito2+ " contadorConflito2");
                                    if(contadorConflito2== 0&& auxConflito2== true){
                                        // console.log("Trocando as aulas");

                                        troca2= noCal[l][cCal];
                                        // console.log("troca2 = "+ noCal[l][cCal]);

                                        noCal[l][cCal]= troca1[0];
                                        // console.log("Calendario l-"+ l+ " c-"+ cCal+ " recebe "+ troca1[0]);

                                        noCal[troca1[1]][troca1[2]]= troca2;
                                        // console.log("Calendario l-"+ troca1[1]+ " c-"+ troca1[2]+ " recebe "+ troca2);

                                        // troca2Par= noCal[l+ 1][cCal];
                                        // console.log("troca2Par = "+ noCal[l+ 1][cCal]);

                                        // noCal[l+ 1][cCal]= troca1Par[0];
                                        // console.log("Calendario l-"+ (l+ 1)+ " c-"+ cCal+ " recebe "+ troca1Par[0]);

                                        // noCal[troca1Par[1]][troca1Par[2]]= troca2Par;
                                        // console.log("Calendario l-"+ troca1Par[1]+ " c-"+ troca1Par[2]+ " recebe "+ troca2Par);
                                        auxConflito2= false;
                                        break;
                                    }
                                }
                            }
                        }

                    }else{ // caso nao sejam iguais
                        // for para trocar uma
                        for(let l= 1; l< numLinCal; l++){
                            if(noCal[l][cCal].indexOf("-")>= 0){
                                linhaTroca= noCal[l];
                                contadorConflito2= 0;
                                for(let l2= 1; l2< linhaTroca.length; l2++){
                                    if(troca1[0].split("-")[1]== linhaTroca[l2].split("-")[1]){
                                        contadorConflito2++;
                                    }
                                }
                                // console.log(contadorConflito2+ " contadorConflito2");
                                if(contadorConflito2== 0&& auxConflito2== true){
                                    // console.log("Trocando as aulas");

                                    troca2= noCal[l][cCal];
                                    // console.log("troca2 = "+ noCal[l][cCal]);

                                    noCal[l][cCal]= troca1[0];
                                    // console.log("Calendario l-"+ l+ " c-"+ cCal+ " recebe "+ troca1[0]);

                                    noCal[troca1[1]][troca1[2]]= troca2;
                                    // console.log("Calendario l-"+ troca1[1]+ " c-"+ troca1[2]+ " recebe "+ troca2);

                                    // troca2Par= noCal[l+ 1][cCal];
                                    // console.log("troca2Par = "+ noCal[l+ 1][cCal]);

                                    // noCal[l+ 1][cCal]= troca1Par[0];
                                    // console.log("Calendario l-"+ (l+ 1)+ " c-"+ cCal+ " recebe "+ troca1Par[0]);

                                    // noCal[troca1Par[1]][troca1Par[2]]= troca2Par;
                                    // console.log("Calendario l-"+ troca1Par[1]+ " c-"+ troca1Par[2]+ " recebe "+ troca2Par);
                                    auxConflito2= false;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

function verificaConflitos(noCal){
    let vet = [];
    let disciplina = 0;
    let conflito = false;
    let aux = 0;
    let aux2 = true;
    let nLCal = noCal.length;
    let nCCal = noCal[0].length;
    let limitador = 1;
    while(aux2 == true && limitador < 100){
        conflito = false;
        aux = 0;
        for (let lCal = 1; lCal < nLCal; lCal++) {
            vet = noCal[lCal];
            for (let cCal = 1; cCal < nCCal; cCal++) {
                if(noCal[lCal][cCal].indexOf("-")>= 0){
                    disciplina = noCal[lCal][cCal];
                    aux = 0;
                    for (let c = 1; c < vet.length; c++) {
                        if(disciplina.split("-")[1] == vet[c].split("-")[1]){
                            aux+= 1;
                        }
                    }
                    // aux+= verificaDias(diaHorarioSemAula, disciplina.split("-")[1], noCal[lCal][0]);
                    if(aux> 1){
                        conflito = true;
                    }
                }
            }
        }
        if(conflito != true){
            aux2 = false;
        }
        else{
            tiraConflitos2(noCal);
        }
        limitador += 1;
    }
    console.log(limitador);
}

function ordenaMatriz(vet, coluna){
    vet.sort(function(a, b) {
        if(a[coluna]< b[coluna]){
            return 1;
        }else if(a[coluna]> b[coluna]){
            return -1;
        }else{
            return 0;
        }
    });
    return vet;
}

function juntaAulas(noCal, noCar){
    let TLCal= noCal.length;
    let TCCal= noCal[0].length;
    let TLCar= noCar.length;
    let vetorRanking= [];
    let linha= [];
    let linha2= [];
    let valor= 0;
    for(let lCal= 1; lCal< 2; lCal++){
        if(noCal[lCal][1].indexOf("-")>= 0){
            vetorRanking= [];
            linha= noCal[lCal];
            console.log(linha)
            for(let lCal2= (lCal+ 1); lCal2< TLCal; lCal2++){
                if(noCal[l])
                if(noCal[lCal2][1].indexOf("-")>= 0){
                    valor= 0;
                    linha2= [];
                    for(let cCal2= 1; cCal2< TCCal; cCal2++){
                        if(linha[cCal2]== noCal[lCal2][cCal2]){
                            // console.log("Linha - "+ lCal2);
                            // console.log(linha[cCal2]+ " == "+ noCal[lCal2][cCal2]);
                            // console.log("Linha - "+ lCal2+ " fim");
                            valor++;
                        }
                        for(let lCar= 0; lCar< TLCar; lCar++){
                            if(noCar[lCar][2]== noCal[lCal2][cCal2] && noCar[lCar][0]== 1){
                                valor++;
                            }
                        }
                    }
                    linha2.push(valor);
                    linha2.push(lCal2);
                    vetorRanking.push(linha2);
                }
            }
        }
    }
    ordenaMatriz(vetorRanking, 0);
    console.log(vetorRanking);
    // ordenaVetor(vetorRanking);
}

function substituiCodigos(noCal, nRel, nTurmas){
    let nLCal = noCal.length;
    let nCCal = noCal[0].length;
    let nLRel = nRel.length;
    let nLTur = nTurmas.length;
    for (let lCal = 1; lCal < nLCal; lCal++) {
        for (let cCal = 1; cCal < nCCal; cCal++) {
            for (let lRel = 0; lRel < nLRel; lRel++) {
                if(noCal[lCal][cCal] == nRel[lRel][0]){
                    noCal[lCal][cCal] = nRel[lRel][1];
                }
            }
            
        }
    }
    for (let lCal = 0; lCal < 1; lCal++) {
        for (let cCal = 1; cCal < nCCal; cCal++) {
            for (let lTur = 0; lTur < nLTur; lTur++) {
                if(noCal[lCal][cCal] == nTurmas[lTur][2]){
                    noCal[lCal][cCal] = nTurmas[lTur][0];
                }
            }
        }
    }
    for (let lCal = 0; lCal < 1; lCal++) {
        for (let cCal = 1; cCal < nCCal; cCal++) {
            if(noCal[lCal][cCal] == "1111"){
                noCal[lCal][cCal] = "Sem aula";
            }
        }
    }
}

function escreveMatriz(noCal, elemento){
    let nL = noCal.length;
    let nC = noCal[0].length;
    let tabela = "<table>";
    for (let l = 0; l < nL; l++) {
        tabela+= "<tr>";
        for (let c = 0; c < nC; c++) {
            tabela+= "<td>"+noCal[l][c]+"</td>";
        }
        tabela+="</tr>";
    }
    tabela+= "</table>";
    $("#"+elemento).html(tabela);
}

function escreveCalendario(noCal, noTurmas, qtdeAulas, elemento){
    let nL= noCal.length;
    let nC= noCal[0].length;
    let nLT= noTurmas.length;
    let tabela= "<table>";
    for (let l= 0; l <nL; l++) {
        tabela+= "<tr>";
        for (let c= 0; c< nC; c++) {
            if(l== 0){
                if(c== 0){
                    tabela+= "<td>"+noCal[l][c]+"</td>";
                }else{
                    for(let lT= 0; lT< nLT; lT++){
                        if(noCal[l][c]== noTurmas[lT][0]){
                            tabela+= "<td>"+((ano- noTurmas[lT][2])+1)+"º "+noTurmas[lT][1]+"</td>";
                        }
                    }
                }
            }else if(noCal[l][c]== "0000"){
                // tabela+= "<td id='td' value='Aula'><input type='button' value='Aula' class='celulas' id='celula-"+l+"-"+c+"'></td>";
                tabela+= "<td id='celula-"+l+"-"+c+"' value='Aula' class='celulas'>Aula</td>";
            }else if(noCal[l][c]== "1111"){
                tabela+= "<td id='celula-"+l+"-"+c+"' value='Sem-Aula' class='celulas'>Sem-Aula</td>";
            }else if(noCal[l][c]== "4444"){
                // tabela+= "<td id='celula-"+l+"-"+c+"' value='Aula editar' class='celulas'>asdsdf</td>";
                tabela+= "<td><input type='text' id='celula-"+l+"-"+c+"' class='celulas inputAulaFixa' placeholder='Ex: Momento Cívico'></td>";
            }else if(noCal[l][c]== "2222"){
                tabela+= "<td><strong>Intervalo</strong></td>";
            }else if(noCal[l][c]== "3333"){
                tabela+= "<td><strong>Novo dia</strong></td>";
            }else{
                if(noCal[l][c].indexOf("-")>= 0){
                    tabela+= "<td id='td'>"+noCal[l][c].split("-")[1]+"ª aula</td>";
                }else{
                    tabela+= "<td id='td'>"+noCal[l][c]+"</td>";
                }
            }
        }
        if(noCal[l][0].split("-")[1]>= qtdeAulas && noCal[l+ 1][1] == "3333"){
            tabela+= "<td><input type='button' value='Adicionar' class='adicionaLinhas' id='linha-"+l+"'>";
            tabela+= "<td><input type='button' value='Remover' class='removeLinhas' id='rlinha-"+l+"'>";
        }else if(noCal[l][0].split("-")[1]<= qtdeAulas && noCal[l+ 1][1] == "3333"){
            tabela+= "<td><input type='button' value='Adicionar' class='adicionaLinhas' id='linha-"+l+"'>";
            tabela+= "<td><input type='button' value='Remover' class='removeLinhas' id='rlinha-"+l+"'>";
        }
        tabela+="</tr>";
    }
    tabela+= "</table>";
    $("#"+elemento).html(tabela);
}

function escreveCalendarioFinal(noCal, noTurmas, noDis, noProfessores, elemento){
    let nL= noCal.length;
    let nC= noCal[0].length;
    let nLT= noTurmas.length;
    let nLD= noDis.length;
    let nLP= noProfessores.length;
    let tabela= `<meta charset="UTF-8">`;
    let vet= criaMatriz(nLT, 1, 0);
    tabela+= `<table cellspacing="0" style="border: 1px solid #909090">`;
    for(let l= 0; l <nL; l++) {
        tabela+= `<tr>`;
        for (let c= 0; c< nC; c++) {
            if(l== 0){
                if(c== 0){
                    tabela+= `<td style="padding: 5px !important; border: 1px solid #909090; padding: 1px; text-align: center; background-color: #f0f0f0"><div>`+noCal[l][c]+`</div></td>`;
                }else{
                    for(let lT= 0; lT< nLT; lT++){
                        if(noCal[l][c]== noTurmas[lT][0]){
                            tabela+= `<td style="padding: 5px !important; border: 1px solid #909090; padding: 1px; text-align: center; background-color: #f0f0f0">`+((ano- noTurmas[lT][2])+1)+`º `+noTurmas[lT][1]+`</td>`;
                            vet[c- 1][0]= ((ano- noTurmas[lT][2])+1)+`º `+noTurmas[lT][1];
                        }
                    }
                }
            }else if(noCal[l][c]== `1111`){
                tabela+= `<td style="padding: 5px !important; border: 1px solid #909090; padding: 1px; text-align: center"><strong> ------- </strong></td>`;
            }else if(noCal[l][c]== `2222`){
                tabela+= `<td style="padding: 5px !important; border: 1px solid #909090; padding: 1px; text-align: center; background-color: #f0f0f0">Intervalo</td>`;
            }else if(noCal[l][c]== `3333`){
                // tabela+= `<td style="border: 1px solid #909090; padding: 1px; text-align: center"><strong>Novo dia</strong></td>`;
                tabela+= `<td style="padding: 5px !important; border: 1px solid #909090; padding: 1px; text-align: center; background-color: #f0f0f0">`+vet[c- 1][0]+`</td>`;
            }else if((noCal[l][c].indexOf("-")>= 0|| noCal[l][c]== "0000") && c> 0){
                let cor;
                let aula= ``;
                for(let lD= 0; lD< nLD; lD++){
                    if(noCal[l][c].split(`-`)[0]== noDis[lD][0]){
                        cor= noDis[lD][2];
                        aula+= noDis[lD][1]+`-`;
                    }
                }
                for(let lP= 0; lP< nLP; lP++){
                    if(noCal[l][c].split(`-`)[1]== noProfessores[lP][0]){
                        aula+= noProfessores[lP][1]
                    }
                }
                tabela+= `<td style="padding: 5px !important; background: `+cor+`; border: 1px solid #909090; padding: 1px; text-align: center">
                    <button id="aula-`+l+`-`+c+`" class="trocaAulas" style="background: none; border:none; padding: 0; width: 100%; height: 100%">`+aula+`</button>
                </td>`;
            }else{
                if(noCal[l][c].indexOf("-")>= 0){
                    tabela+= `<td style="padding: 5px !important; border: 1px solid #909090; padding: 1px; text-align: center; background-color: #f0f0f0">`+noCal[l][c].split("-")[1]+`ª aula</td>`;
                }else{
                    tabela+= `<td style="padding: 5px !important; border: 1px solid #909090; padding: 1px; text-align: center; background-color: #f0f0f0">`+noCal[l][c]+`</td>`;
                }
            }
        }
        tabela+=`</tr>`;
    }
    tabela+= `</table>`;
    $("#"+elemento).html(tabela);
    $("#divCadastroTurmas").html("");
}

function criaMatriz(nLinhas, nColunas, valor){
    let matriz= [];
    for(let l= 0; l< nLinhas; l++){
        let linha= [];
        for(let c= 0; c< nColunas; c++){
            linha.push(valor);
        }
        matriz.push(linha);
    }
    return matriz;
}

function calculaLinhas(qtdeAulas){
    if(qtdeAulas== 5){
        return (qtdeAulas+ 2)* 5;
    }else{
        return (qtdeAulas+ 4)* 5;
    }
}

function trocaAula(button, varTroca, vetorTroca, noCal){
    // recebe a aula, a linha e a coluna da celula clicada
    let vet= button.getAttribute("id").split("-"),
        linha= [],
        linha2= [],
        auxTrocaDia= 0;
    if(vetorTroca[0]== 0){ // pegar a disciplina para troca
        // seta a aula na div de mensagem
        celulaTrocaAulas("#divMensagens", $(button).html());
        // coloca a aula na posicao 0 do vetor
        vetorTroca[0]= noCal[vet[1]][vet[2]];
        // linha da aula
        vetorTroca[1]= vet[1];
        // coluna da aula
        vetorTroca[2]= vet[2];
    }else{ // caso ja tenha disciplina para troca
        // verifica se estao na mesma coluna
        if(vetorTroca[2]== vet[2]){
            let aux= 0;
            // linha recebe a linha do calendario da aula anterior para troca
            linha= noCal[vetorTroca[1]];
            // linha2 recebe a linha atual que foi clicada
            linha2= noCal[vet[1]];
            // for para veficar se a aula atual vai dar conflito com a linha da aula que vai ser trocada
            // verifica se o horario da aula é valido para o professor
            auxTrocaDia+= verificaDias(diaHorarioSemAula, noCal[vet[1]][vet[2]].split("-")[1], noCal[vetorTroca[1]][0]);
            // console.log(noCal[vetorTroca[1]][0]+ " nao pode "+ noCal[vet[1]][vet[2]]+"Primeiro")
            for(let l= 0; l< qtdeTurmas; l++){
                if(linha[l+ 1].split("-")[1]== noCal[vet[1]][vet[2]].split("-")[1] && noCal[vet[1]][vet[2]]!= "0000"){
                    aux++;
                }
            }
            // for para veficar se a aula que vai ser trocada vai dar conflito com a linha da aula atual
            // se o horario da aula é valido
            auxTrocaDia+= verificaDias(diaHorarioSemAula, vetorTroca[0].split("-")[1], noCal[vet[1]][0]);
            // console.log(noCal[vet[1]][0]+ " nao pode "+vetorTroca[0] +" Segundo");
            for(let l= 0; l< qtdeTurmas; l++){
                if(linha2[l+ 1].split("-")[1]== vetorTroca[0].split("-")[1] && noCal[vetorTroca[1]][vetorTroca[2]]!= "0000"){
                    aux++;
                }
            }
            console.log(auxTrocaDia);
            // se der conflito
            if(aux> 0){
                // vetor troca é zerado
                vetorTroca[0]= 0;
                vetorTroca[1]= 0;
                vetorTroca[2]= 0;
                varTroca= 0;
                auxTroca= 1;
                // é exibida a mensagem de erro
                celulaTrocaAulas("#divMensagens", "");
                mensagemAlerta("Essa troca causará conflito, tente outra", 2500, "cuidado", cursorX, cursorY);
            }else if(auxTrocaDia> 0){ // caso o horario nao seja valido
                // vetor troca é zerado
                vetorTroca[0]= 0;
                vetorTroca[1]= 0;
                vetorTroca[2]= 0;
                varTroca= 0;
                auxTroca= 1;
                // é exibida a mensagem de erro
                celulaTrocaAulas("#divMensagens", "");
                mensagemAlerta("O horário de aula não é valido para o professor, tente outra", 2500, "cuidado", cursorX, cursorY);
            }else{ // se nao der conflito é realizada a troca
                varTroca= noCal[vet[1]][vet[2]];
                noCal[vet[1]][vet[2]]= vetorTroca[0];
                noCal[vetorTroca[1]][vetorTroca[2]]= varTroca;
                vetorTroca[0]= 0;
                vetorTroca[1]= 0;
                vetorTroca[2]= 0;
                varTroca= 0;
                celulaTrocaAulas("#divMensagens", "");
                // reescreve o calendario
                escreveCalendarioFinal(calendarioCriado, turmas, disciplinas, professores, "calendario");
            }
        }else{ // se nao for na mesma coluna
            // mesagem de erro
            celulaTrocaAulas("#divMensagens", "");
            mensagemAlerta("Troca invalida", 2500, "cuidado", cursorX, cursorY);
            vetorTroca[0]= 0;
            vetorTroca[1]= 0;
            vetorTroca[2]= 0;
            varTroca= 0;
        }
    }
}

function criaCalendario(qtdeAulas, qtdeTurmas, matrizTurmas){
    let valor= "0000";
    let valor2= "3333"; // novo dia
    let valor3= "2222"; // intervalo
    let dias= ["Segunda", "Terca", "Quarta", "Quinta", "Sexta", "Fim"];
    let numL= calculaLinhas(qtdeAulas)+ 1;
    let numC= qtdeTurmas+ 1;
    let matriz= [];
    let aula= 1;
    if(qtdeAulas == 5){
        let dia= 0;
        for(let l= 0; l< numL; l++){
            let linha= [];
            if(l== 0){
                for(let c= 0; c< numC; c++){
                    if(c== 0){
                        linha.push(dias[0]);
                    }else{
                        linha.push(matrizTurmas[c- 1][0]);
                    }
                }
            }else{
                if((l% 7)== 0){
                    dia= parseInt(l/ 7);
                    for(let c= 0; c< numC; c++){
                        if(c== 0){
                            linha.push(dias[dia]);
                        }else{
                            linha.push(valor2);
                        }
                    }
                }else{
                    if(l== 3 || l== 10 || l== 17 || l== 24 || l== 31){
                        for(let c= 0; c< numC; c++){
                            linha.push(valor3);
                        }
                    }else{
                        if(aula== 6){
                            aula= 1;
                        }
                        for(let c= 0; c< numC; c++){
                            if(c == 0){
                                linha.push(dias[dia]+ "-"+ aula.toString())   
                            }
                            else{
                                linha.push(valor)
                            }
                        }
                        aula++;
                    }
                }
            }
            matriz.push(linha);
        }
    }else{
        let dia= 0;
        for(let l= 0; l< numL; l++){
            let linha= [];
            if(l== 0){
                for(let c= 0; c< numC; c++){
                    if(c== 0){
                        linha.push(dias[0]);
                    }else{
                        linha.push(matrizTurmas[c- 1][0]);
                    }
                }
            }else{
                if((l% 13)== 0){
                    dia= parseInt(l/ 13);
                    for(let c= 0; c< numC; c++){
                        if(c== 0){
                            linha.push(dias[dia]);
                        }else{
                            linha.push(valor2);
                        }
                    }
                }else{
                    if(l== 3 || l== 7 || l== 10 || l== 16 || l== 20 || l== 23 || l== 29 || l== 33 || l== 36 || l== 42 || l== 46 || l== 49 || l== 55 || l== 59 || l== 62){
                        for(let c= 0; c< numC; c++){
                            linha.push(valor3);
                        }
                    }else{
                        if(aula== 10){
                            aula= 1;
                        }
                        for(let c= 0; c< numC; c++){
                            if(c == 0){
                                linha.push(dias[dia]+ "-"+ aula.toString())   
                            }
                            else{
                                linha.push(valor)
                            }
                        }
                        aula++;
                    }
                }
            }
            matriz.push(linha);
        }
    }
    // console.log(matriz)
    return matriz;
}

function tiraAula(el, matriz){
    let id= el.target.getAttribute("id");
    let vet= id.split("-");
    if(matriz[vet[1]][vet[2]]== "0000"){
        matriz[vet[1]][vet[2]]= "1111";
        $("#"+id).html("Sem Aula");
    }else if(matriz[vet[1]][vet[2]]== "1111"){
        matriz[vet[1]][vet[2]]= "4444";
        $("#"+id).html("<td><input type='text' id='"+id+"' class='inputAulaFixa' placeholder='Ex: Momento Cívico'></td>");
    }else{
        matriz[vet[1]][vet[2]]= "0000";
        $("#"+id).html("Aula");
    }
}

function adicionaLinhas(id, matriz){
    let novaMatriz= [];
    let vet= id.split("-");
    let linhaAdd = [];
    let linha= parseInt(vet[1])+ 1;
    let nLM= matriz.length;
    let nCM= matriz[0].length;
    for(let l= 0; l< linha; l++){
        novaMatriz.push(matriz[l]);
    }
    for(let c= 0; c< nCM; c++){
        if(c== 0){
            let dia= matriz[linha- 1][0].split("-")[0];
            let aula= parseInt(matriz[linha- 1][0].split("-")[1])+ 1;
            linhaAdd.push(dia+"-"+ aula.toString());
        }else{
            linhaAdd.push("0000");
        }
    }
    novaMatriz.push(linhaAdd);
    for(let l= linha; l< nLM; l++){
        novaMatriz.push(matriz[l]);
    }
    return novaMatriz;
}

function removeLinhas(id, matriz){
    let novaMatriz= [];
    let vet= id.split("-");
    let linhaAdd = [];
    let linha= parseInt(vet[1])+ 1;
    let nLM= matriz.length;
    let nCM= matriz[0].length;
    for(let l= 0; l< (linha- 2); l++){
        novaMatriz.push(matriz[l]);
    }
    for(let c= 0; c< nCM; c++){
        if(c== 0){
            let dia= matriz[linha- 1][0].split("-")[0];
            let aula= parseInt(matriz[linha- 1][0].split("-")[1])- 1;
            linhaAdd.push(dia+"-"+ aula.toString());
        }else{
            linhaAdd.push("0000");
        }
    }
    novaMatriz.push(linhaAdd);
    for(let l= linha; l< nLM; l++){
        novaMatriz.push(matriz[l]);
    }
    return novaMatriz;
}

function ordenaTurmas(vet){
    vet.sort(function(a, b) {
        if(a[2]< b[2]){
            return 1;
        }else if(a[2]> b[2]){
            return -1;
        }else{
            return 0;
        }
    });
    vet.sort(function(a, b) {
        if(a[1]> b[1]&& a[2]== b[2]){
            return 1;
        }else if(a[1]< b[1]&& a[2]== b[2]){
            return -1;
        }else{
            return 0;
        }
    });
    return vet;
}

function trazQtdeAulas(){
    let store= getObjectStore("stEscola", "readonly");
    let req = store.openCursor();
    req.onsuccess = (e)=>{
        let cursor= e.target.result;
        if(cursor){
            req= store.get(cursor.key);
            req.onsuccess= (e)=>{
                let value= e.target.result;
                idEscola= cursor.key;
                escola= value.escNome;
                qtdeAulas= parseInt(value.escQtdeAulas);
                // cursor.continue();
                setaValorInputEscola("#escNome", "#escQtdeAulas", escola, qtdeAulas);
            };
            req.onerror= (e)=>{
                console.log("Erro: "+ e.target.codeError);
            };
        }
    };
    req.onerror= (e)=>{
        console.log("erro: "+ e.target.codeError);
    };
}

function setaValorInputEscola(id1, id2, escola, qtdeAulas){
    $(id1).val(escola);
    $(id2).val(qtdeAulas);
}

function trazTurmasApagar(idTabela, storage){
    let store= getObjectStore(storage, "readonly");
    let html;
    $(idTabela).html("");
    // console.log(qtde)
    let req = store.openCursor();
    req.onsuccess = (e)=>{
        let cursor= e.target.result;
        if(cursor){
            req= store.get(cursor.key);
            req.onsuccess= (e)=>{
                let value= e.target.result;
                html= ``;
                html+= `<tr>`;
                html+= `<td>`+ value.turNome+ `</td>`;
                html+= `<td>`+ (ano- value.turAno+ 1)+ `º</td>`;
                html+= `<td><button id="turId-`+cursor.key+`" class="apagarTurmas">Deletar</button></td>`;
                html+= `</tr>`;
                $(idTabela).append(html);
                cursor.continue();
            };
            req.onerror= (e)=>{
                console.log("Erro: "+ e.target.codeError);
            };
        }
    };
    req.onerror= (e)=>{
        console.log("erro: "+ e.target.codeError);
    };
}

function trazProfessoresApagar(idTabela, storage){
    let store= getObjectStore(storage, "readonly");
    let html;
    // console.log(qtde)
    $(idTabela).html("");
    let req = store.openCursor();
    req.onsuccess = (e)=>{
        let cursor= e.target.result;
        if(cursor){
            req= store.get(cursor.key);
            req.onsuccess= (e)=>{
                let value= e.target.result;
                html= ``;
                html+= `<tr>`;
                html+= `<td>`+ value.proNome+ `</td>`;
                html+= `<td><button id="proId-`+cursor.key+`" class="apagarProfessor">Deletar</button></td>`;
                html+= `</tr>`;
                $(idTabela).append(html);
                cursor.continue();
            };
            req.onerror= (e)=>{
                console.log("Erro: "+ e.target.codeError);
            };
        }
    };
    req.onerror= (e)=>{
        console.log("erro: "+ e.target.codeError);
    };
}

function profTabelaDisciplinas(){
    $(".profDiscApagar").each((index, elemento)=>{
        $("#disIdProf option").each((index2, elemento2)=>{
        if(elemento.getAttribute("valor")== elemento2.getAttribute("value")){
            elemento.textContent= elemento2.textContent;
        }
        });
    });
}

function trazDisciplinaApagar(idTabela, storage){
    let store= getObjectStore(storage, "readonly");
    let qtde= store.count();
    let aux= 0;
    let html;
    $(idTabela).html("");
    // let qtde= store.count();
    qtde.onsuccess= (e)=>{
        qtde= parseInt(e.target.result);
        let req = store.openCursor();
        req.onsuccess = (e)=>{
            let cursor= e.target.result;
            if(cursor){
                req= store.get(cursor.key);
                req.onsuccess= (e)=>{
                    let value= e.target.result;
                    html= ``;
                    html+= `<tr>`;
                    html+= `<td>`+ value.disNome+ `</td>`;
                    html+= `<td class="profDiscApagar" valor="`+ value.disProfId+ `"></td>`;
                    html+= `<td style="background-color: `+ value.disCor+ `">`+ value.disCor+ `</td>`;
                    html+= `<td><button id="disId-`+cursor.key+`" class="deletarDisc">Deletar</button></td>`;
                    html+= `</tr>`;
                    $(idTabela).append(html);
                    if((aux+ 1)== qtde){
                        profTabelaDisciplinas();
                    }
                    aux++;
                    cursor.continue();
                };
                req.onerror= (e)=>{
                    console.log("Erro: "+ e.target.codeError);
                };
            }
        };
        req.onerror= (e)=>{
            console.log("erro: "+ e.target.codeError);
        };
    };
}

function trazCargaMatriz(){
    let store= getObjectStore("stCarga", "readonly");
    let qtde= store.count();
    let aux= 0;
    qtde.onsuccess= (e)=>{
        qtde= parseInt(e.target.result);
        carga= criaMatriz(qtde, 3, 0);
        let req = store.openCursor();
        req.onsuccess = (e)=>{
            let cursor= e.target.result;
            if(cursor){
                req= store.get(cursor.key);
                req.onsuccess= (e)=>{
                    let value= e.target.result;
                    carga[aux][0]= parseInt(value.carQtde);
                    carga[aux][1]= value.carIdTurma;
                    carga[aux][2]= value.carCod;
                    cursor.continue();
                    if((aux+ 1)== qtde){
                        $("#gerarCalendario").prop("disabled", false);
                    }
                    aux++;
                };
                req.onerror= (e)=>{
                    console.log("Erro: "+ e.target.codeError);
                };
            }
        };
        req.onerror= (e)=>{
            console.log("erro: "+ e.target.codeError);
        };
    };
}

function trazDiasSemAula(){
    let store= getObjectStore("stDiasSemAula", "readonly");
    let qtde= store.count();
    let aux= 0;
    qtde.onsuccess= (e)=>{
        qtde= parseInt(e.target.result);
        diaHorarioSemAula= criaMatriz(qtde, 2, 0);
        let req = store.openCursor();
        req.onsuccess = (e)=>{
            let cursor= e.target.result;
            if(cursor){
                req= store.get(cursor.key);
                req.onsuccess= (e)=>{
                    let value= e.target.result;
                    diaHorarioSemAula[aux][0]= value.diaIdProf;
                    diaHorarioSemAula[aux][1]= value.diaSemanaAula;
                    cursor.continue();
                    aux++;
                    // if((aux+ 1)== qtde){
                    //     console.log(diaHorarioSemAula)
                    // }
                };
                req.onerror= (e)=>{
                    console.log("Erro: "+ e.target.codeError);
                };
            }
        };
        req.onerror= (e)=>{
            console.log("erro: "+ e.target.codeError);
        };
    };
}

function trazDisciplinasMatriz(){
    let store= getObjectStore("stDisciplinas", "readonly");
    let qtde= store.count();
    let aux= 0;
    qtde.onsuccess= (e)=>{
        qtde= parseInt(e.target.result);
        disciplinas= criaMatriz(qtde, 3, 0);
        let req = store.openCursor();
        req.onsuccess = (e)=>{
            let cursor= e.target.result;
            if(cursor){
                req= store.get(cursor.key);
                req.onsuccess= (e)=>{
                    let value= e.target.result;
                    disciplinas[aux][0]= cursor.key;
                    disciplinas[aux][1]= value.disNome;
                    disciplinas[aux][2]= value.disCor;
                    cursor.continue();
                    aux++;
                };
                req.onerror= (e)=>{
                    console.log("Erro: "+ e.target.codeError);
                };
            }
        };
        req.onerror= (e)=>{
            console.log("erro: "+ e.target.codeError);
        };
    };
}

function trazProfessoresMatriz(){
    let store= getObjectStore("stProfessores", "readonly");
    let qtde= store.count();
    let aux= 0;
    qtde.onsuccess= (e)=>{
        qtde= parseInt(e.target.result);
        professores= criaMatriz(qtde, 2, 0);
        let req = store.openCursor();
        req.onsuccess = (e)=>{
            let cursor= e.target.result;
            if(cursor){
                req= store.get(cursor.key);
                req.onsuccess= (e)=>{
                    let value= e.target.result;
                    professores[aux][0]= cursor.key;
                    professores[aux][1]= value.proNome;
                    cursor.continue();
                    aux++;
                };
                req.onerror= (e)=>{
                    console.log("Erro: "+ e.target.codeError);
                };
            }
        };
        req.onerror= (e)=>{
            console.log("erro: "+ e.target.codeError);
        };
    };
}

function trazTurmasMatriz(){
    let store= getObjectStore("stTurmas", "readonly");
    let qtde= store.count();
    let aux= 0;
    qtde.onsuccess= (e)=>{
        qtdeTurmas= parseInt(e.target.result);
        turmas= criaMatriz(qtdeTurmas, 3, 0);
        let req = store.openCursor();
        req.onsuccess = (e)=>{
            let cursor= e.target.result;
            if(cursor){
                req= store.get(cursor.key);
                req.onsuccess= (e)=>{
                    let value= e.target.result;
                    turmas[aux][0]= cursor.key;
                    turmas[aux][1]= value.turNome;
                    turmas[aux][2]= value.turAno;
                    cursor.continue();
                    if((aux+ 1)== qtdeTurmas){
                        ordenaTurmas(turmas);
                    }
                    aux++;
                };
                req.onerror= (e)=>{
                    console.log("Erro: "+ e.target.codeError);
                };
            }
        };
        req.onerror= (e)=>{
            console.log("erro: "+ e.target.codeError);
        };
    };
}

// function trazCalendario(){
//     let store= getObjectStore("stCalendarios", "readonly");
//     let req = store.openCursor();
//     req.onsuccess = (e)=>{
//         let cursor= e.target.result;
//         if(cursor){
//             req= store.get(cursor.key);
//             req.onsuccess= (e)=>{
//                 let value= e.target.result;
//                 $("#divCalendario").html(value.calConteudo);
//                 transformaImagem();
//             };
//             req.onerror= (e)=>{
//                 console.log("Erro: "+ e.target.codeError);
//             };
//         }
//     };
//     req.onerror= (e)=>{
//         console.log("erro: "+ e.target.codeError);
//     };
// }

function trazTema(){
    let store= getObjectStore("stConfiguracoes", "readonly");
    let req = store.openCursor();
    req.onsuccess = (e)=>{
        let cursor= e.target.result;
        if(cursor){
            req= store.get(cursor.key);
            req.onsuccess= (e)=>{
                let value= e.target.result;
                tema= value.conTema;
                // inputTema("#divEscolhaTemaApp", tema);
            };
            req.onerror= (e)=>{
                console.log("Erro: "+ e.target.codeError);
            };
        }
    };
    req.onerror= (e)=>{
        console.log("erro: "+ e.target.codeError);
    };
}

function setaTemaNoApp(tema){
    if(tema== "claro"){
        let root= document.documentElement;
        root.style.setProperty("--background-litle", "#ffffff")
        // $(":root").css({
        //     "--background-litle": "#ffffff"
        // });
    }else{
        // $(document).css({
        //     "--background-litle": "#000000"
        // });
        let root= document.documentElement;
        root.style.setProperty("--background-litle", "#000000")
    }
}

function setaValorTemaInput(tema){
    if(tema== "claro"){
        let largura= $("#divEscolhaTemaApp div").width();
        $("#divEscolhaTemaApp div").css({left: "calc(100% - "+ largura+ "px)", transitionDuration: "1s"});
        $("#divEscolhaTemaApp").attr("valor", "escuro");
        $("#temaEscolhido").text("Escuro");
    }else{
        $("#divEscolhaTemaApp div").css({left: "0px", transitionDuration: "1s"});
        $("#divEscolhaTemaApp").attr("valor", "claro");
        $("#temaEscolhido").text("Claro");
    }
}

function geraPDF(id, escola, nomeArquivo){
    let format= "A4"; // 'A3', 'A4', 'A5', 'Legal', 'Letter', 'Tabloid'
    let orientation= "landscape"; // 'portrait', 'landscape'
    let margin= {"top": "5mm", "left": "5mm", "bottom": "5mm", "right": "5mm"};
    conversion({ 
        html: $("#"+ id).html(),
        header: "<h1 style='text-align:center'>"+escola+"</h1>",
        footer: "<div style='text-align:center'>{#pageNum}/{#numPages} - VRL Desenvolvimento</div>",
        printDelay: 0,
        paperSize: {
            format, orientation, margin //, width, height, headerHeight, footerHeight
        }
    }, function(err, pdf) {
        if(err){
            alert("Erro");
        }else{
            var output = fs.createWriteStream(__dirname+ '/output.pdf');
            // console.log(pdf.logs);
            // console.log(pdf.numberOfPages);
              // since pdf.stream is a node.js stream you can use it
              // to save the pdf to a file (like in this example) or to
              // respond an http request.
            pdf.stream.pipe(output);
            // alert("Salvo");
            // setTimeout(()=> $("#testePdf").attr("src", "output.pdf"), 1000);
            setTimeout(()=> salvar("./output.pdf", nomeArquivo), 1100);
            // salvar()
        }
      });
      
}

function salvar(url, titulo) {
    // let blob = new Blob([arquivo], { type: "application/pdf;charset=utf-8" });
    // console.log("chamou")
    // saveAs(blob, "output.pdf");
    saveAs(url, titulo+ ".pdf");
}

function geraInputs(qtdeAulas, dia){
    let html= ``;
    let aux= 1;
    while(aux<= qtdeAulas){
        html+= `<div>`
            html+= `<input type='checkbox' class='is-primary' value='`+dia+`-`+aux+`'>`;
            html+= `<span>`+ aux+ `ª Aula</span>`;
        html+= `</div>`
        aux++;
    }
    return html;
}

function inputChecked(input){
    let dia= input.getAttribute("value");
    if($(input).is(":checked")){
        if(qtdeAulas> 0){
            $("#div"+ dia).html(geraInputs(qtdeAulas, dia));
        }else{
            mensagem("teste", "Insira a quantidade de aulas, ou coloque um valor maior que zero");
            // console.log("Insera a quantidade de aula")
        }
    }else{
        $("#div"+ dia).html("")
        console.log("desmarcou");

    }
}

function aulaFixa(el, matriz){
    let vet= el.getAttribute("id").split("-");
    let valor= $(el).val();
    if(valor!= ""){
        matriz[vet[1]][vet[2]]= valor;
        // if(valor.indexOf("-")>= 0){
        //     console.log("tem")
        // }else{
        //     console.log("nao tem")
        // }
    }else{
        matriz[vet[1]][vet[2]]= "4444";
    }
}

function mensagemCadastros(id, mensagem){
    $(id).css("display", "block");
    $(id).text(mensagem);
    setTimeout(()=>{
        $(id).css("display", "none");
        $(id).text("");
    }, 2000);
}

function celulaTrocaAulas(id, celula){
    if($(id).text()== ""){
        $(id).css("display", "block");
        $(id).text(celula);
    }else{
        $(id).text("");
        $(id).css("display", "none");
    }
}

function mensagemAjuda(id){
    setTimeout(()=>{
        $(id).toggleClass("aparece");
    }, 100);
}

function mensagemAlerta(mensagem, tempo, classe, pageX, pageY){
    let id= "div-"+ parseInt(Math.random()* 100);
    let div= `<div id="`+id+`"></div>`;
    $("body").append(div);
    $("#" +id).css({"top": (pageY+ 10)+ "px", "left": (pageX+ 10)+ "px"});
    // $("#" +id).css("left", (pageX+ 10)+ "px");
    $("#" +id).addClass("divMensagensAlerta");
    $("#" +id).text(mensagem);
    $("#" +id).addClass(classe);
    // console.log($("#"+ id).html());
    setTimeout(()=>{
        $("#" +id).remove();
    }, tempo);

}

function verificaParaInserir(objStore, dados, funcao){
    let vazio= 0;
    Object.keys(dados).forEach((item)=>{
        if(dados[item]== ""|| dados[item]== 0|| dados[item]== undefined|| dados[item]== null){
            vazio++;
        }
    });
    if(vazio== 0){
        if(funcao!= null){
            inserirDadosGenerica2(objStore, dados, funcao);
        }else{
            inserirDadosGenerica(objStore, dados);
        }
    }else{
        mensagemCadastros("#divMensagens", "Preencha todos os campos por favor");
    }
}

function inputTema(id, tema){
    $(id).attr("valor", tema);
    ajustaBotao(id);
}

function ajustaBotao(id){
    if($(id).attr("valor")== "claro"){

    }else{
        let largura= $("#divEscolhaTemaApp div").width();
        $(id+ " div").css({left: "calc(100% - "+ largura+ "px)", transitionDuration: "0s"});
    }
}

function auxDeletarDis(id){
    id= parseInt(id)
    deletaGenerico("stDisciplinas", "disId", id);
    deletaGenerico("stCarga", "carIdDis", id);
}

function auxDeletarTurmas(id){
    id= parseInt(id)
    deletaGenerico("stTurmas", "turId", id);
    deletaGenerico("stCarga", "carIdTurma", id);
}

function auxDeletarProf(id){
    id= parseInt(id)
    deletaGenerico("stDiasSemAula", "diaIdProf", id);
    deletaGenerico("stProfessores", "proId", id);
    deletaGenerico("stDisciplinas", "disProfId", id);
    deletaGenerico("stCarga", "carProfId", id);
}

function insereJson(dados){
    console.log(dados)
    IDBExportImport.clearDatabase(db, function(err){
        if(!err){
            IDBExportImport.importFromJsonString(db, JSON.stringify(dados), function(err) {
                if(!err){
                    console.log("deu certo");
                }else{
                    console.log("deu erro");
                }
            });
        }else{
            console.log("deu erro");
        }
    });
}

function trazJson(caminho){
    $.getJSON(caminho, data=>{
        return data;
    });
}

$(document).ready(function () {

    $(document).on("click", ".apagarTurmas", e=>{
        auxDeletarTurmas(e.target.getAttribute("id").split("-")[1]);
        trazTurmasApagar("#tabelaTurmas", "stTurmas");
    });

    $(document).on("click", ".apagarProfessor", e=>{
        auxDeletarProf(e.target.getAttribute("id").split("-")[1]);
        trazProfessoresApagar("#tabelaProfessores", "stProfessores");
    });

    $(document).on("click", ".deletarDisc", e=>{
        auxDeletarDis(e.target.getAttribute("id").split("-")[1]);
        trazDisciplinaApagar("#tabelaDisciplinas", "stDisciplinas");
    });

    $(document).on( "mouseenter mouseleave", ".ajuda", (e)=>{
        mensagemAjuda(e.target.getAttribute("divId"));
    });

    $(document).on("keyup", ".inputAulaFixa", (e)=>{
        aulaFixa(e.target, calendarioCriado);
    });

    $(document).on("click", ".celulas", (e)=>{
        if (e.ctrlKey) {
            tiraAula(e, calendarioCriado);
            // tiraAula(e.target.getAttribute("id"), e.target.getAttribute("value"), calendarioCriado);
        }
            // console.log(e.keyCode)
    });
    $(document).on("click", ".checkDia", (e)=>{
        inputChecked(e.target);
    });

    $(document).mousemove((e)=>{
        cursorX= e.pageX;
        cursorY= e.pageY;
        $("#divMensagens").css("top", (cursorY+ 10)+"px");
        $("#divMensagens").css("left", (cursorX+ 15)+"px");
    });

    $(document).on("click", "#gerarPdf", ()=>{
        let nomeArquivo= $("#nomePdf").val();
        if(nomeArquivo!= ""){
            geraPDF("calendario", escola, nomeArquivo);
        }else{
            geraPDF("calendario", escola, "calendario");
        }
    });

    $(document).on("click", "#gerarCalendario", (e)=>{
        e.preventDefault();
        $("#gerarCalendarioDiv").css("display", "none");
        $("#gerarCalendarioFinalDiv").css("display", "block");
        calendarioCriado= criaCalendario(qtdeAulas, qtdeTurmas, turmas);
        escreveCalendario(calendarioCriado, turmas, qtdeAulas, "calendario");
    });

    $(document).on("click", "#gerarCalendarioFinal", (e)=>{
        e.preventDefault();
        e.preventDefault();
        $("#gerarCalendarioFinalDiv").css("display", "none");
        $("#gerarPdfDiv").css("display", "block");
        for(let i= 0; i< 3; i++){
            distribuiAulas(calendarioCriado, carga);
        }
        if($("#soDistribuiAulas").is(":checked")){
            escreveCalendarioFinal(calendarioCriado, turmas, disciplinas, professores, "calendario");
        }else{
            verificaConflitos(calendarioCriado);
            escreveCalendarioFinal(calendarioCriado, turmas, disciplinas, professores, "calendario");
        }
    });

    $(document).on("click", ".trocaAulas", (e)=>{
        trocaAula(e.target, varTroca, vetorTroca, calendarioCriado);
        // trocaAula(e.target.getAttribute("id"), varTroca, vetorTroca, calendarioCriado);
    });

    $(document).on("click", ".removeLinhas", (e)=>{
        calendarioCriado= removeLinhas(e.target.getAttribute("id"), calendarioCriado);
        escreveCalendario(calendarioCriado, turmas, qtdeAulas, "calendario");
    });

    $(document).on("click", ".adicionaLinhas", (e)=>{
        calendarioCriado= adicionaLinhas(e.target.getAttribute("id"), calendarioCriado);
        escreveCalendario(calendarioCriado, turmas, qtdeAulas, "calendario");
    });

    $(document).on("click", "#resetarCalendario", ()=>{
        calendarioCriado= [];
        $("#calendario").html("");
        $("#gerarCalendarioFinalDiv").css("display", "none");
        $("#gerarPdfDiv").css("display", "none");
        $("#gerarCalendarioDiv").css("display", "block");
        $("#gerarCalendario").prop("disabled", true);
        trazCargaMatriz();
    });
    
    $(document).on("click", "#divEscolhaTemaApp", e=>{
        if(e.target.getAttribute("valor")== "claro"){
            let largura= $("#divEscolhaTemaApp div").width();
            $("#divEscolhaTemaApp div").css({left: "calc(100% - "+ largura+ "px)", transitionDuration: "1s"});
            $("#divEscolhaTemaApp").attr("valor", "escuro");
            $("#temaEscolhido").text("Escuro");
        }else{
            $("#divEscolhaTemaApp div").css({left: "0px", transitionDuration: "1s"});
            $("#divEscolhaTemaApp").attr("valor", "claro");
            $("#temaEscolhido").text("Claro");
        }
    });

    $(document).on("click", "#importarJson", ()=>{
        // console.log($("#arquivoJson").val());
        // let dados= trazJson("../teste.json");
        // console.log(dados);
        $.getJSON("../teste.json", data=>{
            IDBExportImport.clearDatabase(db, function(err){
                if(!err){
                    IDBExportImport.importFromJsonString(db, JSON.stringify(data), function(err) {
                        if(!err){
                            console.log("deu certo");
                        }else{
                            console.log("deu erro");
                        }
                    });
                }else{
                    console.log("deu erro");
                }
            });
            mensagemCadastros("#divMensagens", "Dados inseridos.")
        });
        // insereJson();
        // IDBExportImport.exportToJsonString(db, function(err, jsonString) {
        //     if(err){
        //         console.log(err);
        //     }else{
        //         console.log(jsonString)
        //         let blob = new Blob([jsonString], { type: "application/octet-stream;charset=utf-8" });
        //         saveAs(blob, "teste.json");
        //     }
        // });
        // console.log(dados)
        // IDBExportImport.importFromJsonString(db, dados, function(err) {
        //     if(err){
        //         console.log("deu erro");
        //     }
        // });
        // IDBExportImport.clearDatabase(db, function(err) {
        //     if (!err) { // cleared data successfully
        //         if (!err) {
        //             console.log('Imported data successfully');
        //         }
        //         });
        //     }
        // });
    });
});