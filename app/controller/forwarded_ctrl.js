

app.controller('forwarded',function($scope,$http,sharedService) {
  $scope.pensionerData={};
  $scope.masterdata=[];
  $scope.postoffice=[];
  $scope.pensionerdetails={};
  $scope.forVirDirData={};
  $scope.forwardData={};
  $scope.forwardDataRet={};
  $scope.forwardDataFlag=false;
  $scope.forwardDataRetFlag=false;
  $scope.showdetails=[];
  $scope.frm={};
  $scope.frm1={};
  $scope.departments={};
  $scope.form={};
  $scope.search={};
  $scope.search1={};

  $scope.curPage = 1;
  $scope.itemsPerPage = '600'; // Default value
  $scope.maxSize = 3;
  $scope.totalItems=0;
  $scope.pageFlag=false;
  $scope.watchFlag=false;

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
  $scope.$watchGroup(['search.year', 'search1.year'], function(newYears) {
    var newYear1 = newYears[0];
    var newYear2 = newYears[1];

    $scope.search.month = undefined;
    $scope.search1.month = undefined;

    var currentYear = new Date().getFullYear();
    var currentMonth = new Date().getMonth() + 1; // getMonth() returns month index (0-11)

    if (newYear1 == currentYear || newYear2 == currentYear) {
        // If either selected year is the current year, filter out future months
        $scope.availableMonths = $scope.months.filter(function(month) {
            return month.value <= currentMonth;
        });
    } else {
        // Otherwise, show all months
        $scope.availableMonths = $scope.months;
    }
});



  $scope.fetchMaster = function () {

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
  $scope.postoffice=res.data[0].PostOffice;
    $scope.form.state =res.data[0].PostOffice[0].State;               			
    $scope.form.city=res.data[0].PostOffice[0].District;
}
else{
alert("Please Enter Valid Pin Code!");
$scope.form.p_state ="";               			
      $scope.form.p_district="";
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



$scope.fetchforforward = function(status) {
  $(".loaderbg").show();
  $scope.pageFlag=false;
  var url = path + '/api/v1/pension-details/by-status/' + status +'?page=' + ($scope.curPage - 1) + '&size=' + parseInt($scope.itemsPerPage);

 
  $http.get(url,{
    
    headers: {
      
      'Authorization': 'Bearer ' + sessionStorage.token
    }
  }).then(function(response) {
      // Handle the response here
      if(response.status===200){
      if(response.data.totalPages>1){
        $scope.pageFlag=true;
      }
      if(status=='U'){
        $(".loaderbg").hide();
        $scope.forwardData=response.data.content; 
        $scope.totalItems = response.data.totalElements; 
        if($scope.forwardData.length){
          $scope.forwardDataFlag=true;
          $scope.frmon=response.data.content[0].pension_month;
          $scope.fryr=response.data.content[0].pension_year; 
        }
      }
      else if(status=='R'){
        $(".loaderbg").hide();
        $scope.forwardDataRet=response.data.content;
        $scope.totalItems = response.data.totalElements;
        if($scope.forwardDataRet.length){
          $scope.forwardDataRetFlag=true;
          $scope.frmonret=response.data.content[0].pension_month;
          $scope.fryrret=response.data.content[0].pension_year; 
        } 
      }
    }
      else{
        $(".loaderbg").hide();
      }
      
  }).catch(function(error) {
      // Handle any errors here
      console.error(error);
      $(".loaderbg").hide();
  });
};

$scope.tab1flg=true;
$scope.tab2flg=false;
$scope.opentab=function(openflg){
  $scope.watchFlag=false;
  if(openflg=='tab1'){
    $scope.tab1flg=true;
    $scope.tab2flg=false;
    $scope.curPage = 0;
    // $scope.fetchforforward ('U');  
  }
  else if(openflg=='tab2'){
    $scope.tab1flg=false;
    $scope.tab2flg=true;
    $scope.curPage = 0;
    // $scope.fetchforforward ('R');
  }
  $scope.search = {};
  $scope.search1 = {};
  $scope.frm= {};
  $scope.frm1= {};

};
$scope.opentab('tab1');



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
      $scope.departmentlist[i]=$scope.departments[i];
    }
  }

};


$scope.exportToExcel = function (){

  // console.log("export");
   $(".excelformate").table2excel({
      filename : "pensioner-details.xls"
    });
};

