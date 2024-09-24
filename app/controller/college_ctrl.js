
        app.controller('college', function ($scope, $http, $timeout, $window, $rootScope, $filter) {
            $scope.flag=false;
            $scope.save = function (n) {

                var collegeId={
                    collegeCode:n.collegeCode,
                    universityCode:n.universityCode
                }
                var postData = {
                    collegeId: collegeId,
                    collegeIdValue:n.collegeIdValue,
                    collegeShortName:n.collegeShortName,
                    dscr:n.dscr,
                    city:n.city,
                    collegeTypeCode:n.collegeTypeCode                    
                };

                $scope.myform.$submitted = true;  
                if ($scope.myform.$valid) {
                $http.post(path+"/api/v1/pension/college", postData,{
                  headers: {
                    
                    'Authorization': 'Bearer ' + sessionStorage.token
                  }
                })
                    .then(function successCallback(response) {
                        console.log(response)
                        $scope.form = {};
                        $scope.flag=false;
                        $scope.formSubmitted = true;
                        if (response.status === 200) {
                          $scope.cllgdata=[];
                          $scope.cllgdata = response.data;
                          for(var a=0;a<$scope.cllgdata.length;a++){
                          $scope.cllgdata[a].collegeCode=$scope.cllgdata[a].collegeId.collegeCode;
                          $scope.cllgdata[a].universityCode=$scope.cllgdata[a].collegeId.universityCode;
                          }
                          $('#editpensioner').modal('hide'); 
                            $scope.pcode=false;
                            toastr.success('Data saved successfully!', 'Success');
                            $scope.getcllgdata();
                        } else {
                            toastr.error('An error occurred while saving data.', 'Error');
                        }
                    },
                        function errorCallback(response) {
                            console.log("Error in saving data", response);
                            toastr.error('An error occurred while saving data.', 'Error');
                        });
            } else {
                    if (!$scope.timeoutPromise) {
                        toastr.error('User, Please fill out all mandatory fields!!', 'Error');
                        $scope.timeoutPromise = $timeout(function () {
                            $scope.timeoutPromise = null;
                        }, 3000); // Adjust the timeout value as needed
                    }
                }
            }


            $scope.updateData = function (n) {

              var collegeId={
                  collegeCode:n.collegeCode,
                  universityCode:n.universityCode
              }
              var postData = {
                  collegeId: collegeId,
                  collegeIdValue:n.collegeIdValue,
                  collegeShortName:n.collegeShortName,
                  dscr:n.dscr,
                  city:n.city,
                  collegeTypeCode:n.collegeTypeCode                    
              };
              $scope.cllgdata=[];
              $scope.myform.$submitted = true;  
              if ($scope.myform.$valid) {
              $http.put(path+"/api/v1/pension/college", postData,{
                headers: {
                  
                  'Authorization': 'Bearer ' + sessionStorage.token
                }
              })
                  .then(function successCallback(response) {
                      console.log("response data",response.data)
                      $scope.form = {};
                      $scope.flag=false;
                      $scope.formSubmitted = true;
                      if (response.status === 200) {
                        $('#editpensioner').modal('hide'); 
                        $scope.p=response.data;
                        $scope.p.collegeCode=response.data.collegeId.collegeCode
                        $scope.cllgdata=[];
                        $scope.cllgdata.push(response.data);
                        $scope.cllgdata.collegeCode.push($scope.p.collegeId.collegeCode);
                        console.log("response $scope.cllgdata",$scope.cllgdata)
                          $scope.pcode=false;
                          toastr.success('Data saved successfully!', 'Success');
                          $scope.getcllgdata();
                      } else {
                          toastr.error('An error occurred while saving data.', 'Error');
                      }
                  },
                      function errorCallback(response) {
                          console.log("Error in saving data", response);
                          toastr.error('An error occurred while saving data.', 'Error');
                      });
          } else {
                  if (!$scope.timeoutPromise) {
                      toastr.error('User, Please fill out all mandatory fields!!', 'Error');
                      $scope.timeoutPromise = $timeout(function () {
                          $scope.timeoutPromise = null;
                      }, 3000); // Adjust the timeout value as needed
                  }
              }
          }

            $scope.getcllgdata = function () {
                $http.get(path+"/api/v1/pension/college",{
                  headers: {
                    
                    'Authorization': 'Bearer ' + sessionStorage.token
                  }
                })
                    .then(function successCallback(response) {
                        $scope.cllgdata = response.data;
                        for(var a=0;a<$scope.cllgdata.length;a++){
                        $scope.cllgdata[a].collegeCode=$scope.cllgdata[a].collegeId.collegeCode;
                        $scope.cllgdata[a].universityCode=$scope.cllgdata[a].collegeId.universityCode;
                        }
                        // console.log("All college data",$scope.cllgdata);
                    },
                        function errorCallback(error) {
                            console.log("Unable to perform  request",error);
                            if(error.data=="Expired token"){
                              if(error.data=="Expired token"){
                                  $rootScope.logout();
                              }
                          }
                          else{
                              alert("Error by server!!");  
                          }
                        }
                    );
            }
            $scope.getcllgdata();


            $scope.dropData=[];
            $scope.allDropdata = function () {   
              $http.get(path+`/api/v1/dropdown/list`,{
                headers: {
                  
                  'Authorization': 'Bearer ' + sessionStorage.token
                }
              })
                .then(function (response) {  
                    $scope.unidata=response.data.universities; 
                  $scope.clgData=response.data.collegeTypes ;  
                  console.log("college data",$scope.clgData);         
                  console.log("dropData data",response.data);  
                },
                  function (error) {
                    console.log("erroe has occured dropData data",error)
                  }
                );
            };
            $scope.allDropdata();


            $scope.edit = function (n) {
                // console.log("cole",n);
                $scope.flag=true;
                $scope.form = {
                    collegeCode: n.collegeCode,
                    dscr: n.dscr,
                    universityCode: n.universityCode,
                    collegeId: n.collegeId,
                    collegeShortName: n.collegeShortName,
                    collegeTypeCode: n.collegeTypeCode,
                    city: n.city,
                    collegeIdValue: n.collegeIdValue
                }
            }

            
            $scope.deleteDataModel = {};
            $scope.setDeleteData = function (data) {
              $scope.deleteDataModel = angular.copy(data);      
          };
      

            // $scope.deletecollege = function (collegeCode, universityCode) {
            //    $http.delete(path+`/api/v1/pension/college/${collegeCode}/${universityCode}`,{
                    //   headers: {
                    //     
                    //     'Authorization': 'Bearer ' + sessionStorage.token
                    //   }
                    // })
            //         .then(function (response) {
            //           console.log('Status ', response.status);
                                        
            //             if (response.status === 204) {
            //                 toastr.success('Data Deleted successfully!', 'Success');
            //                 $scope.getcllgdata();
            //                 $('#deleteModal').modal('hide')
            //             }else if(response.status === 400){
            //               toastr.success('Data Deleted successfully!', 'Success');
            //               $('#deleteModal').modal('hide');

            //             }else if(response.status === 203){
            //               toastr.warn('Data is dependent to other table', 'Success');
            //               $('#deleteModal').modal('hide');

            //             }
            //         })
            //         .catch(function (error) {
            //             console.error('Error deleting item: ' + error);
            //             $('#deleteModal').modal('hide')
            //             toastr.error('Data Not Deleted !');
            //         });
            // };


              $scope.deletecollege = function (collegeCode, universityCode) {
               $http.delete(path+`/api/v1/pension/college/${collegeCode}/${universityCode}`,{
                headers: {
                  
                  'Authorization': 'Bearer ' + sessionStorage.token
                }
              })
               .then(function (response) {  
                        if (response.status === 204) {
                            toastr.success('Data Deleted successfully!', 'Success');
                            $scope.getcllgdata();
                            $('#deleteModal').modal('hide')
                        }else if(response.status === 400){
                          toastr.success('Data Deleted successfully!', 'Success');
                          $('#deleteModal').modal('hide');

                        }else if(response.status === 203){
                          toastr.error('The data is dependent on another table and has not been deleted');
                          $('#deleteModal').modal('hide');

                        }  
            },
              function (error) {
                console.log("erroe has occured dropData data",error)
              });
            };



              $scope.checkDuplicate = function (val1) {
                var req = {
                  method: 'GET',
                  url: path+'/api/v1/pension/college' ,
                  headers: {
                    
                    'Authorization': 'Bearer ' + sessionStorage.token
                  }         
                };         
                $http(req).then(function(res){ 
                    // console.log(">>>>>>>>",res.data)
                for(var a=0;a<res.data.length;a++){
                   $scope.cllgdata[a].collegeCode=res.data[a].collegeId.collegeCode;
                };
                  if (res.status == 200) {
                    $scope.pcode = false;
                    for (var i = 0; i < $scope.cllgdata.length; i++) {
                      if (val1 == $scope.cllgdata[i].collegeCode) {
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
                $scope.form.collegeCode= "";
                $scope.form.collegeShortName="";
                $scope.form.dscr="";
                $scope.form.city="";
                $scope.form.collegeTypeCode="";
                $scope.form.collegeIdValue="";
              };


              $scope.departments={};
              $scope.fetchMaster = function () {
                $(".loaderbg").show();
                var req = {
                  method: 'GET',
                  url: path+'/api/v1/dropdown/list',
                  headers: {
                    'Authorization': "Bearer " + sessionStorage.token,
                    'Content-Type': 'application/json'
                  },
                };
                
               $http(req).then(function(masterdata_res){
                   if (masterdata_res) {
                      $scope.masterdata=masterdata_res.data.masterDetails;
                      $(".loaderbg").hide();        
                   } },
                   function (error) {
                    console.log("error has occured application data",error) ;
                    $(".loaderbg").hide();                  
                   });
              
            };
            $scope.fetchMaster();
            
            
            $scope.accountdetialData=[];
            $scope.k=[];
            $scope.searchDept = function( val1,val2) {
              console.log("chk",val1,val2)
              var params = {};
              params[val1] = val2;
             
              $http.get(path+'/api/v1/pension/college/search', 
              {
                params: params,
                headers: {
                  
                  'Authorization': 'Bearer ' + sessionStorage.token
                }
              }).then(function(response) {
                    $scope.k = response.data;
                    for(var a=0;a<$scope.k.length;a++){
                      $scope.k[a].collegeCode=$scope.k[a].collegeId.collegeCode;
                      }
                    $scope.cllgdata = $scope.k;
                console.log("$scope.deptdata",$scope.cllgdata);
              }).catch(function(error) {
                  console.error(error);
              });
            };

      



        })
   