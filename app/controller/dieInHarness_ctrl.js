

app.controller('dieInHarness',function($scope,$http,sharedService, $rootScope) {


  $scope.handleLink = function (pgname) {
    $rootScope.handleLink(pgname);
  };
    
    $scope.pensionerData={};
    $scope.flgmain=false;
    $scope.dobflg=false;
    $scope.la=false;
    $scope.rgl=false;
    $scope.spr=false;
    $scope.form ={};
    $scope.pensionerAccounts =[{}];
   
    $scope.masterdata=[];
    $scope.postoffice=[];
    $scope.showdetails=[];
    $scope.frm={};
    $scope.departments={};
    $scope.form.pensionerStatusCode=0;
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
            $scope.religion=masterdata_res.data.religion;
            $scope.collegeTypes=masterdata_res.data.collegeTypes;
            $scope.subjects=masterdata_res.data.subject;
            $scope.relationship=masterdata_res.data.relationship;
            $scope.pensionerType=masterdata_res.data.pensionerType;
            $scope.pensionerGrade=masterdata_res.data.pensionerGrade;
            $scope.pensionerDesignation=masterdata_res.data.pensionerDesignation;
            $scope.pensionerStatus=masterdata_res.data.pensionerStatus;
            $scope.universities=masterdata_res.data.universities;
            $scope.form.universityCode=$scope.universities[0].universityCode;
            $scope.colleges=masterdata_res.data.colleges;
            $scope.departments=masterdata_res.data.departments;
            $scope.masterdata=masterdata_res.data.masterDetails;
            $scope.payCommisions=masterdata_res.data.payCommisions;
            $scope.banklist=masterdata_res.data.bank;
            $(".loaderbg").hide();
            setTimeout(function () {
              $('.dropdd').selectpicker();
            },150);
  
          
         }
  
         else {
        }
  
         },
         function (err) {
          if(err.data=="Expired token"){
            $rootScope.logout();
        }  
                   
         });
    
  };
  $scope.fetchMaster();
  
  $scope.getFilteredDesignation = (gradeCode) => {
    if (gradeCode) {
        const filteredDesignation = $scope.pensionerDesignation.filter(deg =>
            deg.gradeCode === gradeCode
        );
  
        const descriptions = filteredDesignation.map(deg => deg.dscr);
        return descriptions;
    }
  
    return [];
  };
  
  $scope.address = function(val)
  {
  $http.get("https://api.postalpincode.in/pincode/"+val).then(function(res) {
  if(res.data[0].Status!="Error"){
    $scope.pinflag=false;
    $scope.postoffice=res.data[0].PostOffice;
      $scope.form.state =res.data[0].PostOffice[0].State;               			
      $scope.form.city=res.data[0].PostOffice[0].District;
  }
  else{
  // alert("Please Enter Valid Pin Code!");
  $scope.pinflag=true;
  $scope.form.state ="";               			
  $scope.form.city="";
  $scope.postoffice=[];
  toastr["error"]("Please Enter Valid Pin Code!");
  }
    });	
  
  
  };
  // $scope.address(83402);
  $scope.formatDate = function(dateString) {
    if (dateString && dateString.split('-').length === 3) {
        const parts = dateString.split('-');
        return parts[2] + '-' + parts[1] + '-' + parts[0];
    }
    return dateString;
  };
  
  $scope.formatDateToPreviousType = function(dateString) {
    if (dateString && dateString.split('-').length === 3) {
        const parts = dateString.split('-');
        return parts[2] + '-' + parts[1] + '-' + parts[0];
    }
    return dateString;
  };
  
  
      $scope.save = function () {
       if($scope.dieInHarnessForm.$valid && !$scope.la && !$scope.rgl && !$scope.spr && !$scope.aadhardup && !$scope.pandup && !$scope.mobiledup && !$scope.pponodup){
        $scope.flgmain=false;
        $scope.pensionerData= {
          "userIdMaker": sessionStorage.appuserId,
          "ruSlno": null,
          "prefix": $scope.form.prefix,
          "employeeName": $scope.form.employeeName,
          "sex": $scope.form.sex,
          "dateOfBirth": $scope.form.dateOfBirth,
          "rateOfPension": $scope.form.rateOfPension,
          "fatherName": $scope.form.fatherName,
          "universityCode": $scope.form.universityCode,
          "collegeCode": $scope.form.collegeCode,
          "departmentCode": $scope.form.departmentCode,
          "pensionerTypeCode": $scope.form.pensionerTypeCode,
          "gradeCode": $scope.form.gradeCode,
          "desigShortName": $scope.form.desigShortName,
          "subjectCode": $scope.form.subjectCode,
          "religionName": $scope.form.religionName,
          "dateOfLastAppointment": $scope.form.dateOfLastAppointment,
          "dateOfRegularisation": $scope.form.dateOfRegularisation,
          "payCommissionCode": $scope.form.payCommissionCode,
          "dateOfSeparation": $scope.form.dateOfSeparation,
          "pensionerUnivId": $scope.form.pensionerUnivId,
          "pensionerName": $scope.form.employeeName,
          "pensionerRelation": "Self",
          "ppoNo": $scope.form.ppoNo,
          "aadhaar": $scope.form.aadhaar,
          "pan": $scope.form.panRecord === 'N' ? undefined : $scope.form.pan,
          "panRecord": $scope.form.panRecord,
          "mobileNo": $scope.form.mobileNo,
          "dateOfDeath": $scope.form.dateOfDeath,
          "pensionerStatusCode": $scope.form.pensionerStatusCode,
          "remarks": $scope.form.remarks,
          "addr1": $scope.form.addr1,
          "addr2": $scope.form.addr2,
          "city": $scope.form.city,
          "state": $scope.form.state,
          "pin": $scope.form.pin,
          "dihStatus": 'Y'
            };
  
        var req = {
          method: 'POST',
          url: path+'/api/v1/pensioners/?isPensioner=false',
          headers: {
            'Authorization': "Bearer " + sessionStorage.token,
            'Content-Type': 'application/json'
          },
          data: $scope.pensionerData
        };
        
       $http(req).then(function(res){
  
           if (res.data[1]=='Saved successfully') {
            alert("Data Saved Successfully!!");
            $scope.form ={};
            $scope.bank =[];
            $scope.paydetail =[];
            $scope.handleLink("list_pensioner");
           }
           else if (res.data[-1]=='Saved failed due to Id generation') {
            alert(res.data[-1]);
           }
           else {
            alert("Something Went Wrong!!");
          }
  
           },
              function (err) {
                alert("Error occured!!");   
                     
           });
          }
          else{
            $scope.flgmain=true;
            alert("Please Fill All Compulsory Field");
          }
       
  
  };
  
  $scope.departmentlist=[];
  $scope.fetchdepartment = function (val) {
    $scope.departmentlist=[];
    $scope.departmentlist = $scope.departments.filter(function(item) {
      return item.departmentId.collegeCode == val;
  });
  setTimeout(function () {
    // $('.dropdd1').selectpicker();
    $('.dropdd1').selectpicker('refresh');
  },100);
  
  };
  $scope.fetchgrade = function (val) {
    $scope.gradelist=[];
    $scope.gradelist = $scope.pensionerGrade.filter(function(item) {
      return item.pensionerTypeCode == val;
  });
        setTimeout(function () {
          $('.dropdd2').selectpicker('refresh');
          $('.dropddsub').selectpicker('refresh');
        },100);
  
  };
  $scope.fetchdesigation = function (val) {
    $scope.pensionerDesignationList=[];
    $scope.pensionerDesignationList = $scope.pensionerDesignation.filter(function(item) {
      return item.gradeCode == val;
  });
            setTimeout(function () {
              $('.dropdd3').selectpicker('refresh');
            },100);
  };
 
  
  $scope.exportToExcel = function (){
  
    console.log("export");
     $(".excelformate").table2excel({
        filename : "pensioner-details.xls"
      });
  };
 
  
  $scope.showdata = function (val){
    $('.popupbg').show();
    $scope.showdetails=val;
    // $('#myModal').modal('show');
  };
  $scope.closemodal = function (){
    $('.popupbg').hide();
    // $('#myModal').modal('hide');
  };

  $scope.checkCharacterLengthInPixels = function(val1,flag) { 
    $scope.frm={};
    if (val1=='All') {
      $scope.fetchAllPensioners(flag); 
   }else{
    for(let i=0;i<$scope.masterdata.length;i++){
    if($scope.masterdata[i].shortName==val1){
      $scope.srchCriteria=$scope.masterdata[i].displayName;
    }
  }
  }
  };
  
  
  
  
  $scope.selectAll = false;
  $scope.toggleAll = function () {
    angular.forEach($scope.ReportOfPensioner, function (item) {
      item.selected = $scope.selectAll;
    });
  };
  $scope.returnAll = function () {
    angular.forEach($scope.ReportOfPensioner, function (item) {
      item.selectedReturn = $scope.selectRetunAll;
    });
  };
  
  $scope.updateSelectedPensioners = function (selectedId) {
    var index = $scope.selectedPensionerIds.indexOf(selectedId) +"";
  
    if (index === -1) {
      // If the ID is not in the array, add it
      $scope.selectedPensionerIds.push(selectedId);
    } else {
      // If the ID is already in the array, remove it
      $scope.selectedPensionerIds.splice(index, 1);
    }
  };
  
  $scope.sendSelectedPensioners = function ( val) {
    var selectedPensionerIds = [];
  
    if ($scope.selectAll || $scope.selectRetunAll) {
      // If "Select All" is checked, send all IDs
      selectedPensionerIds = $scope.ReportOfPensioner.map(function (item) {
        return item.id;
      });
    } else {
      // If "Select All" is not checked, send only the ID of the selected item
      angular.forEach($scope.ReportOfPensioner, function (item) {
        if (item.selected) {
          selectedPensionerIds.push(item.id);
        }
      });
    }
    
    var requestData = {
      pensionIds: selectedPensionerIds,
      pensionStatus: val
    };
  
  
    var req = {
      method: 'PUT',
      url: path+'/api/v1/pension-details/update-all',
      headers: {
        'Authorization': "Bearer " + sessionStorage.token,
        'Content-Type': 'application/json'
      },
      data: requestData
    };
    
   $http(req).then(function(res){
  
       if (res.status==201) {
        alert("You are registered!!");
       }
  
       else {
        alert("Something Went Wrong!!");
      }
  
       },
               function (err) {
              
                 
       });
  
  };
  
  
  $scope.dateCompare=function( val1,val2,val3){
    $scope.result='';
    if(val3=='LA'){
      $scope.result=sharedService.compareDates(val1, val2);
      if($scope.result>0){
         $scope.la=false;
      }
      else{
        $scope.la=true;
        // alert("Date of Last Appointment is greater than Date of Birth");
      }
      
    }
    else  if(val3=='Rgl'){
      $scope.result=sharedService.compareDates(val1, val2);
      if($scope.result>0){
         $scope.rgl=false;
      }
      else{
        $scope.rgl=true;
        // alert("Date of Regularisation is greater than Date of Last Appointment");
      }
      
    }
    else  if(val3=='Rgl1'){
         $scope.rgl=false;
    }
    else  if(val3=='Spr'){
      $scope.result=sharedService.compareDates(val1, val2);
      if($scope.result>0){
         $scope.spr=false;
         $scope.spr1=false;
      }
      else{
        $scope.spr=true;
        $scope.spr1=false;
        // alert("Date of Separation is greater than Date of Regularisation");
      }
      
    }
    else  if(val3=='Spr1'){
      $scope.result=sharedService.compareDates(val1, val2);
      if($scope.result>0){
         $scope.spr1=false;
         $scope.spr=false;
      }
      else{
        $scope.spr1=true;
        $scope.spr=false;
        // alert("Date of Separation is greater than Date of Regularisation");
      }
      
    }
    else  if(val3=='accountEffectiveFrom'){
      $scope.result=sharedService.compareDates(val1, val2);
      if($scope.result>0){
         $scope.accEfFrom=false;
      }
      else{
        $scope.accEfFrom=true;
        // alert("Date of Regularisation is greater than Date of Last Appointment");
      }
      
    }
    else  if(val3=='dateFrom'){
      $scope.result=sharedService.compareDates(val1, val2);
      if($scope.result>0){
         $scope.dateFromflg=false;
      }
      else{
        $scope.dateFromflg=true;
        // alert("Date of Regularisation is greater than Date of Last Appointment");
      }
      
    }

    else  if(val3=='dateOfDeath'){
      $scope.result=sharedService.compareDates(val1, val2);
      if($scope.result>0){
         $scope.dateOfDeathflg=false;
      }
      else{
        $scope.dateOfDeathflg=true;
        // alert("Date of Regularisation is greater than Date of Last Appointment");
      }
      
    }
    
  
  // alert($scope.result);
  };
  
  
  
  $scope.isSeniorCitizen= function(dateOfBirth) {
    var dob =  new Date(dateOfBirth.split('-').reverse().join('-'));
    var currentDate = new Date();
    var age = currentDate.getFullYear() - dob.getFullYear();
    if (currentDate.getMonth() < dob.getMonth() || (currentDate.getMonth() === dob.getMonth() && currentDate.getDate() < dob.getDate())) {
      age--;
    }
    if(age >= 60){
      $scope.dobflg=false;
    }
    else{
      $scope.dobflg=true;
      // alert("Your Date of Birth is not eligible for pension");
    }
  };
  
  $scope.fillAutomatic= function(val1,val2) {
  
    if(val2==='prefix'){
      if(val1==='Miss' || val1==='Mrs.' || val1==='Smt.' || val1==='Dr(Mrs).'){
     $scope.form.sex='F';
      }
      else{
          $scope.form.sex='M';
      }
    }
    else if(val2==='relation'){
      if(val1==='Self'){
        $scope.form.pensionerName=$scope.form.employeeName;
        $scope.form.pensionerStatusCode=1;

         }
         else{
          $scope.form.pensionerName=undefined;
          $scope.form.dateOfDeath=undefined;
          $scope.form.pensionerStatusCode=undefined;
         }
    }
    else if(val2==='pan'){
      if(val1==='Y'){
         }
         else{
          $scope.form.pan=undefined;
         }
    }
  };
  
  
  $scope.chkAadhar = function() {
    if (isNaN($scope.form.aadhaar)) {
      $scope.form.aadhaar = "";
    }
    if ($scope.form.aadhaar.length < 12) {
  // 									alert("Please enter 12 digit Valid Aadhar Number");
      toastr["error"]("Please enter 12 digit Valid Aadhar Number");
      $scope.aadharflag=true;
    } else {
      var D = [ [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ],
          [ 1, 2, 3, 4, 0, 6, 7, 8, 9, 5 ],
          [ 2, 3, 4, 0, 1, 7, 8, 9, 5, 6 ],
          [ 3, 4, 0, 1, 2, 8, 9, 5, 6, 7 ],
          [ 4, 0, 1, 2, 3, 9, 5, 6, 7, 8 ],
          [ 5, 9, 8, 7, 6, 0, 4, 3, 2, 1 ],
          [ 6, 5, 9, 8, 7, 1, 0, 4, 3, 2 ],
          [ 7, 6, 5, 9, 8, 2, 1, 0, 4, 3 ],
          [ 8, 7, 6, 5, 9, 3, 2, 1, 0, 4 ],
          [ 9, 8, 7, 6, 5, 4, 3, 2, 1, 0 ] ];
      var inV = [ 0, 4, 3, 2, 1, 5, 6, 7, 8, 9 ];
      var P = [ [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ],
          [ 1, 5, 7, 6, 2, 8, 3, 0, 9, 4 ],
          [ 5, 8, 0, 3, 7, 9, 6, 1, 4, 2 ],
          [ 8, 9, 1, 6, 0, 4, 3, 5, 2, 7 ],
          [ 9, 4, 5, 3, 1, 2, 6, 8, 7, 0 ],
          [ 4, 2, 8, 6, 5, 7, 3, 9, 0, 1 ],
          [ 2, 7, 9, 3, 8, 0, 6, 4, 1, 5 ],
          [ 7, 0, 4, 6, 9, 1, 3, 2, 5, 8 ] ];
      var digits = $scope.form.aadhaar.split('');
      var len = (digits.length - 1);
      var i = 0;
      var c = 0;
      for (var j = len; j > -1; j--) {
        var imod8 = i % 8;
        var p = P[imod8][parseInt(digits[j])];
        c = D[c][p];
        i++;
      }
      if (c == 0) {
        $scope.aadharflag=false;
        console.log('valid aadhar'+ $scope.form.aadhaar);
      } else {
        //console.log('Invalid aadhar'+$scope.form.aadhar);
        //alert("Please enter Valid aadhar Number");
        toastr["error"]("This is Not Valid Aadhaar Number");
        $scope.aadharflag=true;
        // $scope.form.aadhaar = "";
      }
    }
  };
  
  $scope.checkDuplicate = function (val1,val2){
    if(val1!=undefined && val2!=undefined){
    var params = {};
    params[val1] = val2;
    var req = {
      method: 'GET',
      url: path+'/api/v1/pensioners/search',params:params,
      headers: {
        'Authorization': "Bearer " + sessionStorage.token,
        'Content-Type': 'application/json'
      },
      
    };
    
   $http(req).then(function(res){
  
       if (res.status==200) {

          if(res.data.result===1){
            $scope[val1+'dup']=true;
          }
          else if(res.data.result===0){
            $scope[val1+'dup']=false;
          }
      }
       else {
        alert("Something went wrong!!");
      }
  
       },
       function (err) {
              
                 
       });
      }
  };

  
  });  
  
  