$scope.pensionerId='';
$scope.editdata = function (val){
  $scope.pensionerId=val;
  var req = {
    method: 'GET',
    url: path+'/api/v1/pensioners/'+val,
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
      $scope.form=pensionerdetails_res.data;
      
      $scope.paydetail=$scope.form.payDetails[0];
      $scope.bank=$scope.form.pensionerAccounts[0];
      $('.popupbg').show();
      
     }

     else {
    }

     },
     function (err) {
            
               
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
$scope.checkCharacterLengthInPixels = function(val1) { 
  if (val1=='All') {
    if($scope.tab1flg){
      $scope.fetchforforward ('U');  
    }
    else if($scope.tab2flg){
      $scope.fetchforforward ('R');
    }
 }else{
  for(let i=0;i<$scope.masterdata.length;i++){
  if($scope.tab1flg){
    if($scope.masterdata[i].shortName==val1){
      $scope.frm.srchCriteria=$scope.masterdata[i].displayName;
    } 
  }
  else if($scope.tab2flg){
    if($scope.masterdata[i].shortName==val1){
      $scope.frm1.srchCriteria=$scope.masterdata[i].displayName;
    }
  }
}
    var offScreenSpan = angular.element('<span style="visibility:hidden;position:absolute;top:-9999px;font-size:16px;">' + $scope.srchCriteria + '</span>');
    angular.element(document.body).append(offScreenSpan); 
    var textWidth = offScreenSpan[0].offsetWidth; 
    offScreenSpan.remove(); 
    $scope.valuew = textWidth+90;
}
};



$scope.selectAll = false;
$scope.selectReturnAll = false;

$scope.toggleAll = function(data, isReturn) {
  var selectAllFlag = isReturn ? 'selectAll' : 'selectReturnAll';
  var selectedKey = isReturn ? 'selected' : 'selectedReturn';
  // var selectAllFlag = isReturn ? 'selectRetunAll' : 'selectAll';
  // var selectedKey = isReturn ? 'selectedReturn' : 'selected';

  angular.forEach(data, function(item) {
    item[selectedKey] = $scope[selectAllFlag];
    // item[selectedKey] = true;
  });
};


$scope.sendSelectedPensioners = function(data,val, isReturn,month,year) {

 
  var selectedData = data;
  var selectedFlag = isReturn ? 'selectAll' : 'selectRetunAll';
  var selectedKey = isReturn ? 'selected' : 'selectedReturn';

  var selectedPensionerIds = [];
  var penmonth=[];
  var penyear=[];

  if ($scope[selectedFlag]) {
    // If "Select All" is checked, send all IDs
    selectedPensionerIds = selectedData.map(function(item) {
      return item.id;
    });
    penmonth  = selectedData.map(function(item) {
      return item.pension_month;
    });
    penyear  = selectedData.map(function(item) {
      return item.pension_year;
    });
  } else {
    // If "Select All" is not checked, send only the ID of the selected item
    angular.forEach(selectedData, function(item) {
      if (item[selectedKey]) {
        selectedPensionerIds.push(item.id);
        penmonth.push(item.pension_month);
        penyear.push(item.pension_year);
      }
    });
  }
  
  var requestData = {
    pensionIds: selectedPensionerIds,
    pensionStatus: val,
    pensionMonth:penmonth[0],
    pensionYear:penyear[0]
  };
     if(selectedPensionerIds.length!=0){
      $(".forwardingload").show();
  var req = {
    method: 'PUT',
    url: path + "/api/v1/pension-details/update-all",
    headers: {
      'Authorization': "Bearer " + sessionStorage.token,
      'Content-Type': 'application/json'
    },
    data: requestData
  };

  $http(req).then(
    function(res) {
      if (res.status == 200) {
        $(".forwardingload").hide();
        alert("Forwarded for verification!!");
        // $scope.fetchforforward(val);
        if(!$scope.watchFlag){
        if($scope.tab1flg){
          $scope.fetchforforward ('U');  
        }
        else if($scope.tab2flg){
          $scope.fetchforforward ('R');
        }
          $scope.search = {};
          $scope.search1 = {};
          $scope.frm= {};
          $scope.frm1= {};
      }
      else{
        if($scope.tab1flg){
          $scope.fetchMonthlyPensionerData($scope.frm.searchCriteria,$scope.frm.searchCriteriaVal,$scope.search,'U');
          }
          else if($scope.tab2flg){
            $scope.fetchMonthlyPensionerData($scope.frm1.searchCriteria,$scope.frm1.searchCriteriaVal,$scope.search1,'R');
          }
      }
          $scope.selectAll = false;
          $scope.selectReturnAll = false;
          
      } else {
        $(".forwardingload").hide();
        alert("Something Went Wrong!!");
      }
    },
    function(err) {
      $(".forwardingload").hide();
    }
  );
}
else{
alert("First Select then click!!");
}
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
      alert("Date of Last Appointment is greater than Date of Birth");
    }
    
  }
  else  if(val3=='Rgl'){
    $scope.result=sharedService.compareDates(val1, val2);
    if($scope.result>0){
       $scope.rgl=false;
    }
    else{
      $scope.rgl=true;
      alert("Date of Regularisation is greater than Date of Last Appointment");
    }
    
  }
  else  if(val3=='Spr'){
    $scope.result=sharedService.compareDates(val1, val2);
    if($scope.result>0){
       $scope.spr=false;
    }
    else{
      $scope.spr=true;
      alert("Date of Separation is greater than Date of Regularisation");
    }
    
  }

