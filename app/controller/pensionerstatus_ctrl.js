app.controller('pensionerstatus', function ($scope, $http, $timeout) {
    $scope.flag = false
    $scope.pensionerStatus = [];
    $scope.savePensionerStatus = function (f) {
        if ($scope.pensionerform.$valid) {
            if (!$scope.isExsistPensionerStatusCode(f.pensionerStatusCode)) {
                $http.post(path + "/api/v1/pension/pensionerstatus", f,{
                    
                    headers: {
                      
                      'Authorization': 'Bearer ' + sessionStorage.token
                    }
                })
                    .then(function successCallback(response) {
                        console.log(response);
                        // $scope.pensionerStatus = response.data;
                        console.log("Post Data ", $scope.pensionerStatus);
                        $scope.flag = false;
                        $scope.formSubmitted = true;
                        // Show a success toast message
                        toastr.success('Save Successfully!', { timeOut: 2000 });
                        $timeout(function () {
                            $scope.showSuccess = false;
                        }, 2000);
                        $scope.getPensionersData();
                        $scope.form = {};
                    }, function errorCallback(response) {
                        console.log("Saving of data failed ", response);
                        // Show an error toast message
                        toastr.error('Failed to Save Data!', { timeOut: 2000 });
                    });
            } else {
                window.alert('Pensioner status Code is already exsist.');
                $scope.form = {};
                $scope.formSubmitted = true;
            }
        } else {
            alert("Fill in all the required fields!!");
        }
    };



    $scope.pensionersData = [];
    $scope.getPensionersData = function () {
        $(".loaderbg").show();
        $http.get(path + "/api/v1/pension/pensionerstatus",{
            
            headers: {
              
              'Authorization': 'Bearer ' + sessionStorage.token
            }
        })
            .then(function (response) {
                $(".loaderbg").hide(); 
                $scope.pensionersData = response.data;
                console.log("All pensionersData  data", $scope.pensionersData);
            },
                function (error) {
                    console.log("erroe has occured pensioners Data data", error);
                    $(".loaderbg").hide(); 
                    if(error.data=="Expired token"){
                        if(error.data=="Expired token"){
                            $rootScope.logout();
                        }
                    }else{
                        alert("Error by server!!");
                        $(".loaderbg").hide();   
                    }
                }
            );
    };
    $scope.getPensionersData();

    $scope.isExsist = false;
    $scope.isExsistPensionerStatusCode = function (pensionerStatusCode) {
        if (pensionerStatusCode) {
            for (let i = 0; i < $scope.pensionersData.length; i++) {
                const element = $scope.pensionersData[i];
                if (element.pensionerStatusCode == pensionerStatusCode) {
                    return true;
                }
            }
            return false;
        }
    }


    $scope.deleteData = function (pensionerStatusCode) {
        $http.delete(`${path}/api/v1/pension/pensionerstatus/${pensionerStatusCode}`,{
            
            headers: {
              
              'Authorization': 'Bearer ' + sessionStorage.token
            }
        })
            .then(function (response) {
                if (response.status === 200) {
                    $scope.getPensionersData();
                    // console.log("you are in delete", response);
                    // Show a success toast message for successful deletion
                    toastr.success('Deleted Successfully!', { timeOut: 500 });
                }
            }, function (error) {
                console.log("An error has occurred when deleting data", error);
                // Show an error toast message for deletion failure
                toastr.warning('This pensioner status code already used!', { timeOut: 2000 });
            });
    };

    $scope.setDeleteData = function (n) {
        // Set the data to delete
        console.log("ranjan>", n)
        $scope.deleteDataInfo = n;
        console.log("deleteDataInfo>", $scope.deleteDataInfo)
    };



    $scope.editData = function (e) {
        // $scope.updateFlag = true;
        $scope.form = {
            pensionerStatusCode: e.pensionerStatusCode,
            handicapType: e.handicapType,
            allowablePerc: e.allowablePerc,
            dscr: e.dscr
        };

    };


    function exportTableToExcel() {
        const table = document.querySelector(".table .table-striped");
        if (table) {
            const ws = XLSX.utils.table_to_sheet(table);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
            XLSX.writeFile(wb, "PhyHandicapped.xlsx");
        }
    }

    const exportButton = document.getElementById("exportToExcel");
    if (exportButton) {
        exportButton.addEventListener("click", exportTableToExcel);
    }
});