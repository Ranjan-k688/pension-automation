
     app.controller('payCommision', function ($scope, $http, $timeout, $window, $rootScope, $filter)
      {
        $scope.flag=false;
        $scope.CommisionData=[];
        $scope.alldpaycommision=[];
        $scope.savePayCommision = function (f) { 
          $scope.paycommision.$submitted = true;
          
        if($scope.paycommision.$valid ) {
        $http.post(path+"/api/v1/pension/paycommision",f,{
          
          headers: {
            
            'Authorization': 'Bearer ' + sessionStorage.token
          }
        })
          .then(function successCallback(response) {           
            $scope.CommisionData=response.data;
            $scope.alldpaycommision=[];
            $scope.alldpaycommision.push($scope.CommisionData);
             console.log("Post Data ",$scope.CommisionData);
             $scope.flag=false;
             if (response.status === 200) {
              $('#editpensioner').modal('hide'); 
              $scope.pcode=false;
              toastr.success('Data saved successfully!', 'Success');
              $scope.form={};
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
        toastr.error("Pay Commission Code already exist!!")
      }


       
      };

      //data set for delete model
      $scope.deleteDataModel = {};
      $scope.setDeleteData = function (data) {
        $scope.deleteDataModel = angular.copy(data);      
    };

      $scope.DeleteData = function (payCommissionCode,applicableDate) {     
        $http.delete(path+`/api/v1/pension/paycommision/${payCommissionCode}/${applicableDate}`,{
          
          headers: {
            
            'Authorization': 'Bearer ' + sessionStorage.token
          }
        })
          .then(function (response) {
            $('#deleteModal').modal('hide');
            if (response.status == '204') {
              $scope.allPayCommission();            
                toastr.success('Data Deleted successfully!', 'Success');

               } else if(response.status === 203){
                toastr.error('The data is dependent on another table and has not been deleted');
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
        $scope.form={
          payCommissionCode:n.payCommissionCode,
          applicableDate:n.applicableDate,
          dscr:n.dscr,
        }
      };

      function exportTableToExcel() {
            const table = document.querySelector(".table.table-striped"); 
            if (table) {
                const ws = XLSX.utils.table_to_sheet(table);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
                XLSX.writeFile(wb, "paycommision.xlsx");
            }
        }
        const exportButton = document.getElementById("exportToExcel");
        if (exportButton) {
            exportButton.addEventListener("click", exportTableToExcel);
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
              $scope.banks=response.data.bank;
               $scope.alldpaycommision=response.data.payCommisions;
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




        $scope.allPayCommission = function () {   
          $http.get(path+`/api/v1/pension/paycommision`,{
            
            headers: {
              
              'Authorization': 'Bearer ' + sessionStorage.token
            }
          })
            .then(function (response) {           
              $scope.alldpaycommision=response.data;
              console.log("dropData data",response.data);  
            },
              function (error) {
                console.log("erroe has occured dropData data",error)
              }
            );
        };


        $scope.checkDuplicate = function (val1) {
          var req = {
            method: 'GET',
            url: path+'/api/v1/pension/paycommision',
              headers: {
                
                'Authorization': 'Bearer ' + sessionStorage.token
              }          
          };         
          $http(req).then(function(res){     
            if (res.status == 200) {
              $scope.pcode = false;
              for (var i = 0; i < res.data.length; i++) {
                if (val1 == res.data[i].payCommissionCode) {
                  $scope.pcode = true;
                  break; 
                }
              }            
            } else {
              alert("Something went wrong!!");
            }
          });
        };

        $scope.cls=function(){ 
          $scope.flag=false;
          $scope.form.payCommissionCode= "";
          $scope.form.dscr="";
          $scope.form.applicableDate="";
        }


    });
