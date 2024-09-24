 
    app.controller('applicationUserContrl', function ($scope, $http, $window,$document, $rootScope, Upload)
      {
        $scope.selectedTypechk = 'employee';

        $scope.handleLink = function (pgname) {
          $rootScope.handleLink(pgname);
        };

        // $scope.clickChkBox = function () {
        //   if($window.sessionStorage.getItem('app_user_status')){
        //   if($window.sessionStorage.getItem('app_user_status')==='E'){
        //     $scope.selectedTypechk = 'employee';
        //   }
        //   else if($window.sessionStorage.getItem('app_user_status')==='P'){
        //     $scope.selectedTypechk = 'pensioner';
        //   }
        // }else{
        //   $scope.selectedTypechk = 'employee';
        // }
        // };
        // $scope.clickChkBox(); 
        $scope.flag=false;
        $scope.payData=[];
        $scope.paydetail = {};
        $scope.isOtherInputDisabled =true;
        $scope.user={};
        $scope.form={};



        $scope.accountdetialData=[];
        $scope.saveapplicationUser = function (f,selectedType) { 
          
            if(selectedType==='employee'){
              $scope.applicationUser.$submitted = true; 
              if(f.adminUser=='Y'){
                f.roleMasters = [
                  {
                   roleCode: "RL-Admin",
                   dscr:"Admin"
                 }
               ]
              }
              else{
              var selected = new Array();
              var tblFruits = document.getElementById("roleselect");
              var chks = tblFruits.getElementsByTagName("INPUT");
              for (var i = 0; i < chks.length; i++) {
              if (chks[i].checked) {
                    selected.push($scope.roleData[i]);
                }
              }
              f.roleMasters=selected;
            }
            }else if(selectedType==='pensioner'){
              f.adminUser='N';
              $scope.applicationUser.$submitted = true; 
                 f.roleMasters = [
               {
                roleCode: "RL-Pension",
                dscr:"Pensioner Entry"
              }
            ]
            }
           
        var fileInput = document.getElementById('fileInput');
        var file = fileInput.files[0];
        if($scope.applicationUser.$valid) { 
            if(f.roleMasters.length>0){
            if (file!==undefined) {
            var formData = new FormData();
            formData.append('applicationUserDto', new Blob([JSON.stringify(f)], { type: 'application/json' }));
            formData.append('profilephoto', file);
            
      var req = {
        method: 'POST',
        url: path+'/api/v1/users/register/',
        headers: {
          'Authorization': "Bearer " + sessionStorage.token,
          'Content-Type': undefined
        },
        data: formData
      };
      
     $http(req)
          .then(function successCallback(response) {
            $scope.accountData=response.data.user;
            $scope.accountdetialData=[];
            $scope.accountdetialData.push($scope.accountData);
             console.log("Post Account Data ",$scope.accountdetialData);
             $scope.flag=false;
             if (response.status == 201) {
              if(selectedType==='employee'){
                $scope.handleLink('userId_emp'); 
                $window.sessionStorage.setItem("app_user_status",'E');
               }else if(selectedType==='pensioner'){
                $scope.handleLink('userId_pen'); 
                $window.sessionStorage.setItem("app_user_status",'P');
               }
              $scope.pcode=false;
              toastr.success('Data saved successfully!', 'Success');
              $scope.selectedImage = null; 
              $scope.imagePreview = 'images/users.jpg';
              document.getElementById('fileInput').value = '';
              $scope.form={};
              } else {
               toastr.error('An error occurred while saving data.', 'Error');
              }
            var tblFruits = document.getElementById("roleselect");
            var chks = tblFruits.getElementsByTagName("INPUT");          
            for (var i = 0; i < chks.length; i++) {
                chks[i].checked = false;
            }          
          } 
        ,function errorCallback(error) {
              console.log("Saving of data failed ",error);
          }  
        );
        }else{
            alert("Please choose profile image!!")
          }
            }else{
              alert("Please choose Roles")
            }  
      }else{
        toastr.error('Please Fill Mandatory Fields');
          }
      };

   
     


      // $scope.DeleteData = function (pensionerId,bankCode,index) {      
      //   $http.delete(path+`/api/v1/pensioners/paydetial/${pensionerId}/${bankCode}`)
      //     .then(function (response) {
      //       $scope.getDependent();
      //       if (response.status == '204') {
      //           toastr.success('Data Deleted successfully!', 'Success');
      //          }
      //     },
      //       function (error) {
      //         console.log("erroe has occured allhandicaped data")
      //       }
      //     );
      // };

      $scope.payData=[];
      $scope.paydetialData=[];
      $scope.payDataById = function (pensionerId) {    
        $http.get(path+`/api/v1/pensioners/${pensionerId}`,{
          headers: {
              
              'Authorization': 'Bearer ' + sessionStorage.token
          }
      })
          .then(function (response) {
            
            $scope.payData=response.data;
           $scope.paydetialData=response.data.payDetails;
            $scope.form.aadhaar=$scope.payData.aadhaar;
            $scope.form.employeeName=$scope.payData.employeeName;
            $scope.form.payCommissionCode=$scope.payData.payCommissionCode;
            $scope.form.ppoNo=$scope.payData.ppoNo;
            $scope.form.mobileNo=$scope.payData.mobileNo;
            $scope.form.username=$scope.payData.mobileNo;
            $scope.form.userFullName=$scope.payData.employeeName;
            $scope.form.emailId=$scope.payData.emailId;
            if($scope.payData.pan==null){
              $scope.form.pan="No Record";
            }else{
              $scope.form.pan=$scope.payData.pan;
            }
            $scope.form.pensionerStatusCode=$scope.payData.pensionerStatusCode;
            $scope.form.departmentCode=$scope.payData.departmentCode;
            $scope.form.collegeCode=$scope.payData.collegeCode;
            //  console.log("paydetail data",$scope.paydetialData)
            if (response.status == '204') {
                toastr.success('Data Deleted successfully!', 'Success');
                $scope.getDependent();
               }
          },
            function (error) {
              console.log("erroe has occured allhandicaped data",error)
            }
          );
      };

      $scope.clr=function(){
        $scope.form.emailId="";
        $scope.form.statusCode="";
        $scope.selectedImage = null; 
        $scope.imagePreview = 'images/users.jpg'; 
        document.getElementById('fileInput').value = '';
        

      }

      $scope.dropData=[];
      $scope.roleData=[];
      $scope.allDropdata = function () {   
        $http.get(path+`/api/v1/dropdown/list`,{
          headers: {
              
              'Authorization': 'Bearer ' + sessionStorage.token
          }
      })
          .then(function (response) {
            
            $scope.clgs=response.data.colleges;
            $scope.depts=response.data.departments;
            $scope.pensionerStatusData=response.data.pensionerStatus;
            $scope.payCommisionData=response.data.payCommisions;
            //  $scope.roleData=response.data.roleMasters; 
             angular.forEach(response.data.roleMasters, function(item) {
              if(item.dscr!='Admin'){
                $scope.roleData.push(item);
              }
            });
          },
            function (error) {
              console.log("erroe has occured dropData data")
            }
          );
      };
      $scope.allDropdata();


    


      $scope.editData = function (e) { 
        $scope.flag=true;     
         $scope.form = {
         pensionerId:e.pensionerId, 
         userFullName: e.userFullName,
         username: e.username,
         mobileNo: e.mobileNo,
         emailId: e.emailId,
         userPassword: e.userPassword,
         statusCode: e.statusCode,
         adminUser: e.adminUser,
         statusDate: e.statusDate,
         dscr: e.dscr
     };
};

function exportTableToExcel() {
            const table = document.querySelector(".table.table-striped"); 
            if (table) {
                const ws = XLSX.utils.table_to_sheet(table);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
                XLSX.writeFile(wb, "patDetails.xlsx");
            }
        }
        const exportButton = document.getElementById("exportToExcel");
        if (exportButton) {
            exportButton.addEventListener("click", exportTableToExcel);
        }



        $scope.getAllPensioner = function () {      
          $http.get(path+"/api/v1/users-pen/all",{
            headers: {
                
                'Authorization': 'Bearer ' + sessionStorage.token
            }
        })
            .then(function (response) {
              $scope.all=response.data;
              $scope.allPensionersData=$scope.all.Pensioner;
              // console.log("$scope.allPensionersData",$scope.allPensionersData);
              
              setTimeout(function () {
                $('.dropdd').selectpicker();
              },15);
              // console.log("All pensioner_detial  data",$scope.allPensionersData)
            },
              function (error) {
                console.log("error has occured pensiondetial data",error)
              }
            );
        };
        $scope.getAllPensioner();


           $scope.chkPayDetail=function(pensionerId){ 
            var pen=pensionerId;
            $scope.accountdetialData=[];
           for(var a=0;a<$scope.allApplication.length;a++)
           {
            if(pen==$scope.allApplication[a].pensionerId){
              $scope.accountdetialData.push($scope.allApplication[a])
              
           }
           console.log("allApplication chk", $scope.accountdetialData)
           }
          };
        

        $scope.chk1 = function() {
          $scope.applicationUser.$setUntouched();
          $scope.applicationUser.$setPristine();
          $scope.flag=false;
          $scope.pcode1 = false;
          $scope.pcode = false;
          $scope.accountdetialData=[];
          $scope.selectedImage = null; 
          $scope.imagePreview = 'images/users.jpg'; 
          document.getElementById('fileInput').value = '';
          $scope.form = { 
                  pensionerId:"",
                  emailId: "",
                  userPassword: "",
                  lastUserPassword: "",
                  adminUser: "",
                  statusCode: "",
                  statusDate: "",
                  aadhaar: "",
                  employeeName: "",
                  payCommissionCode: "",
                  ppoNo: "",
                  mobileNo: "",
                  username: "",
                  userFullName: "",
                  pensionerStatusCode: "",
                  departmentCode: "",
                  collegeCode: "",
                  pan: "" 
            };
            setTimeout(function () {
              $('.dropdd').selectpicker('refresh');
            },15);

        }

      $scope.isOtherInputDisabled = true ;
      $scope.chk = function() {
        $scope.form={}
        if ($scope.selectedTypechk === 'pensioner') {
            $scope.isOtherInputDisabled = false;              
            $scope.otherInputValue = '';
            $scope.adm=true;
        } else {
            $scope.isOtherInputDisabled = true ;
            $scope.adm=false;
        }
    };
        

    $scope.selectedImage = null; 
    $scope.imagePreview = 'images/users.jpg'; 
    $scope.previewImage = function () {
    if ($scope.selectedFile) {
      Upload.dataUrl($scope.selectedFile, true).then(function (url) {
          $scope.imagePreview = url;
      });
    }
    else{
      $scope.imagePreview = 'images/users.jpg';
    }
    };


    $scope.chkmobile = function(mob) {
      var url = path+'/api/v1/search';
      var config = {
        params: { mobileNo: mob }
      };
      $http.get(url,config, {
        headers: {
            
            'Authorization': 'Bearer ' + sessionStorage.token
        }
    })
        .then(function(response) {
          console.log(response.data);
          if(response.data.result==1){
            $scope.pcode = true;
          }else{
            $scope.pcode = false;
          }
        })
        .catch(function(error) {
          console.error('Error:', error);
        });
    };

    $scope.chkemail = function(eml) {
      var url = path+'/api/v1/search';
      var config = {
        params: { emailId: eml }
      };
      $http.get(url,config,{
        headers: {
            
            'Authorization': 'Bearer ' + sessionStorage.token
        }
    })
        .then(function(response) {
          console.log(response.data);
          if(response.data.result==1){
            $scope.pcode1 = true;
          }else{
            $scope.pcode1 = false;
          }
        })
        .catch(function(error) {
          console.error('Error:', error);
        });
    };

    // $scope.restoreimage = function(status) {
    //       if(status=='employee'){
    //         $scope.selectedImage = null; 
    //         $scope.imagePreview = 'images/users.jpg'; 
    //         document.getElementById('fileInput').value = '';
    //       }
    //       else if(status=='pensioner'){
    //         $scope.selectedImage = null; 
    //         $scope.imagePreview = 'images/users.jpg'; 
    //         document.getElementById('fileInput').value = '';
    //       }
    // };    
        
    $scope.flag = false;
    $scope.dropdownOpen = false;

    $scope.toggleDropdown = function() {
        $scope.dropdownOpen = !$scope.dropdownOpen;
    };

    $scope.selectPensioner = function(id) {
      $scope.form.pensionerId = id;
      $scope.searchPensionerId=undefined;
      // $scope.dropdownOpen = false;
      id===undefined?$scope.form={}:$scope.payDataById(id);
      $scope.clr();
    };

    
  $scope.checkDuplicate = function (val1,val2){
    if(val1!=undefined && val2!=undefined){
    var params = {};
    params[val1] = val2;
    var req = {
      method: 'GET',
      url: path+'/api/v1/search',params:params,
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
