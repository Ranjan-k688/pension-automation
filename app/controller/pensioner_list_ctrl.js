

app.controller('pensionerList',function($scope,$http,sharedService, $rootScope) {


  $scope.handleLink = function (pgname) {
    $rootScope.handleLink(pgname);
  };
    $scope.pensionerData={};
    $scope.flgmain=false;
    $scope.dobflg=false;
    $scope.la=false;
    $scope.rgl=false;
    $scope.spr=false;
    $scope.watchFlag=false;
    $scope.form ={};
    $scope.pensionerAccounts =[{}];
    
    $scope.paydetail =[{}];
    $scope.masterdata=[];
    $scope.postoffice=[];
    $scope.showdetails=[];
    $scope.frm={};
    $scope.search={};
    $scope.departments={};
    $scope.bank={};



     // List of months
     $scope.months = [
      { value: 1, name: 'January' },
      { value: 2, name: 'February' },
      { value: 3, name: 'March' },
      { value: 4, name: 'April' },
      { value: 5, name: 'May' },
      { value: 6, name: 'June' },
      { value: 7, name: 'July' },
      { value: 8, name: 'August' },
      { value: 9, name: 'September' },
      { value: 10, name: 'October' },
      { value: 11, name: 'November' },
      { value: 12, name: 'December' }
    ];

    // Watch for changes in the selected year
    $scope.$watch('search.year', function(newYear) {
      $scope.search.month=undefined;
      var currentYear = new Date().getFullYear();
      var currentMonth = new Date().getMonth() + 1; // getMonth() returns month index (0-11)

      if (newYear == currentYear) {
        // If selected year is the current year, filter out future months
        $scope.availableMonths = $scope.months.filter(function(month) {
          return month.value <= currentMonth;
        });
      } else {
        // Otherwise, show all months
        $scope.availableMonths = $scope.months;
      }
    });
    
    $scope.fetchMaster = function () {
      // $(".loaderbg").show();
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
            // $(".loaderbg").hide();
  
          
         }
  
         else {
        }
  
         },
         function (err) {
                
                   
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
  
  $scope.ReportOfPensioner={};
  $scope.listOfPensioner={};
  $scope.yrmon={};
  $scope.pageFlag=false;

  $scope.curPage = 1;
  $scope.itemsPerPage = '600'; // Default value
  $scope.maxSize = 3;
  $scope.totalItems=0;

  $scope.fetchAllPensioners = function (flagsts) {
      $(".loaderbg").show();
      $scope.pageFlag=false;
      var req = {
          method: 'GET',
          url: flagsts === 'report' ? path + '/api/v1/pensioner-details' : path + '/api/v1/pensioners/getAllPensionerData',
          params: {
              page: $scope.curPage - 1,
              size: parseInt($scope.itemsPerPage),
          },
          headers: {
            
            'Authorization': 'Bearer ' + sessionStorage.token
          }
      };
      $scope.watchFlag=false;
      $scope.watchFlagSrch=false;

      $http(req).then(function (response) {
          if (response.status===200) {
            if(response.data.totalPages>1){
              $scope.pageFlag=true;
            }
              if (flagsts === 'report') {
                  $scope.ReportOfPensioner = response.data.content;
                  $scope.totalItems = response.data.totalElements;
                  $(".loaderbg").hide();
                  $scope.yrmon.month = response.data.content[0].pension_month;
                  $scope.yrmon.year = response.data.content[0].pension_year; 
                 
              } else if (flagsts === 'list') {
                  $scope.listOfPensioner = response.data.content;
                  $scope.totalItems = response.data.totalElements; 
                $(".loaderbg").hide();
              }
             
              
          }
          else{
            toastr["error"]("Something went wrong!!");
          }
      }, function (err) {
          console.error('Error fetching data:', err);
          $(".loaderbg").hide();
      });
  };

  var pathSegments = window.location.hash.split('#!/')[1];
  // if(pathSegments==='list_pensioner' || pathSegments==='pensioner-checker'){
  //   $scope.fetchAllPensioners('list'); 
  // }
  // else if(pathSegments==='pensioner_report'){
  //   $scope.fetchAllPensioners('report'); 
  // }

  // $scope.updateItemsPerPage = function () {
  //     $scope.curPage = 1;
  //     if(pathSegments==='list_pensioner' || pathSegments==='pensioner-checker'){
  //       $scope.fetchAllPensioners('list'); 
  //     }
  //     else if(pathSegments==='pensioner_report'){
  //       $scope.fetchAllPensioners('report'); 
  //     }
  // };

  $scope.numOfPages = function () {
    return Math.ceil($scope.totalItems / parseInt($scope.itemsPerPage));
};


      $scope.fetchMonthlyPensionerData = function (val1,val2,f,statusflg) {
        $(".loaderbg").show();
        $scope.pageFlag=false;
        var params = {};
        params= {
          page: $scope.curPage - 1,
          size: parseInt($scope.itemsPerPage),
       }
  
        if(val1=='All'){
            params.pensionMonth=f === undefined || f.month === undefined ? 0 : f.month;
            params.pensionYear=f === undefined || f.year === undefined ? 0 : f.year;
            params.status=statusflg;
            params.pension_status = '';
        }
      else{
        if(f === undefined && val1!=="pension_status"){
          params.pensionMonth=f === undefined || f.month === undefined ? 0 : f.month;
          params.pensionYear=f === undefined || f.year === undefined ? 0 : f.year;
          params.status=statusflg;
          params[val1 === undefined ? 'pension_status' : val1] = val2 === undefined ? '' : val2;
          params.pension_status=statusflg;
        }
              
        else if(f === undefined && val1==="pension_status"){
            params.pensionMonth=f === undefined || f.month === undefined ? 0 : f.month;
            params.pensionYear=f === undefined || f.year === undefined ? 0 : f.year;
            params.status=statusflg;
            params.pension_status = '';
          }
          else{
           if(val1!=="pension_status"){
            params.pensionMonth=f === undefined || f.month === undefined ? 0 : f.month;
            params.pensionYear=f === undefined || f.year === undefined ? 0 : f.year;
            params.status=statusflg;
            params.pension_status = '';
            params[val1 === undefined ? 'pension_status' : val1] = val2 === undefined ? '' : val2;
          }
          else{
            params.pensionMonth=f === undefined || f.month === undefined ? 0 : f.month;
            params.pensionYear=f === undefined || f.year === undefined ? 0 : f.year;
            params.status=statusflg;
            params[val1 === undefined ? 'pension_status' : val1] = val2 === undefined ? '' : val2;
            }
            }
         }
        var req = {
          method: 'GET',
          url: path+"/api/v1/pensioner-details/searchByMonYrStatus",params: params,
          headers: {
            'Authorization': "Bearer " + sessionStorage.token,
            'Content-Type': 'application/json'
          },
          
        };
        
       $http(req).then(function(response){
      
           if (response) {
            $scope.watchFlag=true;
              $scope.ReportOfPensioner=response.data.content;
              $scope.totalItems = response.data.totalElements; 
              $(".loaderbg").hide();
              if(response.data.totalPages>1){
                $scope.pageFlag=true;
              }
              $scope.yrmon.month=response.data.content[0].pension_month;
              $scope.yrmon.year=response.data.content[0].pension_year; 
           }
      
           else {
              $scope.yrmon.month='';
              $scope.yrmon.year=''; 
              $scope.yrmon1.month='';
              $scope.yrmon1.year=''; 
          }
      
           },
           function (err) {         
           });
      
      };

  
  
  $scope.getMonthName = function(monthNumber) {
    var months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
    // Ensure the monthNumber is valid (between 1 and 12)
    if (monthNumber >= 1 && monthNumber <= 12) {
      return months[monthNumber - 1];
    } else {
      return "Invalid month number";
    }
  };
  
  
  $scope.pensionerType={};
  $scope.gradelist={};
  $scope.fetchPensionerType = function () {
  
    var req = {
      method: 'GET',
      url: path+'/api/v1/pension/allTypeGradeDesig',
      headers: {
        'Authorization': "Bearer " + sessionStorage.token,
        'Content-Type': 'application/json'
      },
      
    };
    
   $http(req).then(function(pensionertype_res){
  
       if (pensionertype_res) {
          $scope.pensionerType=pensionertype_res.data;
          // $scope.grade=$scope.pensionerType.pensionerGrades;
  
       }
  
       else {
      }
  
       },
       function (err) {
              
                 
       });
  
  };
  $scope.fetchPensionerType();
  
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
        $scope.departmentlist.push($scope.departments[i]);
      }
    }
  
  };
  
  $scope.listOfPensionerExcel={};
  $scope.pensionerReportExcel={};


  $scope.exportToExcel = function (flgsts) {
    $(".loaderbg").show();
    var req = {
        method: 'GET',
        url: path + (flgsts === 'report' ? "/api/v1/pension-details/download/by-status/ALL" : "/api/v1/pensioners/getAllPensionerData/download"),

     headers: {
      'Authorization': "Bearer " + sessionStorage.token,
      'Content-Type': 'application/json'
    },
    };

    $http(req).then(function (response) {
        if (response.status===200) {
            if(flgsts==='list'){
                $scope.listOfPensionerExcel = response.data.content;
                setTimeout(function () {
                  $(".excelformate").table2excel({
                      filename: "List-of-pensioner.xls"
                  });
                  $(".loaderbg").hide();
              }, 3500); 

            }
            else if(flgsts==='report'){
              $scope.pensionerReportExcel = response.data.content;
              setTimeout(function () {
                $(".excelformate").table2excel({
                    filename: "Pensioner-Report.xls"
                });
                $(".loaderbg").hide();
            }, 3500); 
          }
            }
            
            
        }, function (err) {
          $(".loaderbg").hide();
        console.error('Error fetching data:', err);
        
    });
};


  
  $scope.editdata = function (val){

    $scope.form={};
    $scope.pensionerForm.$setPristine();
    $scope.pensionerForm.$setUntouched(); 
    $scope.pensionerId=val;
    var req = {
      method: 'GET',
      url: path+'/api/v1/pensioners/latestList/'+val,
      headers: {
        'Authorization': "Bearer " + sessionStorage.token,
        'Content-Type': 'application/json'
      },
      
    };
   $http(req).then(function(pensionerdetails_res){
  
       if (pensionerdetails_res) {
        $http.get("https://api.postalpincode.in/pincode/"+pensionerdetails_res.data.pin).then(function(res) {
          if(res.data[0].Status!="Error"){
            $scope.postoffice=res.data[0].PostOffice;
          }
          });	
         $scope.fetchdepartment(pensionerdetails_res.data.collegeCode);
        $scope.form=angular.copy(pensionerdetails_res.data);
        $scope.form.departmentCode=pensionerdetails_res.data.departmentCode+'!!'+pensionerdetails_res.data.departmentIds;
        $scope.form.desigShortName=pensionerdetails_res.data.desigShortName+'!!'+pensionerdetails_res.data.designationId;
        
        $scope.paydetail=$scope.form.payDetails[0];
        $scope.bank=$scope.form.pensionerAccounts[0];
        if($scope.form.mobileNo && $scope.form.mobileNo===$scope.form.whatsAppMobileNo){
          $scope.sameAsMobileNo=true;
        }
        $('#editpensioner').modal('show');
        $('.popupbg').show();
        
       }
  
       else {
      }
  
       },
       function (err) {
              
                 
       });
  };

  
  $scope.fetchDataForVerify = function (val){
    var date = new Date();
    $scope.currentMonth = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() returns 0-11, so add 1
    $scope.currentYear = date.getFullYear();
    var monYr=$scope.currentYear+'-'+$scope.currentMonth;

    $scope.form={};
    $scope.pensionerId=val;
    var req = {
      method: 'GET',
      url: path+'/api/v1/pensioners/latestList/'+val,
      headers: {
        'Authorization': "Bearer " + sessionStorage.token,
        'Content-Type': 'application/json'
      },
      params: { yrMn: monYr }
    };
    
   $http(req).then(function(pensionerdetails_res){
  
       if (pensionerdetails_res) {
        $('#editpensioner').modal('show');
        $http.get("https://api.postalpincode.in/pincode/"+pensionerdetails_res.data.pin).then(function(res) {
          if(res.data[0].Status!="Error"){
            $scope.postoffice=res.data[0].PostOffice;
          }
          });	
         $scope.fetchdepartment(pensionerdetails_res.data.collegeCode);
        $scope.form=pensionerdetails_res.data;
        $scope.form.departmentCode=pensionerdetails_res.data.departmentCode+'!!'+pensionerdetails_res.data.departmentIds;
        $scope.form.desigShortName=pensionerdetails_res.data.desigShortName+'!!'+pensionerdetails_res.data.designationId;
        
        $scope.paydetail=$scope.form.payDetails[0];
        $scope.bank=$scope.form.pensionerAccounts[0];
        $scope.form.curLifeCf=$scope.form.curLifeCf+"";
        if( $scope.form.mobileNo && $scope.form.mobileNo===$scope.form.whatsAppMobileNo){
          $scope.sameAsMobileNo=true;
        }
        $('.popupbg').show();
        
       }
  
       else {
      }
  
       },
       function (err) {
              
                 
       });
  };
  
  $scope.searchPensionerDetails = function( val1,val2,flagsts) {
    $scope.pageFlag=false;
    var params = {};
    params[val1] = val2;
    if(flagsts=='report'){
    $http.get(path+'/api/v1/pensioner-details/search', {
      params: params,
        headers: {
          
          'Authorization': 'Bearer ' + sessionStorage.token
        }
    }).then(function(response) {
        // Handle the response here
        if(response.status===200){
        $scope.ReportOfPensioner=response.data.content;
        $scope.totalItems = response.data.totalElements; 
        $scope.watchFlagSrch=true;
        if(response.data.totalPages>1){
          $scope.pageFlag=true;
        }
      }
      else{
        toastr.error('Something went wrong!!');
      }
        // console.log(response.data);
    }).catch(function(error) {
        // Handle any errors here
        toastr.error('Something went wrong!!', error);
    });
  }
  if(flagsts=='list'){
    $http.get(path+'/api/v1/pensioner-details/searchPensionData', {
      params: params,
        headers: {
          
          'Authorization': 'Bearer ' + sessionStorage.token
        }
    }).then(function(response) {
        // Handle the response here
        if(response.status===200){
        $scope.listOfPensioner = response.data.content;
        $scope.totalItems = response.data.totalElements; 
        if(response.data.totalPages>1){
          $scope.pageFlag=true;
        }
      }
      else{
        toastr.error('Something went wrong!!');
      }
        // console.log(response.data);
    }).catch(function(error) {
        // Handle any errors here
        toastr.error('Something went wrong!!', error);
    });
  }
  };
  
  
  $scope.showdata = function (val){
    $('.popupbg').show();
    $scope.showdetails=val;
    // $('#myModal').modal('show');
  };
  $scope.closemodal = function (){
    $('.popupbg').hide();
    $scope.aadharflag=false;
    $scope.aadhaardup=false;
    $scope.rgl=false;
    $scope.spr=false;
    $scope.pinflag=false;
    $scope.mobileNodup=false;

    // $('#myModal').modal('hide');
  };
  
  $scope.checkCharacterLengthInPixels = function(val1) { 
    $scope.frm={};
    if (val1=='All') {
      $scope.frm.searchCriteria=val1;
      if(pathSegments==='list_pensioner' || pathSegments==='pensioner-checker'){
        $scope.fetchAllPensioners('list'); 
      }
      else if(pathSegments==='pensioner_report'){
        $scope.fetchAllPensioners('report'); 
      } 
   }else{
    for(let i=0;i<$scope.masterdata.length;i++){
    if($scope.masterdata[i].shortName==val1){
      $scope.frm.srchCriteria=$scope.masterdata[i].displayName;
      $scope.frm.searchCriteria=$scope.masterdata[i].shortName;
    }
  }
  }
  };
  
  
  $scope.checkDuplicate = function (val1,val2,val3){
    if(val1!=undefined && val2!=undefined && val3!=undefined){
    var params = {};
    params[val1] = val2;
    params.pensionerId = val3;
    var req = {
      method: 'GET',
      url: path+'/api/v1/pensioners/update-search',params:params,
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

  
  
  $scope.update = function () {
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
    }
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
      "stopRemarks": $scope.form.stopRemarks,
      "panRecord": $scope.form.panRecord,
      "mobileNo": $scope.form.mobileNo,
      "whatsAppMobileNo": $scope.form.whatsAppMobileNo,
      "emailId": $scope.form.emailId,
      "dateOfDeath": $scope.form.dateOfDeath,
      "pensionerStatusCode": $scope.form.pensionerStatusCode,
      "remarks": $scope.form.remarks,
      "addr1": $scope.form.addr1,
      "addr2": $scope.form.addr2,
      "city": $scope.form.city,
      "state": $scope.form.state,
      "pin": $scope.form.pin,
      "staffPensionerId": $scope.form.staffPensionerId,
      "dependentSlno": $scope.form.dependentSlno,
      "religionName": $scope.form.religionName,
      "dihStatus":$scope.form.dihStatus,
      "payDetails": $scope.paydetail !== undefined ? [{
        "dateFrom":  $scope.paydetail.dateFrom,
        "pensionBasic": $scope.paydetail.pensionBasic,
        "medicalAllowance": $scope.paydetail.medicalAllowance,
        "hra": $scope.paydetail.hra,
        "othersAllowance": $scope.paydetail.othersAllowance,
        "tds": $scope.paydetail.tds
      }] : $scope.paydetail,
      "pensionerAccounts": $scope.bank!==undefined?[{
            "bankCode": $scope.bank.bankCode,
            "accountEffectiveFrom": $scope.bank.accountEffectiveFrom,
            "ifscCode": $scope.bank.ifscCode,
            "accountNo": $scope.bank.accountNo,
            "branchName": $scope.bank.branchName,
            "branchCity": $scope.bank.branchCity,
            "state": $scope.bank.state,
  
          }]:$scope.bank
        };
  

        if($scope.pensionerForm.$valid){
    var req = {
      method: 'PUT',
      url: path+ (($scope.form.dateOfDeath===undefined || $scope.form.dateOfDeath===null) && $scope.form.staffPensionerId===null?'/api/v1/pensioners/'+$scope.pensionerId:'/api/v1/pensioners/'+$scope.pensionerId+'?isPensioner=false'),
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
        toastr["error"]("Something went wrong!!");
      }
  
       },
               function (err) {
                toastr["error"]("Something went wrong!!");
                 
       });
      }
      else{
        $scope.flgrequired=true;
        alert("Please Fill All Compulsory Field");
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
        // console.log('valid aadhar'+ $scope.form.aadhaar);
      } else {
        //console.log('Invalid aadhar'+$scope.form.aadhar);
        //alert("Please enter Valid aadhar Number");
        toastr["error"]("This is Not Valid Aadhaar Number");
        $scope.aadharflag=true;
        // $scope.form.aadhaar = "";
      }
    }
  };
  


  $scope.deleteById = function (id,mon,yr) {
    if(!(mon=== undefined || yr === undefined )){
    var params = {};
    params.pensionMonth=mon;
    params.pensionYear=yr;
    params.pensionerId= id;
    var req = {
      method: 'DELETE',
      url: path+"/api/v1/pension-details/deleteUandRbyIdMonYr",params: params,
      headers: {
        'Authorization': "Bearer " + sessionStorage.token,
        'Content-Type': 'application/json'
      },
      
    };
    
   $http(req).then(function(response){
  
       if (response.data.Message===1) {
        // $scope.pensionersDataById=response.data;
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


  $scope.$watch('curPage + itemsPerPage', function () {
    if($scope.watchFlag){
      $scope.fetchMonthlyPensionerData($scope.frm.searchCriteria,$scope.frm.searchCriteriaVal,$scope.search,'');
    }
    else if($scope.watchFlagSrch){
      $scope.searchPensionerDetails($scope.frm.searchCriteria,$scope.frm.searchCriteriaVal,'list');
    }
    else{
  
        if(pathSegments==='list_pensioner' || pathSegments==='pensioner-checker'){
          $scope.fetchAllPensioners('list'); 
        }
        else if(pathSegments==='pensioner_report'){
          $scope.fetchAllPensioners('report'); 
        }
    }
        
    });

    $scope.sameAsMobileNo=false;
    $scope.sameasMobileNo = function (val){
      if($scope.sameAsMobileNo){
        $scope.form.whatsAppMobileNo=val;
      }
      else{
        $scope.form.whatsAppMobileNo=undefined;
      }
  
    };
  });  
  
  