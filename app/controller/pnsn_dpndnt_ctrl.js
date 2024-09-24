

app.controller('pensioner',function($scope,$http,sharedService, $rootScope) {


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
    
    $scope.paydetail =[{}];
    $scope.masterdata=[];
    $scope.postoffice=[];
    $scope.showdetails=[];
    $scope.frm={};
    $scope.departments={};
    $scope.bank={};
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
  
          
         }
  
         else {
        }
  
         },
         function (err) {
                
                   
         });
    
  };
  $scope.fetchMaster();
  
  $scope.getFilteredDesignation = (val, gradeCode) => {
    if (val && gradeCode) {
        const filteredDesignation = $scope.pensionerDesignation.filter(deg =>
            deg.desigShortName === val && deg.gradeCode === gradeCode
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
        if(($scope.form.pensionerRelation=='Self' && $scope.form.pensionerStatusCode==1) || ($scope.form.pensionerRelation!='Self' && $scope.form.pensionerStatusCode!=1)){
       if($scope.pensionerForm.$valid && !$scope.la && !$scope.rgl && !$scope.spr && !$scope.aadhardup && !$scope.pandup && !$scope.mobiledup && !$scope.pponodup){
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
          "pensionerName": $scope.form.pensionerName,
          "pensionerRelation":$scope.form.pensionerRelation,
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
          "payDetails": [{
                "dateFrom": $scope.paydetail.dateFrom,
                "dateTo": $scope.paydetail.dateTo,
                "pensionBasic": $scope.paydetail.pensionBasic,
                "medicalAllowance":$scope.paydetail.medicalAllowance,
                "hra": $scope.paydetail.hra
              }],
          "pensionerAccounts": [{
                "bankCode": $scope.bank.bankCode,
                "accountEffectiveFrom":$scope.bank.accountEffectiveFrom,
                "ifscCode": $scope.bank.ifscCode,
                "accountNo": $scope.bank.accountNo,
                "branchName": $scope.bank.branchName,
                "branchCity": $scope.bank.branchCity,
                "state": $scope.bank.state,
  
              }]
            };
  
        var req = {
          method: 'POST',
          url: path+'/api/v1/pensioners/',
          headers: {
            'Authorization': "Bearer " + sessionStorage.token,
            'Content-Type': 'application/json'
          },
          data: $scope.pensionerData
        };
        
       $http(req).then(function(res){
  
           if (res.data[1]=='Saved successfully') {
            alert("You are registered!!");
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
        }
        else{
          alert("Please select correct Penstioner status code");
        }
  
  };
  
  $scope.fetchgrade = function (val) {
  
        for(let i=0;i<$scope.pensionerType.length;i++){
          if($scope.pensionerType[i].pensionerTypeCode==val){
            $scope.gradelist=$scope.pensionerType[i].pensionerGrades;
          }
        }
  
  };
  $scope.fetchdesigation = function (val) {
  
    for(let i=0;i<$scope.gradelist.length;i++){
      if($scope.gradelist[i].gradeCode==val){
        $scope.desigationlist=$scope.gradelist[i].pensionerDesignations;
      }
    }
  
  };
  
  $scope.departmentlist=[];
  $scope.fetchdepartment = function (val) {
    $scope.departmentlist=[];
    for(let i=0;i<$scope.departments.length;i++){
      if($scope.departments[i].departmentId.collegeCode==val){
        // $scope.departmentlist[i]=$scope.departments[i];
        $scope.departmentlist.push($scope.departments[i]);
      }
    }
  
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
  $scope.valuew=0;
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
      var offScreenSpan = angular.element('<span style="visibility:hidden;position:absolute;top:-9999px;font-size:16px;">' + $scope.srchCriteria + '</span>');
      angular.element(document.body).append(offScreenSpan); 
      var textWidth = offScreenSpan[0].offsetWidth; 
      offScreenSpan.remove(); 
      $scope.valuew = textWidth+90;
  }
  };
  
  
  
  
  $scope.update = function () {
  
    $scope.pensionerData= {
      "insertedOn": $scope.form.insertedOn,
      "userIdMaker": $scope.form.userIdMaker,
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
      "dateOfLastAppointment": $scope.form.dateOfLastAppointment,
      "dateOfRegularisation": $scope.form.dateOfRegularisation,
      "payCommissionCode": $scope.form.payCommissionCode,
      "dateOfSeparation": $scope.form.dateOfSeparation,
      "pensionerUnivId": $scope.form.pensionerUnivId,
      "pensionerName": $scope.form.pensionerName,
      "pensionerRelation":$scope.form.pensionerRelation,
      "ppoNo": $scope.form.ppoNo,
      "aadhaar": $scope.form.aadhaar,
      "pan": $scope.form.pan,
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
      "payDetails": [{
            "dateFrom": $scope.paydetail.dateFrom,
            "pensionBasic": $scope.paydetail.pensionBasic,
            "medicalAllowance":$scope.paydetail.medicalAllowance,
            "hra": $scope.paydetail.hra
          }],
      "pensionerAccounts": [{
            "bankCode": $scope.bank.bankCode,
            "accountEffectiveFrom":$scope.bank.accountEffectiveFrom,
            "ifscCode": $scope.bank.ifscCode,
            "accountNo": $scope.bank.accountNo,
            "branchName": $scope.bank.branchName,
            "branchCity": $scope.bank.branchCity,
            "state": $scope.bank.state,
  
          }]
        };
  
    var req = {
      method: 'PUT',
      url: path+'/api/v1/pensioners/'+$scope.pensionerId,
      headers: {
        'Authorization': "Bearer " + sessionStorage.token,
        'Content-Type': 'application/json'
      },
      data: $scope.pensionerData
    };
    
   $http(req).then(function(res){
  
       if (res.status===200) {
        $scope.fetchAllPensioners('list');
        alert("Pensioner Record Updated!!");
        $('.popupbg').hide();
        $('#editpensioner').modal('hide');
       }
  
       else {
      }
  
       },
               function (err) {
                toastr["error"]("Something went wrong!!");
                 
       });
  
  
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
    else  if(val3=='Spr'){
      $scope.result=sharedService.compareDates(val1, val2);
      if($scope.result>0){
         $scope.spr=false;
      }
      else{
        $scope.spr=true;
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
         }
         else{
          $scope.form.pensionerName='';
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
        if(val1==='aadhaar'){
        if(res.data.result===1){
          $scope.aadhardup=true;
          toastr["error"]("Aadhaar Number already exist!!");
        }
        else if(res.data.result===0){
          $scope.aadhardup=false;
        }
       }
       else if(val1==='pan'){
        if(res.data.result===1){
          $scope.pandup=true;
          toastr["error"]("PAN Number already exist!!");
        }
        else if(res.data.result===0){
          $scope.pandup=false;
        }
       }
       else if(val1==='mobileNo'){
        if(res.data.result===1){
          $scope.mobiledup=true;
          toastr["error"]("Mobile Number already exist!!");
        }
        else if(res.data.result===0){
          $scope.mobiledup=false;
        }
       }
       else if(val1==='ppoNo'){
        if(res.data.result===1){
          $scope.pponodup=true;
          toastr["error"]("PPO Number already exist!!");
        }
        else if(res.data.result===0){
          $scope.pponodup=false;
        }
       }
      }
       else {
        alert("Something went wrong!!");
      }
  
       },
       function (err) {
              
                 
       });
  };


  $scope.deleteById = function (id,mon,yr) {
    // var mon =$scope.deleteDate.month;
    // var yr =$scope.deleteDate.year;
    // var id =$scope.deleteDate.id;
    if(!(mon=== undefined || yr === undefined )){
    var params = {};
    params.pensionMonth=mon;
    params.pensionYear=yr;
    params.pensionerId= id;
    var req = {
      method: 'DELETE',
      headers: {
        'Authorization': "Bearer " + sessionStorage.token,
        'Content-Type': 'application/json'
      },
      url: path+"/api/v1/pension-details/deleteUandRbyIdMonYr",params: params
    };
    
   $http(req).then(function(response){
  
       if (response.data.Message===1) {
        toastr["success"]("Record deleted successfully!!");
        $scope.fetchAllPensioners('report'); 
        $('.popupbg').hide();
       }
  
       else {
         
      }
  
       },
       function (err) {
              
                 
       });
      } 
      else{
        alert("Please select month and year.");
      }
  
  };
$scope.deleteDate={};
  $scope.sendDataDelete = function (id,month,year) { 
    $('.popupbg').show();
    if(month!==undefined && year!==undefined && id!==undefined){
      $scope.deleteDate.month=month;
      $scope.deleteDate.year=year;
      $scope.deleteDate.id=id;
  }else{
    $scope.deleteDate={};
  }
  };


  $scope.verifyData = function (val){
    
    var req = {
      method: 'PUT',
      url: path+'/api/v1/pensioners/verify/'+val,
      headers: {
        'Authorization': "Bearer " + sessionStorage.token,
        'Content-Type': 'application/json'
      },
    };
    
   $http(req).then(function(res){
  
       if (res.status===200) {
        toastr["success"]("Record verified!!");
        $('.popupbg').hide();
        $('#editpensioner').modal('hide');
        $scope.fetchAllPensioners('list'); 
       }
       else {
      }
       },
       function (err) {
              
                 
       });
  };
  
  });  
  
  