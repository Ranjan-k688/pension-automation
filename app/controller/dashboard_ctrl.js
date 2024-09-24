app.controller('dashboard', function ($scope, $http, $timeout, $window, $rootScope, $interval)
 {

        $scope.adminflg=false;
        $scope.pnsnGenflg=false;
        $scope.misflg=false;
        $scope.payflg=false;
        $scope.frwdflg=false;
        $scope.verifrflg=false;
        $scope.dsbrsrflg=false;
    $scope.handleLink = function (pgname) {
        $rootScope.handleLink(pgname);
      };
      $scope.rolelist=[];
      $scope.rolelist=$window.sessionStorage.getItem('rolelist');

      $scope.rolecheck=function(){
        var roleArray = $scope.rolelist.split(',');
        for(let i=0;i<=roleArray.length;i++){
          if(roleArray[i]=='RL-Admin'){
                $scope.adminflg=true;
                $scope.pnsnGenflg=true;
                $scope.pensionflg=true;
                $scope.misflg=true;
                $scope.payflg=true;
                $scope.frwdflg=true;
                $scope.verifrflg=true;
                $scope.dsbrsrflg=true;
               }
               else if(roleArray[i]=='RL-PnsnGen'){
                $scope.pnsnGenflg=true;
               }
               else if(roleArray[i]=='RL-Pension'){
                $scope.pensionflg=true;
               }
               else if(roleArray[i]=='RL-MIS'){
                $scope.misflg=true;
               }
               else if(roleArray[i]=='RL-Pay'){
                $scope.payflg=true;
               }
               else if(roleArray[i]=='RL-Frwd'){
                $scope.frwdflg=true;
               }
               else if(roleArray[i]=='RL-Verifr'){
                $scope.verifrflg=true;
               }
               else if(roleArray[i]=='RL-Dsbrsr'){
                $scope.dsbrsrflg=true;
               }
                  }
                }
                $scope.rolecheck();


                $scope.amountMonthLables=[];
                $scope.amountMonthRecord=[];

  $scope.fetchMaster = function () {

    var req = {
      method: 'GET',
      url: path+'/api/v1/pensioner-details/mis-dashboard-data',
      headers: {
        'Authorization': "Bearer " + sessionStorage.token,
        'Content-Type': 'application/json'
      },
      
    };
   $http(req).then(function(chat_res){

       if (chat_res.status===200) {
          $scope.allPensionerData=chat_res.data.PensionProcessData.boxdata;
          $scope.allChartPensionerData=chat_res.data.PensionProcessData.data;
          $scope.allChartPensionerLables=chat_res.data.PensionProcessData.labels;

          $scope.agewisePensionerLables=chat_res.data.pensionerAgeData.labels;
          $scope.agewisePensionerRecord=chat_res.data.pensionerAgeData.data1;
          $scope.agewisePensionerAmount=chat_res.data.pensionerAgeData.data2;

          $scope.amountMonthLables=chat_res.data.monthlyAmtData.labels.reverse();
          $scope.amountMonthRecord=chat_res.data.monthlyAmtData.data.reverse();
          $scope.amountYr='All';
          $scope.amountyear=chat_res.data.pensionYears.years;
          var ctx = $("#chart-line");
          var myLineChart = new Chart(ctx, {
          type: 'pie',
          data: {
          labels: $scope.allChartPensionerLables,
          datasets: [{
            borderWidth: 3,
          data: $scope.allChartPensionerData,
          backgroundColor: ["#7eeb97","#f7cb8c", "#165793", "#35727b", "#16c2d2", "#cdcf85","#8f8ff9","#f198ec"]
          }]
          },
          options: {
          title: {
          //display: true,
          //text: 'Weather'
          }
          }
          });


                          /* 3 donut charts */
                          var donutOptions = {
                            cutoutPercentage: 60, 
                            legend: {position:'top', padding:10, labels: {pointStyle:'circle', usePointStyle:true}}
                            };
                            
                            // donut 1
                            var chDonutData1 = {
                            labels: $scope.allChartPensionerLables,
                            datasets: [
                              {
                                backgroundColor: ["#bd7610","#28a745","#ff0000", "#165793", "#35727b", "#ffe6aa", "#132556","#0303ff","#ff03f0"],
                                borderWidth: 3,
                                data: $scope.allChartPensionerData
                              }
                            ]
                            };
                            
                            var chDonut1 = document.getElementById("chDonut1");
                            if (chDonut1) {
                            new Chart(chDonut1, {
                              type: 'pie',
                              data: chDonutData1,
                              options: donutOptions
                            });
                            }




                                  /* bar chart */
                var chBar = document.getElementById("chBar");
                if (chBar) {
                    new Chart(chBar, {
                        type: 'bar',
                        data: {
                            labels: $scope.agewisePensionerLables,
                            datasets: [{
                                data: $scope.agewisePensionerRecord,
                                backgroundColor: ['#165793','#165793','#165793','#165793','#165793','#165793','#165793','#165793','#165793','#165793']
                            }]
                        },
                        options: {
                            legend: {
                                display: false
                            },
                            scales: {
                                xAxes: [{
                                    scaleLabel: {
                                        display: true,
                                        labelString: 'Age Range' // Label for the x axis
                                    },
                                    barPercentage: 0.8,
                                    categoryPercentage: 0.7
                                }],
                                yAxes: [{
                                    scaleLabel: {
                                        display: true,
                                        labelString: 'No. of Pensioners' // Label for the y axis
                                    },
                                    ticks: {
                                        beginAtZero: true
                                    }
                                }]
                            }
                        }
                    });
                }

                
  
                var chBar1 = document.getElementById("chBar1");
                if (chBar1) {
                    new Chart(chBar1, {
                        type: 'bar',
                        data: {
                            labels: $scope.agewisePensionerLables,
                            datasets: [{
                                data: $scope.agewisePensionerAmount,
                                backgroundColor: ['#2da2b3', '#2da2b3', '#2da2b3', '#2da2b3', '#2da2b3', '#2da2b3', '#2da2b3', '#2da2b3', '#2da2b3', '#2da2b3']
                            }]
                        },
                        options: {
                            legend: {
                                display: false
                            },
                            scales: {
                                xAxes: [{
                                    scaleLabel: {
                                        display: true,
                                        labelString: 'Age Range' // Label for the x axis
                                    },
                                    barPercentage: 0.8,
                                    categoryPercentage: 0.7
                                }],
                                yAxes: [{
                                    scaleLabel: {
                                        display: true,
                                        labelString: 'Amount in Rs.' // Label for the y axis
                                    },
                                    ticks: {
                                        beginAtZero: true,
                                        callback: function (value, index, values) {
                                            // Format y-axis label with commas
                                            return value.toLocaleString();
                                        }
                                    }
                                }]
                            },
                            tooltips: {
                                callbacks: {
                                    label: function (tooltipItem, data) {
                                        var label = data.datasets[tooltipItem.datasetIndex].label || '';
                                        label += ': ';
                                        label += tooltipItem.yLabel.toLocaleString();
                                        return label;
                                    }
                                }
                            }
                        }
                    });
                }
                

              $scope.creategraph();
              

       }

       else {
       alert("Error!!");
      }

       },
       function (err) {
        if(err.data=="Expired token"){
            if(err.data=="Expired token"){
                $rootScope.logout();
            }
        }
        else{
            alert("Error by server!!");   
        }         
       });
  
};
$scope.fetchMaster();




$scope.fetchAmountByMonth = function (val) {

  if(val=='All'){
    $scope.fetchMaster();
    }
    else{
      var req = {
        method: 'GET',
        url: path+'/api/v1/pensioner-details/mis-dashboard-data/search/'+val,
        headers: {
          'Authorization': "Bearer " + sessionStorage.token,
          'Content-Type': 'application/json'
        },
        
      };
     $http(req).then(function(chat_res){
    
         if (chat_res.status===200) {

            $scope.amountMonthLables=chat_res.data.PensionProcessData.labels.reverse();
            $scope.amountMonthRecord=chat_res.data.PensionProcessData.data.reverse();
           
                                $scope.creategraph();

         }
    
         else {
         alert("Error!!");
        }
    
         },
         function (err) {
            if(err.data=="Expired token"){
                if(err.data=="Expired token"){
                    $rootScope.logout();
                }
            }
            else{
                alert("Error by server!!");   
            }   
         });
    }

};



$scope.creategraph = function() {
  // Create or update chart data
  if ($scope.lineChart) {
      $scope.lineChart.data.labels = $scope.amountMonthLables;
      $scope.lineChart.data.datasets[0].data = $scope.amountMonthRecord.map(amount => parseInt(amount.replace(/,/g, '')));
      $scope.lineChart.update();
  } else {
      $scope.chartData = {
          labels: $scope.amountMonthLables,
          datasets: [{
              label: 'Amounts',
              data: $scope.amountMonthRecord.map(amount => parseInt(amount.replace(/,/g, ''))),
              borderColor: '#165793',
              borderWidth: 3
          }]
      };

      // Create the line chart
      var ctx = document.getElementById('chLine').getContext('2d');
      $scope.lineChart = new Chart(ctx, {
          type: 'line',
          data: $scope.chartData,
          options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: 'Month and Year' // Label for x-axis
                      },
                      type: 'category',
                      labels: $scope.chartData.labels
                  }],
                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: 'Amount in Rs.' // Label for y-axis
                      },
                      ticks: {
                          beginAtZero: true,
                          callback: function(value, index, values) {
                              return value.toLocaleString(); // Format y-axis values with commas
                          }
                      }
                  }]
              },
              tooltips: {
                  callbacks: {
                      label: function(tooltipItem, data) {
                          var value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                          return 'Amount: ' + value.toLocaleString();
                      }
                  }
              }
          }
      });
  }
};

