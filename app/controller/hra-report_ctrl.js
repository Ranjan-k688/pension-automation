

app.controller('hraReport',function($scope,$http,$rootScope,numberToWordsService) {

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


  


$scope.exportToExcel = function (){

  console.log("export");
   $(".excelformate").table2excel({
      filename : "pensioner-details.xls"
    });
};

      $scope.monPensioerReportExcel = {};
      $scope.monPensioerReportTotal = {};
      
$scope.downloadAdviceExcel = function (val1) {
  if(true){
        $scope.from=val1.start;
        $scope.to=val1.end;
    $(".generateload").show();
    var req = {
        method: 'GET',
        url: path + '/api/v1/tds-hra-report/download/hra',
  params: {
          pensionMonth: val1.month,
          pensionYear: val1.year
      },
     headers: {
      'Authorization': "Bearer " + sessionStorage.token,
      'Content-Type': 'application/json'
    },
    };
    $http(req).then(function (response) {
        if (response.status===200) {
          $scope.monPensioerReportExcel = response.data.report;
                 $scope.monPensioerReportTotal = response.data.totalHra;
                if($scope.monPensioerReportExcel.length>0){
                setTimeout(function () {
                  $(".excelformate").table2excel({
                      filename: "HRA_Report_"+$scope.getMonthName(val1.month)+"-"+val1.year+".xls"
                  });
                  $(".generateload").hide();
                  location.reload();
                  // $scope.form = undefined;
              }, 1000); 
            }
            else{
              $(".generateload").hide();
                  $('.popupbg').hide();
              alert('No Data Found!!');
            }
            }
            else{
              alert('Something went wrong!!');
            }
            
            
        }, function (err) {
        console.error('Error fetching data:', err);
        $(".generateload").hide();
    });
  }else{
  alert('Please fill all compulsory field!!');
  }
  };

       
$scope.downloadAdvicePdf = function (val1) {

  // if(val1.year!==undefined && val1.month!==undefined){
  if(true){
        $scope.from=val1.start;
        $scope.to=val1.end;
    $(".generateload").show();
    var req = {
      method: 'GET',
      url: path + '/api/v1/tds-hra-report/download/hra',
      params: {
          pensionMonth: val1.month,
          pensionYear: val1.year
      },
  
     headers: {
      'Authorization': "Bearer " + sessionStorage.token,
      'Content-Type': 'application/json'
    },
    };
  
    $http(req).then(function (response) {
        if (response.status===200) {
                $scope.monPensioerReportExcel = response.data.report;
                 $scope.monPensioerReportTotal = response.data.totalHra;
                 if($scope.monPensioerReportExcel.length>0){
                // Wait for a short delay to allow the table to render properly before generating the PDF
                  setTimeout(function() {
                    // Hide loader
                    $(".generateload").hide();

                    // Get the content of the specific div
                    var content = document.querySelector('.excelformate').innerHTML;

                    // Open a new window
                    var printWindow = window.open('', '_blank');

                    // Check if the new window was successfully opened
                    if (printWindow) {
                        // Write the content to the new window
                        printWindow.document.write('<html><head><title>HRA Report_'+ $scope.getMonthName(val1.month)+'_'+val1.year+' </title></head><body>');
                        printWindow.document.write('<div class="printable-table" style=" width:100%; box-sizing:border-box;">' + content + '</div>');
                        printWindow.document.write('</body></html>');

                        // Print the content of the new window
                        printWindow.document.close(); // Close the document for writing
                        printWindow.print();
                        location.reload();
                        // $scope.form = undefined;
                    } else {
                        // Handle the case where the new window could not be opened
                        console.error("Failed to open print window.");
                    }
                }, 1000);

              }
              else{
                $(".generateload").hide();
                  $('.popupbg').hide();
                alert('No Data Found!!');
              }
            }
            else{
              alert('Something went wrong!!');
            }
            
        }, function (err) {
        console.error('Error fetching data:', err);
        $(".generateload").hide();
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


});  

