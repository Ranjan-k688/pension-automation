
app.controller('bankAdvice',function($scope,$http,$rootScope,numberToWordsService) {

        $scope.showmessage=false;
        $scope.handleLink = function (pgname) {
          $rootScope.handleLink(pgname);
        };

        $scope.form={};
      // List of months
      $scope.months = [
        { value: 1, name: 'January' },
        { value: 2, name: 'February' },
        { value: 3, name: 'March' },
        { value: 4, name: 'April' },
        { value: 5, name: 'May' },
        { value: 6, name: 'June' },
        { value: 7, name: 'July' },
        { value: 8, name: 'August' },
        { value: 9, name: 'September' },
        { value: 10, name: 'October' },
        { value: 11, name: 'November' },
        { value: 12, name: 'December' }
      ];

      $scope.$watch('form.bank', function(bank) {
      if(bank){
        $scope.showmessage=false;
      }
     })

     $scope.$watch('form.year', function(y) {
      if(y){
        $scope.showmessage=false;
      }
     })


     $scope.$watch('form.month', function(mo) {
      if(mo){
        $scope.showmessage=false;
      }
     })

    //  $scope.$watch(['form.bank','form.year','form.month'], function(mo) {
    //   if(mo){
    //     $scope.showmessage=false;
    //   }
    //  })



      // Watch for changes in the selected year
      $scope.$watch('form.year', function(newYear) {
        $scope.form.month=undefined;
        var currentYear = new Date().getFullYear();
        var currentMonth = new Date().getMonth() + 1; // getMonth() returns month index (0-11)

        if (newYear == currentYear) {
          // If selected year is the current year, filter out future months
          $scope.availableMonths = $scope.months.filter(function(month) {
            return month.value <= currentMonth;
          });
        } else {
          // Otherwise, show all months
          $scope.availableMonths = $scope.months;
        }
      });

      // Function to convert number to words
      $scope.convertNumberToWords = function (val) {
        return numberToWordsService.convert(val);
    };

    $scope.banklist=[];
    $scope.bankifsclist=[];
$scope.fetchBankMaster = function () {
  $(".loaderbg").show();  
  var req = {
    method: 'GET',
    url: path+'/api/v1/bankDisbursement/bank-ifsc',
    headers: {
      'Authorization': "Bearer " + sessionStorage.token,
      'Content-Type': 'application/json'
    },
   
  };
 $http(req).then(function(masterdata_res){

     if (masterdata_res) {
      $(".loaderbg").hide();  
        $scope.banklist=angular.copy(masterdata_res.data);
        $scope.bankifsclist=angular.copy(masterdata_res.data);
     }

     else {
      $(".loaderbg").hide();  
    }

     },
     function (err) {
      $(".loaderbg").hide();  
      if(err.data=="Expired token"){
        $rootScope.logout();
    }   
               
     });

};
$scope.fetchBankMaster();




$scope.exportToExcel = function (){

  console.log("export");
   $(".excelformate").table2excel({
      filename : "pensioner-details.xls"
    });
};


$scope.generate_advice = function(val) {
  $scope.showmessage=false;
  var req = {
      method: 'PUT',
      url: path + '/api/v1/bankDisbursement/add-advicedate?pensionYr=' + val.year + '&pensionMonth=' + val.month + '&bankCode=' + val.bank,
      headers: {
        'Authorization': "Bearer " + sessionStorage.token,
        'Content-Type': 'application/json'
      },
  };
if($scope.generateAdvice.$valid){
  $http(req).then(function(res) {
    if (res.status===200) {
        // $scope.form = pensionerdetails_res.data;
        $scope.adviceDate=res.data.adviceDate;
        $scope.adviceSlno=res.data.adviceSlno;
        $scope.showmessage=true;
        toastr.success('Success' ,'Bank Advice Generated');
    } else {
        alert("There is no record in disbursed state!!");
        toastr.error('There is no record in disbursed state!!', 'Error');
    }
}, function(err) {
    // Handle errors
});
}
else{
  alert("Please Fill add field")
}

};




$scope.fetchListDateAdvice = function(val) {
  if(val.ifscCode!=undefined){
  $scope.branchlist=[];
  $scope.branchlist= $scope.bankifsclist.filter(function(item) {
    return item.ifsc_code == val.ifscCode;
});
  $scope.form.branchName=$scope.branchlist[0].branch_name;
  $scope.adviceDateList={};
  $scope.adviceSlnoList={};
  // $scope.generateAdvice.$setPristine();
  $scope.generateAdvice.$setUntouched();
  var req = {
      method: 'GET',
      params:{ifscCode:val.ifscCode,
        bankCode:val.bank,
        pensionMonth:val.month,
        pensionYr:val.year
      },
      url: path + '/api/v1/bankDisbursement/search-date-slno',
      headers: {
        'Authorization': "Bearer " + sessionStorage.token,
        'Content-Type': 'application/json'
      },
  };
  $http(req).then(function(res) {
    if (res.status===200) {
        $scope.adviceDateList = res.data.dateList;
        $scope.adviceSlnoList = res.data.dateSlno;
        // toastr.success(res.data.updated_record ,'Bank Advice Generated for ');
    } else {
        alert("Error!!");
        toastr.error('Error!!', 'Error');
    }
}, function(err) {
    // Handle errors
});

}
else{
  $scope.adviceDateList={};
  $scope.adviceSlnoList={};
  // $scope.generateAdvice.$setPristine();
  $scope.generateAdvice.$setUntouched();
}
};



$scope.fetchListSlnoAdvice = function() {
$scope.adviceSlnoListUse = $scope.adviceSlnoList[$scope.form.adviceDate];
};


      $scope.printedData=[];
      $scope.monPensioerReportExcel = {};
      $scope.monPensioerReportTotal = {};

      $scope.sendDataToPrint={};


      $scope.getDataFun=function(val1){
        if($scope.generateAdvice.$valid){
        $scope.prepareDataBank={};
        let itemExists = false;
          $scope.prepareDataBank.year= val1.year;
          $scope.prepareDataBank.month= val1.month;
          $scope.prepareDataBank.bank= val1.bank;
          $scope.prepareDataBank.branchName= val1.branchName;
          $scope.prepareDataBank.ifscCode= val1.ifscCode;
          $scope.prepareDataBank.adviceDate= val1.adviceDate;
          $scope.prepareDataBank.adviceSlno= val1.adviceSlno;
        for (let i = 0; i < $scope.printedData.length; i++) {
          if (
            $scope.printedData[i].year === val1.year && $scope.printedData[i].month === val1.month 
            && $scope.printedData[i].bank === val1.bank && $scope.printedData[i].ifscCode === val1.ifscCode
            && $scope.printedData[i].adviceDate === val1.adviceDate && $scope.printedData[i].adviceSlno === val1.adviceSlno
          ) {
            // Remove the matching item
            $scope.printedData.splice(i, 1);
            $scope.printedData.splice(i, 0, $scope.prepareDataBank);
            itemExists = true;
            break; // Exit the loop since the item has been found and removed
          }
        }
        
        if (!itemExists) {
          // If no matching item was found, add the new item
          $scope.printedData.push($scope.prepareDataBank);
        }
        $scope.removeifsccode(val1.ifscCode);
      }
      else{
        toastr.error('Fill All Mandatory Field!!','Error');
      }
      };

      $scope.removeifsccode = function(ifsc) {
        // $scope.adviceDateList={};
        // $scope.adviceSlnoList={};
        // // $scope.generateAdvice.$setPristine();
        // $scope.generateAdvice.$setUntouched();
        $scope.bankifsclist = $scope.bankifsclist.filter(function(item) {
            return item.ifsc_code !== ifsc;
        });
      }

      $scope.sendToPrintFun = function (val,flag){
        $('.popupbg').show();
        $scope.sendDataToPrint=val;
        $scope.sendDataToPrint.flag=flag;
        $('#confirmModal').modal('show');
      };
      $scope.closemodal = function (){
        $('.popupbg').hide();
        $('#confirmModal').modal('hide');
      };
      
$scope.downloadAdviceExcel = function () {

  var val1=$scope.sendDataToPrint;
  if(val1.year!==undefined && val1.month!==undefined && val1.adviceDate!==undefined  && val1.bank!==undefined && val1.adviceSlno!==undefined){
        
        
    $(".generateload").show();
    var req = {
        method: 'GET',
        params:{ifscCode:val1.ifscCode,
          bankCode:val1.bank,
          pensionMonth:val1.month,
          pensionYear:val1.year,
          adviseDate:val1.adviceDate,
          adviseSlno:val1.adviceSlno

        },
        url: path + '/api/v1/pensioner-details/download/disbursh-data-bybank',
  
     headers: {
      'Authorization': "Bearer " + sessionStorage.token,
      'Content-Type': 'application/json'
    },
    };
  
    $http(req).then(function (response) {
        if (response.status===200) {
          // $scope.form = {};
          $scope.generateAdvice.$setPristine();
          $scope.generateAdvice.$setUntouched();
          $scope.monPensioerReportExcel = response.data.content;
          $scope.monPensioerReportTotal = response.data.totalSum;
          $scope.monPensioerReportTotalWords = response.data.totalSumInWords;
          if($scope.monPensioerReportExcel.length>0){
                setTimeout(function () {
                  $(".excelformate").table2excel({
                      filename: "Bank_advice_"+$scope.getMonthName($scope.monPensioerReportExcel[0].pension_month)+"-"+$scope.monPensioerReportExcel[0].pension_year+".xls"
                  });
                  $(".generateload").hide();
                  // location.reload();
                  $('#confirmModal').modal('hide');
                  $('.popupbg').hide();
              }, 1000); 

            }
            else{
              $(".generateload").hide();
              $('#confirmModal').modal('hide');
                  $('.popupbg').hide();
              alert('Data not found!!');
            }
            }
            else{
              $(".generateload").hide();
              $('#confirmModal').modal('hide');
                  $('.popupbg').hide();
              alert('Something went wrong!!');
            }
            
            
        }, function (err) {
          $(".generateload").hide();
              $('#confirmModal').modal('hide');
                  $('.popupbg').hide();
        console.error('Error fetching data:', err);
    });
  }else{
  alert('Please fill all compulsory field!!');
  }
  };

       
$scope.downloadAdvicePdf = function () {
    var val1=$scope.sendDataToPrint;
  if(val1.year!==undefined && val1.month!==undefined && val1.adviceDate!==undefined  && val1.bank!==undefined && val1.adviceSlno!==undefined){
        
        
    $(".generateload").show();
    var req = {
        method: 'GET',
        params:{ifscCode:val1.ifscCode,
          bankCode:val1.bank,
          pensionMonth:val1.month,
          pensionYear:val1.year,
          adviseDate:val1.adviceDate,
          adviseSlno:val1.adviceSlno

        },
        url: path + '/api/v1/pensioner-details/download/disbursh-data-bybank',
  
     headers: {
      'Authorization': "Bearer " + sessionStorage.token,
      'Content-Type': 'application/json'
    },
    };
  
    $http(req).then(function (response) {
        if (response.status===200) {

                // $scope.form = {};
                $scope.generateAdvice.$setPristine();
                $scope.generateAdvice.$setUntouched();
                $scope.monPensioerReportExcel = response.data.content;
                $scope.monPensioerReportTotal = response.data.totalSum;
                $scope.monPensioerReportTotalWords = response.data.totalSumInWords;
                $scope[val1.flag]=true;
                if($scope.monPensioerReportExcel.length>0){
  //                 // Wait for a short delay to allow the table to render properly before generating the PDF
                  setTimeout(function() {

                    // Get the content of the specific div
                    var content = document.querySelector('.excelformate').innerHTML;

                    // Open a new window
                    var printWindow = window.open('', '_blank');

                    // Check if the new window was successfully opened
                    if (printWindow) {
                        // Write the content to the new window
                        printWindow.document.write('<html><head><title>Bank Advice Report_'+$scope.getMonthName($scope.monPensioerReportExcel[0].pension_month)+'_'+$scope.monPensioerReportExcel[0].pension_year+' </title></head><body>');
                        printWindow.document.write('<div class="printable-table" style=" width:100%; box-sizing:border-box;">' + content + '</div>');
                        printWindow.document.write('</body></html>');

                        // Print the content of the new window
                        printWindow.document.close(); // Close the document for writing
                        printWindow.print();
                        // location.reload();
                        $(".generateload").hide();
              $('#confirmModal').modal('hide');
                  $('.popupbg').hide();
                    } else {
                        // Handle the case where the new window could not be opened
                        console.error("Failed to open print window.");
                    }
                }, 1000);
              }
              else{
                
                $(".generateload").hide();
              $('#confirmModal').modal('hide');
                  $('.popupbg').hide();
                alert('Data not found!!');
              }

            }
            else{
              $(".generateload").hide();
              $('#confirmModal').modal('hide');
                  $('.popupbg').hide();
              alert('Something went wrong!!');
            }
            
            
        }, function (err) {
          $(".generateload").hide();
              $('#confirmModal').modal('hide');
                  $('.popupbg').hide();
        console.error('Error fetching data:', err);
    });
  }else{
  alert('Please fill all compulsory field!!');
  }
  };


  $scope.getMonthName = function(monthNumber) {
    var months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
    // Ensure the monthNumber is valid (between 1 and 12)
    if (monthNumber >= 1 && monthNumber <= 12) {
      return months[monthNumber - 1];
    } else {
      return "";
    }
  };

  $scope.getBankName = function(bankcode) {
   var retvalue='';
    for(let i=0;i<$scope.banklist.length;i++){
      if ($scope.banklist[i].bank_code==bankcode) {
        retvalue=$scope.banklist[i].bank_name;
      } 
    }
    if (retvalue!=='') {
      return retvalue;
    } else {
      return retvalue;
    }
  };

  $scope.getPrintFlag = function(index) {
    return $scope['printdataflg_' + index];
};


});  

