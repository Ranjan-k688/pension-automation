 
    app.controller('payDetails', function ($scope, $http)
      {
        $scope.flag=false;
        $scope.payData=[];
        $scope.paydetail = {};

        $scope.savePayDetail = function (f) { 
          $scope.paydetail.$submitted = true;        
          if($scope.paydetail.$valid) { 
        $http.post(path+"/api/v1/pensioners/paydetial/",f,{
          
          headers: {
            
            'Authorization': 'Bearer ' + sessionStorage.token
          }
        })
          .then(function successCallback(response) {
            $('#editpensioner').modal('hide'); 
            $scope.payData=response.data;
            $scope.payDataById1(response.data.pensionerId);       
             console.log("Post Data ",$scope.payData);       
             $scope.flag=false;
             if (response.status === 200) {
              $scope.form.dateFrom="";
              $scope.form.pensionBasic="";
              $scope.form.medicalAllowance="";
              $scope.form.hra="";
              $scope.form.otherAllowance="";
              $scope.form.tds="";
              $scope.form.remarks="";
              toastr.success('Data saved successfully!', 'Success');
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
            // alert("filled All the red Strike!!")
            toastr.error('filled All the red Strike!!', 'Error');
          }
      };
  
         
            //data set for delete model
            $scope.deleteDataModel = {};
            $scope.setDeleteData = function (data) {
              $scope.deleteDataModel = angular.copy(data);      
          };



      $scope.DeleteData = function (pensionerId,dateFrom,index) {      
        $http.delete(path+`/api/v1/pensioners/paydetial/${pensionerId}/${dateFrom}`,{
          
          headers: {
            
            'Authorization': 'Bearer ' + sessionStorage.token
          }
        })
          .then(function (response) {
            if (response.status) {             
                toastr.success('Data Deleted successfully!', 'Success');
                $('#deleteModal').modal('hide');
                $scope.paydetialData.splice(index, 1); 
               }
          },
            function (error) {
              console.log("erroe has occured allhandicaped data",error);
              toastr.error('Data Not Deleted !');
              $('#deleteModal').modal('hide');
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
            $scope.paydetialData=response.data.payDetails;
            console.log("pay details",$scope.payData)
            $scope.form.pensionerId=$scope.payData.pensionerId;
            $scope.form.aadhaar=$scope.payData.aadhaar;
            $scope.form.employeeName=$scope.payData.employeeName;
            $scope.form.payCommissionCode=$scope.payData.payCommissionCode;
            $scope.form.ppoNo=$scope.payData.ppoNo;
            $scope.form.dateTo=$scope.payData.dateTo;
            if($scope.payData.pan==null){
              $scope.form.pan="No Record";
            }else{
              $scope.form.pan=$scope.payData.pan;
            }
            $scope.form.pensionerStatusCode=$scope.payData.pensionerStatusCode;
            $scope.form.departmentCode=$scope.payData.departmentCode;
            $scope.form.collegeCode=$scope.payData.collegeCode;           
            $(".loaderbg").hide();
          },
            function (error) {
              console.log("erroe has occured allhandicaped data",error);
              $(".loaderbg").hide();
            }
          );
      };

      $scope.status={};
      $scope.payStatusChk = function(pensionerId) {
        var pen = pensionerId;
        for (var a = 0; a < $scope.paydetialData.length; a++) {
          if ($scope.paydetialData[a].pensionerId == pen) {
            var status=$scope.paydetialData[a].status;
          }
          console.log("$scope.all status", status);
        }
      };

      $scope.paydetialData=[];
      $scope.payDataById1 = function (pensionerId) { 
        $(".loaderbg").show();     
        $http.get(path+`/api/v1/pensioners/${pensionerId}`,{
          
          headers: {
            
            'Authorization': 'Bearer ' + sessionStorage.token
          }
        })
          .then(function (response) {
            $scope.paydetialData=response.data.payDetails;
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
            // console.log("dropData data",response.data); 
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

      $scope.AllpayDetail=[];
      $scope.getAllPayDetaildata = function () { 
        $(".loaderbg").show();        
        $http.get(path+"/api/v1/pensioners/paydetial",{
          
          headers: {
            
            'Authorization': 'Bearer ' + sessionStorage.token
          }
        })
          .then(function (response) {
            $scope.AllpayDetail=response.data;
              // console.log("All pay detial  data",$scope.AllpayDetail);
             $(".loaderbg").hide(); 
          },
            function (error) {
              console.log("error has occured pay detial data",error);
              $(".loaderbg").hide(); 
            }
          );
      };
       $scope.getAllPayDetaildata();
     

      $scope.editData = function (e) { 
      console.log("eee",e)
      $scope.flag=true;     
      $scope.form = {
      pensionerId: e.pensionerId,
      dateFrom: e.dateFrom,
      dateTo: e.dateTo,
      pensionBasic: e.pensionBasic,
      medicalAllowance: e.medicalAllowance,
      hra: e.hra,
      othersAllowance: e.othersAllowance,
      tds: e.tds,
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

        
        $scope.chkDate = function (p1, d1) {
          $scope.date1 = new Date(d1);
        
          var dateComponents1 = d1.split('-');
          var selectedDate = new Date(dateComponents1[2], dateComponents1[1] - 1, dateComponents1[0]);
          var selectedMonth = selectedDate.getMonth() + 1;
          var selectedYear = selectedDate.getFullYear();
        
          var req = {
            method: 'GET',
            url: path + '/api/v1/pensioners/paydetial',
              headers: {
                
                'Authorization': 'Bearer ' + sessionStorage.token
              }
          };
        
          $http(req).then(function (res) {
            $scope.pay = res.data;
            console.log("pay", $scope.pay);
        
            if (res.status == 200) {
              for (var i = 0; i < res.data.length; i++) {
                if ((p1 == res.data[i].pensionerId) && (res.data[i].dateTo == null)) {
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

        
        $scope.cls=function(){ 
          $scope.flag=false;
          $scope.form.dateFrom= "";
          $scope.form.pensionBasic="";
          $scope.form.medicalAllowance="";
          $scope.form.hra="";
          $scope.form.othersAllowance="";
          $scope.form.tds="";
          $scope.form.remarks="";
        }

    });
