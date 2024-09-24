

        app.controller('collegeType', function ($scope, $http, $timeout, $window, $rootScope, $filter) {

            $scope.save = function (n) {
                $scope.myform.$submitted = true; 
                if ($scope.myform.$valid) {
                $http.post(path+"/api/v1/pension/cllgtype", n,{
                  headers: {
                    
                    'Authorization': 'Bearer ' + sessionStorage.token
                  }
                })
                    .then(function successCallback(response) {
                        console.log(response)
                        $scope.cllgdata=[];
                        $scope.cllgdata.push(response.data);
                        $scope.form = {};
                        $scope.formSubmitted = true;
                        $scope.flag=false;
                        if (response.status === 200) {
                            toastr.success('Data saved successfully!', 'Success');
                          
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



            $scope.cllgdata =[];
            $scope.allDropdata = function () { 
              $(".loaderbg").show();  
              $http.get(path+`/api/v1/dropdown/list`,{
                headers: {
                  
                  'Authorization': 'Bearer ' + sessionStorage.token
                }
              })
                .then(function (response) {           
                $scope.cllgdata = response.data.collegeTypes;                
                  console.log("dropData data",response.data);
                  $(".loaderbg").hide();  
                },
                  function (error) {
                    console.log("erroe has occured dropData data",error);
                    if(error.data=="Expired token"){
                      if(error.data=="Expired token"){
                          $rootScope.logout();
                      }
                  }
                  else{
                      alert("Error by server!!"); 
                      $(".loaderbg").hide(); 
                  }
                  }
                );
            };
            $scope.allDropdata();


    
            $scope.clgdata = function () {  
              
              $http.get(path+`/api/v1/pension/cllgtype`,{
                headers: {
                  
                  'Authorization': 'Bearer ' + sessionStorage.token
                }
              })
                .then(function (response) {           
                  $scope.cllgdata = response.data;                
                  console.log("dropData data",response.data);
                  
                },
                  function (error) {
                    console.log("erroe has occured dropData data",error);
                    
                  }
                );
            };

            $scope.checkDuplicate = function (val1) {
                var req = {
                  method: 'GET',
                  url: path+'/api/v1/pension/cllgtype' ,
                  headers: {
                    
                    'Authorization': 'Bearer ' + sessionStorage.token
                  }          
                };         
                $http(req).then(function(res){   
                //   console.log("res data", res);       
                  if (res.status == 200) {
                    $scope.pcode = false;
                    for (var i = 0; i < res.data.length; i++) {
                      if (val1 == res.data[i].collegeTypeCode) {
                        $scope.pcode = true;                       
                        break; 
                      }
                    }            
                  } else {
                    alert("Something went wrong!!");
                  }
                });
              };
      


            $scope.flag=false;
            $scope.edit = function (n) {
                console.log("all",n)
                $scope.flag=true;
                console.log(n)
                $scope.form = {
                    collegeTypeCode: n.collegeTypeCode,
                    description: n.description,

                }
            }

                  //data set for delete model
                    $scope.deleteDataModel = {};
                    $scope.setDeleteData = function (data) {
                        $scope.deleteDataModel = angular.copy(data);      
                    };


            $scope.delele = function (n) {
                console.log(n)
                $http.delete(path+'/api/v1/pension/cllgtype/' + n,{
                  headers: {
                    
                    'Authorization': 'Bearer ' + sessionStorage.token
                  }
                })                
                    .then(function (response) {
                        $('#deleteModal').modal('hide');
                        console.log(response)
                        if (response.status === 204) {
                            $scope.clgdata();
                            toastr.success('Data Deleted successfully!', 'Success');
                          
                        }

                    })
                    .catch(function (error) {
                        console.error('Error deleting item: ' + error);
                        toastr.error("Data Not deleted");
                        $('#deleteModal').modal('hide') 
                    });

            }



        });
   