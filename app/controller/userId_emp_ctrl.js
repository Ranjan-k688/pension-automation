
app.controller('useridemp', function ($scope, $http,$rootScope,$window) {

  
  $window.sessionStorage.setItem("app_user_status",'E');
          //data set for delete model
          $scope.deleteDataModel = {};
          $scope.setDeleteData = function (data) {
            $scope.deleteDataModel = angular.copy(data);      
        };
  
 
  $scope.save = function (n) {
        $http.post(path+"/api/v1/pension/agevsbasic", n,{
          
          headers: {
            
            'Authorization': 'Bearer ' + sessionStorage.token
          }
        })
            .then(function successCallback(response) {
                if (response.status === 200) {
                    $('#editpensioner').modal('hide'); 
                    toastr.success('Data saved successfully!', 'Success');
                } else {
                    toastr.error('An error occurred while saving data.', 'Error');
                }

            },
                function errorCallback(error) {
                    toastr.error('An error occurred while saving data.', error);
                });
       }


  $scope.handleLink = function (pgname) {
    $rootScope.handleLink(pgname);
  };
  


  $scope.accountdetialData=[];

  $scope.getAllApplication = function () {
       $(".loaderbg").show();
    $http.get(path + "/api/v1/users/all/?status=E",{
      
      headers: {
        
        'Authorization': 'Bearer ' + sessionStorage.token
      }
    })
        .then(function (response) {
            //  console.log("All Application response data", response.data);
            $scope.p = response.data;
            $scope.accountdetialData = $scope.p.users;
            setTimeout(function () {
              $('.dropdd').selectpicker();
            },15);
            // Set initial values for invigilator based on roleMasters
            $scope.accountdetialData.forEach(function (item) {
              item.roleMasters = item.roleMasters.map(function (role) {
                  return role.roleCode;
              }); 
          });
            $scope.fetchMaster();
             $(".loaderbg").hide();
          
        },
            function (error) {
               $(".loaderbg").hide();
            }
        );
};
 
  
       
  $scope.showdetails={};
      $scope.edit = function (n) {
          $scope.showdetails=n;
          $('#showUserModal').modal('show');
          $('.popupbg').show();
      }

      $scope.closemodal = function (){
        $('.popupbg').hide();
        $('#showUserModal').modal('hide');
      };



      $scope.dropData=[];
      $scope.roleData={};
      $scope.allDropdata = function () { 
        //  $(".loaderbg").show();  
        $http.get(path+`/api/v1/dropdown/list`,{
          
          headers: {
            
            'Authorization': 'Bearer ' + sessionStorage.token
          }
        })
          .then(function (response) {
             $scope.roleData=response.data.roleMasters;
             $scope.getAllApplication();
            //  $(".loaderbg").hide();
          },
            function (error) {
              console.log("erroe has occured dropData data");
              //  $(".loaderbg").hide();
            }
          );
      };
      $scope.allDropdata();


      $scope.update = function(val) {

        rolmaster = [];
        if(val.roleMasters.length>0){
          for (let i = 0; i < val.roleMasters.length; i++) {
            rolmaster[i] = {};
            rolmaster[i].roleCode = val.roleMasters[i];
        }
        }
        
       var applicationUserDto=
        {
          "userId": val.userId,
          "statusCode": val.statusCode,
          "roleMasters":rolmaster
        }
      
        var req = {
          method: 'PUT',
          url: path + "/api/v1/users/update/"+val.userId,
          headers: {
            'Authorization': "Bearer " + sessionStorage.token,
            'Content-Type': 'application/json'
          },
          data: applicationUserDto
        };
      
        $http(req).then(
          function(res) {
            if (res.status == 201) {
              $('#deleteModal').modal('hide');
              toastr.success('Data Update successfully!', 'Success');
              $scope.getAllApplication();
            } else {
              toastr.error('An error occurred while Updating data.', 'Error');
              $scope.getAllApplication();
            }
          },
          function(err) {
            toastr.error('An error occurred while Updating data.',err);
            $scope.getAllApplication();
          }
        );
      
      };

      $scope.departments={};
  $scope.fetchMaster = function () {
    //  $(".loaderbg").show();
    var req = {
      method: 'GET',
      headers: {
        'Authorization': "Bearer " + sessionStorage.token,
        'Content-Type': 'application/json'
      },
      url: path+'/api/v1/dropdown/list',
    };
    
   $http(req).then(function(masterdata_res){
       if (masterdata_res) {
          $scope.masterdata=masterdata_res.data.masterDetails;
          //  $(".loaderbg").hide();        
       } },
       function (error) {
        console.log("error has occured application data",error) ;               
       });
  
};


$scope.accountdetialData=[];
$scope.k=[];
$scope.searchPensionerDetails = function( val1,val2,flag) {
  console.log("chk",val1,val2,flag)
  var params = {};
  var s='status';
  params[s]=flag;
  params[val1] = val2;
 
  if(flag){
  $http.get(path+'/api/v1/users/all/',{
      params: params,
      headers: {
        
        'Authorization': 'Bearer ' + sessionStorage.token
      }
  }).then(function(response) {
    console.log("response data",response.data);
    

        console.log("$scope.accountdetialData",$scope.accountdetialData);
        $scope.k = response.data;
        $scope.accountdetialData = $scope.k.users;
        setTimeout(function () {
          $('.dropdd').selectpicker();
        },150);
        $scope.accountdetialData.forEach(function (item) {
        item.roleMasters = item.roleMasters.map(function (role) {
            return role.roleCode;
        }); 
    });
    console.log("$scope.accountdetialData2",$scope.accountdetialData);
  }).catch(function(error) {
      console.error(error);
  });
}
};

      
  });
