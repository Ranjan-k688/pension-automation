 
    app.controller('generatePension', function ($scope, $http, $timeout, $window, $rootScope, $filter)
    {
      $scope.flag=false;
      $scope.yrmon={};
      $scope.form={};
      $scope.showbtn=false;



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

      $scope.handleLink = function (pgname) {
        $rootScope.handleLink(pgname);
      };

      $scope.initializeMonthPicker = function (element, initialYear) {
        $(element).datepicker({
          format: 'mm/yyyy',
          minViewMode: 'months',
          autoclose: true,
          startDate: new Date(initialYear, 0, 1),
          endDate: new Date(initialYear, 11, 31)
        }).on('changeDate', function (e) {
          // Update the AngularJS model with the selected month and year
          $scope.$apply(function () {
            $scope.form.month = e.format();
          });
        });
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
          return "Invalid month number";
        }
      };

      $scope.generate = function (f) { 

        if($scope.generatePension.$valid) { 
          $(".generateload").show();
          var currentDate = new Date();
          var currentMonth = currentDate.getMonth() + 1;
          var currentYear = currentDate.getFullYear();
          var currdate = '01-' + currentMonth + '-' + currentYear;
          
          var generationdate = '01-' + (parseInt(f.month)) + '-' + parseInt(f.year); // Corrected syntax
          
          if (new Date(generationdate) <= new Date(currdate)) {
      // $http.post(path+"/api/v1/pension-details/insert?pensionYear="+f.year+"&pensionMonth="+f.month,{
      //   headers: {
      //     'Authorization': 'Bearer ' + sessionStorage.token
      //   }
      // })
      $http.post(path+"/api/v1/pension-details/insert?pensionYear="+f.year+"&pensionMonth="+f.month,{}, {
        headers: {
          'Authorization': 'Bearer ' + sessionStorage.token
        }
      })
      
    //   var req = {
    //     method: 'POST',
    //     url: path+"/api/v1/pension-details/insert?pensionYear="+f.year+"&pensionMonth="+f.month,
    //     headers: {
    //       'Authorization': "Bearer " + sessionStorage.token,
    //     }
    //   };
      
    //  $http(req)
     .then(function successCallback(response) {
           $scope.flag=false;
           if (response.data[1].split('!')[0] === 'Procedure executed successfully') {
            toastr.success(response.data[1].split('!')[1],'Pension Generated for ');
            $scope.showbtn=true;
            // $scope.getAllPensioner(f);
            } else if(response.data[1].split('!')[0] ===  'Error:') {
            toastr.error('An error occurred while generating pension data.', 'Error');

            }
        $scope.formSubmitted = true;
        $(".generateload").hide();
        } 
      ,function errorCallback(response) {
            toastr.error('An error occurred while pension generation.', 'Error');
            // $scope.getAllPensioner(f);
            $(".generateload").hide();
        }    
      );
          }
          else{
            alert("Future month pension generation is not allowed. Please select a valid month !!")
          }
        
    }else{
          alert("Fill All the compulsory field!!")
        }
    };


function exportTableToExcel() {
          const table = document.querySelector(".table.table-striped"); 
          if (table) {
              const ws = XLSX.utils.table_to_sheet(table);
              const wb = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
              XLSX.writeFile(wb, "patDetails.xlsx");
          }
      }
      const exportButton = document.getElementById("exportToExcel");
      if (exportButton) {
          exportButton.addEventListener("click", exportTableToExcel);
      }



      $scope.getAllPensioner = function (f) {     
        $scope.yrmon=f; 
        $http.get(path+"/api/v1/pensioner-details/searchByMonYr?pensionMonth="+f.month+"&pensionYear="+f.year,{},{
          
          headers: {
            
            'Authorization': 'Bearer ' + sessionStorage.token
          }
        })
          .then(function (res) {
            $scope.pensionersData=res.data;
            //  console.log("All pensioner_detial  data",$scope.pensionersData)
          },
            function (error) {
              // console.log("error has occured pensiondetial data")
              toastr["error"]("Something went wrong!!",error);
            }
          );
      };
      $scope.allPensionersData={};
      $scope.getAllPensionerData = function () {      
        $http.get(path+"/api/v1/pensioners/pensionersId",{
          
          headers: {
            
            'Authorization': 'Bearer ' + sessionStorage.token
          }
        })
          .then(function (response) {
            $scope.allPensionersData=response.data.pensionerIds;
            //  console.log("All pensioner_detial  data",$scope.allPensionersData)
          },
            function (error) {
              // console.log("error has occured pensiondetial data")
              toastr["error"]("Something went wrong!!",error);
            }
          );
      };
      // $scope.getAllPensionerData();
      $scope.allPensionersIDs={};
      $scope.getAllPensionerIDs = function (val) {  
        if(val.year!=undefined && val.month!=undefined){
          $(".fetchIdloader").show();
          $http.get(path+"/api/v1/pensioners/individual-pension/pensionersId?pensionMonth="+val.month+"&pensionYear="+val.year,{
            headers: {
              'Authorization': 'Bearer ' + sessionStorage.token
            }
          })
            .then(function (response) {

              if(response.status==200){
                $scope.allPensionersIDs=angular.copy(response.data);
                $(".fetchIdloader").hide();
                setTimeout(function () {
                  $('.dropdd').selectpicker();
                },150);
              }
              else{
                toastr["error"]("Something went wrong!!");
                $(".fetchIdloader").hide();
              }
              
            },
              function (error) {
                $(".fetchIdloader").hide();
                if(error.data=='Expired token'){
                 $rootScope.logout();
                }
                if(error.status==-1){
                  alert('Server Unreacheable !!');
                 }
                 else{
                // console.log("error has occured pensiondetial data")
                toastr["error"]("Something went wrong!!",error);
                 }
                
              }
            );
        }    
        else{
          alert("select year and month")
        }
        
      };
      // $scope.getAllPensionerIDs();
      $scope.form12={};
      $scope.filldata = function (f) { 
        if(f!==undefined){
        for(let i=0;i<$scope.allPensionersIDs.length;i++){
          if($scope.allPensionersIDs[i].pensioner_id===f){
            $scope.form12=$scope.allPensionersIDs[i];
          }
        }
      }else{
        $scope.form12={};
      }
      };


      
$scope.fetchMaster = function () {

  var req = {
    method: 'GET',
    headers: {
      'Authorization': "Bearer " + sessionStorage.token,
      'Content-Type': 'application/json'
    },
    url: path+'/api/v1/dropdown/list',
  };
  
 $http(req).then(function(masterdata_res){

     if (masterdata_res) {
        $scope.religion=masterdata_res.data.religion;
        $scope.collegeTypes=masterdata_res.data.collegeTypes;
        $scope.subjects=masterdata_res.data.subject;
        $scope.relationship=masterdata_res.data.relationship;
        $scope.pensionerType=masterdata_res.data.pensionerType;
        $scope.pensionerGrade=masterdata_res.data.pensionerGrade;
        $scope.pensionerDesignation=masterdata_res.data.pensionerDesignation;
        $scope.pensionerStatusData=masterdata_res.data.pensionerStatus;
        $scope.universities=masterdata_res.data.universities;
        // $scope.form.universityCode=$scope.universities[0].universityCode;
        $scope.colleges=masterdata_res.data.colleges;
        $scope.departments=masterdata_res.data.departments;
        $scope.masterdata=masterdata_res.data.masterDetails;
        $scope.payCommisionData=masterdata_res.data.payCommisions;
        $scope.banklist=masterdata_res.data.bank;

      
     }

     else {
    }

     },
     function (err) {
            
               
     });

};
$scope.fetchMaster();


      $scope.pensionersDataById={};

$scope.generatePensionById = function (f) { 
       
  if($scope.generatePension.$valid) { 
    var currentDate = new Date();
    var currentMonth = currentDate.getMonth() + 1;
    var currentYear = currentDate.getFullYear();
    var currdate = '01-' + currentMonth + '-' + currentYear;
    
    var generationdate = '01-' + (parseInt(f.month)) + '-' + parseInt(f.year); // Corrected syntax
    
    if (new Date(generationdate) <= new Date(currdate)) {
$http.post(path+"/api/v1/pension-details/insertIndividual?pensionYear="+f.year+"&pensionMonth="+f.month+"&pensionerId="+f.pensionerId,{},{
	
	headers: {
	  
	  'Authorization': 'Bearer ' + sessionStorage.token
	}
})
  .then(function successCallback(response) {
     $scope.flag=false;
     if (response.data[1].split('!')[0] === 'Insert data individual executed successfully') {
      $scope.form12={};
      toastr.success('Generated!!', 'Success');
      $scope.getAllPensionerById(f);
      } else if(response.data[1].split('!')[0] === 'Individual pension details already exist for the specified parameters.') {
        toastr.error('Pension for this individual has already been processed for the current month and year.', 'Error');
        }
       else if(response.data[1].split('!')[0] ===  'Error:') {
      toastr.error('An error occurred while saving data.', 'Error');
      }
  $scope.formSubmitted = true;
  } 
,function errorCallback(response) {
      toastr.error('An error occurred while pension generation.', 'Error');
      // $scope.getAllPensioner(f);
  }    
);
}
else{
  alert("Future month pension generation is not allowed. Please select a valid month !!")
}
}else{
    alert("Fill All the compulsory field!!")
  }
};



$scope.getAllPensionerById = function (f) {

  if(!(f.month === undefined || f.year === undefined )){
  var params = {};
  params.pensionMonth=f.month;
  params.pensionYear=f.year;
  params.status='U';
  params.id= f.pensionerId;
  var req = {
    method: 'GET',
    headers: {
      'Authorization': "Bearer " + sessionStorage.token,
      'Content-Type': 'application/json'
    },
    url: path+"/api/v1/pensioner-details/searchByMonYrStatus",params: params
  }; 

 $http(req).then(function(response){

     if (response.status===200) {

      $scope.form={};
      setTimeout(function () {
        $('.dropdd').selectpicker('refresh');
      },150);

      $scope.pensionersDataById=response.data.content;
     }

     else {
       
    }

     },
     function (err) {
            
               
     });
    } 
    else{
      alert("Please select month and year.");
    }

};

$scope.flushMonth=function(){
  $scope.form.month=undefined;
}

  });
