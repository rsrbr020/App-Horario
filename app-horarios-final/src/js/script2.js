// importe do nicescroll
var niceScroll= require("jquery.nicescroll");

function calculaAlturaCorpo(id1, id2, id3){
  const altura= $(id1).height()+ $(id2).height();
  $(id3).css("max-height", "calc(100vh - "+altura+"px)");
}
// $("body").css("--corTeste", "red");

$(document).ready(function() {
  // trocar cor css
  $(document).on("click", "body", ()=>{
  });

  $(".toggler").on("click", function() {
    $(".menu-container").toggleClass("active");
  });
  
  $(".nav-toggler").on("click", function() {
    $(".navbar-toggler").toggleClass("is-active");
    $(".navbar-menu").toggleClass("is-active");
  });
  
  function setMenuHeight() {
    var navbarHeight = $(".navbar").outerHeight();
    $(".menu-wrapper")
    .outerHeight(document.documentElement.clientHeight - navbarHeight)
    .niceScroll({
      emulatetouch: true
    });
  }
  setMenuHeight();
  
  calculaAlturaCorpo("#menuAcoesApp", "#menuBar", "#divScroll");
  
  $(window).resize(()=>{
    calculaAlturaCorpo("#menuAcoesApp", "#menuBar", "#divScroll");
  });

  $(window).on("resize", function() {
    setMenuHeight();
  });

  // recolhe o menu lateral ao clicar na div da classe p1
  $(document).on("click", "#corpoApp", ()=>{
    if($(".menu-container").hasClass("active")){
      $(".menu-container").removeClass("active");
    }
  });

  $(document).on("click", ".delete", e=>{
    e.preventDefault();
    $(e.target.getAttribute("divId")).remove();
    console.log(e.target.getAttribute("divId"));
  });
});

// document.addEventListener('DOMContentLoaded', () => {
//   (document.querySelectorAll('.notification .delete') || []).forEach(($delete) => {
//     $notification = $delete.parentNode;

//     $delete.addEventListener('click', () => {
//       $notification.parentNode.removeChild($notification);
//     });
//   });
// });
// document.addEventListener('DOMContentLoaded', () => {
//   (document.querySelectorAll('.notification1 .delete1') || []).forEach(($delete) => {
//     $notification = $delete.parentNode;

//     $delete.addEventListener('click', () => {
//       $notification.parentNode.removeChild($notification);
//     });
//   });
// });
