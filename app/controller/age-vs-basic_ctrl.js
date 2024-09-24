

 app.controller('ageVsBasic', function ($scope, $http, $timeout, $window, $rootScope, $filter) {
            $scope.flag = false;
            $scope.save = function (n) {
                if ($scope.myform.$valid) {
                    $http.post(path+"/api/v1/pension/agevsbasic", n,{
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + sessionStorage.token
                        }
                    })
                        .then(function successCallback(response) {
                            console.log(response)
                            $scope.form = {};
                            $scope.formSubmitted = true;
                            $scope.flag=false;
                            if (response.status === 200) {
                                $('#editpensioner').modal('hide'); 
                                toastr.success('Data saved successfully!', 'Success');
                                $scope.getagevsdata();
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



            $scope.getagevsdata = function () {
                $(".loaderbg").show();
                $http.get(path+"/api/v1/pension/agevsbasic",{
                    headers: {
                        'Authorization': 'Bearer ' + sessionStorage.token
                    }
                })
                    .then(function successCallback(response) {
                        $scope.agevsbasic = response.data;
                        $(".loaderbg").hide();
                    },
                        function errorCallback(error) {
                            if(error.data=="Expired token"){
                                if(error.data=="Expired token"){
                                    $rootScope.logout();
                                }
                            }
                            else{
                                alert("Error by server!!");  
                            }
                            console.log("Unable to perform  request");
                            $(".loaderbg").hide();
                        }
                    );
            }
            $scope.getagevsdata();

        
            $scope.edit = function (n) {
                $scope.flag=true;
                $scope.form = {
                    minAgeInYears: n.minAgeInYears,
                    dateFrom: n.dateFrom,
                    dateTo: n.dateTo,
                    percIncrease: n.percIncrease,
                }
                console.log("formdata",$scope.formData)
            }


                    //data set for delete model
                    $scope.deleteDataModel = {};
                    $scope.setDeleteData = function (data) {
                        $scope.deleteDataModel = angular.copy(data);      
                    };


                    
            $scope.delete = function (minAgeInYears, dateFrom) {
                let dd = dateFrom?.substring(0, 2);
                let mm = dateFrom?.substring(2, 6);
                let yyyy = dateFrom?.substring(6, 10);
                let Date = dateFrom ? yyyy + mm + dd : null;
                console.log(Date)
                // Format the date as needed

                $http.delete(path+'/api/v1/pension/' + minAgeInYears + '/' + Date,{
                    headers: {
                        
                        'Authorization': 'Bearer ' + sessionStorage.token
                    }
                })
                    .then(function (response) {
                        $('#deleteModal').modal('hide');                        
                        console.log(response);
                        if (response.status === 204) {
                            toastr.success('Data Deleted successfully!', 'Success');
                            $scope.getagevsdata();
                        }
                    })
                    .catch(function (error) {
                        // Handle the error, e.g., show an error message
                        console.error('Error deleting item: ' + error);
                        toastr.error('Data Not Deleted !');
                        $('#deleteModal').modal('hide');
                    });
            };




              $scope.chkDate = function (p1, d1) {
                $scope.date1 = new Date(d1);
              
                var dateComponents1 = d1.split('-');
                var selectedDate = new Date(dateComponents1[2], dateComponents1[1] - 1, dateComponents1[0]);
                var selectedMonth = selectedDate.getMonth() + 1;
                var selectedYear = selectedDate.getFullYear();
              
                var req = {
                  method: 'GET',
                  url: path + '/api/v1/pension/agevsbasic',
                    headers: {
                        
                        'Authorization': 'Bearer ' + sessionStorage.token
                    }
                };
              
                $http(req).then(function (res) {
                  $scope.pay = res.data;
                  console.log("pay", $scope.pay);
              
                  if (res.status == 200) {
                    for (var i = 0; i < res.data.length; i++) {
                      if ((p1 == res.data[i].minAgeInYears) && (res.data[i].dateTo == null)) {
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



        });
   