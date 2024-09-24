

app.controller('dependent_pId_gen',function($scope,$http,sharedService, $rootScope) {


  $scope.handleLink = function (pgname) {
    $rootScope.handleLink(pgname);
  };
    $scope.pensionerData={};
    $scope.flgmain=false;
    $scope.dobflg=false;
    $scope.la=false;
    $scope.rgl=false;
    $scope.spr=false;
    $scope.pponodup=false;
    $scope.form ={};
    $scope.form2 ={};
    $scope.pensionerAccounts =[{}];
    
    $scope.paydetail =[{}];
    $scope.masterdata=[];
    $scope.postoffice=[];
    $scope.showdetails=[];
    $scope.frm={};
    $scope.departments={};
    $scope.bank={};
    $scope.fetchMaster = function () {
      // $(".loaderbg").show();
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
            // $(".loaderbg").hide();
            setTimeout(function () {
              $('.dropdd1').selectpicker();
            },150);
  
          
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
      $scope.form2.state =res.data[0].PostOffice[0].State;               			
      $scope.form2.city=res.data[0].PostOffice[0].District;
  }
  else{
  // alert("Please Enter Valid Pin Code!");
  $scope.pinflag=true;
  $scope.form2.state ="";               			
  $scope.form2.city="";
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
        $scope.invalidFields = [];
        if (!$scope.pensionerForm.$valid) {
          angular.forEach($scope.pensionerForm.$error, function (error, errorType) {
            angular.forEach(error, function (invalidField) {
              var field = {
                name: invalidField.$name,
                reason: errorType
              };
              $scope.invalidFields.push(field);
            });
          });
          console.log("aa gaya yaar",$scope.invalidFields);
        }
       if($scope.pensionerForm.$valid && !$scope.la && !$scope.rgl && !$scope.spr && !$scope.aadhardup && !$scope.pandup && !$scope.mobiledup && !$scope.pponodup){
        $scope.flgmain=false;
        $scope.pensionerData= {
          "userIdMaker": sessionStorage.appuserId,
          "ruSlno": null,
          "prefix": $scope.form.prefix,
          "employeeName": $scope.form.employeeName,
          "sex": $scope.form2.sex,
          "dateOfBirth": $scope.form2.dateOfBirth,
          "rateOfPension": $scope.form2.rateOfPension,
          "fatherName": $scope.form.fatherName,
          "universityCode": $scope.form.universityCode,
          "collegeCode": $scope.form.collegeCode,
          "departmentCode": $scope.form.departmentCode,
          "pensionerTypeCode": $scope.form.pensionerTypeCode,
          "gradeCode": $scope.form.gradeCode,
          "desigShortName": $scope.form.desigShortName,

          "workingStatus": $scope.form.workingStatus,
          "workingClgDepRemark": $scope.form.workingClgDepRemark,
          "workingPostRemark": $scope.form.workingPostRemark,

          "subjectCode": $scope.form.subjectCode,
          "religionName": $scope.form.religionName,
          "dateOfLastAppointment": $scope.form.dateOfLastAppointment,
          "dateOfRegularisation": $scope.form.dateOfRegularisation,
          "payCommissionCode": $scope.form.payCommissionCode,
          "dateOfSeparation": $scope.form.dateOfSeparation,
          "pensionerUnivId": $scope.form.pensionerUnivId,
          "pensionerName": $scope.form2.pensionerName,
          "pensionerRelation":$scope.form2.pensionerRelation,
          "ppoNo": $scope.form2.ppoNo,
          "aadhaar": $scope.form2.aadhaar,
          "pan": $scope.form2.panRecord === 'N' ? undefined : $scope.form2.pan,
          "panRecord": $scope.form2.panRecord,
          "mobileNo": $scope.form2.mobileNo,
          "whatsAppMobileNo": $scope.form2.whatsAppMobileNo,
          "emailId": $scope.form2.emailId,
          "dateOfDeath": $scope.form2.dateOfDeath,
          "pensionerStatusCode": $scope.form2.pensionerStatusCode,
          "remarks": $scope.form.remarks,
          "addr1": $scope.form2.addr1,
          "addr2": $scope.form2.addr2,
          "city": $scope.form2.city,
          "state": $scope.form2.state,
          "pin": $scope.form2.pin,
          "staffPensionerId":$scope.form.staffPensionerId,
          "dependentSlno":$scope.form2.dependentSlno.split('-')[0],
          "payDetails": [{
                "dateFrom": $scope.paydetail.dateFrom,
                "dateTo": $scope.paydetail.dateTo,
                "pensionBasic": $scope.paydetail.pensionBasic,
                "medicalAllowance":$scope.paydetail.medicalAllowance,
                "hra": $scope.paydetail.hra,
                "othersAllowance": $scope.paydetail.othersAllowance,
                "tds": $scope.paydetail.tds
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
           else if (res.status===203) {
            alert(res.data.message);
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
  
    if(val2==='relation'){
      $scope.form2.sex= (val1 === 'Wife') ? 'F' : (val1 === 'Husband') ? 'M' : (val1 === 'Son') ? 'M' : (val1 === 'Daughter') ? 'F' : (val1 === 'Father') ? 'M' :
                       (val1 === 'Mother') ? 'F' : '';
    }
    else if(val2==='pan'){
      if(val1==='Y'){
         }
         else{
          $scope.form2.pan=undefined;
         }
    }
  };
  
  
  $scope.chkAadhar = function() {
    if (isNaN($scope.form2.aadhaar)) {
      $scope.form2.aadhaar = "";
    }
    if ($scope.form2.aadhaar.length < 12) {
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
      var digits = $scope.form2.aadhaar.split('');
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
        // console.log('valid aadhar'+ $scope.form2.aadhaar);
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
  };


  $scope.dependentSlnoList={};
  $scope.filldataEmp = function (val){
    $scope.pensionerId=val;
    if(val){
      var req = {
        method: 'GET',
        url: path+'/api/v1/pension/dependents/pensioner/'+val,
        headers: {
          'Authorization': "Bearer " + sessionStorage.token,
          'Content-Type': 'application/json'
        },
        
      };
      
     $http(req).then(function(pensionerdetails_res){
    
         if (pensionerdetails_res) {
          $scope.form=pensionerdetails_res.data.pensioner;
          $scope.fetchdepartment($scope.form.collegeCode);
          $scope.dependentSlnoList=pensionerdetails_res.data.dependentSlNo;
          $scope.form.staffPensionerId=val;
          $scope.form.departmentCode=pensionerdetails_res.data.pensioner.departmentCode+'!!'+pensionerdetails_res.data.pensioner.departmentIds;
          $scope.form.desigShortName=pensionerdetails_res.data.pensioner.desigShortName+'!!'+pensionerdetails_res.data.pensioner.designationId;
          
          // $scope.paydetail=$scope.form.payDetails[0];
          // $scope.bank=$scope.form.pensionerAccounts[0];
          $('.popupbg').show();
          
         }
    
         else {
        }
    
         },
         function (err) {
                
         });
    }
    else{
      $scope.form={};
    }
   
  };


  
  $scope.form2={};
  $scope.filldataPen = function (val1,val2){
    var req = {
      method: 'GET',
      url: path+'/api/v1/pension/dependents/'+val1+'/'+val2,
      headers: {
        'Authorization': "Bearer " + sessionStorage.token,
        'Content-Type': 'application/json'
      },
      
    };
    
   $http(req).then(function(pensioner_res){
  
       if (pensioner_res.status===200) {
        $http.get("https://pincode.p.rapidapi.com/"+pensioner_res.data[0].dependentPin).then(function(res) {
          if(res.data[0].Status!="Error"){
            $scope.postoffice=res.data[0].PostOffice;
          }
          });	
        $scope.form2.pensionerRelation=pensioner_res.data[0].pensionerRelation;
        $scope.form2.pensionerName=pensioner_res.data[0].dependentName;
        $scope.form2.dateOfBirth=pensioner_res.data[0].dateOfBirth;
        $scope.form2.rateOfPension=pensioner_res.data[0].pensionPerc;
        $scope.form2.pin=pensioner_res.data[0].dependentPin;
        $scope.form2.addr1=pensioner_res.data[0].dependentAddress;
        $scope.form2.addr2=pensioner_res.data[0].dependentPo;
        $scope.form2.city=pensioner_res.data[0].dependentCity;
        $scope.form2.state=pensioner_res.data[0].dependentState;
        $scope.form2.pensionerStatusCode=1;
        $scope.form2.ppoNo=$scope.form.ppoNo+"-"+$scope.form2.dependentSlno.split('-')[0]
        $scope.fillAutomatic($scope.form2.pensionerRelation,'relation');

       }
  
       else {
      }
  
       },
       function (err) {
              
                 
       });
  };

  $scope.deathEmpId={};
  $scope.fetchdatadeathEmp = function (){
    $(".loaderbg").show();
    var req = {
      method: 'GET',
      url: path+'/api/v1/pensioners/staff/pensionersId',
      headers: {
        'Authorization': "Bearer " + sessionStorage.token,
        'Content-Type': 'application/json'
      },
      
    };
    
   $http(req).then(function(pensionerdetails_res){
  
       if (pensionerdetails_res) {
   
        $scope.deathEmpId=pensionerdetails_res.data;
        setTimeout(function () {
          $('.dropdd').selectpicker();
        },150);
        $(".loaderbg").hide();
       }
  
       else {
        $(".loaderbg").hide();
      }
  
       },
       function (err) {
        $(".loaderbg").hide();
       });
  };
  $scope.fetchdatadeathEmp(); 
  $scope.sameAsMobileNo=false;
  $scope.sameasMobileNo = function (val){
    if($scope.sameAsMobileNo){
      $scope.form2.whatsAppMobileNo=val;
    }
    else{
      $scope.form2.whatsAppMobileNo=undefined;
    }

  };

  
  });  
  
  