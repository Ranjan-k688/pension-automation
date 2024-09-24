$(document).ready(function () { 
   AOS.init();
   var dataNameValue="service-history";
   setTimeout(function(){
$(".links").click(function() { 
    alert("hello");
    $(this).addClass("active");
    $(this).attr("data-name");
    dataNameValue=$(this).attr("data-name");
    $(".contentsection").attr("ng-controller", dataNameValue);
  angular.bootstrap(document, ['myApp']);
  });
},15);

$(document).ready(function() {

var link;
link= window.location.href.split("/")[window.location.href.split("/").length - 1].split(".")[0];
$(".contentsection").attr("ng-controller", dataNameValue);
  angular.bootstrap(document, ['myApp']);
});
   $(document).on("click", function (event) {
     if (!$(event.target).closest('.datepicker').length) {
       $('.datepicker').datepicker({
         // format: "yyyy-mm-dd",
         format: "dd-mm-yyyy",
         autoclose: true
       });
     }
   });

}); 