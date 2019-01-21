/*
 *  Controller To Set Global Definitions
 */
function GlobalCtrl($rootScope, $http, $scope, $timeout) {

    $rootScope.tokken=localStorage.getItem("vilaspetroleum_admin_access_token");
    $rootScope.userid=localStorage.getItem("vilaspetroleum_admin_username");
    $rootScope.firstname=localStorage.getItem("vilaspetroleum_admin_firstname");
    $rootScope.iconimage=localStorage.getItem("vilaspetroleum_admin_iconimage");
    
    $rootScope.financialyear = localStorage.getItem("vilaspetroleum_admin_financial_year");

    localStorage.setItem('com_name', "Vilas Petroleum");
    localStorage.setItem('com_dealer', "Indian Oil Corporation Ltd.");
    localStorage.setItem('com_address', "Sr. No. 47, Heaven Park, Next Wanowadi, Ruby Hall Clinic, Mohammadwadi, Pune-411060");
    localStorage.setItem('com_contact', "+91-9422024216");
    localStorage.setItem('com_email', "vilaspetroleum18@gmail.com");
    localStorage.setItem('com_gst', "27AAQFV2654M1ZE");

    localStorage.setItem('bkm_name', "Oriental Bank of Commerce");
    localStorage.setItem('bkm_account_no', "08914011000381");
    localStorage.setItem('bkm_branch', "Wanwadi");
    localStorage.setItem('bkm_ifsc', "ORBC0100891");
    

    // $rootScope.baseURL = 'http://localhost:3004';
     // $rootScope.baseURL = 'http://10.1.0.36:3002';
    $rootScope.baseURL = 'http://pos.restromaticz.com:3004';

    if(localStorage.getItem("vilaspetroleum_admin_access_token") === null)
      {
          window.location = 'login.html';
      }

    // $rootScope.back = function () {
    //     window.history.back();
    // };

    $rootScope.logOut = function(){

        $http({
          method: 'POST',
          url: $rootScope.baseURL+'/login/isoffline',
          data: 'username='+$rootScope.userid,
          headers: {'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization' :'Bearer '+$rootScope.tokken}
        })
        .success(function(deliverycount)
        {   
            localStorage.removeItem('vilaspetroleum_admin_username');
            localStorage.removeItem('vilaspetroleum_admin_firstname');
            localStorage.removeItem('vilaspetroleum_admin_iconimage');
            localStorage.removeItem('vilaspetroleum_admin_access_token');
            localStorage.removeItem('vilaspetroleum_admin_expires_in');
            localStorage.removeItem('vilaspetroleum_admin_refresh_token');
            localStorage.removeItem('vilaspetroleum_admin_token_type');
            localStorage.clear();
            window.location = 'login.html'; 
        })
        .error(function(data) 
        {   
            //console.log("url"+$scope.apiURL);
            /*console.log("Oops, Something Went Wrong!");*/
            var dialog = bootbox.dialog({
            message: '<p class="text-center">Oops, Something Went Wrong!</p>',
                closeButton: false
            });
            setTimeout(function(){
                dialog.modal('hide');
            }, 3001);
        });
      };

      $rootScope.backup = function(){

        $http({
          method: 'POST',
          url: $rootScope.baseURL+'/backup',
          // data: 'username='+$rootScope.userid,
          headers: {'Content-Type': 'application/json',
          'Authorization' :'Bearer '+$rootScope.tokken}
        })
        .success(function(deliverycount)
        {   
            var dialog = bootbox.dialog({
            message: '<p class="text-center">Successfully Backup!</p>',
                closeButton: false
            });
            setTimeout(function(){
                dialog.modal('hide');
            }, 3001);
        })
        .error(function(data) 
        {   
            //console.log("url"+$scope.apiURL);
            /*console.log("Oops, Something Went Wrong!");*/
            var dialog = bootbox.dialog({
            message: '<p class="text-center">Oops, Something Went Wrong!</p>',
                closeButton: false
            });
            setTimeout(function(){
                dialog.modal('hide');
            }, 3001);
        });
      };

    // $scope.Log_Out = function () {

    //     localStorage.clear();
    //     Parse.User.logOut();
    //     window.location = "login.html";
    // };

    //check user is idle
    // $rootScope.idle = 800; //800 expire time 24 hrs
    // $rootScope.timeout = 60; //60 warning time 1 minute

  $rootScope.$on('IdleStart', function() {
        // the user appears to have gone idle
        // $rootScope.oldTokken=$rootScope.tokken;
        //  console.log("Before"+$rootScope.oldTokken);
        console.log("start");
      });

  $rootScope.$on('IdleWarn', function(e, countdown) {
        // follows after the IdleStart event, but includes a countdown until the user is considered timed out
        // the countdown arg is the number of seconds remaining until then.
        // you can change the title or display a warning dialog from here.
        // you can let them resume their session by calling Idle.watch()
      });

  $rootScope.$on('IdleTimeout', function() {    
        // the user has timed out (meaning idleDuration + timeout has passed without any activity)
        // this is where you'd log them

        $rootScope.logOut(); 
      });

  $rootScope.$on('IdleEnd', function() {
        // the user has come back from AFK and is doing stuff. if you are warning them, you can use this to hide the dialog
        console.log("end")
      });

}