        app.controller('relationship', function ($scope, $http, $timeout) {
            $scope.form = {};
            $scope.formSubmitted = false;

            $scope.saveRelation = function () {
                if (!$scope.isRelationExsist($scope.form.pensionerRelation)) {

                    // console.log($scope.form)
                    $http.post(path + "/api/v1/pension/relation", $scope.form,{
                        
                        headers: {
                          
                          'Authorization': 'Bearer ' + sessionStorage.token
                        }
                    })
                        .then(function (response) {
                            if (response.status === 200) {
                                toastr.success("Data Saved Successfully!", { timeOut: 3000 })
                                // console.log("res", response)
                                $scope.form = {};
                                $scope.getPensionerType();
                                $scope.formSubmitted = true;
                            }
                        }, function (err) {
                            // console.log(err);
                        })
                }
                else {
                    alert("This relation is already exsist!");
                }
            }
            $scope.edit = function (n) {
                $scope.form = n;
                // console.log(n);
            }
            $scope.deleteRel = function (a) {
                console.log(">>>>>>>>>>>a", a);
                $http.delete(`${path}/api/v1/pension/relation/${a}`,{
                    
                    headers: {
                      
                      'Authorization': 'Bearer ' + sessionStorage.token
                    }
                })
                    .then(function (response) {
                        console.log("deleted", response);
                        if (response.status == 200) {
                            if (!$('#deleteConfirmationModal').modal('hide')) {
                                $('#deleteConfirmationModal').modal('hide');
                            }
                            toastr.success(response.data.massage, {timeOut: 3000})
                            $scope.getPensionerType();
                            $scope.form = {};
                        } else if (response.status === 203) {
                            if (!$('#deleteConfirmationModal').modal('hide')) {
                                $('#deleteConfirmationModal').modal('hide');
                            }
                            toastr.warning('This relation is used with  another pensioner.', { timeOut: 3000 });
                        }
                    }, function (err) {
                        console.log(err);
                        toastr.error('Somthing went wrong!', { timeOut: 3000 });
                        $scope.getPensionerType();
                    })
            }
            $scope.setDeleteData = function (n) {
                $scope.deleteDataInfo = n;
                console.log("deleteDataInfo>", $scope.deleteDataInfo,n);
            };
            $scope.getPensionerType = function () {
                $http.get(path+"/api/v1/pension/relation",{
                    
                    headers: {
                      
                      'Authorization': 'Bearer ' + sessionStorage.token
                    }
                })
                    .then(function (response) {
                        // console.log("getPensionerType>>>>>>>>>>>>>>>>", response)
                        $scope.relationData = response.data;
                    }, function (error) {
                        if(error.data=="Expired token"){
                            if(error.data=="Expired token"){
                                $rootScope.logout();
                            }
                        }else{
                            alert("Error by server!!");  
                        }
                    })
            }
            $scope.getPensionerType();
            $scope.isExsist = false;
            $scope.isRelationExsist = function (pensionerRelation) {
                if (pensionerRelation) {
                    const lowerCasePensionerRelation = pensionerRelation.toLowerCase();
                    const upperCasePensionerRelation = pensionerRelation.toUpperCase();

                    for (let i = 0; i < $scope.relationData?.length; i++) {
                        const element = $scope.relationData[i];
                        const elementLowerCase = element.pensionerRelation.toLowerCase();
                        const elementUpperCase = element.pensionerRelation.toUpperCase();

                        if (elementLowerCase === lowerCasePensionerRelation ||
                            elementUpperCase === upperCasePensionerRelation) {
                            // console.log(element.pensionerRelation, pensionerRelation);
                            return true;
                        }
                    }
                }
                return false;
            };

        })

