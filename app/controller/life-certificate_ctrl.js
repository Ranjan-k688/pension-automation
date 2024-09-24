
        app.controller('lifeCertificate', function ($scope, $http, $timeout, Upload) {
            $scope.flag=false
            $scope.lifedata=[];

            $scope.save = function (n) {
              $scope.myform.$submitted = true;  
              var fileInput = document.getElementById('fileInput');
              var file = fileInput.files[0];
              
              if (file !== undefined) {
                // var invalidFields = {};
        
                // angular.forEach($scope.myform.$error, function(errors, errorType) {
                //     angular.forEach(errors, function(field) {
                //         if (!invalidFields[field.$name]) {
                //             invalidFields[field.$name] = [];
                //         }
                //         invalidFields[field.$name].push(errorType);
                //     });
                // });
                // console(invalidFields);
                  if ($scope.myform.$valid) {
                      n.imageFileName = undefined;
                      var formData = new FormData();
                      // formData.append('lifecert', new Blob([JSON.stringify(n)], { type: 'application/json' }));

                      formData.append('pensionerId',$scope.form.pensionerId);
                      formData.append('finYear',$scope.form.finYear);
                      formData.append('certificateNo',$scope.form.certificateNo);
                      formData.append('certificateDate',$scope.form.certificateDate);
                      formData.append('profilephoto', file);
          
                      $http.post(path + "/api/v1/pension/lifecert",formData, {
                          
                          headers: {
                              'Content-Type': undefined ,
                              'Authorization': 'Bearer ' + sessionStorage.token
                          } 
                      })      
                        .then(function successCallback(response) {
                            if (response.status === 200) {
                              $scope.lifedata.push(response.data);
                              $scope.formSubmitted = true;
                              $scope.flag=false;
                              $scope.form.finYear=''
                              $scope.form.certificateNo=''
                              $scope.form.certificateDate=''
                              document.getElementById('fileInput').value = '';
                                  $scope.imagePreview='images/users.jpg';
                                toastr.success('Data saved successfully!', 'Success');
                              //   setTimeout(function() {
                              //         $('.dropdd').selectpicker('refresh');
                              // }, 1000);
                            }
                            else if(response.status === 203){
                              alert(response.data.status);
                            } 
                            else {
                                toastr.error('An error occurred while saving data.', 'Error');
                            }
                        },
                            function errorCallback(response) {
                                console.log("Error in saving data", response);
                                toastr.error('An error occurred while saving data.', 'Error');
                            });
                }else {
                    if (!$scope.timeoutPromise) {
                        toastr.error('User, Please fill out all mandatory fields!!');
                        $scope.timeoutPromise = $timeout(function () {
                            $scope.timeoutPromise = null;
                        }, 3000); // Adjust the timeout value as needed
                    }
                }
              }else{
                alert("Life certificate image is mandatory!!")
              }
            };


            $scope.payData=[];
            $scope.paydetialData=[];
            $scope.payDataById = function (pensionerId) { 
              $scope.lifedata=[];  
              console.log("payDataById" ,pensionerId)   
              $http.get(path+`/api/v1/pensioners/${pensionerId}`,{
                
                headers: {
                  
                  'Authorization': 'Bearer ' + sessionStorage.token
                }
              })
                .then(function (response) {
                  $scope.payData=response.data;
                  $scope.paydetialData=response.data.payDetails;
                  $scope.form.aadhaar=$scope.payData.aadhaar;
                  $scope.form.employeeName=$scope.payData.employeeName;
                  $scope.form.payCommissionCode=$scope.payData.payCommissionCode;
                  $scope.form.ppoNo=$scope.payData.ppoNo;
                  $scope.form.pan=$scope.payData.pan;
                  $scope.form.pensionerStatusCode=$scope.payData.pensionerStatusCode;
                  $scope.form.departmentCode=$scope.payData.departmentCode;
                  $scope.form.collegeCode=$scope.payData.collegeCode;
                  $scope.lifeDataById(pensionerId);
                },
                  function (error) {
                    console.log("erroe has occured allhandicaped data",error)
                  }
                );
            };

            $scope.lifedata = [];
            $scope.lifeDataById = function(pensionerId) {
              $http.get(path+"/api/v1/pension/lifecert/"+pensionerId,{
                    
                headers: {
                  
                  'Authorization': 'Bearer ' + sessionStorage.token
                }
              })
                .then(function (response) {
                  $scope.lifedata=response.data;
                   console.log("All Life  data",$scope.lifedata)
                },
                  function (error) {
                    console.log("error has occured life data",error)
                  }
                );
            };


                  $scope.getAllPensionerId = function () {   

                    var date = new Date();
                    $scope.currentMonth = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() returns 0-11, so add 1
                    $scope.currentYear = date.getFullYear();
                    var monYr=$scope.currentYear+'-'+$scope.currentMonth;
                    $(".loaderbg").show();
                      $http.get(path+"/api/v1/pension/lifecert-pensionerid/not-submitted?yrMn="+monYr,{
                        
                        headers: {
                          'Authorization': 'Bearer ' + sessionStorage.token
                        }
                      })
                        .then(function (response) {
                          if(response.status==200){
                            $scope.allPensionersIdData=response.data.pensionerIdList;
                            console.log("response ",response.data);
                            
                            setTimeout(function () {
                              $('.dropdd').selectpicker();
                            },100);
                          }
                          else{

                          }
                          
                          $(".loaderbg").hide();
                          //  console.log("All pensioner_detial  data",$scope.allPensionersData)
                        },
                          function (error) {
                            $(".loaderbg").hide();
                            console.log("error has occured pensiondetial data",error)
                          }
                        );
                    };
                    $scope.getAllPensionerId();


                  $scope.dropData=[];
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
                      },
                        function (error) {
                          console.log("erroe has occured dropData data",error)
                        }
                      );
                  };
                  $scope.allDropdata();


                $scope.edit = function (n) {
                    $scope.flag=true
                    $scope.form = {
                        pensionerId: n.pensionerId,
                        finYear: n.finYear,
                        dateOfSubmission: n.dateOfSubmission,
                        certificateNo: n.certificateNo,
                        certificateDate: n.certificateDate,
                        imageFileName: n.imageFileName
                    }
                }

                $scope.getAllLifeData = function () {      
                  $http.get(path+"/api/v1/pension/lifecert",{
                    
                    headers: {
                      
                      'Authorization': 'Bearer ' + sessionStorage.token
                    }
                  })
                    .then(function (response) {
                      $scope.lifedata=response.data;
                       console.log("All Life  data",$scope.lifedata)
                    },
                      function (error) {
                        console.log("error has occured life data",error)
                      }
                    );
                };
                //  $scope.getAllLifeData();

                $scope.delete = function (n, m) {
                  
                    $http.delete(path+'/api/v1/pension/lifecert/' + n + '/' + m,{
                      
                      headers: {
                        'Authorization': 'Bearer ' + sessionStorage.token
                      }
                    })
                        .then(function (response) {
                          $('#deleteModal').modal('hide');
                            if (response.status === 204) {                             
                                toastr.success('Data Deleted successfully!', 'Success');
                                  $scope.lifeDataById(n); 
                            }
                        })
                        .catch(function (error) {
                            // Handle the error, e.g., show an error message
                            console.error('Error deleting item: ' + error);
                            toastr.error('Data Not Deleted!');
                            $('#deleteModal').modal('hide');
                        });
                }

                    //data set for delete model
                    $scope.deleteDataModel = {};
                    $scope.setDeleteData = function (data) {
                      $scope.deleteDataModel = angular.copy(data);      
                  };
                 


                  $scope.selectedImage = null;
                  $scope.imagePreview = null;

                  $scope.previewImage = function () {
                    var input = document.getElementById('fileInput');
            
                    if (input.files && input.files[0]) {
                        var reader = new FileReader();
            
                        reader.onload = function (e) {
                            $scope.$apply(function () {
                                $scope.imagePreview = e.target.result;
                            });
                        };
            
                        reader.readAsDataURL(input.files[0]);
                    }
                };
                $scope.selectedImage = null; 
                $scope.imagePreview = 'images/users.jpg'; 
                $scope.previewImage = function () {
                if ($scope.selectedFile) {
                  Upload.dataUrl($scope.selectedFile, true).then(function (url) {
                      $scope.imagePreview = url;
                  });
                }
                else{
                  $scope.imagePreview = 'images/users.jpg';
                }
                };


            });