$scope.showdata = function (){
    $('#myModal').modal('show');
    $('.popupbg').show();
  };
  $scope.closemodal = function (){
    $('.popupbg').hide();
    $('#myModal').modal('hide');
  };


  $scope.lifeNotSubList = function () {

    var date = new Date();
    $scope.currentMonth = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() returns 0-11, so add 1
        $scope.currentYear = date.getFullYear();
        var monYr=$scope.currentYear+'-'+$scope.currentMonth;
    var req = {
      method: 'GET',
      url: path+'/api/v1/pension/lifecert/not-submitted?yrMn='+monYr,
      headers: {
        'Authorization': "Bearer " + sessionStorage.token,
        'Content-Type': 'application/json'
      },
      
    };
    
   $http(req).then(function(res){

       if (res.status===200) {
        $scope.lifeCerNotSubList=res.data;
        if(res.data.length>0){
            $scope.showdata();
        }
        
       }

       else {
      }

       },
       function (err) {
              
                 
       });
  
};
$scope.lifeNotSubList(); 

$scope.ids=[];
$scope.stopPension = function (remarks) {
    
    
        var data = {
            ids: $scope.ids,
            remarks:remarks
        };
        var req = {
          method: 'PUT',
          url: path+'/api/v1/pension/lifecert/update-pensioner',
          headers: {
            'Authorization': "Bearer " + sessionStorage.token,
            'Content-Type': 'application/json'
          },
          data: data
          
        };
       $http(req).then(function(res){
      
           if (res.status===200) {
            $scope.lifeNotSubList();
            $('#confirmModal').modal('hide');
           }
      
           else {
            $('#confirmModal').modal('hide');
           alert("Error!!");
          }
      
           },
           function (err) {
            if(err.data=="Expired token"){
                $rootScope.logout();
            }
            else{
                $('#confirmModal').modal('hide');
                alert("Error by server!!");   
            }           
           });
  
  };

  
$scope.stopPensionConfrim = function (val) {
    $scope.ids.push(val);
    $('#confirmModal').modal('show');
};
$scope.closemodalConfrim = function (val) {
 $('#confirmModal').modal('hide');
};
});