// alert($scope.result);
};



    $scope.formatDateToPreviousType = function(dateString) {
      if (dateString && dateString.split('-').length === 3) {
          const parts = dateString.split('-');
          return parts[2] + '-' + parts[1] + '-' + parts[0];
      }
      return dateString;
    };

    
    $scope.fetchMonthlyPensionerData = function (val1,val2,f,statusflg) {
      $(".loaderbg").show();
      $scope.pageFlag=false;
      if(!(f === undefined || f.month === undefined || f.year === undefined )){
      var params = {};
      params= {
        page: $scope.curPage - 1,
        size: parseInt($scope.itemsPerPage),
     }
      if(val1=='All' || val1=="pension_status"){
        params.pensionMonth=f === undefined || f.month === undefined ? 0 : f.month;
        params.pensionYear=f === undefined || f.year === undefined ? 0 : f.year;
        params.status=statusflg;
      }
   else{
      if(f === undefined || f.month === undefined || f.year === undefined){
        params.pensionMonth=f === undefined || f.month === undefined ? 0 : f.month;
        params.pensionYear=f === undefined || f.year === undefined ? 0 : f.year;
        params.status=statusflg;
        params[val1] = val2;  
      }
            
      else{
        params.pensionMonth=f === undefined || f.month === undefined ? 0 : f.month;
        params.pensionYear=f === undefined || f.year === undefined ? 0 : f.year;
          params.status=statusflg;
          params[val1] = val2;
        }
      }
      var req = {
        method: 'GET',
        url: path+"/api/v1/pensioner-details/searchByMonYrStatus",
        headers: {
          'Authorization': "Bearer " + sessionStorage.token,
          'Content-Type': 'application/json'
        },
        
        params: params
      };
      
     $http(req).then(function(response){
    
         if (response.status===200) {
          if(response.data.totalPages>1){
            $scope.pageFlag=true;
          }
          $scope.watchFlag=true;
          if(statusflg=='U'){
            $scope.forwardData=response.data.content; 
            $scope.totalItems = response.data.totalElements; 
            if($scope.forwardData.length){
              $scope.forwardDataFlag=true;
            $scope.frmon=response.data.content[0].pension_month;
            $scope.fryr=response.data.content[0].pension_year; 
            }
              $(".loaderbg").hide();
          }
          else if(statusflg=='R'){
            $scope.forwardDataRet=response.data.content;
            $scope.totalItems = response.data.totalElements; 
            if($scope.forwardDataRet.length){
              $scope.forwardDataRetFlag=true;
              $scope.frmonret=response.data.content[0].pension_month;
              $scope.fryrret=response.data.content[0].pension_year; 
            }
            $(".loaderbg").hide();
          }
         }
    
         else {
            $scope.yrmon.month='';
            $scope.yrmon.year=''; 
            $scope.yrmon1.month='';
            $scope.yrmon1.year=''; 
            $(".loaderbg").hide();
        }
    
         },
         function (err) {
          $(".loaderbg").hide();
                
                   
         });
        } 
        else{
          alert("Please select month and year.");
          $(".loaderbg").hide();
        }
    
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

    $scope.updateItemsPerPage = function () {
      $scope.curPage = 1;
      if(pathSegments==='list_pensioner' || pathSegments==='pensioner-checker'){
        $scope.fetchAllPensioners('list'); 
      }
      else if(pathSegments==='pensioner_report'){
        $scope.fetchAllPensioners('report'); 
      }
  };

  $scope.numOfPages = function () {
    return Math.ceil($scope.totalItems / parseInt($scope.itemsPerPage));
};


    $scope.$watch('curPage + itemsPerPage', function () {
      if($scope.curPage===0){
        $scope.curPage = 1;
      }
      if($scope.watchFlag){
        if($scope.tab1flg){
        $scope.fetchMonthlyPensionerData($scope.frm.searchCriteria,$scope.frm.searchCriteriaVal,$scope.search,'U');
        }
        else if($scope.tab2flg){
          $scope.fetchMonthlyPensionerData($scope.frm1.searchCriteria,$scope.frm1.searchCriteriaVal,$scope.search1,'R');
        }
      }
      else{
    
          if($scope.tab1flg){
            $scope.fetchforforward ('U'); 
          }
          else if($scope.tab2flg){
            $scope.fetchforforward ('R'); 
          }
      }
          
      });
});  

