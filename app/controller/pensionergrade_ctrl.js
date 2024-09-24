
app.controller('pensionergrade', function ($scope, $http, $timeout) {

  $scope.form = {};
  $scope.formSubmitted = false;
  $scope.savePensionGrade = function (data) {
    console.log(data)
    if ($scope.penform.$valid || $scope.upenform.$valid) {
      $http.post(path + "/api/v1/pension/pensionergrade", data,{
        
        headers: {
          
          'Authorization': 'Bearer ' + sessionStorage.token
        }
      })
        .then(function successCallback(response) {
          if (response.status === 200) {
            $scope.isIdDisable=false;
            if (!$('#editpensioner').modal('hide')) {
                $('#editpensioner').modal('hide');
            }
            toastr.success("Saved Successfully!", 'Success');
            $scope.form = {};
            $scope.allDropdata();
            $scope.formSubmitted = true;
          } else {
            console.log(response);
          }
        }, function errorCallback(err) {
          if (err.status === 500) {
            toastr.error("Kindly fill all mandatory Fields!", 'error')
          }
          else {

            toastr.error("Something went wrong!", 'error')
          }
        })
    } else {
      if (!$scope.timeoutPromise) {
        toastr.error('Please fill in all required fields.', 'Error');
        $scope.timeoutPromise = $timeout(function () {
          $scope.timeoutPromise = null;
        }, 3000);
      }
    }
  }
  $scope.isIdDisable = false;
  $scope.deleteData = function (a, b) {


    
    // console.log(">>>>>>>>>>>a,p", a, b);
    $http.delete(`${path}/api/v1/pension/pensionergrade/${a}/${b}`,{
      
      headers: {
        
        'Authorization': 'Bearer ' + sessionStorage.token
      }
    })
      .then(function (response) {
        if (response.status == 200) {
          $scope.isIdDisable = false;
          toastr.success(response.data.message, { timeOut: 3000 })
          $scope.allDropdata();
          // console.log("deleted", response);
          // $('#deleteConfirmationModal').modal('show');
        }
        // $scope.form = {};
      }, function (err) {
        // console.log(err)
        if (err.status === 304)
          toastr.warning("This Grade is used with Pensioner.", { timeOut: 3000 })
      })
  }


  $scope.setDeleteData = function (n) {
    // Set the data to delete
    // console.log("ranjan>",n)
    $scope.deleteDataInfo = {
      pensionerTypeCode: n.pensionerTypeCode,
      gradeCode: n.gradeCode
    };
    // console.log("deleteDataInfo>", $scope.deleteDataInfo)
  };

  $scope.uform = {};
  $scope.edit = function (n) {
    console.log(n)
    $scope.uform = {
      pensionerTypeCode: n.pensionerTypeCode,
      gradeCode: n.gradeCode,
      dscr: n.dscr
    };
    $scope.isIdDisable = true;
    // console.log(n);
  }
  $scope.dropData = [];
  $scope.allDropdata = function () {
    $(".loaderbg").show();  
    $http.get(path + "/api/v1/dropdown/list",{
      
      headers: {
        
        'Authorization': 'Bearer ' + sessionStorage.token
      }
    })
      .then(function (response) {
        $(".loaderbg").hide(); 
        $scope.pensionerTypeData = response.data.pensionerType;
        $scope.pensionerDesignationData = response.data.pensionerDesignation;
        $scope.pensionGradeData = response.data.pensionerGrade;

      },
        function (error) {
         console.log("erroe has occured dropData data", error);
         $(".loaderbg").hide(); 
         if(error.data=="Expired token"){
          if(error.data=="Expired token"){
              $rootScope.logout();
          }
      }else{
          alert("Error by server!!"); 
          $(".loaderbg").hide();  
      }
        }
      );
  };
  $scope.allDropdata();

  $scope.setGrdeDiscription = function (gradeCode) {
    $scope.pensionGradeData.forEach(element => {
      if (element.gradeCode === gradeCode) {
        $scope.form.dscr = element.dscr;
        // console.log("gradeCode>>>>>>", element);
      }
    });
  }

})
