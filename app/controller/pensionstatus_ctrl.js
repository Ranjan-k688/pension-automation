app.controller('pensionstatus', function ($scope, $http, $timeout) {
  $scope.form = {};
  $scope.formSubmitted = false;
  $scope.isIdDisable = false;

  $scope.savePensionStatus = function (data) {
    $scope.form = data;
    // console.log($scope.form)
    
    $http.post(path + "/api/v1/pension/penstatus", data,{
      
      headers: {
        
        'Authorization': 'Bearer ' + sessionStorage.token
      }
    })
      .then(function (response) {
        if (response.status == 200) {
          $('#editpensioner').modal('hide'); 
          toastr.success('Save Data Successfully!!.', { timeOut: 5000 })
          $scope.form = {};
          $scope.getPensionStatus();
          $scope.formSubmitted = true;
        }
      }, function (err) {
        console.log(err)
        toastr.error('Something Went Wrong!!.', { timeOut: 5000 })

      })
  }

  $(document).keydown(function (event) {
    if (event.which == 27) {
      $('#editpensioner').modal('hide');
    }
  });


  $scope.isIdDisable = false;
  $scope.edit = function (n) {
    // console.log(n)
    $scope.isIdDisable = true;

    $scope.uForm = {
      pensionerId: n.pensionerId,
      dateFrom: n.dateFrom,
      stoppedPercentage: n.stoppedPercentage
    }
  }
  function formatDate(inputDate) {
    const parts = inputDate.split('-');
    if (parts.length === 3) {
      const day = parts[0];
      const month = parts[1];
      const year = parts[2];
      const formattedDate = `${year}-${month}-${day}`;
      return formattedDate;
    } else {
      return "Invalid Date";
    }
  }


  $scope.getAllPensioner = function () { 
    $(".loaderbg").show();      
    $http.get(path+"/api/v1/pensioners/pensionersId?verifiedId=true",{
      
      headers: {
        
        'Authorization': 'Bearer ' + sessionStorage.token
      }
    })
      .then(function (response) {
          if(response){
            $scope.allPensionersData=response.data;
            setTimeout(function () {
              $('.dropdd').selectpicker();
            },150);
            $(".loaderbg").hide();
          } 
      },
        function (error) {
          if(error.data=="Expired token"){
            if(error.data=="Expired token"){
                $rootScope.logout();
            }
        }else{
            alert("Error by server!!");  
            console.log("error has occured pensiondetial data",error); 
        }
        $(".loaderbg").hide();
        }
      );
  };
  $scope.getAllPensioner();


  $scope.payData = [];
  $scope.paydetialData = [];
  $scope.payDataById = function (pensionerId) {
    if (pensionerId) {

      $http.get(`${path}/api/v1/pensioners/${pensionerId}`,{
        
        headers: {
          
          'Authorization': 'Bearer ' + sessionStorage.token
        }
      })
        .then(function (response) {
          $scope.payData = response.data;
          $scope.pensionStatusData = $scope.pensionStatusDataAll.filter(x => x.pensionerId === pensionerId);
          console.log("clicked!!!!");
          $scope.form.aadhaar = $scope.payData.aadhaar;
          $scope.form.pensionerId = response.data.pensionerId;
          $scope.setPensionerStatusFields(response.data.pensionerId);
          $scope.form.employeeName = $scope.payData.employeeName;
          $scope.form.payCommissionCode = $scope.payData.payCommissionCode;
          $scope.form.ppoNo = $scope.payData.ppoNo;
          if($scope.payData.pan==null){
            $scope.form.pan="No Record";
          }else{
            $scope.form.pan=$scope.payData.pan;
          }
          $scope.form.pensionerStatusCode = $scope.payData.pensionerStatusCode;
          $scope.form.departmentCode = $scope.payData.departmentCode;
          $scope.form.collegeCode = $scope.payData.collegeCode;
          if (response.status == '204') {
            toastr.success('Data Deleted successfully!', 'Success');
            $scope.getDependent();
          }
        },
          function (error) {
            // console.log("erroe has occured allhandicaped data")
          }
        );
    } else {
      $scope.pensionStatusData = [];
      $scope.form.aadhaar = null;
      $scope.form.employeeName = null;
      $scope.form.payCommissionCode = null;
      $scope.form.ppoNo = null;
      $scope.form.pan = null;
      $scope.form.pensionerStatusCode = null;
      $scope.form.departmentCode = null;
      $scope.form.collegeCode = null;

    }
  }
  $scope.dropData = [];
  $scope.allDropdata = function () {
    $http.get(path + "/api/v1/dropdown/list",{
      
      headers: {
        
        'Authorization': 'Bearer ' + sessionStorage.token
      }
    })
      .then(function (response) {
        $scope.clgs = response.data.colleges;
        $scope.depts = response.data.departments;
        // console.log("dropData data",$scope.clg);  
      },
        function (error) {
          console.log("erroe has occured dropData data",error)
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

  $scope.deleteData = function (a, b) {
    b = formatDate(b);
    $http.delete(`${path}/api/v1/pension/penstatus/${a}/${b}`,{
      
      headers: {
        
        'Authorization': 'Bearer ' + sessionStorage.token
      }
    })
      .then(function (response) {
        if (response.status == 204) {
          $('#deleteModal').modal('hide');
          $scope.getPensionStatus();
          toastr.success('Deleted Successfully!!.', { timeOut: 5000 });
          $scope.form = {};
        }
      }, function (err) {
        // console.log(err);
      })
  }


  $scope.setDeleteData = function (n) {
    $scope.deleteDataInfo = n;
  };


  $scope.getPensionStatus = function () {
    $http.get(path + "/api/v1/pension/penstatus",{
      
      headers: {
        
        'Authorization': 'Bearer ' + sessionStorage.token
      }
    })
      .then(function (response) {
        // console.log("all pension Status Data >>>>>>>>>>", response);
        $scope.pensionStatusDataAll = response.data;
        $scope.pensionStatusData = $scope.pensionStatusDataAll;
      }, function (err) {
        // console.log(err)
      })
  }
  $scope.getPensionStatus();

  $scope.setPensionerStatusFields = (pensionerId) => {
    for (let i = 0; i < $scope.pensionStatusDataAll.length; i++) {
      const element = $scope.pensionStatusDataAll[i];
      if (element.pensionerId === pensionerId) {
        $scope.form.dateFrom = element.dateFrom;
        $scope.form.stoppedPercentage = element.stoppedPercentage;
        return;
      } else {
        $scope.form.dateFrom = null;
        $scope.form.stoppedPercentage = null;
      }

    }
  }

  // $scope.masterDetails = [];
  // $scope.getMasterDetails = function () {
  //   $http.get(path + "/api/v1/pension/master",{
      
  //     headers: {
        
  //       'Authorization': 'Bearer ' + sessionStorage.token
  //     }
  //   })
  //     .then(function (response) {
  //       // console.log("masterDetails>>>>>>>>", response)

  //       $scope.masterDetails = response.data;
  //       // console.log("master details>>>>>>>>>>>>>>>>>>",$scope.masterDetails)
  //     }, function (err) {
  //       // console.log(err)
  //     })
  // }
  // $scope.getMasterDetails();


})
