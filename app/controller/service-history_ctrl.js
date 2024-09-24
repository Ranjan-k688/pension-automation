
app.controller('serviceHistorys', function ($scope, $http)
 {


   $scope.flag=false;  
   $scope.serviceData=[];        
   $scope.saveServiceHistory = function (f) {
    $scope.serviceF.$submitted = true; 
     if($scope.serviceF.$valid) {
   $http.post(path+"/api/v1/pension/servicehistory",f,{
    
    headers: {
      
      'Authorization': 'Bearer ' + sessionStorage.token
    }
  })
     .then(function successCallback(response) { 
      $scope.paydetialData=[]; 
      $scope.paydetialData.push(response.data);
        $scope.serviceData=response.data;
        $scope.payDataById1(response.data.pensionerId);
        console.log("Post Data ",$scope.serviceData);
         $scope.flag=false;
         $scope.formSubmitted = true;      
         $scope.form.dateOfAppointment="";
        $scope.form.dateOfSeparation="";
        if (response.status === 200) {
          $('#editpensioner').modal('hide');
         toastr.success('Data saved successfully!', 'Success');
         $scope.allDropdata();
         } else {
         toastr.error('An error occurred while saving data.', 'Error');
         }
     } 
     
   ,function errorCallback(error) {
         console.log("Saving of data failed ",error);
     }    
   );
      }else{
        toastr.error("User, Please fill out all mandatory fields!!")
      }
 };




 $scope.paydetialData=[];
 $scope.payDataById1 = function (pensionerId) {    
   $http.get(path+`/api/v1/pension/servicehistory/${pensionerId}`,{
    
    headers: {
      
      'Authorization': 'Bearer ' + sessionStorage.token
    }
  })
     .then(function (response) {
       $scope.paydetialData=response.data;
       $scope.paydetialData= $scope.paydetialData.slice().sort(function (a, b) {
                return a - b;
      });

            }
          );
      };



$scope.paydetialData = [];
$scope.getServicedata = function(pensionerId) {
  var pen = pensionerId;
  $scope.paydetialData = [];
  for (var a = 0; a < $scope.serviceHistoryData.length; a++) {
    if ($scope.serviceHistoryData[a].pensionerId == pen) {
      $scope.paydetialData.push($scope.serviceHistoryData[a]);
    }
  }
  // console.log("$scope.all", $scope.paydetialData);
};

      //data set for delete model
      $scope.deleteDataModel = {};
      $scope.setDeleteData = function (data) {
        $scope.deleteDataModel = angular.copy(data);      
    };

 $scope.DeleteData = function (pensionerId,dateOfAppointment,index) {      
   $http.delete(path+`/api/v1/pension/servicehistory/${pensionerId}/${dateOfAppointment}`,{
    
    headers: {
      
      'Authorization': 'Bearer ' + sessionStorage.token
    }
  })
     .then(function (response) {
      $('#deleteModal').modal('hide');
       console.log("data Delete")
       if (response.status == '204') {
        $scope.paydetialData.splice(index, 1); 
           toastr.success('Data Deleted successfully!', 'Success');
          }
     },
       function (error) {
         console.log("erroe has occured allhandicaped data",error);
         toastr.success('Data Not Deleted !');
         $('#deleteModal').modal('hide');
       }
     );
 };

 
 $scope.editData = function (e) { 
 $scope.flag=true;  
 $scope.form = {      
 pensionerId: e.pensionerId,
 dateOfAppointment: e.dateOfAppointment,
 dateOfSeparation: e.dateOfSeparation,
};

};


$scope.getAllPensioner = function () { 
  $(".loaderbg").show();      
  $http.get(path+"/api/v1/pensioners/pensionersId?verifiedId=true",{
    
    headers: {
      
      'Authorization': 'Bearer ' + sessionStorage.token
    }
  })
    .then(function (response) {
      if(response){
        $scope.allPensionersData=response.data;
        setTimeout(function () {
          $('.dropdd').selectpicker();
        },150);
        $(".loaderbg").hide(); 
      }
    },
      function (error) {
        if(error.data=="Expired token"){
          if(error.data=="Expired token"){
              $rootScope.logout();
          }
      }else{
          alert("Error by server!!");  
          console.log("error has occured pensiondetial data",error); 
      }
      $(".loaderbg").hide();
      }
    );
};
$scope.getAllPensioner();

  $scope.dropData=[];
  $scope.allDropdata = function () {   
    $(".loaderbg").show(); 
    $http.get(path+`/api/v1/dropdown/list`,{
      
      headers: {
        
        'Authorization': 'Bearer ' + sessionStorage.token
      }
    })
      .then(function (response) {           
        $scope.clgs=response.data.colleges;
        $scope.depts=response.data.departments;
        $scope.service=response.data.serviceHistories;
         $scope.pensionerStatusData=response.data.pensionerStatus;
         $scope.payCommisionData=response.data.payCommisions;
         $scope.serviceHistoryData=response.data.serviceHistories;
        // console.log("dropData data",response.data); 
        $(".loaderbg").hide();  
      },
        function (error) {
          console.log("erroe has occured dropData data",error);
          $(".loaderbg").hide(); 
        }
      );
  };
  $scope.allDropdata();



  $scope.payData=[];
      $scope.paydetialData=[];
      $scope.payDataById = function (pensionerId) {  
        $(".loaderbg").show();  
        $http.get(path+`/api/v1/pensioners/${pensionerId}`,{
          
          headers: {
            
            'Authorization': 'Bearer ' + sessionStorage.token
          }
        })
          .then(function (response) {
            $scope.payData=response.data; 
            // console.log("pensioner",$scope.payData);              
                $scope.form.aadhaar=$scope.payData.aadhaar;
                $scope.form.employeeName=$scope.payData.employeeName;
                $scope.form.payCommissionCode=$scope.payData.payCommissionCode;
                $scope.form.ppoNo=$scope.payData.ppoNo;
                if($scope.payData.pan==null){
                  $scope.form.pan="No Record";
                }else{
                  $scope.form.pan=$scope.payData.pan;
                }          
                $scope.form.pensionerStatusCode=$scope.payData.pensionerStatusCode;
                $scope.form.departmentCode=$scope.payData.departmentCode;
                $scope.form.collegeCode=$scope.payData.collegeCode;
                $(".loaderbg").hide();  
                  
            if (response.status == '204') {
                toastr.success('Data Deleted successfully!', 'Success');
                $(".loaderbg").hide(); 
               }
          },
            function (error) {
              console.log("erroe has occured allhandicaped data",error);
              $(".loaderbg").hide(); 
            }
          );
      };

      //for download
      function exportTableToExcel() {
        const table = document.querySelector(".table.table-striped"); 
        if (table) {
            const ws = XLSX.utils.table_to_sheet(table);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
            XLSX.writeFile(wb, "Service.xlsx");
        }
    }
    const exportButton = document.getElementById("exportToExcel");
    if (exportButton) {
        exportButton.addEventListener("click", exportTableToExcel);
    };


    $scope.cls=function(){ 
      $scope.flag=false;
      $scope.form.dateOfAppointment= "";
      $scope.form.dateOfSeparation= ""; 
    };


    $scope.checkDuplicate = function (pensionerId, d1) {
      $scope.date1 = new Date(d1);     
      var dateComponents1 = d1.split('-');
      var selectedDate = new Date(dateComponents1[2], dateComponents1[1] - 1, dateComponents1[0]);     
      var req = {
        method: 'GET',
        url: path + `/api/v1/pensioners/${pensionerId}`,
        headers: {
          
          'Authorization': 'Bearer ' + sessionStorage.token
        }
      };      
      $http(req).then(function (res) {
        $scope.pay = res.data;
            if (pensionerId ==  $scope.pay.pensionerId) {
              var e = $scope.pay.dateOfBirth;
              $scope.date2 = new Date(e);
              var dateComponents = e.split('-');
              var existingDate = new Date(dateComponents[2], dateComponents[1] - 1, dateComponents[0]);
             
              if (selectedDate <= existingDate) {
                $scope.pcode = true;
              } else {
                $scope.pcode = false;
              }
            }                      
      });
    };

 
});