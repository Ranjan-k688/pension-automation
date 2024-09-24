

app.controller('monthly',function($scope,$http,sharedService) {
  $scope.pensionerData={};
  // $scope.searchDate = {
  //   start: moment(), // set initial start date (you can customize this)
  //   end: moment()    // set initial end date (you can customize this)
  // };
  $scope.masterdata=[];
  $scope.postoffice=[];
  $scope.pensionerdetails={};
  $scope.showdetails=[];
  $scope.frm={};
  $scope.search={};
  $scope.departments={};
  $scope.monRptOfPensioner={};



  $scope.curPage = 1;
  $scope.itemsPerPage = '600'; // Default value
  $scope.maxSize = 3;
  $scope.totalItems=0;
  $scope.pageFlag=false;
  $scope.watchFlag=false;


  // $(".loaderbg").show();

  $scope.fetchMaster = function () {

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
          // $scope.form.universityCode=$scope.universities[0].universityCode;
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


$scope.fetchMonthlyPensionerDataRange = function (val1,val2,f) {
  $(".loaderbg").show();
  $scope.pageFlag=false;
  var params = {};
  params= {
    page: $scope.curPage - 1,
    size: parseInt($scope.itemsPerPage),
 }
  if(f === undefined ){
    params.from=(moment().subtract(1, 'months')).format('DD-MM-YYYY');;
    params.to=moment().format('DD-MM-YYYY');
    params[val1] = val2;
    params.status = "D";
  }
        
  else{

      params.from=f.start;
      params.to=f.end;
      params[val1] = val2;
      params.status = "D";
    }

  var req = {
    method: 'GET',
    headers: {
      'Authorization': "Bearer " + sessionStorage.token,
      'Content-Type': 'application/json'
    },
    url: path+"/api/v1/pensioner-details/searchByFromTo",params: params
  };
  
 $http(req).then(function(res){

     if (res.status===200) {
      if(res.data.totalPages>1){
        $scope.pageFlag=true;
      }
      $scope.watchFlag=true;
      $scope.monRptOfPensioner=res.data.content;
      $scope.totalItems = res.data.totalElements; 
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




$scope.fetchAllPensionerData = function(status) {
  $scope.pageFlag=false;
  $(".loaderbg").show();
  var url = path + '/api/v1/pension-details/by-status/' + status +'?page=' + ($scope.curPage - 1) + '&size=' + parseInt($scope.itemsPerPage);
  $http.get(url,{
    
    headers: {
      
      'Authorization': 'Bearer ' + sessionStorage.token
    }
  }).then(function(response) {
      // Handle the response here
      // $scope.pensionerdetails=response.data;
      if(response.status===200){
        if(response.data.totalPages>1){
          $scope.pageFlag=true;
        }
        $(".loaderbg").hide();
        $scope.monRptOfPensioner=response.data.content;
        $scope.totalItems = response.data.totalElements; 
        $scope.mondismon=sharedService.getMonthName(response.data.content[0].pension_month);
        $scope.mondisyr=response.data.content[0].pension_year;
      }
      else{

      }
      // console.log(response.data);
  }).catch(function(error) {
      // Handle any errors here
      console.error(error);
  });
};
// $scope.fetchAllPensionerData ('D');



$scope.exportToExcel = function (){

  console.log("export");
   $(".excelformate").table2excel({
      filename : "monthly-pension-details.xls",
      fileext: ".xls"
    });
  //   var table = document.getElementsByClassName('excelformate');
  //  var wb = XLSX.utils.table_to_book(table);

  //  XLSX.writeFile(wb, "monthly-pension-details.xlsx");
};

$scope.monPensioerReportExcel={};

$scope.exportToExcel = function (val1) {
if(!(val1===undefined)){
      $scope.from=val1.start;
      $scope.to=val1.end;
  $(".loaderbg").show();
  var req = {
      method: 'GET',
      url: path + '/api/v1/pensioner-details/download/searchByFromTo?from=' + $scope.from +'&to='+ $scope.to + '&status=D',

   headers: {
    'Authorization': "Bearer " + sessionStorage.token,
    'Content-Type': 'application/json'
  },
  };

  $http(req).then(function (response) {
      if (response) {
              $scope.monPensioerReportExcel = response.data.content;
              setTimeout(function () {
                $(".excelformate").table2excel({
                    filename: "Monthly-Pension-Report.xls"
                });
                $(".loaderbg").hide();
            }, 3500); 
          }
          
          
      }, function (err) {
      console.error('Error fetching data:', err);
      $(".loaderbg").hide();
  });
}else{
alert('Please select date range!');
}
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
    $scope.fetchAllPensioners('report'); 
 }else{
  for(let i=0;i<$scope.masterdata.length;i++){
  if($scope.masterdata[i].shortName==val1){
    $scope.frm.srchCriteria=$scope.masterdata[i].displayName;
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
$scope.toggleAll = function () {
  angular.forEach($scope.pensionerdetails, function (item) {
    item.selected = $scope.selectAll;
  });
};

$scope.updateSelectedPensioners = function (selectedId) {
  var index = $scope.selectedPensionerIds.indexOf(selectedId);

  if (index === -1) {
    // If the ID is not in the array, add it
    $scope.selectedPensionerIds.push(selectedId);
  } else {
    // If the ID is already in the array, remove it
    $scope.selectedPensionerIds.splice(index, 1);
  }
};

$scope.sendSelectedPensioners = function () {
  var selectedPensionerIds = [];

  if ($scope.selectAll) {
    // If "Select All" is checked, send all IDs
    selectedPensionerIds = $scope.pensionerdetails.map(function (item) {
      return item.id;
    });
  } else {
    // If "Select All" is not checked, send only the ID of the selected item
    angular.forEach($scope.pensionerdetails, function (item) {
      if (item.selected) {
        selectedPensionerIds.push(item.id);
      }
    });
  }

  // Assuming you have an API endpoint to send the selected pensioner IDs
  $http.post('/api/sendPensioners', { ids: selectedPensionerIds },{
    
    headers: {
      
      'Authorization': 'Bearer ' + sessionStorage.token
    }
  })
    .then(function (response) {
      // Handle the response as needed
      console.log('Selected pensioners sent successfully:', response.data);
    })
    .catch(function (error) {
      // Handle errors
      console.error('Error sending selected pensioners:', error);
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
  if($scope.watchFlag){
    $scope.fetchMonthlyPensionerDataRange($scope.frm.searchCriteria,$scope.frm.searchCriteriaVal,$scope.search.searchDate);
  }
  else{
    $scope.fetchAllPensionerData('D');
  }
      
  });

});  

