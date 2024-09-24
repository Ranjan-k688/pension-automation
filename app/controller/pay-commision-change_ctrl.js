 
    app.controller('payCommisionChanges', function ($scope, $http, $timeout, $window, $rootScope, $filter)
    {
      $scope.flag=false;
      $scope.payCommisionData=[];
      $scope.paydetail = {};
      

      $scope.g={};
      $scope.savePayCommision = function (f) { 
        $scope.g={
          pensionerId:f.pensionerId,
          dateFrom:formatDate(f.dateFrom),
          effectiveDate:formatDate(f.effectiveDate),
          payCommissionCode:f.payCommissionCode,
          remarks:f.remarks

        }      
        $scope.paycommision.$submitted = true; 
        if($scope.paycommision.$valid) { 
         $http.post(path+"/api/v1/pension/paycommisionchange",$scope.g,{
          
          headers: {
            
            'Authorization': 'Bearer ' + sessionStorage.token
          }
        })
        .then(function successCallback(response) {
          $scope.payCommisionData=response.data;
          $scope.getpayData(response.data.pensionerId) 
           $scope.flag=false;
           if (response.status === 200) {
            $('#editpensioner').modal('hide'); 
            toastr.success('Data saved successfully!', 'Success');
            $scope.form.dateFrom="";
            $scope.form.effectiveDate="";
            $scope.form.remarks="";
            } else {
            toastr.error('An error occurred while saving data.', 'Error');
            }
        $scope.formSubmitted = true;
        } 
        ,function errorCallback(error) {
              console.log("Saving of data failed ",error);
          }    
          );
        }else{
          toastr.error("User, Please fill out all mandatory fields!!")
            }
        };

 // Function to format date to day-month-year
        function formatDate(date) {
          var dateObj = new Date(date);
          var day = ('0' + dateObj.getDate()).slice(-2);  
          var month = ('0' + (dateObj.getMonth() + 1)).slice(-2); 
          var year = dateObj.getFullYear();

          return day + '-' + month + '-' + year;
        }


   
            //data set for delete model
            $scope.deleteDataModel = {};
            $scope.setDeleteData = function (data) {
              $scope.deleteDataModel = angular.copy(data);   
              console.log("deleteDataModel",$scope.deleteDataModel);
                 
          };

        $scope.DeleteData = function (pensionerId,payCommissionCode,dateFrom,index) {  
        var  dateFrom =  formatDate(dateFrom);
          $http.delete(path+`/api/v1/pension/paycommisionchange/${pensionerId}/${payCommissionCode}/${dateFrom}`,{           
            headers: {
              
              'Authorization': 'Bearer ' + sessionStorage.token
            }
          })
            .then(function (response) {
              $('#deleteModal').modal('hide');
              if (response.status == '200') {
              $scope.getpayData(pensionerId)   
              $('#deleteModal').modal('hide');
                  toastr.success('Data Deleted successfully!', 'Success');
                }
            },
              function (error) {
                console.log("erroe has occured AllpayCommision data",error)
                toastr.error('Data Not Deleted !');
                $('#deleteModal').modal('hide');
              }
            );
        };


        $scope.getpayData = function (pensionerId) {    
          $http.get(path+`/api/v1/pension/paycommisionchange/${pensionerId}`,{
            
            headers: {
              
              'Authorization': 'Bearer ' + sessionStorage.token
            }
          })
            .then(function (response) {
              $scope.AllpayCommision=response.data;
              console.log("$scope.AllpayCommision",$scope.AllpayCommision);
              
              }
            );
        };

        

    $scope.payData=[];
    $scope.paydetialData=[];
    $scope.payDataById = function (pensionerId) { 
      $(".loaderbg").show();    
      $http.get(path+`/api/v1/pension/paycommisionchange/${pensionerId}`,{
        
        headers: {
          
          'Authorization': 'Bearer ' + sessionStorage.token
        }
      })
        .then(function (response) {
          $(".loaderbg").hide();
          $scope.payData=response.data;
          $scope.AllpayCommision=response.data;
          // console.log("hhhhhhhh",$scope.AllpayCommision);
          console.log("$scope.payData",$scope.payData);
          $scope.paydetialData=response.data[0].payDetails;
          $scope.aadhaar=response.data[0].aadhaar;
          $scope.employeeName=response.data[0].employee_name;
          $scope.ppoNo=response.data[0].ppoNo;
          $scope.pan=response.data[0].pan;
          if(response.data[0].pan==null){
            $scope.pan="No Record";
          }else{
            $scope.pan=response.data[0].pan;
          }
          $scope.pensionerStatusCode=response.data[0].pensionerStatusCode;
          $scope.departmentCode=response.data[0].department;
          $scope.collegeCode=response.data[0].college;
          $scope.previousPayCommCode=response.data[0].pay_commission_code;
          $(".loaderbg").hide();
        },
          function (error) {
            console.log("erroe has occured allhandicaped data",error);
            $(".loaderbg").hide();
          }
        );
    };


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
          $scope.pensionerStatusData=response.data.pensionerStatus;
          $scope.payCommisionData=response.data.payCommisions;
           console.log("dropData data",$scope.payCommisionData); 
          $(".loaderbg").hide();   
        },
          function (error) {
            console.log("erroe has occured dropData data",error);
            $(".loaderbg").hide();  
            if(error.data=="Expired token"){
              if(error.data=="Expired token"){
                  $rootScope.logout();
              }
          }else{
              alert("Error by server!!");  
          }
          }
        );
    };
    $scope.allDropdata();

    $scope.payDataById2 = function (pensionerId) {    
      $http.get(path+`/api/v1/pension/paycommisionchange/${pensionerId}`,{
        
        headers: {
          
          'Authorization': 'Bearer ' + sessionStorage.token
        }
      })
        .then(function (response) {
          $scope.AllpayCommision=[];
          $scope.AllpayCommision=response.data;
          console.log("$scope.AllpayCommision",$scope.AllpayCommision);
          
          }
        );
    };


    $scope.payDataById1 = function (pensionerId) {    
      $http.get(path+`/api/v1/pension/paycommisionchange/${pensionerId}`,{
        
        headers: {
          
          'Authorization': 'Bearer ' + sessionStorage.token
        }
      })
        .then(function (response) {
          $scope.AllpayCommision=response.data;
          console.log("$scope.AllpayCommision",$scope.AllpayCommision);
          
          }
        );
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


    $scope.AllpayCommision=[];
    $scope.getAllPayChangedata = function () {      
      $http.get(path+"/api/v1/pension/paycommisionchange",{
        
        headers: {
          
          'Authorization': 'Bearer ' + sessionStorage.token
        }
      })
        .then(function (response) {
          $scope.AllpayCommisionData=response.data;
          //  console.log("All pay commsion change  data",$scope.AllpayCommisionData)
        },
          function (error) {
            console.log("error has occured pay commsion change ",error)
          }
        );
    };
    $scope.getAllPayChangedata ();


  

    $scope.editData = function (e) { 
    $scope.flag=true;     
     $scope.form = {
     pensionerId: e.pensioner_id,
     payCommissionCode: e.pay_commission_code,
     dateFrom: e.date_from,
     effectiveDate: e.effective_date,
     remarks: e.remarks,
   };
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


      $scope.cls=function(){ 
        $scope.flag=false;
        $scope.form.employeeName= "";
        $scope.form.aadhaar= "";
        $scope.form.pan= "";
        $scope.form.pensionerStatusCode= "";
        $scope.form.collegeCode= "";
        $scope.form.departmentCode= "";
         $scope.form.payCommissionCode= "";
        $scope.form.dateFrom= "";
        $scope.form.effectiveDate= "";
        $scope.form.remarks= "";

      }


      $scope.chkDate = function (p1, d1) {
        $scope.date1 = new Date(d1);
      
        var dateComponents1 = d1.split('-');
        var selectedDate = new Date(dateComponents1[2], dateComponents1[1] - 1, dateComponents1[0]);
        var selectedMonth = selectedDate.getMonth() + 1;
        var selectedYear = selectedDate.getFullYear();
      
        var req = {
          method: 'GET',
          url: path + '/api/v1/pension/agevsbasic',
            headers: {
              
              'Authorization': 'Bearer ' + sessionStorage.token
            }
        };
      
        $http(req).then(function (res) {
          $scope.pay = res.data;
          console.log("pay", $scope.pay);
      
          if (res.status == 200) {
            for (var i = 0; i < res.data.length; i++) {
              if ((p1 == res.data[i].minAgeInYears) && (res.data[i].dateTo == null)) {
                var e = res.data[i].dateFrom;
                $scope.date2 = new Date(e);
                var dateComponents = e.split('-');
                var existingDate = new Date(dateComponents[2], dateComponents[1] - 1, dateComponents[0]);             
                var existMonth = existingDate.getMonth() + 1;
                var existYear = existingDate.getFullYear();             
                if (selectedDate <= existingDate) {
                  $scope.pcode = true;
                } else if (selectedMonth == existMonth && selectedYear == existYear) {
                  $scope.pcode = true;
                } else {
                  $scope.pcode = false;
                }
              }
            }
          }
        });
      };



      $scope.checkDuplicate = function (pensionerId, d1) {
        $scope.date1 = new Date(d1);     
        var dateComponents1 = d1.split('-');
        var selectedDate = new Date(dateComponents1[2], dateComponents1[1] - 1, dateComponents1[0]);     
        var req = {
          method: 'GET',
          url: path + `/api/v1/pensioners/${pensionerId}` ,
          headers: {
            
            'Authorization': 'Bearer ' + sessionStorage.token
          }
        };      
        $http(req).then(function (res) {
          $scope.pay = res.data;
          // console.log("payyy", $scope.pay);     
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

      $scope.checkDuplicate1 = function (pensionerId, d1) {
        $scope.date1 = new Date(d1);     
        var dateComponents1 = d1.split('-');
        var selectedDate = new Date(dateComponents1[2], dateComponents1[1] - 1, dateComponents1[0]);     
        var req = {
          method: 'GET',
          url: path + `/api/v1/pensioners/${pensionerId}` ,
          headers: {
            
            'Authorization': 'Bearer ' + sessionStorage.token
          }
        };      
        $http(req).then(function (res) {
          $scope.pay = res.data;
          // console.log("payyy", $scope.pay);     
              if (pensionerId ==  $scope.pay.pensionerId) {
                var e = $scope.pay.dateOfBirth;
                $scope.date2 = new Date(e);
                var dateComponents = e.split('-');
                var existingDate = new Date(dateComponents[2], dateComponents[1] - 1, dateComponents[0]);
               
                if (selectedDate <= existingDate) {
                  $scope.pcode1 = true;
                } else {
                  $scope.pcode1 = false;
                }
              }                      
        });
      };


  });
