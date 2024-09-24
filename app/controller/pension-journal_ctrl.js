
     app.controller('pensionJournal', function ($scope, $http, $timeout, $window, $rootScope, $filter)
      {
        $scope.flag=false; 
        $scope.pensionJournel=[];
        $scope.pensionJournalData=[];
        $scope.savePayDetail = function (f) { 
        $scope.pension.$submitted = true;  
        if($scope.pension.$valid) {
        $http.post(path+"/api/v1/pension/pensionJournal",f,{
          
          headers: {
            
            'Authorization': 'Bearer ' + sessionStorage.token
          }
        })
          .then(function successCallback(response) {
            $scope.pensionJournel=response.data;
            $scope.pensionJournalData=[];
            $scope.pensionJournalData.push($scope.pensionJournel);
             console.log("Post Data ",$scope.pensionJournel);
             $scope.flag=false; 
             if (response.status === 200) {
              $('#editpensioner').modal('hide'); 
              $scope.allPensionJournal();
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
            toastr.error('filled All the red Strike!!', 'Error');
          }
      };

      $scope.dropData=[];
      $scope.allPensionJournal = function () {   
        $http.get(path+`/api/v1/pension/pensionJournal`,{
          
          headers: {
            
            'Authorization': 'Bearer ' + sessionStorage.token
          }
        })
          .then(function (response) {           
             $scope.pensionJournalData=response.data;
            console.log("all PensionJournal data",response.data);  
          },
            function (error) {
              console.log("erroe has occured all PensionJournal data",error);
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
      $scope.allPensionJournal();


      $scope.DeleteData = function (finYear,journalId,index) {      
        $http.delete(path+`/api/v1/pension/pensionJournal/${finYear}/${journalId}`,{
          
          headers: {
            
            'Authorization': 'Bearer ' + sessionStorage.token
          }
        })
          .then(function (response) {
            if (response.status == '204') {
                location.reload(); 
                toastr.success('Data Deleted successfully!', 'Success');
              
               }
          },
            function (error) {
              console.log("erroe has occured allhandicaped data")
            }
          );
      };


      $scope.editData = function (e) {  
      $scope.flag=true;     
      $scope.form = {
      finYear: e.finYear,
      journalId: e.journalId,
      txDate: e.txDate,
      txTable: e.txTable,
      txType: e.txType,
      userId: e.userId
     };
};

function exportTableToExcel() {
            const table = document.querySelector(".table.table-striped"); 
            if (table) {
                const ws = XLSX.utils.table_to_sheet(table);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
                XLSX.writeFile(wb, "Pension.xlsx");
            }
        }
        const exportButton = document.getElementById("exportToExcel");
        if (exportButton) {
            exportButton.addEventListener("click", exportTableToExcel);
        }

    });
