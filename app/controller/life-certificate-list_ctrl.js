

app.controller('lifeCertificateList',function($scope,$http,sharedService, $rootScope) {


  $scope.handleLink = function (pgname) {
    $rootScope.handleLink(pgname);
  };
    $scope.frm={};
    $scope.watchFlag=false;
 
  $scope.pageFlag=false;

  $scope.curPage = 1;
  $scope.itemsPerPage = '700'; // Default value
  $scope.maxSize = 3;
  $scope.totalItems=0;
  $scope.lifeCertificateData=[];


 
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
          $scope.masterdata=masterdata_res.data.masterDetails;
        
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

  $scope.fetchAllLifeCertificate = function (flagsts) {
      $(".loaderbg").show();
      $scope.pageFlag=false;
      var date = new Date();
      $scope.currentMonth = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() returns 0-11, so add 1
      $scope.currentYear = date.getFullYear();
      var monYr=$scope.currentYear+'-'+$scope.currentMonth;
      var req = {
          method: 'GET',
          url: path + '/api/v1/pension/lifecert/current-yr-list?yrMn='+monYr,
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
                  $scope.lifeCertificateData = response.data.content;
                  $scope.totalItems = response.data.totalElements;
                  $(".loaderbg").hide(); 
          }
          else{
            $(".loaderbg").hide();
            toastr["error"]("Something went wrong!!");
          }
      }, function (err) {
          console.error('Error fetching data:', err);
          $(".loaderbg").hide();
      });
  };

  var pathSegments = window.location.hash.split('#!/')[1];


  $scope.numOfPages = function () {
    return Math.ceil($scope.totalItems / parseInt($scope.itemsPerPage));
};


      $scope.searchLifeCertificate = function (val1,val2) {

        var date = new Date();
        $scope.currentMonth = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() returns 0-11, so add 1
        $scope.currentYear = date.getFullYear();
        var monYr=$scope.currentYear+'-'+$scope.currentMonth;
        $(".loaderbg").show();
        $scope.pageFlag=false;
        var params = {};
        if(val1 && val2 && val2!=''){
          params[val1] = val2;
        }
        params.page= $scope.curPage - 1;
        params.size= parseInt($scope.itemsPerPage);
        var req = {
          method: 'GET',
          url: path+'/api/v1/pension/lifecert/current-yr-list?yrMn='+monYr,params: params,
          headers: {
            'Authorization': "Bearer " + sessionStorage.token,
            'Content-Type': 'application/json'
          },
          
        };
        
       $http(req).then(function(response){
      
           if (response) {
            $scope.watchFlag=true;
            if(response.data.totalPages>1){
              $scope.pageFlag=true;
            }
            $scope.lifeCertificateData = response.data.content;
            $scope.totalItems = response.data.totalElements;
            $(".loaderbg").hide(); 
              
           }
      
           else {
          }
      
           },
           function (err) {         
           });
      
      };




  $scope.exportToExcel = function (flgsts) {
    $(".loaderbg").show();
    var req = {
        method: 'GET',
        url: path + (flgsts === 'report' ? "/api/v1/pension-details/download/by-status/U" : "/api/v1/pensioners/getAllPensionerData/download"),

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
        $scope.form=pensionerdetails_res.data;
        $scope.form.departmentCode=pensionerdetails_res.data.departmentCode+'!!'+pensionerdetails_res.data.departmentIds;
        $scope.form.desigShortName=pensionerdetails_res.data.desigShortName+'!!'+pensionerdetails_res.data.designationId;
        
        $scope.paydetail=$scope.form.payDetails[0];
        $scope.bank=$scope.form.pensionerAccounts[0];
        if($scope.form.mobileNo===$scope.form.whatsAppMobileNo){
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
      $scope.curPage = 1;
      $scope.itemsPerPage = '100'; // Default value
      $scope.maxSize = 3;
      $scope.totalItems=0;
      $scope.frm.searchCriteria=val1
      $scope.fetchAllLifeCertificate(); 
   }else{
    for(let i=0;i<$scope.masterdata.length;i++){
    if($scope.masterdata[i].shortName==val1){
      $scope.frm.srchCriteria=$scope.masterdata[i].displayName;
      $scope.frm.searchCriteria=$scope.masterdata[i].shortName;
    }
  }
  }
  };
  
  

  $scope.$watch('curPage + itemsPerPage', function () {
    if($scope.watchFlag){
      $scope.searchLifeCertificate($scope.frm.searchCriteria,$scope.frm.searchCriteriaVal);
    }
    else{
  
        if(pathSegments==='list-life-certificate'){
          $scope.fetchAllLifeCertificate('list');
        }
    }
        
    });


    $scope.ids=[];
    $scope.remarks='';
    $scope.finYear='';
    $scope.verifyLifeModal = function (val) {
      $scope.ids=[];
      $scope.remarks='';
      $scope.finYear='';
      $scope.ids.push(val.pensionerId);
      $scope.finYear=val.finYear;
      $scope.imageLifeCert=val.imageFileName;
      $('#showImageModal').modal('show');
  };
  $scope.closemodalverifyLife = function () {
   $('#showImageModal').modal('hide');
  };


  

$scope.VerifyLifeCertificate = function (remarks) {
    
        var data = {
            ids: $scope.ids,
            remarks:remarks,
            finYr:$scope.finYear

        };
        var req = {
          method: 'PUT',
          url: path+'/api/v1/pension/lifecert/verify-certificate',
          headers: {
            'Authorization': "Bearer " + sessionStorage.token,
            'Content-Type': 'application/json'
          },
          data: data
          
        };
       $http(req).then(function(res){
      
           if (res.status===200) {
            $scope.fetchAllLifeCertificate();
            toastr["success"]("Certificate Verified");
            $('#showImageModal').modal('hide');
           }
      
           else {
           alert("Error!!");
          }
      
           },
           function (err) {
            if(err.data=="Expired token"){
                $rootScope.logout();
            }
            else{
                alert("Error by server!!");   
            }           
           });
  
  };
  });  
  
  