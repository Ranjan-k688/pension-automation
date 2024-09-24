
$(document).on("click", function (event) {
    if (!$(event.target).closest('.datepicker').length) {
      $('.datepicker').datepicker({
        // format: "yyyy-mm-dd",
        format: "dd-mm-yyyy",
        autoclose: true
      });
    }
  });
       
  
  $(document).ready(function () { 
    AOS.init();
  
  
   
   
       
    // $(document).on("click", function (event) {
    //     if (!$(event.target).closest('.datepicker').length) {
    //       setTimeout(function(){
    //       $('.datepicker').datepicker({
    //         // format: "yyyy-mm-dd",
    //         format: "dd-mm-yyyy",
    //         autoclose: true
    //       });
    //     }, 2000);
    //     }
    //   });
    $(".close").click(function(){
  $('.popupbg').hide();
  });
   $(".sidelink > ul > li > a").click(function(){
    $('.sidelink > ul > li').removeClass('active'); 
  });
   
   $(".submenu").click(function(){
    $('.sidelink li').removeClass('active');
  $(this).parent().addClass('active');
  });
   
  
  
  }); 
  
  
  