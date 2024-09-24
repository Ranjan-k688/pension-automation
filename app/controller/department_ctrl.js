
        app.controller('department', function ($scope, $http, $timeout, $window, $rootScope, $filter) {
            $scope.flag = false;

            $scope.temp=[];
            $scope.save = function (n) {
                var departmentId={
                    collegeCode:n.collegeCode,
                    departmentCode:n.departmentCode,
                    universityCode:n.universityCode
                }
                var postData = {
                    departmentId: departmentId,
                    departmentIds:n.departmentIds,
                    collegeTypeCode:n.collegeTypeCode,
                    deptShortName:n.deptShortName,
                    dscr:n.dscr
                    
                };
                $scope.myform.$submitted = true;  
                if ($scope.myform.$valid) {
                    $http.post(path+"/api/v1/pension/department", postData,{
                      headers: {
                        
                        'Authorization': 'Bearer ' + sessionStorage.token
                      }
                    })
                        .then(function successCallback(response) {
                            // console.log(">>>>>",response.data)
                            $scope.temp.push(response.data);
                            $scope.getdept($scope.temp[0].departmentId.departmentCode);                                                          
                            $scope.form = {};
                            $scope.formSubmitted = true;
                            $scope.flag=false;
                            if (response.status === 200) {
                              $('#editpensioner').modal('hide'); 
                                $scope.pcode=false;
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

            $scope.getdeptdata = function () {
                $http.get(path+"/api/v1/pension/department",{
                  headers: {
                    
                    'Authorization': 'Bearer ' + sessionStorage.token
                  }
                })
                    .then(function successCallback(response) {
                        $scope.deptdata = response.data;
                        for(var a=0;a<$scope.deptdata.length;a++){
                            $scope.deptdata[a].collegeCode=$scope.deptdata[a].departmentId.collegeCode;
                            $scope.deptdata[a].universityCode=$scope.deptdata[a].departmentId.universityCode;
                            $scope.deptdata[a].departmentCode=$scope.deptdata[a].departmentId.departmentCode;
                            }
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
            $scope.getdeptdata();

         
            $scope.getdept = function (departmentCode) {
                $http.get(path+`/api/v1/pension/department/${departmentCode}`,{
                  headers: {
                    
                    'Authorization': 'Bearer ' + sessionStorage.token
                  }
                })
                    .then(function successCallback(response) {
                        $scope.deptdata=[];
                        console.log("empty",$scope.deptdata)
                        $scope.deptdata = response.data;
                        for(var a=0;a<$scope.deptdata.length;a++){
                            $scope.deptdata[0].collegeCode=$scope.deptdata[a].departmentId.collegeCode;
                            $scope.deptdata[0].universityCode=$scope.deptdata[a].departmentId.universityCode;
                            $scope.deptdata[0].departmentCode=$scope.deptdata[a].departmentId.departmentCode;
                            $scope.deptdata[0].dscr=$scope.deptdata[a].dscr;
                            $scope.deptdata[0].deptShortName=$scope.deptdata[a].deptShortName;
                            $scope.deptdata[0].collegeTypeCode=$scope.deptdata[a].collegeTypeCode;
                            }
                        console.log("ffff", $scope.deptdata)

                    },
                        function errorCallback(error) {
                            console.log("Unable to perform  request",error);
                        }
                    );
            };

            $scope.checkDuplicate = function (val1) {
                var req = {
                  method: 'GET',
                  url: path+'/api/v1/pension/department',
                  headers: {
                    
                    'Authorization': 'Bearer ' + sessionStorage.token
                  }         
                };         
                $http(req).then(function(res){ 
                for(var a=0;a<res.data.length;a++){
                   $scope.deptdata[a].departmentCode=res.data[a].departmentId.departmentCode;
                };
                  if (res.status == 200) {
                    $scope.pcode = false;
                    for (var i = 0; i < $scope.deptdata.length; i++) {
                      if (val1 == $scope.deptdata[i].departmentCode) {
                        $scope.pcode = true;                       
                        break; 
                      }
                    }            
                  } else {
                    alert("Something went wrong!!");
                  }
                });
              };

  
              $scope.clgType=[];
              $scope.allClgdata = function () {   
                $http.get(path+`/api/v1/pension/cllgtype`,{
                  
                  headers: {
                    
                    'Authorization': 'Bearer ' + sessionStorage.token
                  }
                })
                  .then(function (response) {           
                    $scope.clgTypedata=response.data; 
                  },
                    function (error) {
                      console.log("erroe has occured collegeType data",error)
                    }
                  );
              };
              $scope.allClgdata();

            $scope.dropData=[];
            $scope.clgData=[];
            $scope.allDropdata = function () {   
              $http.get(path+`/api/v1/dropdown/list`,{
                
                headers: {
                  
                  'Authorization': 'Bearer ' + sessionStorage.token
                }
              })
                .then(function (response) {           
                  $scope.clgs=response.data.colleges;
                  $scope.collegedata=response.data.colleges;
                  $scope.unidata=response.data.universities; 
                  $scope.clgType=response.data.collegeTypes ;
                   $scope.alldpaycommision=response.data.payCommisions;
                for (var a = 0; a < $scope.collegedata.length; a++) {
                    var newEntry = {
                        collegeCode: $scope.collegedata[a].collegeId.collegeCode,
                        clgdscr: $scope.collegedata[a].dscr
                    };
                
                    $scope.clgData.push(newEntry);
                }
                },
                  function (error) {
                    console.log("erroe has occured dropData data",error)
                  }
                );
            };
            $scope.allDropdata();

            
            $scope.edit = function (n) {
                // console.log("collegeType Code",n)
              $scope.flag=true;
                $scope.form = {
                    collegeCode: n.collegeCode,
                    departmentIds: n.departmentIds,
                    dscr: n.dscr,
                    universityCode: n.universityCode,
                    departmentCode: n.departmentCode,
                    deptShortName: n.deptShortName,
                    collegeTypeCode: n.collegeTypeCode
                }
            }

            $scope.deleteDataModel = {};
            $scope.setDeleteData = function (data) {
              $scope.deleteDataModel = angular.copy(data);      
          };
      


            $scope.deletedept = function (collegeCode, universityCode, departmentCode) {
                $http.delete(path+`/api/v1/pension/department/${collegeCode}/${universityCode}/${departmentCode}`,{
                  
                  headers: {
                    
                    'Authorization': 'Bearer ' + sessionStorage.token
                  }
                })
                .then(function (response) { 
                  console.log("response",response.status) 
                  if (response.status === 204) {
                    toastr.success('Data Deleted successfully!', 'Success');
                    $scope.getdeptdata();
                    $('#deleteModal').modal('hide')
                }else if(response.status === 500){
                  toastr.success('Internal server Error');
                  $('#deleteModal').modal('hide');

                }else if(response.status === 203){
                  toastr.error('The data is dependent on another table and has not been deleted');
                  $('#deleteModal').modal('hide');

                }  
    })
 };




            $scope.getPayCode = function (collegeTypeCode) {
                for (let index = 0; index < $scope.clgType.length; index++) {
                  const element = $scope.clgType[index];
                  if (element.collegeTypeCode === collegeTypeCode) {
                    return element.description;
                  }
                }
              };

              $scope.cls=function(){ 
                $scope.flag=false;
                $scope.form.universityCode= "";
                $scope.form.collegeCode= "";
                $scope.form.departmentCode= "";
                $scope.form.deptShortName= "";
                $scope.form.dscr= "";
                $scope.form.collegeTypeCode= "";
        
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
 
  $http.get(path+'/api/v1/pension/department/search', 
  {
    params: params,
    
    headers: {
      
      'Authorization': 'Bearer ' + sessionStorage.token
    }
  }).then(function(response) {
        $scope.k = response.data;
        for(var a=0;a<$scope.k.length;a++){
          $scope.k[a].collegeCode=$scope.k[a].departmentId.collegeCode;
          $scope.k[a].universityCode=$scope.k[a].departmentId.universityCode;
          $scope.k[a].departmentCode=$scope.k[a].departmentId.departmentCode;
          }
        $scope.deptdata = $scope.k;
    console.log("$scope.deptdata",$scope.deptdata);
  }).catch(function(error) {
      console.error(error);
  });
};


 });
