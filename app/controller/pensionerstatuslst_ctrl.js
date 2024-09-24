

        app.controller('pensionerstatuslst', function ($scope, $http, $rootScope) {



            // $scope.edit = function (n) {
            //     $scope.IdDisable = true;
            //     $scope.form = n;

            //     console.log(n);
            // }
            $scope.edit = function (pensionerStatusCode) {
                console.log(pensionerStatusCode);
                var nObject = {
                    pensionerStatusCode: pensionerStatusCode
                };

                var url = "pensionerstatus.html?n=" + JSON.stringify(nObject);
                window.open(url, "_blank");
            };


            $scope.delete = function (a) {
                console.log(">>>>>>>>>>>a", a);
                $http.delete(path+`/api/v1/pension/pensionerstatus/${a}`,{
                    
                    headers: {
                      
                      'Authorization': 'Bearer ' + sessionStorage.token
                    }
                })
                    .then(function (response) {
                        if (response.status == 200) {
                            $scope.getAllPensionerStatus();
                            toastr.success('Deleted Successfully!!.', {timeOut: 5000})
                        }
                        console.log("deleted", response)
                        // $scope.form = {};

                    }, function (err) {
                        console.log(err)
                    })
            }
            $scope.view = function (a) {
                document.getElementById("detailmodal").style.display = "block";

                console.log(">>>>>>>>>>>a", a);
                $http.get(path+`/api/v1/pension/pensionerstatus/${a}`,{
                    
                    headers: {
                      
                      'Authorization': 'Bearer ' + sessionStorage.token
                    }
                })
                    .then(function (response) {
                        $scope.pensionerStatus = response.data;
                        console.log(">>>>>>>>>>>>>>>>>>>>", a)
                        console.log("my bad", response)
                        // $scope.form = {};


                    }, function (err) {
                        console.log(err)
                    })
            }

            $scope.convertCamelToReadable = function (input) {
                // Use a regular expression to insert spaces before capital letters
                return input.replace(/([A-Z])/g, ' $1')
                    // Capitalize the first letter and remove underscores (if any)
                    .replace(/^./, function (str) { return str.toUpperCase(); })
                    .replace(/_/g, ' ');
            }







            $scope.closeDetail = () => {
                document.getElementById("detailmodal").style.display = "none";
            };

            
            $scope.add = () => {
                $rootScope.handleLink('pensionerstatus');
            };


            var modal = document.getElementById("detailmodal");
            var closeBtn = document.getElementById("closeBtn");

            // Add an event listener for the "Escape" key press
            document.addEventListener("keydown", function (event) {
                if (event.key === "Escape") {
                    modal.style.display = "none"; // Hide the modal when "Escape" key is pressed
                }
            });


            $scope.pensionStatusData = [];
            $scope.getAllPensionerStatus = function () {
                $http.get(path+"/api/v1/pension/pensionerstatus",{
                    
                    headers: {
                      
                      'Authorization': 'Bearer ' + sessionStorage.token
                    }
                })
                    .then(function (res) {
                        console.log("pensionStatusData", res.data)
                        $scope.pensionStatusData = res.data;

                    })
            }
            $scope.getAllPensionerStatus();
        })
