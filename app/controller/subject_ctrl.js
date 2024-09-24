app.controller('subject', function ($scope, $http, $timeout, $window, $rootScope, $filter) {
            $scope.flag = false;
            $scope.save = function (n) {
                n.subjectCode=n.subjectCode.toUpperCase();
                $scope.myform.$submitted = true;  
                if ($scope.myform.$valid) {
                    $http.post(path+"/api/v1/pension/subject", n,{
                        
                        headers: {
                          
                          'Authorization': 'Bearer ' + sessionStorage.token
                        }
                    })
                        .then(function successCallback(response) {
                            console.log(response)
                            $scope.form = {};
                            $scope.formSubmitted = true;
                            $scope.flag = false;
                            if (response.status == '200') {
                                $('#editpensioner').modal('hide'); 
                                toastr.success('Data saved successfully!', 'Success');
                                $scope.getsubjectdata();
                                $scope.pcode=false;
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
                        toastr.error('Please fill in all required fields.', 'Error');
                        $scope.timeoutPromise = $timeout(function () {
                            $scope.timeoutPromise = null;
                        }, 300); 
                    }
                }
            }

            $scope.getsubjectdata = function () {
                $(".loaderbg").show();
                $http.get(path+"/api/v1/pension/subject",{
                    
                    headers: {
                      
                      'Authorization': 'Bearer ' + sessionStorage.token
                    }
                })
                    .then(function successCallback(response) {
                        $scope.subject = response.data;
                        $(".loaderbg").hide();
                    },
                        function errorCallback(response) {
                            $(".loaderbg").hide();
                            // console.log("Unable to perform  request");
                        }
                    );
            }

            $scope.getsubjectdata();



            $scope.checkDuplicate = function (v) {
                var val1=v.toUpperCase();
                var req = {
                    method: 'GET',
                    url: path+'/api/v1/pension/subject',
                    headers: {
                    
                    'Authorization': 'Bearer ' + sessionStorage.token
                    }           
                };         
                $http(req).then(function(res){   
                //   console.log("res data", res);       
                  if (res.status == 200) {
                    $scope.pcode = false;
                    for (var i = 0; i < res.data.length; i++) {
                      if (val1 == res.data[i].subjectCode) {
                        $scope.pcode = true;                       
                        break; 
                      }
                    }            
                  } else {
                    alert("Something went wrong!!");
                  }
                });
              };


           

            $scope.edit = function (n) {
                $scope.flag = true;
                $scope.form = {
                    subjectCode: n.subjectCode,
                    dscr: n.dscr,
                }
            }

                  //data set for delete model
                    $scope.deleteDataModel = {};
                    $scope.setDeleteData = function (data) {
                        $scope.deleteDataModel = angular.copy(data);      
                    };
                    
            $scope.delele = function (n) {
                $http.delete(path+'/api/v1/pension/subject/' + n,{
                    
                    headers: {
                      
                      'Authorization': 'Bearer ' + sessionStorage.token
                    }
                })
                    .then(function (response) {
                        $('#deleteModal').modal('hide');                       
                         console.log(response)
                        if (response.status == '204') {                           
                            $scope.getsubjectdata();
                            $('#deleteModal').modal('hide'); 
                            toastr.success('Data Deleted successfully!', 'Success');  
                        }else if(response.status == '203'){
                            $scope.getsubjectdata();
                            $('#deleteModal').modal('hide'); 
                            toastr.error('This ID is in use and cannot be deleted', 'Success'); 
                        }

                    })
                    .catch(function (error) {
                        toastr.error('Data Not Deleted !');
                        $('#deleteModal').modal('hide');                       
                         console.error('Error deleting item: ' + error);
                    });

            }

            $scope.downloadCSV = function () {
                // Generate a CSV content string from the table data
                var csvContent = "Subject Code,Description\n";
                $scope.subject.forEach(function (row) {
                    csvContent += row.subjectCode + "," + row.dscr + "\n";
                });

                // Create a Blob containing the CSV data
                var blob = new Blob([csvContent], { type: 'text/csv' });

                // Create a download link and trigger the download
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = 'subject_data.csv';
                link.click();
            };

            $scope.cls=function(){ 
                $scope.flag=false;
                $scope.form.subjectCode= "";
                $scope.form.dscr="";
                
              }



        })
