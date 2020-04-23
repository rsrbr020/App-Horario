// // window.indexedDB= window.indexedDB|| window.mozIndexedDB|| window.webkitIndexedDB|| window.msIndexedDB;

// // if(!window.indexedDB){
// //     alert();
// // }
// // let db;
// // let tx;
// // let storage;
// // let index;
// // let req= window.indexedDB.open("dbHorarios", 1);
const IDBExportImport = require('indexeddb-export-import');

const DB_NAME = 'dbHorarios';
const DB_VERSION = 1; // Use a long long for this value (don't use a float)
// const DB_STORE_NAME = 'stTurmas';

var db;

// export to JSON, clear database, and import from JSON
// IDBExportImport.exportToJsonString(idbDatabase, function(err, jsonString) {
//     if (err) {
//       console.error(err);
//     } else {
//       console.log('Exported as JSON: ' + jsonString);
//       IDBExportImport.clearDatabase(idbDatabase, function(err) {
//         if (!err) { // cleared data successfully
//           IDBExportImport.importFromJsonString(idbDatabase, jsonString, function(err) {
//             if (!err) {
//               console.log('Imported data successfully');
//             }
//           });
//         }
//       });
//     }
//   });

function openDb() {
    console.log("Conectando...");
    let req= indexedDB.open(DB_NAME, DB_VERSION);
    let teste;
    req.onsuccess= (e)=>{
        // Better use "this" than "req" to get the result to avoid problems with
        // garbage collection.
        // db = req.result;
        db= req.result;
        console.log("Conectado com sucesso");
        // IDBExportImport.exportToJsonString(db, function(err, jsonString) {
        //     if(err){
        //         console.log(err);
        //     }else{
        //         console.log(jsonString)
        //         let blob = new Blob([jsonString], { type: "application/octet-stream;charset=utf-8" });
        //         saveAs(blob, "teste.json");
        //     }
        // });
    };
    // idbDatabase= db;
    req.onerror= (e)=>{
        console.error("Erro: ", e.target.errorCode);
    };

    req.onupgradeneeded = function (e) {
        console.log("Atualizando o banco");
        let db1= e.currentTarget.result; 
        var store= e.currentTarget.result.createObjectStore("stTurmas", { keyPath: 'turId', autoIncrement: true });
        store.createIndex('turNome', 'turNome', { unique: false });
        store.createIndex('turAno', 'turAno', { unique: false });

        var store2= e.currentTarget.result.createObjectStore("stProfessores", { keyPath: 'proId', autoIncrement: true });
        store2.createIndex('proNome', 'proNome', { unique: false });

        var store3= e.currentTarget.result.createObjectStore("stDisciplinas", { keyPath: 'disId', autoIncrement: true });
        store3.createIndex('disNome', 'disNome', { unique: false });
        store3.createIndex('disCor', 'disCor', { unique: false });
        store3.createIndex('disProfId', 'disProfId', { unique: false });

        var store4= e.currentTarget.result.createObjectStore("stEscola", { keyPath: 'escId', autoIncrement: true });
        store4.createIndex('escNome', 'escNome', { unique: false });
        store4.createIndex('escQtdeAulas', 'escQtdeAulas', { unique: false });
        
        var store5= e.currentTarget.result.createObjectStore("stCarga", { keyPath: 'carId', autoIncrement: true });
        store5.createIndex('carQtde', 'carQtde', { unique: false });
        store5.createIndex('carIdTurma', 'carIdTurma', { unique: false });
        store5.createIndex('carIdDis', 'carIdDis', { unique: false });
        store5.createIndex('carCod', 'carCod', { unique: false });
        store5.createIndex('carProfId', 'carProfId', { unique: false });
        
        var store5= e.currentTarget.result.createObjectStore("stCalendarios", { keyPath: 'calId', autoIncrement: true });
        store5.createIndex('calConteudo', 'calConteudo', { unique: false });

        var store6= e.currentTarget.result.createObjectStore("stDiasSemAula", { keyPath: 'diaId', autoIncrement: true });
        store6.createIndex('diaIdProf', 'diaIdProf', { unique: false });
        store6.createIndex('diaSemanaAula', 'diaSemanaAula', { unique: false });

        var store7= e.currentTarget.result.createObjectStore("stConfiguracoes", { keyPath: 'conId', autoIncrement: true });
        store7.createIndex('conTema', 'conTema', { unique: false });
        store7.add({conTema: "claro"});
        // store7.transaction.oncomplete= (e)=>{
        //     let stConfiguracoes= db1.transaction("stConfiguracoes", "readwrite").objectStore("stConfiguracoes");
        //     stConfiguracoes.add("claro");
        // }
    };
}

openDb();

// req.onerror= (e)=>{
//     console.log("Erro: "+ e.target.errorCode);
// };

// req.onsuccess= (e)=>{
//     db= this.result;
//     console.log("banco aberto");
//     // tx= db.transaction("turmas", "readwrite");
//     // store= tx.objectStore("turmas");
// };
// req.onupgradeneeded= (e)=>{
//     // let db= e.target.result;
//     console.log("deu");
//     let objStore= e.currentTarget.result.createObjectStore("stTurmas", {keypath: "turId", autoIncrement: true});
//     objStore.createIndex("turNome", "turNome", {unique: false});
//     objStore.createIndex("turAno", "turAno", {unique: false});

//     objStore.transaction.oncomplete= (e)=>{
//         // Armazenando valores no novo objectStore.
//         let turmasObjStore= db.transaction("stTurmas", "readwrite").objectStore("stTurmas");
//         for (let i in dadosTurmas) {
//             turmasObjStore.add(dadosTurmas[i]);
//         }
//     }
// };

function getObjectStore(nomeStore, modo) {
    let tx= db.transaction(nomeStore, modo);
    return tx.objectStore(nomeStore);
}