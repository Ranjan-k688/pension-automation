
     app.controller('phyHandicapped', function ($scope, $http, $timeout, $window, $rootScope, $filter)
      {
        $scope.flag=false  
        $scope.handicapedd=[];
        $scope.allhandicaped=[];
        $scope.saveHandiCapped = function (f) { 
          $scope.handicaped.$submitted = true;    
           if($scope.handicaped.$valid) {
        $http.post(path+"/api/v1/pension/phyhandicapped",f,{
          
          headers: {
            
            'Authorization': 'Bearer ' + sessionStorage.token
          }
        })
          .then(function successCallback(response) {
            $scope.handicapedd=response.data;
            $scope.pcode=false;
            $scope.allhandicaped=[];
            $scope.allhandicaped.push($scope.handicapedd);
             console.log("Post Data ",$scope.handicapedd);
             $scope.flag=false ; 
            $scope.formSubmitted = true;          
            if (response.status === 200) {
              $('#editpensioner').modal('hide'); 
              toastr.success('Data saved successfully!', 'Success');
              $scope.form={};
              } else {
              toastr.error('An error occurred while saving data.', 'Error');
              }         
          } 
        ,function errorCallback(response) {
              console.log("Saving of data failed ");
          }    
        );
          }else{
            toastr.error("User, Please fill out all mandatory fields!!")
          }
      };

      $scope.dropData=[];
      $scope.allPhyhandicaped = function () {  
        $(".loaderbg").show(); 
        $http.get(path+`/api/v1/pension/phyhandicapped`,{
          
          headers: {
            
            'Authorization': 'Bearer ' + sessionStorage.token
          }
        })
          .then(function (response) {    
            $(".loaderbg").hide();        
             $scope.allhandicaped=response.data;
            console.log("allPhyhandicaped data",response.data);  
          },
            function (error) {
              $(".loaderbg").hide(); 
              console.log("erroe has occured allPhyhandicaped data",error);
              if(error.data=="Expired token"){
                if(error.data=="Expired token"){
                    $rootScope.logout();
                }
            }else{
                alert("Error by server!!"); 
                $(".loaderbg").hide();  
            }
            }
          );
      };
      $scope.allPhyhandicaped();

      //data set for delete model
      $scope.deleteDataModel = {};
      $scope.setDeleteData = function (data) {
        $scope.deleteDataModel = angular.copy(data);      
    };

      $scope.DeleteData = function (phyHandicappedCode,index) {      
        $http.delete(path+`/api/v1/pension/phyhandicapped/${phyHandicappedCode}`,{
          
          headers: {
            
            'Authorization': 'Bearer ' + sessionStorage.token
          }
        })
          .then(function (response) {
            if (response.status == '204') {
                toastr.success('Data Deleted successfully!', 'Success');
                $('#deleteModal').modal('hide');
                $scope.allPhyhandicaped();
               }
 
          },
            function (error) {
              console.log("erroe has occured allhandicaped data",error);
              toastr.error('Data Not Deleted !');
              $('#deleteModal').modal('hide');
            }
          );
      };

      
      $scope.editData = function (e) {  
      $scope.flag=true     
      $scope.form = {
      phyHandicappedCode: e.phyHandicappedCode,
      handicapType: e.handicapType,
      allowablePerc: e.allowablePerc,
      dscr: e.dscr
     };
     
};


$scope.checkDuplicate = function (val1) {
  var req = {
    method: 'GET',
    url: path+'/api/v1/pension/phyhandicapped',
    headers: {
      
      'Authorization': 'Bearer ' + sessionStorage.token
    }        
  };         
  $http(req).then(function(res){   
    console.log("res data", res);

    if (res.status == 200) {
      $scope.pcode = false; // Reset the flag before checking duplicates
      for (var i = 0; i < res.data.length; i++) {
        if (val1 == res.data[i].phyHandicappedCode) {
          $scope.pcode = true;
          // toastr["error"]("Pay Commission Code already exists!!");
          break;
        }
      }            
    } else {
      alert("Something went wrong!!");
    }
  });
};


function exportTableToExcel() {
    const table = document.querySelector(".table.table-striped");
    if (table) {
        const ws = XLSX.utils.table_to_sheet(table);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, "PhyHandicapped.xlsx");
    }
}

const exportButton = document.getElementById("exportToExcel");
if (exportButton) {
    exportButton.addEventListener("click", exportTableToExcel);
}


      $scope.cls=function(){ 
        $scope.flag=false;
        $scope.form.phyHandicappedCode= "";
        $scope.form.handicapType="";
        $scope.form.allowablePerc="";
        $scope.form.dscr="";

      }

    });
