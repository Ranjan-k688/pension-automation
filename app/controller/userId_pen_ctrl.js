
app.controller('useridpen', function ($scope, $http,$window, $timeout,$rootScope) {
 
  $window.sessionStorage.setItem("app_user_status",'P');
  // alert('hello');

        //data set for delete model
        $scope.deleteDataModel = {};
        $scope.setDeleteData = function (data) {
          $scope.deleteDataModel = angular.copy(data);      
      };

  $scope.update = function (n) {
    $http.put(path + `/api/v1/users/update/${n.userId}`, n,{
      
      headers: {
        
        'Authorization': 'Bearer ' + sessionStorage.token
      }
    })
        .then(function successCallback(response) {
                console.log("response data", response.data);
                if (response.status === 201) {
                  $('#deleteModal').modal('hide');
                    $('#editpensioner').modal('hide');
                    toastr.success('Data Update successfully!', 'Success');
                } else {
                    toastr.error('An error occurred while Update data.', 'Error');
                }
            },

        );
};

  $scope.getAllApplication = function () {    
    $(".loaderbg").show();  
    $http.get(path+"/api/v1/users/all/?status=P",{
      
      headers: {
        
        'Authorization': 'Bearer ' + sessionStorage.token
      }
    })
      .then(function (response) {
        $scope.accountdetialData=response.data.users;
          console.log("All Application  data",$scope.accountdetialData);
          $(".loaderbg").hide();
          $scope.fetchMaster();
      },
        function (error) {
          console.log("error has occured application data",error)
        }
      );
  };
  $scope.getAllApplication();




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



  $scope.departments={};
  $scope.fetchMaster = function () {
    $(".loaderbg").show();
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
          $(".loaderbg").hide();        
       } },
       function (error) {
        console.log("error has occured application data",error) ;
        $(".loaderbg").hide();                  
       });
  
};



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
      $scope.accountdetialData=response.data.users;
      console.log(response.data);
  }).catch(function(error) {
      console.error(error);
  });
}
};


  })
