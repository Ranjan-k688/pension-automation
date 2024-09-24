
     app.controller('dependents', function ($scope, $http, $timeout, $window, $rootScope, $filter)
      {
        $scope.handleLink = function (pgname) {
          $rootScope.handleLink(pgname);
        };

        $scope.form = {
            minorDependent:'N',
            alternateNomineeMinor:'N', // Set the default value to 'N'
            workingStatus:'N'
          };
      
        $scope.updateflag=false;

        $scope.flag=false;
        $scope.dependent=[];

        $scope.saveDependents = function (form) { 
          if(!$scope.updateflag){
            $scope.form.dependentSlNo=$scope.s;
            $scope.form.alternateNomineePo='';
            $scope.form.dependentPo='';
          }
          $scope.Ddependent.$submitted = true; 
          if($scope.Ddependent.$valid) {
            $http.post(path + "/api/v1/pension/dependents", form,{            
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + sessionStorage.token
              }
          })
          .then(function successCallback(response) {
            $scope.dependent=response.data;
            $scope.payDataById1(response.data.pensionerId);
             $scope.alldependent.push($scope.dependent)
             console.log("Post Data ",$scope.dependent);
             $scope.flag=false;
             if (response.status === 200) {
              $scope.handleLink('dependents_list'); 
              $('#editpensioner').modal('hide');
              if(!$scope.updateflag){
                toastr.success('Data Updated successfully!', 'Success');
              }else{
                toastr.success('Data saved successfully!', 'Success');
              }             
              } else if(response.status === 203) {
              toastr.warning('Please fill in all mandatory fields.');
              }else{
                toastr.error('An error occurred while saving data.', 'Error');
              }
          $scope.formSubmitted = true;
          }
           ,function errorCallback(error) {
              console.log("Saving of data failed ");
              toastr.error('An error occurred while saving data.', 'Error',error);
          }    
        );
        }else{
            toastr.error('User, please fill  all mandatory fields.!!','Error',error);
          }

      };



      $scope.updateDependents = function (form) { 
        $scope.Ddependent.$submitted = true; 
       if($scope.Ddependent.$valid) {
      $http.post(path+"/api/v1/pension/dependents",form,{        
        headers: {          
          'Authorization': 'Bearer ' + sessionStorage.token
        }
      })
        .then(function successCallback(response) {
          $scope.dependent=response.data;
          $scope.payDataById1(response.data.pensionerId);
           $scope.alldependent.push($scope.dependent)
           console.log("Post Data ",$scope.dependent);
           $scope.flag=false;
           if (response.status === 200) {
            $('#editpensioner').modal('hide');
            $scope.form.dependentName="";
            $scope.form.pensionNominee="";
            $scope.form.pensionPerc="";
            $scope.form.dateOfBirth="";
            $scope.form.pensionerRelation="";
            $scope.form.married="";
            $scope.form.dateOfMarriage="";
            $scope.form.phyHandicappedCode="";
            toastr.success('Data Updated successfully!', 'Success');
            } else {
            toastr.error('An error occurred while saving data.', 'Error');
            }
        $scope.formSubmitted = true;
        } 
      ,function errorCallback(error) {
            console.log("Saving of data failed ");
            toastr.error('An error occurred while saving data.', 'Error',error);
        }    
      );
      }else{
          toastr.error("User, please fill  all mandatory fields.!!");
        }

    };

    
 
      $scope.allDependentData = function () {    
        $http.get(path+`/api/v1/pension/dependents`,{         
          headers: {           
            'Authorization': 'Bearer ' + sessionStorage.token
          }
        })
          .then(function (response) {
            $scope.deptdata=response.data;
            console.log("all dependenttdata",$scope.deptdata)
            }
          );
      };
      

      $scope.alldependent=[];
      var totallPer;
      $scope.s;
      $scope.payDataById1 = function (pensionerId) { 
        $(".loaderbg").show();    
        $http.get(path+`/api/v1/pension/dependents/${pensionerId}`,{
          
          headers: {
            
            'Authorization': 'Bearer ' + sessionStorage.token
          }
        })
          .then(function (response) {
            $scope.alldependent=[];
            $scope.alldependent=response.data.dependentData;
             $scope.s=$scope.alldependent.length+1;
             console.log("$scope.alldependent11",$scope.alldependent);

             totallPer = 0;
             for(var a=0;a<$scope.alldependent.length;a++){
              totallPer = totallPer + $scope.alldependent[a].pensionPerc;
             }
             console.log("totall percentage",totallPer);
            $(".loaderbg").hide(); 
            }
          );
      };


      $scope.amountErrors = false;
      $scope.amount=false;
      var remaingAmount = 0;
      $scope.calculate = function(per) {
       if(per){
        remaingAmount = parseInt(per) + totallPer;
        if (100 < remaingAmount) {
            $scope.amountErrors = true; 
            $scope.amount=true;
        } else {
            $scope.amountErrors = false; 
            $scope.amount=false;
        }
       }
  };


      $scope.deleteDataModel = {};
      $scope.setDeleteData = function (data) {
        console.log("data delete",data);
        $scope.chkdeletepensioner(data.pensionerId,data.dependentSlNo);
        $scope.deleteDataModel = angular.copy(data);      
    };

    $scope.deleteDataModel = {
      status: []
    };
    // $scope.form = {
    //   status: {}
    // };
    $scope.chkdelete={};
    $scope.chkdeletepensioner = function (pensionerId,slNo) {    
      $http.get(path+`/api/v1/pension/dependents/status/${pensionerId}/${slNo}`,{
        
        headers: {
          
          'Authorization': 'Bearer ' + sessionStorage.token
        }
      })
        .then(function (response) {
          $scope.deleteDataModel.status=response.data.status;
          $scope.form.status=response.data.status
          console.log("$scope.deleteDataModel",$scope.deleteDataModel);
        },
          function (error) {
            console.log("erroe has occured allhandicaped data",error)            
            toastr.error('Data Not Deleted !');
            $('#deleteModal').modal('hide');
            
          }
        );
    };

      $scope.DeleteData = function (pensionerId,slNo) {      
        $http.delete(path+`/api/v1/pension/dependents/${pensionerId}/${slNo}`,{
          
          headers: {
            
            'Authorization': 'Bearer ' + sessionStorage.token
          }
        })
          .then(function (response) {
            if (response.status == '204') {           
                toastr.success('Data Deleted successfully!', 'Success');
                $('#deleteModal').modal('hide');
                $scope.payDataById1(pensionerId);
               }
          },
            function (error) {
              console.log("erroe has occured allhandicaped data",error)            
              toastr.error('Data Not Deleted !');
              $('#deleteModal').modal('hide');
              
            }
          );
      };

      $scope.editData=function(n){
        console.log("percentage",n);
        $scope.chkdeletepensioner(n.pensionerId,n.dependentSlNo);
        $scope.flag=true;
        $scope.updateflag=true;
        $scope.form=n;
      };


      function exportTableToExcel() {
            const table = document.querySelector(".table.table-striped"); 
            if (table) {
                const ws = XLSX.utils.table_to_sheet(table);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
                XLSX.writeFile(wb, "dependents.xlsx");
            }
        }
        const exportButton = document.getElementById("exportToExcel");
        if (exportButton) {
            exportButton.addEventListener("click", exportTableToExcel);
        }


        $scope.getAllPensioner = function () { 
          $(".loaderbg").show();      
          // $http.get(path+"/api/v1/pensioners/pensionersId",{
            $http.get(path+"/api/v1/pensioners/pensionersId?verifiedId=true",{
            headers: {
              
              'Authorization': 'Bearer ' + sessionStorage.token
            }
          })
            .then(function (response) {
             if(response){
              setTimeout(function () {
                $('.dropdd').selectpicker();
              },150);
              // $scope.allPensionersData=response.data.pensionerIds;
              $scope.allPensionersData=response.data;
              console.log("$scope.allPensionersData",$scope.allPensionersData);
              
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
                // if (error.status === 401) {
                //   sessionStorage.clear();
                //   window.location.href = "index.html";
                // } else {
                //   $(".loaderbg").hide();
                // }
              }
            );
        };
        $scope.getAllPensioner();

        $scope.getPhy = function () {      
          $http.get(path+"/api/v1/pension/phyhandicapped",{
            
            headers: {
              
              'Authorization': 'Bearer ' + sessionStorage.token
            }
          })
            .then(function (response) {
              $scope.phyHandicaped=response.data;
               console.log("All phyHandicaped  data",$scope.phyHandicaped)
            },
              function (error) {
                console.log("error has occured pensiondetial data",error)
              }
            );
        };
        $scope.getPhy();
        

 
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
            if(response){
              $scope.amountErrors=false;
              $scope.form.pensionPerc="";
            }
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
            $(".loaderbg").hide();           
          },
            function (error) {
              console.log("erroe has occured allhandicaped data",error);
              $(".loaderbg").hide();
            }
          );
      };

      $scope.dropData=[];
      $scope.alldepData=[];
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
            $scope.alldepData=response.data.dependents;
            $scope.relation=response.data.relationship;
            $scope.phyHandicaped=response.data.phyHandicappeds;
            // console.log("dropData data",$scope.phyHandicaped);   
          },
            function (error) {
              console.log("erroe has occured dropData data",error)
            }
          );
      };
      $scope.allDropdata();

    
      $scope.mar=false;
      $scope.maried=function(x){
        if(x=='N')
        {
          $scope.mar=true;
         $scope.form.dateOfMarriage="";
        }else{
          $scope.mar=false;
        }

      }


      $scope.getPayCode = function (phyHandicappedCode) {
        for (let index = 0; index < $scope.phyHandicaped.length; index++) {
          const element = $scope.phyHandicaped[index];
          if (element.phyHandicappedCode === phyHandicappedCode) {
            return element.dscr;
          }
        }
      };


      $scope.invalidDate = false;
      $scope.validateDates = function () {
        if ($scope.form.dateOfBirth && $scope.form.dateOfMarriage) {
          var dateOfBirth = new Date($scope.form.dateOfBirth);
          var dateOfMarriage = new Date($scope.form.dateOfMarriage);

          // Check if dateOfMarriage is greater than dateOfBirth
          if (dateOfMarriage <= dateOfBirth) {
            $scope.invalidDate = true;
          } else {
            $scope.invalidDate = false;
          }

        }
      };


      $scope.showdata = function (val){
        $('.popupbg').show();
        $scope.showdetails=val;
        console.log("$scope.showdetails",$scope.showdetails)
      };


    


      $scope.getaddress = function(val,d)
      {
      $http.get("https://api.postalpincode.in/pincode/"+val).then(function(res) {
      if(res.data[0].Status!="Error"){
        console.log("Details",res.data[0])
       if(d=='D'){
        $scope.dependentPostoffice=res.data[0].PostOffice;
        $scope.form.dependentState =res.data[0].PostOffice[0].State;               			
        $scope.form.dependentCity=res.data[0].PostOffice[0].District;
        $scope.form.dependentCountry=res.data[0].PostOffice[0].Country;
       }else if(d=='A'){
        $scope.alternateNomGuardPostoffice=res.data[0].PostOffice;
        $scope.form.alternateNameGuardState =res.data[0].PostOffice[0].State;               			
        $scope.form.alternateNomGuardCity=res.data[0].PostOffice[0].District;
        $scope.form.alternateNameGuardCountry=res.data[0].PostOffice[0].Country;
       }else if(d=='N'){
        $scope.alternateNomineePostoffice=res.data[0].PostOffice;
        $scope.form.alternateNomineeState =res.data[0].PostOffice[0].State;               			
        $scope.form.alternateNomineeCity=res.data[0].PostOffice[0].District;
        $scope.form.alternateNomineeCountry=res.data[0].PostOffice[0].Country;
       }else if(d=='M'){
        $scope.minorGuardianPostoffice=res.data[0].PostOffice;
        $scope.form.minorGuardianState =res.data[0].PostOffice[0].State;               			
        $scope.form.minorGuardianCity=res.data[0].PostOffice[0].District;
        $scope.form.minorGuardianCountry=res.data[0].PostOffice[0].Country;
       }
      }
      else{
      $scope.form.state ="";               			
      $scope.form.city="";
      $scope.postoffice=[];
      toastr["error"]("Please Enter Valid Pin Code!");
      }
        });	
      
      
      };


    });
