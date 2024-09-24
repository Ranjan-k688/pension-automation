   app.controller('pacommnRate', function ($scope, $http, $timeout, $window, $rootScope, $filter)
      {
        $scope.flag=false;
        $scope.PayCommisionData=[];
        $scope.allCommnrate=[];
        $scope.savePayCommnRate = function (form) {
          $scope.payCommon.$submitted = true;  
          if($scope.payCommon.$valid) { 
          $http.post(path+"/api/v1/pension/paycommnrate",form,{         
          headers: {           
            'Authorization': 'Bearer ' + sessionStorage.token
          }
        })
          .then(function successCallback(response) {
            $scope.PayCommisionData=response.data;
            $scope.allCommnrate=[];
             $scope.allCommnrate.push($scope.PayCommisionData);
             console.log("Post Data ",$scope.PayCommisionData);
             $scope.formSubmitted = true;
             $scope.flag=false;
             if (response.status === 200) {
              $scope.pcode=false;
              toastr.success('Data saved successfully!', 'Success');
              $scope.form={};
              } else {
              toastr.error('An error occurred while saving data.', 'Error');
              } 
          $scope.formSubmitted = true;
          } 

        ,function errorCallback(response) {
              console.log("Saving of data failed ");
          }    
        );
          }else{
            toastr.error("User, Please fill out all mandatory fields!!")
          }
      };

      
     
      $scope.getServicedata = function(payCommissionCode) {
        $(".loaderbg").show();  
        var pen = payCommissionCode;
        $scope.allCommnrate = [];
        for (var a = 0; a < $scope.payrate.length; a++) {
          if ($scope.payrate[a].payCommissionCode == pen) {
            $scope.allCommnrate.push($scope.payrate[a]);
            $(".loaderbg").hide();  
          }
        }
        console.log("all allCommnrate", $scope.allCommnrate);
      };


      $scope.getPayCode = function (payCommissionCode) {
        for (let index = 0; index < $scope.payCommisionData.length; index++) {
          const element = $scope.payCommisionData[index];
          if (element.payCommissionCode === payCommissionCode) {
            return element.dscr;
          }
        }
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
            console.log("dropData data",response.data); 
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


      $scope.allPayCommonrate = function () {   
        $http.get(path+`/api/v1/pension/paycommnrate`,{
          
          headers: {
            
            'Authorization': 'Bearer ' + sessionStorage.token
          }
        })
          .then(function (response) {           
            $scope.allCommnrate=response.data;
            $scope.payrate=$scope.allCommnrate;
            console.log("all PayCommonrate data",response.data);  
          },
            function (error) {
              console.log("erroe has occured all PayCommonrate data",error)
            }
          );
      };
      $scope.allPayCommonrate();


      $scope.checkDuplicate = function (val1) {
        var req = {
          method: 'GET',
          url: path+'/api/v1/pension/paycommnrate' ,
            headers: {
              
              'Authorization': 'Bearer ' + sessionStorage.token
            }         
        };         
        $http(req).then(function(res){   
          console.log("res data", res);

          if (res.status == 200) {
            $scope.pcode = false; // Reset the flag before checking duplicates
            for (var i = 0; i < res.data.length; i++) {
              if (val1 == res.data[i].payCommissionCode) {
                $scope.pcode = true;
                // toastr["error"]("Pay Commission Code already exists!!");
                break; // Exit the loop once a match is found
              }
            }            
          } else {
            alert("Something went wrong!!");
          }
        });
      };


            //data set for delete model
            $scope.deleteDataModel = {};
            $scope.setDeleteData = function (data) {
              $scope.deleteDataModel = angular.copy(data);      
          };

      $scope.DeleteData = function (payCommissionCode,dateFrom,index) {      
        $http.delete(path+`/api/v1/pension/paycommnrate/${payCommissionCode}/${dateFrom}`,{
          
          headers: {
            
            'Authorization': 'Bearer ' + sessionStorage.token
          }
        })
          .then(function (response) {
             if (response.status == '204') {
              // $scope.paydetialData.splice(index, 1); 
              location.reload();
                toastr.success('Data Deleted successfully!', 'Success');
                $('#deleteModal').modal('hide');
               }
          },
            function (error) {
              console.log("erroe has occured allhandicaped data",error);
              toastr.error('Data Not Deleted !');
              $('#deleteModal').modal('hide');
            }
          );
      };

      $scope.editData=function(n){
        $scope.flag=true;
        $scope.form ={
          payCommissionCode:n.payCommissionCode,
          dateFrom:n.dateFrom,
          dateTo:n.dateTo,
          ratePerc:n.ratePerc
        }
      };


      function exportTableToExcel() {
            const table = document.querySelector(".table.table-striped"); 
            if (table) {
                const ws = XLSX.utils.table_to_sheet(table);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
                XLSX.writeFile(wb, "paycommisionRate.xlsx");
            }
        }
        const exportButton = document.getElementById("exportToExcel");
        if (exportButton) {
            exportButton.addEventListener("click", exportTableToExcel);
        }

    });
