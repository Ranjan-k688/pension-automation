    app.controller('pensionertype', function ($scope, $http, $timeout) {
      $scope.form = {};
      $scope.IdDesable = false;
      $scope.formSubmitted = false;
      $scope.savePensionType = function (form) {
        // if ($scope.form.$invalid) {
        if (!$scope.isExsistpensionerTypeCode(form.pensionerTypeCode)) {
            // console.log(form);
            $http.post(path+"/api/v1/pension/pentypes", form,{
              
              headers: {
                
                'Authorization': 'Bearer ' + sessionStorage.token
              }
            })
            .then(function (response) {
            if (response.status == 200) {
              toastr.success("Data Saved Successfully!")
              // console.log("lkjshnlkjnh", response)
              $scope.form = {};
              $scope.getPensionerType();
              $scope.formSubmitted = true;
              $scope.IdDesable = false;
            }
          }, function (err) {
              toastr.error('Something went wrong !!', 'error');
          })
        } else {
          window.alert('This pensioner type code is already exsist.');
          $scope.form = {};
          $scope.formSubmitted = true;
        }
      }
      $scope.edit = function (n) {
        $scope.IdDesable = true;
        $scope.form = n;
        // console.log(n);
      }

      $scope.deleteData = function (pensionerTypeCode) {
        // console.log(">>>>>>>>>>>a", pensionerTypeCode);
        $http.delete(`${path}/api/v1/pension/pentype/${pensionerTypeCode}`,{
          
          headers: {
            
            'Authorization': 'Bearer ' + sessionStorage.token
          }
        })
          .then(function (response) {
            if (response.status == 200) {
              toastr.success('Deleted Successfully.', { timeOut: 5000 })
              $scope.getPensionerType();
              $scope.form = {};
            }
            // console.log("deleted>>>>>>>>>>>>>>>", response)
          }, function (err) {
            // console.log(err)
            if (err.status === 304) {
              toastr.warning("This pensioner type is already in use!");
            }

          })
      }

      $scope.getPensionerType = function () {
        $(".loaderbg").show();
        $http.get(path+"/api/v1/pension/pentypes",{
          
          headers: {
            
            'Authorization': 'Bearer ' + sessionStorage.token
          }
        })
          .then(function (response) {
            $(".loaderbg").hide(); 
            $scope.pensionTypeData = response.data;
          }, function (error) {
            $(".loaderbg").hide(); 
            if(error.data=="Expired token"){
              if(error.data=="Expired token"){
                  $rootScope.logout();
              }
          }else{
              alert("Error by server!!");
              $(".loaderbg").hide();   
          }
          })
      }
      $scope.getPensionerType();

      $scope.setDeleteData = function (n) {
        // Set the data to delete
        console.log("ranjanwrewrer>", n)
        $scope.deleteDataInfo = n;
        console.log("deleteDataInfo>", $scope.deleteDataInfo);
      };


      $scope.isExsist = false;

      $scope.isExsistpensionerTypeCode = function (pensionerTypeCode) {
        if (pensionerTypeCode) {
          // console.log(pensionerTypeCode);
          for (let i = 0; i < $scope.pensionTypeData.length; i++) {
            const element = $scope.pensionTypeData[i];
            if (element.pensionerTypeCode === pensionerTypeCode) {
              // console.log("bbbbbb", element.pensionerTypeCode, pensionerTypeCode);
              return true; // Found a match, return true
            }
          }
        }
        // If no match found, return false outside the loop
        // console.log("bbbbbba", "No match found for", pensionerTypeCode);
        return false;
      };
    })
