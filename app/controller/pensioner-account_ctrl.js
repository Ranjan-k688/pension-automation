 
    app.controller('accounts', function ($scope, $http, $timeout, $window, $rootScope, $filter)
      {
        $scope.flag=false;
        $scope.payData=[];
       

        
        $scope.saveacoount = function (f) { 
          $scope.acoount.$submitted = true; 
          if($scope.acoount.$valid) { 
        $http.post(path+"/api/v1/pensioners/pensionerAccount/",f,{
          
          headers: {
            
            'Authorization': 'Bearer ' + sessionStorage.token
          }
        })
          .then(function successCallback(response) {
            $scope.payData=response.data;
            $scope.paydetialData.push($scope.payData);
            $scope.payDataById($scope.payData.pensionerId);
             console.log("Post Data ",$scope.payData);
             $scope.flag=false;
         
             if (response.status === 200) {
              $('#editpensioner').modal('hide');
              toastr.success('Data saved successfully!', 'Success');
              $scope.form.accountEffectiveFrom="";
              $scope.form.accountNo="";
              $scope.form.ifscCode="";
              $scope.form.branchName="";
              $scope.form.branchCity="";
              $scope.form.state="";
              $scope.form.remarks="";
              // $scope.form={};
              } else {
              toastr.error('An error occurred while saving data.', 'Error');
              $('#editpensioner').modal('hide');
              }
          $scope.formSubmitted = true;
          } 
        ,function errorCallback(error) {
              console.log("Saving of data failed ",error);
              $('#editpensioner').modal('hide');
          }    
        );
      }else{
        toastr.error('User, Please fill out all mandatory fields!!', 'Error');
        $('#editpensioner').modal('hide');
          }
      };


      $scope.updateAccount = function (f) { 
        $scope.acoount.$submitted = true; 
        if($scope.acoount.$valid) { 
      $http.put(path+"/api/v1/pensioners/pensionerAccount/",f,{
        
        headers: {
          
          'Authorization': 'Bearer ' + sessionStorage.token
        }
      })
        .then(function successCallback(response) {
          $scope.payData=response.data;
          $scope.paydetialData.push($scope.payData);
          $scope.payDataById($scope.payData.pensionerId);
           console.log("Post Data ",$scope.payData);
           $scope.flag=false;
       
           if (response.status === 200) {
            $('#editpensioner').modal('hide');
            toastr.success('Data saved successfully!', 'Success');
            $scope.form.accountEffectiveFrom="";
            $scope.form.accountNo="";
            $scope.form.ifscCode="";
            $scope.form.branchName="";
            $scope.form.branchCity="";
            $scope.form.state="";
            $scope.form.remarks="";
            // $scope.form={};
            } else {
            toastr.error('An error occurred while saving data.', 'Error');
            }
        $scope.formSubmitted = true;
        } 
      ,function errorCallback(error) {
            console.log("Saving of data failed ",error);
            $('#editpensioner').modal('hide');
        }    
      );
    }else{
      toastr.error('User, Please fill out all mandatory fields!!', 'Error');
        }
    };

   
      $scope.deleteDataModel = {};
      $scope.setDeleteData = function (data) {
        $scope.deleteDataModel = angular.copy(data);      
    };


      $scope.DeleteData = function (pensionerId,bankCode,index) {  
     console.log("pensionerId pensionerId",pensionerId,bankCode);
        $http.delete(path+`/api/v1/pensioners/pensionerAccount/${pensionerId}/${bankCode}`,{
          
          headers: {
            
            'Authorization': 'Bearer ' + sessionStorage.token
          }
        })
          .then(function (response) {
            $('#deleteModal').modal('hide')
            $scope.paydetialData.splice(index, 1); 
            if (response.status == '204') {
                toastr.success('Data Deleted successfully!', 'Success');
               
               }
          },
            function (error) {
              console.log("erroe has occured allhandicaped data",error);
              $('#deleteModal').modal('hide');
              toastr.error('Data Not Deleted !');
            }
          );
      };

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
           $scope.paydetialData=response.data.pensionerAccounts;
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
            $scope.form.status=$scope.payData.status;
             $(".loaderbg").hide();
    
          },
            function (error) {
              console.log("erroe has occured allhandicaped data",error);
              $(".loaderbg").hide();
            }
          );
      };


      $scope.getBankName = function (bankCode) {
        for (let index = 0; index < $scope.banks.length; index++) {
          const element = $scope.banks[index];
          if (element.bankCode === bankCode) {
            return element.bankName;
          }

        }
      };



      $scope.dropData=[];
      $scope.allDropdata = function () {   
        $http.get(path+`/api/v1/dropdown/list`,{
          
          headers: {
            
            'Authorization': 'Bearer ' + sessionStorage.token
          }
        })
          .then(function (response) {           
            $scope.clgs=response.data.colleges;
            $scope.depts=response.data.departments;
            $scope.banks=response.data.bank;
            $scope.pensionerStatusData=response.data.pensionerStatus;
            $scope.payCommisionData=response.data.payCommisions; 
          },
            function (error) {
              console.log("erroe has occured dropData data",error);
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




      $scope.editData = function (e) { 
        $scope.flag=true;     
        $scope.form = {
        pensionerId: e.pensionerId,
        bankCode: e.bankCode,
        accountEffectiveFrom: e.accountEffectiveFrom,
        accountEffectiveTo: e.accountEffectiveTo,
        accountNo: e.accountNo,
        ifscCode: e.ifscCode,
        branchName:e.branchName,
        branchCity: e.branchCity,
        state: e.state,
        remarks: e.remarks
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



        $scope.cls=function(){ 
          $scope.flag=false;
           $scope.form.accountEffectiveFrom= "";
          $scope.form.branchCity= "";
          $scope.form.accountNo= "";
          $scope.form.ifscCode= "";
          $scope.form.branchName= "";
           $scope.form.bankName= "";
           $scope.form.bankCode= '';
           $scope.form.state= '';
           $scope.form.remarks= '';  
        };

        $scope.chkDate = function (p1, d1) {
          $scope.date1 = new Date(d1);
        
          var dateComponents1 = d1.split('-');
          var selectedDate = new Date(dateComponents1[2], dateComponents1[1] - 1, dateComponents1[0]);
          var selectedMonth = selectedDate.getMonth() + 1;
          var selectedYear = selectedDate.getFullYear();
        
          var req = {
            method: 'GET',
            url: path + '/api/v1/pensioners/pensionerAccount',
              headers: {
                
                'Authorization': 'Bearer ' + sessionStorage.token
              }
          };
        
          $http(req).then(function (res) {
            $scope.pay = res.data;
            console.log("pay", $scope.pay);
        
            if (res.status == 200) {
              for (var i = 0; i < res.data.length; i++) {
                if (p1 == res.data[i].pensionerId) {
                  var e = res.data[i].accountEffectiveFrom;
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

    });
