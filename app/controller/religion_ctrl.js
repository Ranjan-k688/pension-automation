

    app.controller('religion', function ($scope, $http, $timeout) {
      $scope.form = {};
      $scope.formSubmitted = false;
      $scope.savePensionType = function () {
        if (!$scope.isReligionExsist($scope.form.religionName)) {
        $http.post(path+"/api/v1/pension/religion", $scope.form,{
          
          headers: {
            
            'Authorization': 'Bearer ' + sessionStorage.token
          }
        })
          .then(function (response) {
            if (response.status === 200) {
              toastr.success("Data Saved Successfully!", {timeOut: 3000})
              $scope.form = {};
              $scope.getReligionData();
              $scope.formSubmitted = true;

            }
          }, function (err) {
            // alert("Something went wrong!");
            toastr.error('Something went wrong!')

          })
        }
        else {
          // alert("This religion name is already exsist!");
          toastr.error('This religion name is already exsist!')
      }
      }
      // }

      $scope.edit = function (n) {
        $scope.form = {
          religionName: n.religionName
        };
      }

      $scope.deleteData = function (a) {
        $http.delete(`${path}/api/v1/pension/religion/${a}`,{
          
          headers: {
            
            'Authorization': 'Bearer ' + sessionStorage.token
          }
        })
          .then(function (response) {
            if (response.status == 200) {
              $('#deleteConfirmationModal').modal('hide');
              $scope.getReligionData();
              toastr.success('Deleted Successfully!!.', {timeOut: 3000})
            }

          }, function (err) {
            $('#deleteConfirmationModal').modal('hide');
            toastr.warning("Unable to delete. This religion name is currently in use by existing records.",err, { timeOut: 3000 });

          })
      }

      $scope.setDeleteData = function (n) {
        $scope.deleteDataInfo = n;
      };


      $scope.getReligionData = function () {
        $http.get(path+"/api/v1/pension/religion",{
          
          headers: {
            
            'Authorization': 'Bearer ' + sessionStorage.token
          }
        })
          .then(function (response) {
            $scope.religionData = response.data;
          }, function (error) {
            if(error.data=="Expired token"){
              if(error.data=="Expired token"){
                  $rootScope.logout();
              }
          }else{
              alert("Error by server!!");  
          }
          })
      }
      $scope.getReligionData();

      $scope.isExsist = false;
      $scope.isReligionExsist = function (religionName) {
        if (religionName) {
          const lowerCaseReligionName = religionName.toLowerCase();
          const upperCaseReligionName = religionName.toUpperCase();

          for (let i = 0; i < $scope.religionData?.length; i++) {
            const element = $scope.religionData[i];
            const elementLowerCase = element.religionName.toLowerCase();
            const elementUpperCase = element.religionName.toUpperCase();

            if (elementLowerCase === lowerCaseReligionName ||
              elementUpperCase === upperCaseReligionName) {
              // console.log(element.religionName, religionName);
              return true;
            }
          }
        }
        return false;
      };

    })

