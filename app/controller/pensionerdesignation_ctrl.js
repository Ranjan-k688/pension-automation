

app.controller('pensionerdesignation', function ($scope, $http, $timeout) {


  $scope.form = {};
  $scope.formSubmitted = false;
  $scope.idDisable = false;

  $scope.savePensionGrade = function (data) {
    if (!$('#pendsig').modal('hide')) {
      $('#pendsig').modal('hide');
    }
    console.log($scope.form, data);
    // if ($scope.form.$valid) {
    $scope.formSubmitted = false;
    // $scope.form.gradeCode = convertDateFormat($scope.form.gradeCode)
    // $scope.form.desigShortName = convertDateFormat($scope.form.desigShortName)
    console.log($scope.form)
    $http.post(path + "/api/v1/pension/pendesig", data,{
      
      headers: {
        
        'Authorization': 'Bearer ' + sessionStorage.token
      }
    })
      .then(function (response) {
        console.log("lkjshnlkjnh", response)
        if (response.status == 200) {
          toastr.success('Data saved successfully!', 'Success');
          // alert('Data saved successfully!')
          $scope.form = {};
          $scope.allDropdata();
          $scope.formSubmitted = true;
          $scope.idDisable = false;
        }
        if (response.status == 203) {
          toastr.warning("Cannot update data. It is currently in use elsewhere.", 'Warning');
          // alert('Data saved successfully!')
          $scope.form = {};
          $scope.allDropdata();
          $scope.formSubmitted = true;
          $scope.idDisable = false;
        }
      }, function (err) {
        console.log(err)
      })


    // else {
    //   console.log("Something Wrong!!!!")
    //   alert("Somthing Wrong!!!!")
    // }
  }



  $scope.edit = function (n) {
    $scope.uform = {
      designationId: n.designationId,
      pensionerTypeCode: n.pensionerTypeCode,
      gradeCode: n.gradeCode,
      desigShortName: n.desigShortName,
      dscr: n.dscr,
    };
    $scope.idDisable = true;
    // console.log(n);
  }

 

  $scope.deleteData = function (pensionerTypeCode, gradeCode, desigShortName) {
    $http.delete(`${path}/api/v1/pension/pendesig`, {
      params: {
        pensionerTypeCode: pensionerTypeCode,
        gradeCode: gradeCode,
        desigShortName: desigShortName
      },
      headers: {
        
        'Authorization': 'Bearer ' + sessionStorage.token
      }
    })
      .then(function (response) {
        if (response.status === 200) {
          // Close the modal
          $('#deleteModal').modal('hide');
          // Display a success message
          toastr.success('Deleted Successfully.', { timeOut: 3000 });
          // Refresh dropdown data
          $scope.allDropdata();
          console.log("deleted", response);
        } else if (response.status === 203) {
          if (!$('#deleteModal').modal('hide')) {
            $('#deleteModal').modal('hide');
          }
          toastr.warning("This Designation is used with Pensioner.", { timeOut: 3000 });
        }
      })
      .catch(function (err) {
        console.log("this is err", err);
        if (err.status === 500) {
          // Display a warning message if the designation is in use
          toastr.warning("This Designation is used with Pensioner.", { timeOut: 3000 });
        } else {
          // Handle other error cases
          console.error("Error deleting data:", err);
        }
      });

  };

  
  $scope.setDeleteData = function (n) {
    // Set the data to delete
    console.log("ranjan>", n)
    $scope.deleteDataInfo = {
      pensionerTypeCode: n.pensionerTypeCode,
      gradeCode: n.gradeCode,
      desigShortName:n.desigShortName
    };
    console.log("deleteDataInfo>", $scope.deleteDataInfo)
  };
  
  $scope.dropData = [];
  $scope.allDropdata = function () {
    $http.get(path + "/api/v1/dropdown/list",{
      
      headers: {
        
        'Authorization': 'Bearer ' + sessionStorage.token
      }
    })
    .then(function (response) {
      $scope.pensionerTypeData = response.data.pensionerType;
      $scope.pensionerDesignationData = response.data.pensionerDesignation;
      $scope.pensionGradeData = response.data.pensionerGrade;
      },
        function (error) {
          console.log("erroe has occured dropData data", error);
          if(error.data=="Expired token"){
            if(error.data=="Expired token"){
                $rootScope.logout();
            }
        }else{
            alert("Error by server!!");  
        }
        }
      );
  };
  $scope.allDropdata();

  $scope.getPensionerTypeCodeDscr = function (pensionerTypeCode) {
    // console.log(pensionerTypeCode);
    // $scope.pensionerTypeData.forEach(element => {
    for (let index = 0; index < $scope.pensionerTypeData.length; index++) {
      const row = $scope.pensionerTypeData[index];

      if (row.pensionerTypeCode === pensionerTypeCode) {
        // console.log(row.dscr);
        return row.dscr;
      }
    }

  }

})


