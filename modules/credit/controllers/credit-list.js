// import admin
angular.module('credit').controller('creditCtrl', function ($rootScope, $http, $scope, $location, $routeParams, $route, $filter) {


  $('.index').removeClass("active");
  $('#creditindex').addClass("active");
  $('#creditlistindex').addClass("active");
  $scope.filteredTodos = [];
    $scope.currentPage = 1;
    $scope.maxSize = 5;
    $scope.entryLimit = 5;
    $scope.filterUser = 0;
    $scope.filterUserend = 1;
    $scope.numPerPage = 10;
    $scope.obj_Main = [];
    $scope.creditListcount = 0;
    $scope.loading1 = 0;
    $scope.parseFloat = parseFloat;
    $scope.limit = {};

$scope.apiURL = $rootScope.baseURL+'/credit/credit/total';

   $scope.getAll = function () {
      if ($('#searchtext').val() == undefined || $('#searchtext').val() == "") {
            $scope.limit.search = "";
          }
          else{
            $scope.limit.search = $scope.searchtext;
          }
          $http({
            method: 'POST',
            url: $scope.apiURL,
            data:$scope.limit,
            headers: {'Content-Type': 'application/json',
                      'Authorization' :'Bearer '+localStorage.getItem("vilaspetroleum_admin_access_token")}
          })
          .success(function(category)
          {
            category.forEach(function (value, key) {
                $scope.creditListcount=value.total;
            });
            $scope.$watch("currentPage + numPerPage",
                function () {
                    $scope.resetpagination();

                });
                // $scope.$apply(); 
          })
          .error(function(data) 
          {   
              $scope.loading1 = 1;
              var dialog = bootbox.dialog({
                  message: '<p class="text-center">No Record Found!</p>',
                    closeButton: false
              });
              dialog.find('.modal-body').addClass("btn-danger");
              setTimeout(function(){
                  dialog.modal('hide'); 
              }, 1500);             
          });
      };

    //Pagination Function
    $scope.resetpagination = function () {
        var begin = (($scope.currentPage - 1) * $scope.numPerPage);
        var end = begin + $scope.numPerPage;
        $scope.filterUserend = begin + 1;
        $scope.filterUser = end;
        if ($scope.filterUser >= $scope.creditListcount)
            $scope.filterUser = $scope.creditListcount;

              $scope.filteredTodos = [];
              $scope.limit.number = $scope.numPerPage;
              $scope.limit.begin = begin;
              $scope.limit.end = end;
              $http({
                method: 'POST',
                url: $rootScope.baseURL+'/credit/credit/limit',
                data: $scope.limit,
                headers: {'Content-Type': 'application/json',
                          'Authorization' :'Bearer '+localStorage.getItem("vilaspetroleum_admin_access_token")}
              })
              .success(function(credit)
              {
                $scope.filteredTodos = [];
                if (credit.length > 0) {
                    credit.forEach(function (value, key) {
                        $scope.filteredTodos.push(value);
                    });
                }
                // $scope.obj_Main = $scope.purchaseList;
                    $scope.loading1 = 1;
                    // $scope.$apply(); 
              })
              .error(function(data) 
              {   
                  $scope.loading1 = 1;
                    var dialog = bootbox.dialog({
                    message: '<p class="text-center">Oops, Something Went Wrong! Please Refresh the Page.</p>',
                        closeButton: false
                    });
                    setTimeout(function(){
                        dialog.modal('hide'); 
                    }, 1500);             
              });
    };
    //search Data
    $scope.getSearch = function () {
        $scope.getAll();
    };

    $scope.deleteSale = function (sm_id) {
      $scope.sm_id=sm_id;
    }  

    $scope.deleteConfirm = function () {
                $('#del').attr('disabled','true');
                $('#del').text("please wait...");
	     $http({
	      method: 'POST',
	      url: $rootScope.baseURL+'/credit/delete/'+$scope.sm_id.crm_id,
        data: $scope.sm_id,
	      headers: {'Content-Type': 'application/json',
                  'Authorization' :'Bearer '+localStorage.getItem("vilaspetroleum_admin_access_token")}
	    })
	    .success(function(saleObj)
	    {
                $('#del').text("Delete");
                $('#del').removeAttr('disabled');
                $scope.creditList = [];
                $scope.getAll();
                $('#confirm-delete').modal('hide');
      		  
	    })
	    .error(function(data) 
	    {   
	      var dialog = bootbox.dialog({
            message: '<p class="text-center">Oops, Something Went Wrong! Please Refresh the Page.</p>',
                closeButton: false
            });
            setTimeout(function(){
                $('#del').text("Delete");
                $('#del').removeAttr('disabled');
                dialog.modal('hide'); 
            }, 1500);            
	    });
	};

    $scope.reopenInvoice = function (sm_id) {
      
      $('#repoen-confirm').modal('show');
      $scope.sm_id=sm_id;
    }  

    $scope.reopenConfirm = function () {
                $('#reopen').attr('disabled','true');
                $('#reopen').text("please wait...");
       $http({
        method: 'POST',
        url: $rootScope.baseURL+'/credit/reopen/'+$scope.sm_id.crm_id,
        data: $scope.sm_id,
        headers: {'Content-Type': 'application/json',
                  'Authorization' :'Bearer '+localStorage.getItem("vilaspetroleum_admin_access_token")}
      })
      .success(function(saleObj)
      {
                $('#reopen').text("Reopen");
                $('#reopen').removeAttr('disabled');
                $scope.getAll();
                $('#repoen-confirm').modal('hide');
            
      })
      .error(function(data) 
      {   
        var dialog = bootbox.dialog({
            message: '<p class="text-center">Oops, Something Went Wrong! Please Refresh the Page.</p>',
                closeButton: false
            });
            setTimeout(function(){
                $('#reopen').text("Reopen");
                $('#reopen').removeAttr('disabled');
                dialog.modal('hide'); 
            }, 1500);            
      });
  };

  $scope.viewQuatationDetails = function (index) {
    
    $scope.saleProductList = [];
      $scope.credits = $scope.filteredTodos[index];

      $http({
        method: 'GET',
        url: $rootScope.baseURL+'/credit/details/'+$scope.filteredTodos[index].crm_id,
        headers: {'Content-Type': 'application/json',
                  'Authorization' :'Bearer '+localStorage.getItem("vilaspetroleum_admin_access_token")}
      })
      .success(function(saleProductList)
      {
         var i = 1;
          saleProductList.forEach(function (value, key) {
              value.srno = i++;
              $scope.saleProductList.push(value);
            });
          $scope.convertNumberToWords($scope.credits.crm_total_amount);
      })
      .error(function(data) 
      {   
        var dialog = bootbox.dialog({
            message: '<p class="text-center">Oops, Something Went Wrong! Please Refresh the Page.</p>',
                closeButton: false
            });
            setTimeout(function(){
                dialog.modal('hide'); 
            }, 1500);
      });

    };

    $scope.convertNumberToWords = function (amount) {
        var words = new Array();
        words[0] = '';
        words[1] = 'One';
        words[2] = 'Two';
        words[3] = 'Three';
        words[4] = 'Four';
        words[5] = 'Five';
        words[6] = 'Six';
        words[7] = 'Seven';
        words[8] = 'Eight';
        words[9] = 'Nine';
        words[10] = 'Ten';
        words[11] = 'Eleven';
        words[12] = 'Twelve';
        words[13] = 'Thirteen';
        words[14] = 'Fourteen';
        words[15] = 'Fifteen';
        words[16] = 'Sixteen';
        words[17] = 'Seventeen';
        words[18] = 'Eighteen';
        words[19] = 'Nineteen';
        words[20] = 'Twenty';
        words[30] = 'Thirty';
        words[40] = 'Forty';
        words[50] = 'Fifty';
        words[60] = 'Sixty';
        words[70] = 'Seventy';
        words[80] = 'Eighty';
        words[90] = 'Ninety';
        amount = amount.toString();
        var atemp = amount.split(".");
        var number = atemp[0].split(",").join("");
        var n_length = number.length;
        var words_string = "";
        if (n_length <= 9) {
            var n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
            var received_n_array = new Array();
            for (var i = 0; i < n_length; i++) {
                received_n_array[i] = number.substr(i, 1);
            }
            for (var i = 9 - n_length, j = 0; i < 9; i++, j++) {
                n_array[i] = received_n_array[j];
            }
            for (var i = 0, j = 1; i < 9; i++, j++) {
                if (i == 0 || i == 2 || i == 4 || i == 7) {
                    if (n_array[i] == 1) {
                        n_array[j] = 10 + parseInt(n_array[j]);
                        n_array[i] = 0;
                    }
                }
            }
            value = "";
            for (var i = 0; i < 9; i++) {
                if (i == 0 || i == 2 || i == 4 || i == 7) {
                    value = n_array[i] * 10;
                } else {
                    value = n_array[i];
                }
                if (value != 0) {
                    words_string += words[value] + " ";
                }
                if ((i == 1 && value != 0) || (i == 0 && value != 0 && n_array[i + 1] == 0)) {
                    words_string += "Crores ";
                }
                if ((i == 3 && value != 0) || (i == 2 && value != 0 && n_array[i + 1] == 0)) {
                    words_string += "Lakhs ";
                }
                if ((i == 5 && value != 0) || (i == 4 && value != 0 && n_array[i + 1] == 0)) {
                    words_string += "Thousand ";
                }
                if (i == 6 && value != 0 && (n_array[i + 1] != 0 && n_array[i + 2] != 0)) {
                    words_string += "Hundred and ";
                } else if (i == 6 && value != 0) {
                    words_string += "Hundred ";
                }
            }
            words_string = words_string.split("  ").join(" ");
        }
        $scope.amountinwords = words_string;
    }

    $scope.printDetails = function(){

      if($scope.credits.crm_status == 1){
        var popupWin = window.open('', 'winname','directories=0,titlebar=0,toolbar=0,location=0,status=0,menubar=0,scrollbars=no,resizable=no');
          
        popupWin.document.write("<html>" +
         " <head>" +
            "<link rel='stylesheet' href='./././resources/vendor/bootstrap/css/bootstrap.min.css' />" +
            "<style>.action{display:none;} .print-hide{display:none;}</style>"+
            "<style>@media print {.watermark {display: inline;position: fixed !important;opacity: 0.50;font-size: 100px;width: 100%;text-align: center;z-index: 1000;top:270px;right:5px;}}</style>" +
            "   <style type='text/css' media='print'>" +
            "  @page " +
             " {" +
              "    size:  A4 portrait;" +  /* auto is the initial value */
               "   margin: 0; " + /* this affects the margin in the printer settings */
              "}" +

              "html" +
              "{" +
               "   background-color: #FFFFFF;" + 
                "  margin: 0px; " + /* this affects the margin on the html before sending to printer */
              "}" +

              "body" +
              "{" +
                "font-size:11pt;"+
                "font-family:'Open Sans', sans-serif;"+
               // "   border: solid 1px black ;" +
                "  margin: 3mm 3mm 3mm 3mm;" + /* margin you want for the content */
              "}" +
              "</style>" +
          "</head>" +
          "<body onload='window.print()'>" +
            "<div class='watermark'>cancelled</p></div>" +
           "<table width='100%' height='100%'>" +
            "<thead>"+
              "<tr>"+
                "<td colspan='12' style=' border-style: solid; border-width:0px;'>"+
                  "<table width='100%'>"+
                    "<tr>" +
                      "<td colspan='2' style='text-align:center; padding-bottom: 10px; border-style: solid solid none solid; border-width:1px; font-size:12pt;' valign='center' width='100%'>" +
                          "<h3 style='font-size:16pt;margin-bottom: 0;'>"+localStorage.getItem("com_name")+"</h3><br>" +
                          "Address : "+localStorage.getItem("com_address")+"<br>" +
                          "Phone : "+localStorage.getItem("com_contact")+"<br>"+
                          "E-Mail : "+localStorage.getItem("com_email")+"<br>"+
                          "GST No.: "+localStorage.getItem("com_gst")+"<br>"+
                      "</td>" +
                    "</tr>" +
                    "<tr>" +
                      "<td colspan='2' style='text-align:center; padding: 4px; border-style: solid solid none solid; border-width:1px; font-size:13pt;' valign='top'>" +
                          "<strong>Credit</strong>"+
                      "</td>" +
                    "</tr>" +
                    "<tr>" +
                      "<td width='60%' style='text-align:left; padding: 4px; border-style: solid solid none solid; border-width:1px; font-size:10pt;' valign='top'>" +
                          "<table width='100%'>"+
                            "<tr>"+
                              "<td  colspan='2' style='text-align:center; padding: 4px; border-style: none none solid none; border-width:1px; font-size:10pt;'>"+
                                "<strong>Customer</strong>"+
                              "</td>"+
                            "</tr>"+
                            "<tr>"+
                              "<td width='30%' style='text-align:left; padding: 4px; border-style: none solid none none; border-width:1px; font-size:10pt;'>"+
                                "Name: "+
                              "</td>"+
                              "<td width='70%' style='text-align:left; padding: 4px; border-style: none none none none; border-width:1px; font-size:10pt;'>"+
                                "<strong>"+$scope.credits.cm_name+"</strong>"+
                              "</td>"+
                            "</tr>"+
                            "<tr>"+
                              "<td width='30%' style='text-align:left; padding: 4px; border-style: none solid none none; border-width:1px; font-size:10pt;'>"+
                                "Address: "+
                              "</td>"+
                              "<td width='70%' style='text-align:left; padding: 4px; border-style: none none none none; border-width:1px; font-size:10pt;'>"+
                                "<strong>"+$scope.credits.cm_address+"</strong>"+
                              "</td>"+
                            "</tr>"+
                            "<tr>"+
                              "<td width='30%' style='text-align:left; padding: 4px; border-style: none solid none none; border-width:1px; font-size:10pt;'>"+
                                "Contact No.: "+
                              "</td>"+
                              "<td width='70%' style='text-align:left; padding: 4px; border-style: none none none none; border-width:1px; font-size:10pt;'>"+
                                "<strong>"+$scope.credits.cm_mobile+"</strong>"+
                              "</td>"+
                            "</tr>"+
                            "<tr>"+
                              "<td width='30%' style='text-align:left; padding: 4px; border-style: none solid none none; border-width:1px; font-size:10pt;'>"+
                                "GSTIN: "+
                              "</td>"+
                              "<td width='70%' style='text-align:left; padding: 4px; border-style: none none none none; border-width:1px; font-size:10pt;'>"+
                                "<strong>"+$scope.credits.cm_gst+"</strong>"+
                              "</td>"+
                            "</tr>"+
                          "</table>"+
                      "</td>" +
                      "<td width='40%' style='text-align:left; padding: 4px; border-style: solid solid none none; border-width:1px; font-size:10pt;' valign='top'>" +
                          "<table width='100%'>"+
                            "<tr>"+
                              "<td width='50%' style='text-align:left; padding: 4px; border-style: none none none none; border-width:1px; font-size:10pt;'>"+
                                "Credit No.: "+
                              "</td>"+
                              "<td width='50%' style='text-align:left; padding: 4px; border-style: none none none none; border-width:1px; font-size:10pt;'>"+
                                "<strong>"+$scope.credits.crm_invoice_no+"</strong>"+
                              "</td>"+
                            "</tr>"+
                            "<tr>"+
                              "<td width='50%' style='text-align:left; padding: 4px; border-style: none none none none; border-width:1px; font-size:10pt;'>"+
                                "Credit Date: "+
                              "</td>"+
                              "<td width='50%' style='text-align:left; padding: 4px; border-style: none none none none; border-width:1px; font-size:10pt;'>"+
                                "<strong>"+$filter('date')($scope.credits.crm_date, "mediumDate")+"</strong>"+
                              "</td>"+
                            "</tr>"+
                            "<tr>"+
                              "<td width='50%' style='text-align:left; padding: 4px; border-style: none none none none; border-width:1px; font-size:10pt;'>"+
                                "Vehicle & Vehicle no.: "+
                              "</td>"+
                              "<td width='50%' style='text-align:left; padding: 4px; border-style: none none none none; border-width:1px; font-size:10pt;'>"+
                                "<strong>"+$scope.credits.crm_vehicle+" & "+ $scope.credits.crm_vehicle_no +"</strong>"+
                              "</td>"+
                            "</tr>"+
                            // "<tr>"+
                            //   "<td width='50%' style='text-align:left; padding: 4px; border-style: none none none none; border-width:1px; font-size:10pt;'>"+
                            //     "Cash / Credit.: "+
                            //   "</td>"+
                            //   "<td width='50%' style='text-align:left; padding: 4px; border-style: none none none none; border-width:1px; font-size:10pt;'>"+
                            //     "<strong>"+$scope.invoices.im_credit+"</strong>"+
                            //   "</td>"+
                            // "</tr>"+
                            // "<tr>"+
                            //   "<td width='50%' style='text-align:left; padding: 4px; border-style: none none none none; border-width:1px; font-size:10pt;'>"+
                            //     "Payment Date: "+
                            //   "</td>"+
                            //   "<td width='50%' style='text-align:left; padding: 4px; border-style: none none none none; border-width:1px; font-size:10pt;'>"+
                            //     "<strong>"+$filter('date')($scope.invoices.im_payment_date, "mediumDate")+"</strong>"+
                            //   "</td>"+
                            // "</tr>"+
                          "</table>"+
                      "</td>" +
                    "</tr>" +
                  "</table>"+
                "</td>"+
              "</tr>"+
            "</thead>"+
            "<tbody>"+
              "<tr>"+
                "<td colspan='12' valign='top' style=' border-style: solid; border-width:1px;'>"+
                  "<table width='100%'>" +
                    "<thead>"+
                      "<tr>"+      
                        "<th width='5%' rowspan='2' style='text-align:center; padding: 4px; font-size: 10pt; border-style: none solid solid none; border-width:1px;'>Sr.No.</th>" +
                        "<th width='20%' rowspan='2' style='text-align:center; padding: 4px; font-size: 10pt; border-style: none solid solid none; border-width:1px;'>Product Description</th> " +
                        "<th width='5%' rowspan='2' style='text-align:center; padding: 4px; font-size: 10pt; border-style: none solid solid none; border-width:1px;'>HSN Code</th>" +
                        "<th width='5%' rowspan='2' style='text-align:center; padding: 4px; font-size: 10pt; border-style: none solid solid none; border-width:1px;'>Qty</th>"+
                        "<th width='5%' rowspan='2' style='text-align:center; padding: 4px; font-size: 10pt; border-style: none solid solid none; border-width:1px;'>Unit</th>" +
                        "<th width='10%' rowspan='2' style='text-align:center; padding: 4px; font-size: 10pt; border-style: none solid solid none; border-width:1px;'>Rate</th>" +
                        "<th width='10%' rowspan='2' style='text-align:center; padding: 4px; font-size: 10pt; border-style: none solid solid none; border-width:1px;'>Amount</th>" +
                        "<th width='10%' colspan='2' style='text-align:center; padding: 4px; font-size: 10pt; border-style: none solid solid none; border-width:1px;'>SGST</th>" +
                        "<th width='10%' colspan='2' style='text-align:center; padding: 4px; font-size: 10pt; border-style: none solid solid none; border-width:1px;'>CGST</th>" +
                        "<th width='10%' colspan='2' style='text-align:center; padding: 4px; font-size: 10pt; border-style: none solid solid none; border-width:1px;'>IGST</th>" +
                        "<th width='10%' rowspan='2' style='text-align:center; padding: 4px; font-size: 10pt; border-style: none none solid none; border-width:1px;'>Total</th>" +
                      "</tr>"+
                      "<tr>"+      
                        "<th width='4%' style='padding: 4px; text-align:center; font-size: 9pt; border-style: none solid solid none; border-width:1px;'>Rate</th>" +
                        "<th width='6%' style='padding: 4px; text-align:center; font-size: 9pt; border-style: none solid solid none; border-width:1px;'>Amount</th>" +
                        "<th width='4%' style='padding: 4px; text-align:center; font-size: 9pt; border-style: none solid solid none; border-width:1px;'>Rate</th>" +
                        "<th width='6%' style='padding: 4px; text-align:center; font-size: 9pt; border-style: none solid solid none; border-width:1px;'>Amount</th>" +
                        "<th width='4%' style='padding: 4px; text-align:center; font-size: 9pt; border-style: none solid solid none; border-width:1px;'>Rate</th>" +
                        "<th width='6%' style='padding: 4px; text-align:center; font-size: 9pt; border-style: none solid solid none; border-width:1px;'>Amount</th>" +
                      "</tr>"+
                    "</thead>"+
                    " "+$('#content').html()+" " +
                  "</table>"+
                "</td>"+
              "</tr>"+
            "</tbody>"+
            "<tfoot>"+
            "<tr>"+
              "<td width='50%' colspan='4' style='text-align:center; padding:4px; font-size:10pt; border-style: solid solid solid solid; border-width:1px;'><strong>Total</strong></td>"+
              "<td width='10%' style='text-align:center; padding:4px; font-size:10pt; border-style: solid solid solid none; border-width:1px;'>"+$filter('number')($scope.credits.crm_net_amount, "3")+"</td>"+
              "<td width='15%' colspan='2' style='text-align:center; padding:4px; font-size:10pt; border-style: solid solid solid none; border-width:1px;'>"+$filter('number')($scope.credits.crm_cgst_amount, "3")+"</td>"+
              "<td width='15%' colspan='2' style='text-align:center; padding:4px; font-size:10pt; border-style: solid solid solid none; border-width:1px;'>"+$filter('number')($scope.credits.crm_sgst_amount, "3")+"</td>"+
              "<td width='15%' colspan='2' style='text-align:center; padding:4px; font-size:10pt; border-style: solid solid solid none; border-width:1px;'>"+$filter('number')($scope.credits.crm_igst_amount, "3")+"</td>"+
              "<td width='10%' style='text-align:center; padding:4px; font-size:10pt; border-style: solid solid solid none; border-width:1px;'>"+$filter('number')($scope.credits.crm_total_amount, "3")+"</td>"+
            "</tr>"+
            "<tr>" +
                  "<td colspan='7' rowspan='2' width='60%' style='padding:4px; font-size:10pt; border-style: none solid solid solid; border-width:1px;'>Amount in words : "+$scope.amountinwords+"</td>" +
                  "<td colspan='4' width='30%' style='padding:4px; font-size:10pt; border-style: none solid solid solid; border-width:1px;'>Total Amount Before Tax</td>" +
                  "<td width='10%' style='padding:4px; font-size:10pt; border-style: none solid none none; border-width:1px;'><strong>"+$filter('number')($scope.credits.crm_net_amount, "3")+"</strong></td>" +
              "</tr>"+
              "<tr>"+
                  "<td colspan='4' width='30%' style='padding:4px; font-size:10pt; border-style: solid; border-width:1px;'>Add: CGST + SGST + IGST</td>" +
                  "<td width='10%' style='padding:4px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')(parseFloat(parseFloat($scope.credits.crm_cgst_amount) + parseFloat($scope.credits.crm_sgst_amount) + parseFloat($scope.credits.crm_igst_amount)), "3")+"</strong></td>" +
              "</tr>"+
              "<tr>"+
                  "<td colspan='7' rowspan='2' width='60%' style='padding:4px; font-size:9pt; border-style: none none solid solid; border-width:1px;'>"+
                  "Company's Bank Details<br>"+
                  "Bank Name : <strong>"+localStorage.getItem("bkm_name")+"</strong><br>"+
                  "A/C No &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp: <strong>"+localStorage.getItem("bkm_account_no")+"</strong><br>"+
                  "Branch &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp: <strong>"+localStorage.getItem("bkm_branch")+"</strong><br>"+
                  "IFS Code &nbsp&nbsp&nbsp&nbsp: <strong>"+localStorage.getItem("bkm_ifsc")+"</strong><br>"+
                  "<strong>Terms & Conditions</strong><br>"+
                  "1. Goods once sold shall not be taken back.<br>"+
                  "2. Our responsibility ceases once the goods leave our premises.<br>"+
                  "3. Subject to Pune jurisdiction Only.<br>"+
                  "4. GST No : <strong></strong>"+
                  "</td>"+
                  "<td colspan='4' width='30%' style='padding:4px; font-size:10pt; border-style: solid; border-width:1px;'>Total Amount After Tax</td>" +
                  "<td width='10%' style='padding:4px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.credits.crm_total_amount, "3")+"</strong></td>" +
              "</tr>"+
              "<tr>"+
                  "<td colspan='5' width='40%' colspan='2' valign='bottom' style='text-align:center; padding:4px; font-size:10pt; border-style: solid solid solid solid; border-width:1px;'><span style='font-size:7pt;'>Ceritified that the particulars given above are true and correct</span><br><strong>for AMK Enterprises</strong><br><br><br><br><br><br><br><br><br><strong>Authorized Signatory</strong></td>" +
              "</tr>" +
            "</tfoot>"+
          "</table>"+
          "</body>" +
        "</html>");
        popupWin.document.close();
      }
      else{
        var popupWin = window.open('', 'winname','directories=0,titlebar=0,toolbar=0,location=0,status=0,menubar=0,scrollbars=no,resizable=no');
          
        var page1 = "<html>" +
         " <head>" +
            "<link rel='stylesheet' href='./././resources/vendor/bootstrap/css/bootstrap.min.css' />" +
            "<style>.action{display:none;} .print-hide{display:none;}</style>"+
            "   <style type='text/css' media='print'>" +
            "  @page " +
             " {" +
              "    size:  A4 portrait;" +  /* auto is the initial value */
               "   margin: 0; " + /* this affects the margin in the printer settings */
              "}" +

              "html" +
              "{" +
               "   background-color: #FFFFFF;" + 
                "  margin: 0px; " + /* this affects the margin on the html before sending to printer */
              "}" +

              "body" +
              "{" +
                "font-size:11pt;"+
                "font-family:'Open Sans', sans-serif;"+
               // "   border: solid 1px black ;" +
                "  margin: 3mm 3mm 3mm 3mm;" + /* margin you want for the content */
              "}" +
              "</style>" +
          "</head>" +
          "<body onload='window.print()'>" +
           "<table width='100%' height='100%'>" +
            "<thead>"+
              "<tr>"+
                "<td colspan='12' style=' border-style: solid; border-width:0px;'>"+
                  "<table width='100%'>"+
                    "<tr>" +
                      "<td colspan='2' style='text-align:center; padding-bottom: 10px; border-style: solid solid none solid; border-width:1px; font-size:12pt;' valign='center' width='100%'>" +
                          "<h3 style='font-size:16pt;margin-bottom: 0;'>"+localStorage.getItem("com_name")+"</h3><br>" +
                          "Address : "+localStorage.getItem("com_address")+"<br>" +
                          "Phone : "+localStorage.getItem("com_contact")+"<br>"+
                          "E-Mail : "+localStorage.getItem("com_email")+"<br>"+
                          "GST No.: "+localStorage.getItem("com_gst")+"<br>"+
                      "</td>" +
                    "</tr>" +
                    "<tr>" +
                      "<td colspan='2' style='text-align:center; padding: 4px; border-style: solid solid none solid; border-width:1px; font-size:13pt;' valign='top'>" +
                          "<strong>Credit</strong>"+
                      "</td>" +
                    "</tr>" +
                    "<tr>" +
                      "<td width='60%' style='text-align:left; padding: 4px; border-style: solid solid none solid; border-width:1px; font-size:10pt;' valign='top'>" +
                          "<table width='100%'>"+
                            "<tr>"+
                              "<td  colspan='2' style='text-align:center; padding: 4px; border-style: none none solid none; border-width:1px; font-size:10pt;'>"+
                                "<strong>Customer</strong>"+
                              "</td>"+
                            "</tr>"+
                            "<tr>"+
                              "<td width='30%' style='text-align:left; padding: 4px; border-style: none solid none none; border-width:1px; font-size:10pt;'>"+
                                "Name: "+
                              "</td>"+
                              "<td width='70%' style='text-align:left; padding: 4px; border-style: none none none none; border-width:1px; font-size:10pt;'>"+
                                "<strong>"+$scope.credits.cm_name+"</strong>"+
                              "</td>"+
                            "</tr>"+
                            "<tr>"+
                              "<td width='30%' style='text-align:left; padding: 4px; border-style: none solid none none; border-width:1px; font-size:10pt;'>"+
                                "Address: "+
                              "</td>"+
                              "<td width='70%' style='text-align:left; padding: 4px; border-style: none none none none; border-width:1px; font-size:10pt;'>"+
                                "<strong>"+$scope.credits.cm_address+"</strong>"+
                              "</td>"+
                            "</tr>"+
                            "<tr>"+
                              "<td width='30%' style='text-align:left; padding: 4px; border-style: none solid none none; border-width:1px; font-size:10pt;'>"+
                                "Contact No.: "+
                              "</td>"+
                              "<td width='70%' style='text-align:left; padding: 4px; border-style: none none none none; border-width:1px; font-size:10pt;'>"+
                                "<strong>"+$scope.credits.cm_mobile+"</strong>"+
                              "</td>"+
                            "</tr>"+
                            "<tr>"+
                              "<td width='30%' style='text-align:left; padding: 4px; border-style: none solid none none; border-width:1px; font-size:10pt;'>"+
                                "GSTIN: "+
                              "</td>"+
                              "<td width='70%' style='text-align:left; padding: 4px; border-style: none none none none; border-width:1px; font-size:10pt;'>"+
                                "<strong>"+$scope.credits.cm_gst+"</strong>"+
                              "</td>"+
                            "</tr>"+
                          "</table>"+
                      "</td>" +
                      "<td width='40%' style='text-align:left; padding: 4px; border-style: solid solid none none; border-width:1px; font-size:10pt;' valign='top'>" +
                          "<table width='100%'>"+
                            "<tr>"+
                              "<td width='50%' style='text-align:left; padding: 4px; border-style: none none none none; border-width:1px; font-size:10pt;'>"+
                                "Credit No.: "+
                              "</td>"+
                              "<td width='50%' style='text-align:left; padding: 4px; border-style: none none none none; border-width:1px; font-size:10pt;'>"+
                                "<strong>"+$scope.credits.crm_invoice_no+"</strong>"+
                              "</td>"+
                            "</tr>"+
                            "<tr>"+
                              "<td width='50%' style='text-align:left; padding: 4px; border-style: none none none none; border-width:1px; font-size:10pt;'>"+
                                "Credit Date: "+
                              "</td>"+
                              "<td width='50%' style='text-align:left; padding: 4px; border-style: none none none none; border-width:1px; font-size:10pt;'>"+
                                "<strong>"+$filter('date')($scope.credits.crm_date, "mediumDate")+"</strong>"+
                              "</td>"+
                            "</tr>"+
                            "<tr>"+
                              "<td width='50%' style='text-align:left; padding: 4px; border-style: none none none none; border-width:1px; font-size:10pt;'>"+
                                "Vehicle & Vehicle no.: "+
                              "</td>"+
                              "<td width='50%' style='text-align:left; padding: 4px; border-style: none none none none; border-width:1px; font-size:10pt;'>"+
                                "<strong>"+$scope.credits.crm_vehicle+" & "+ $scope.credits.crm_vehicle_no +"</strong>"+
                              "</td>"+
                            "</tr>"+
                            // "<tr>"+
                            //   "<td width='50%' style='text-align:left; padding: 4px; border-style: none none none none; border-width:1px; font-size:10pt;'>"+
                            //     "Cash / Credit.: "+
                            //   "</td>"+
                            //   "<td width='50%' style='text-align:left; padding: 4px; border-style: none none none none; border-width:1px; font-size:10pt;'>"+
                            //     "<strong>"+$scope.invoices.im_credit+"</strong>"+
                            //   "</td>"+
                            // "</tr>"+
                            // "<tr>"+
                            //   "<td width='50%' style='text-align:left; padding: 4px; border-style: none none none none; border-width:1px; font-size:10pt;'>"+
                            //     "Payment Date: "+
                            //   "</td>";
                            //   if($scope.invoices.im_payment_date == null){
                            //     page1 = page1 + "<td width='50%' style='text-align:left; padding: 4px; border-style: none none none none; border-width:1px; font-size:10pt;'>"+
                            //     "<strong></strong>"+
                            //   "</td>";
                            //   }
                            //   else{
                            //     page1 = page1 + "<td width='50%' style='text-align:left; padding: 4px; border-style: none none none none; border-width:1px; font-size:10pt;'>"+
                            //     "<strong>"+$filter('date')($scope.invoices.im_payment_date, "mediumDate")+"</strong>"+
                            //   "</td>";
                            //   }
                            // page1 = page1 + "</tr>"+
                          "</table>"+
                      "</td>" +
                    "</tr>" +
                  "</table>"+
                "</td>"+
              "</tr>"+
            "</thead>"+
            "<tbody>"+
              "<tr>"+
                "<td colspan='12' valign='top' style=' border-style: solid; border-width:1px;'>"+
                  "<table width='100%'>" +
                    "<thead>"+
                      "<tr>"+      
                        "<th width='5%' rowspan='2' style='text-align:center; padding: 4px; font-size: 10pt; border-style: none solid solid none; border-width:1px;'>Sr.No.</th>" +
                        "<th width='20%' rowspan='2' style='text-align:center; padding: 4px; font-size: 10pt; border-style: none solid solid none; border-width:1px;'>Product Description</th> " +
                        "<th width='5%' rowspan='2' style='text-align:center; padding: 4px; font-size: 10pt; border-style: none solid solid none; border-width:1px;'>HSN Code</th>" +
                        "<th width='5%' rowspan='2' style='text-align:center; padding: 4px; font-size: 10pt; border-style: none solid solid none; border-width:1px;'>Qty</th>"+
                        "<th width='5%' rowspan='2' style='text-align:center; padding: 4px; font-size: 10pt; border-style: none solid solid none; border-width:1px;'>Unit</th>" +
                        "<th width='10%' rowspan='2' style='text-align:center; padding: 4px; font-size: 10pt; border-style: none solid solid none; border-width:1px;'>Rate</th>" +
                        "<th width='10%' rowspan='2' style='text-align:center; padding: 4px; font-size: 10pt; border-style: none solid solid none; border-width:1px;'>Amount</th>" +
                        "<th width='10%' colspan='2' style='text-align:center; padding: 4px; font-size: 10pt; border-style: none solid solid none; border-width:1px;'>SGST</th>" +
                        "<th width='10%' colspan='2' style='text-align:center; padding: 4px; font-size: 10pt; border-style: none solid solid none; border-width:1px;'>CGST</th>" +
                        "<th width='10%' colspan='2' style='text-align:center; padding: 4px; font-size: 10pt; border-style: none solid solid none; border-width:1px;'>IGST</th>" +
                        "<th width='10%' rowspan='2' style='text-align:center; padding: 4px; font-size: 10pt; border-style: none none solid none; border-width:1px;'>Total</th>" +
                      "</tr>"+
                      "<tr>"+      
                        "<th width='4%' style='padding: 4px; text-align:center; font-size: 9pt; border-style: none solid solid none; border-width:1px;'>Rate</th>" +
                        "<th width='6%' style='padding: 4px; text-align:center; font-size: 9pt; border-style: none solid solid none; border-width:1px;'>Amount</th>" +
                        "<th width='4%' style='padding: 4px; text-align:center; font-size: 9pt; border-style: none solid solid none; border-width:1px;'>Rate</th>" +
                        "<th width='6%' style='padding: 4px; text-align:center; font-size: 9pt; border-style: none solid solid none; border-width:1px;'>Amount</th>" +
                        "<th width='4%' style='padding: 4px; text-align:center; font-size: 9pt; border-style: none solid solid none; border-width:1px;'>Rate</th>" +
                        "<th width='6%' style='padding: 4px; text-align:center; font-size: 9pt; border-style: none solid solid none; border-width:1px;'>Amount</th>" +
                      "</tr>"+
                    "</thead>"+
                    " "+$('#content').html()+" " +
                  "</table>"+
                "</td>"+
              "</tr>"+
            "</tbody>"+
            "<tfoot>"+
            "<tr>"+
              "<td width='50%' colspan='4' style='text-align:center; padding:4px; font-size:10pt; border-style: solid solid solid solid; border-width:1px;'><strong>Total</strong></td>"+
              "<td width='10%' style='text-align:center; padding:4px; font-size:10pt; border-style: solid solid solid none; border-width:1px;'>"+$filter('number')($scope.credits.crm_net_amount, "3")+"</td>"+
              "<td width='15%' colspan='2' style='text-align:center; padding:4px; font-size:10pt; border-style: solid solid solid none; border-width:1px;'>"+$filter('number')($scope.credits.crm_cgst_amount, "3")+"</td>"+
              "<td width='15%' colspan='2' style='text-align:center; padding:4px; font-size:10pt; border-style: solid solid solid none; border-width:1px;'>"+$filter('number')($scope.credits.crm_sgst_amount, "3")+"</td>"+
              "<td width='15%' colspan='2' style='text-align:center; padding:4px; font-size:10pt; border-style: solid solid solid none; border-width:1px;'>"+$filter('number')($scope.credits.crm_igst_amount, "3")+"</td>"+
              "<td width='10%' style='text-align:center; padding:4px; font-size:10pt; border-style: solid solid solid none; border-width:1px;'>"+$filter('number')($scope.credits.crm_total_amount, "3")+"</td>"+
            "</tr>"+
            "<tr>" +
                  "<td colspan='7' rowspan='2' width='60%' style='padding:4px; font-size:10pt; border-style: none solid solid solid; border-width:1px;'>Amount in words : "+$scope.amountinwords+"</td>" +
                  "<td colspan='4' width='30%' style='padding:4px; font-size:10pt; border-style: none solid solid solid; border-width:1px;'>Total Amount Before Tax</td>" +
                  "<td width='10%' style='padding:4px; font-size:10pt; border-style: none solid none none; border-width:1px;'><strong>"+$filter('number')($scope.credits.crm_net_amount, "3")+"</strong></td>" +
              "</tr>"+
              "<tr>"+
                  "<td colspan='4' width='30%' style='padding:4px; font-size:10pt; border-style: solid; border-width:1px;'>Add: CGST + SGST + IGST</td>" +
                  "<td width='10%' style='padding:4px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')(parseFloat(parseFloat($scope.credits.crm_cgst_amount) + parseFloat($scope.credits.crm_sgst_amount) + parseFloat($scope.credits.crm_igst_amount)), "3")+"</strong></td>" +
              "</tr>"+
              "<tr>"+
                  "<td colspan='7' rowspan='2' width='60%' style='padding:4px; font-size:9pt; border-style: none none solid solid; border-width:1px;'>"+
                  "Company's Bank Details<br>"+
                  "Bank Name : <strong>"+localStorage.getItem("bkm_name")+"</strong><br>"+
                  "A/C No &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp: <strong>"+localStorage.getItem("bkm_account_no")+"</strong><br>"+
                  "Branch &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp: <strong>"+localStorage.getItem("bkm_branch")+"</strong><br>"+
                  "IFS Code &nbsp&nbsp&nbsp&nbsp: <strong>"+localStorage.getItem("bkm_ifsc")+"</strong><br>"+
                  "<strong>Terms & Conditions</strong><br>"+
                  "1. Goods once sold shall not be taken back.<br>"+
                  "2. Our responsibility ceases once the goods leave our premises.<br>"+
                  "3. Subject to Pune jurisdiction Only.<br>"+
                  "4. GST No : <strong></strong>"+
                  "</td>"+
                  "<td colspan='4' width='30%' style='padding:4px; font-size:10pt; border-style: solid; border-width:1px;'>Total Amount After Tax</td>" +
                  "<td width='10%' style='padding:4px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.credits.crm_total_amount, "3")+"</strong></td>" +
              "</tr>"+
              "<tr>"+
                  "<td colspan='5' width='40%' colspan='2' valign='bottom' style='text-align:center; padding:4px; font-size:10pt; border-style: solid solid solid solid; border-width:1px;'><span style='font-size:7pt;'>Ceritified that the particulars given above are true and correct</span><br><strong>for AMK Enterprises</strong><br><br><br><br><br><br><br><br><br><strong>Authorized Signatory</strong></td>" +
              "</tr>" +
            "</tfoot>"+
          "</table>"+
          "</body>" +
        "</html>";
        popupWin.document.write(page1);
        popupWin.document.close();
      }
    }
});