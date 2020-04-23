// const $= require("jquery");
const app= require("electron").remote.app;
const {remote}= require("electron");

function verficaMaximizacao(){
    if(remote.BrowserWindow.getFocusedWindow().isMaximized()){
        $("#botaoRestaurar i").addClass("far fa-window-restore");
        $("#botaoRestaurar").attr("title", "Restaurar");
    }else{
        $("#botaoRestaurar i").addClass("fas fa-expand-arrows-alt");
        $("#botaoRestaurar").attr("title", "Expandir");
    }
}

remote.BrowserWindow.getFocusedWindow().maximize();

$(document).ready(()=>{
    verficaMaximizacao();

    $(document).on("click", "#botaoMinimizar", ()=>{
        remote.BrowserWindow.getFocusedWindow().minimize();
    });
    $(document).on("click", "#botaoRestaurar", ()=>{
        if(remote.BrowserWindow.getFocusedWindow().isMaximized()){
            remote.BrowserWindow.getFocusedWindow().restore();
            $("#botaoRestaurar i").removeClass("far fa-window-restore");
            $("#botaoRestaurar i").addClass("fas fa-expand-arrows-alt");
            $("#botaoRestaurar").attr("title", "Expandir");
        }else{
            remote.BrowserWindow.getFocusedWindow().maximize();
            $("#botaoRestaurar i").removeClass("fas fa-expand-arrows-alt");
            $("#botaoRestaurar i").addClass("far fa-window-restore");
            $("#botaoRestaurar").attr("title", "Restaurar");
        }
    });
    $(document).on("click", "#botaoFechar", ()=>{
        remote.BrowserWindow.getFocusedWindow().close();
    });
});