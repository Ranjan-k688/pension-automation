 

 app.controller('university', function ($scope, $http, $timeout, $window, $rootScope, $filter) {
$scope.flag=false

            $scope.save = function (n) {
              n.universityId=n.universityId.toUpperCase();
                $scope.myform.$submitted = true;  
                if ($scope.myform.$valid) {
                $http.post(path+"/api/v1/pension/university", n,{
                  
                  headers: {
                    
                    'Authorization': 'Bearer ' + sessionStorage.token
                  }
                })
                    .then(function successCallback(response) {
                        console.log(response)
                        $scope.form = {};
                        $scope.formSubmitted = true;                      
                        $scope.flag=false
                        if (response.status == '200') {  
                          $('#editpensioner').modal('hide');                      
                            $scope.pcode=false;
                            $scope.pcode1=false;
                            toastr.success('Data saved successfully!', 'Success');
                            $scope.getuniversitydata();
                        } else {
                            toastr.error('An error occurred while saving data.', 'Error');
                        }
                    },
                        function errorCallback(response) {
                            console.log("Error in saving data", response);
                            toastr.error('An error occurred while saving data.', 'Error');
                        });
            }else {
                    if (!$scope.timeoutPromise) {
                        toastr.error("User, Please fill out all mandatory fields!!")
                        $scope.timeoutPromise = $timeout(function () {
                            $scope.timeoutPromise = null;
                        }, 3000); // Adjust the timeout value as needed
                    }
                }
            }


            $scope.getuniversitydata = function () {
                $http.get(path+"/api/v1/pension/university",{
                  
                  headers: {
                    
                    'Authorization': 'Bearer ' + sessionStorage.token
                  }
                })
                    .then(function successCallback(response) {
                        $scope.university = response.data;
                    },
                        function errorCallback(response) {
                            console.log("Unable to perform  request");
                        }
                    );
            }
            $scope.getuniversitydata();


            $scope.edit = function (n) {
                $scope.flag=true
                $scope.form = {
                    universityCode: n.universityCode,
                    dscr: n.dscr,                   
                    universityId: n.universityId

                }
            }


                  //data set for delete model
                    $scope.deleteDataModel = {};
                    $scope.setDeleteData = function (data) {
                        $scope.deleteDataModel = angular.copy(data);      
                    };


            $scope.delete = function (universityCode) {
                $http.delete(path+'/api/v1/pension/university/' + universityCode,{
                  
                  headers: {
                    
                    'Authorization': 'Bearer ' + sessionStorage.token
                  }
                })
                    .then(function (response) {
                      $('#deleteModal').modal('hide'); 
                        console.log(response)
                        if (response.status == '204') {                           
                            toastr.success('Data Deleted successfully!', 'Success');
                            $scope.getuniversitydata();
                        }else if(response.status == '203'){
                          $('#deleteModal').modal('hide');
                            toastr.error('This ID is in use and cannot be deleted', 'Success');
                        }

                    })
                    .catch(function (error) {
                        $('#deleteModal').modal('hide');   
                        toastr.error('Data Not Deleted !');                     
                        console.error('Error deleting item: ' + error);
                    });

            };


            $scope.checkDuplicate = function (val1) {
                var req = {
                      method: 'GET',
                      url: path+'/api/v1/pension/university',
                      headers: {
                          
                          'Authorization': 'Bearer ' + sessionStorage.token
                      }           
                };         
                $http(req).then(function(res){          
                  if (res.status == 200) {
                    $scope.pcode = false; 
                    for (var i = 0; i < res.data.length; i++) {
                      if (val1 == res.data[i].universityCode ) {
                        $scope.pcode = true;
                        break; 
                      }
                    }            
                  } else {
                    alert("Something went wrong!!");
                  }
                });
              };

              $scope.checkDuplicate1 = function (v) {
                var val1=v.toUpperCase();
                var req = {
                  method: 'GET',
                  url: path+'/api/v1/pension/university',
                  headers: {
                    
                    'Authorization': 'Bearer ' + sessionStorage.token
                  }          
                };         
                $http(req).then(function(res){          
                  if (res.status == 200) {
                    $scope.pcode1 = false; 
                    for (var i = 0; i < res.data.length; i++) {
                      if (val1 == res.data[i].universityId) {
                        $scope.pcode1 = true;
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
                $scope.form.universityCode= "";
                $scope.form.universityId= "";
                $scope.form.dscr="";
                
              }



        })
