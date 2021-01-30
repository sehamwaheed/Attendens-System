const _url = "../resource/employee.json";
const _daileyReportsUrl = "../resource/dailyReport.json";
const _monthelyReportUrl = "../resource/monthelyReport.json";



//on loaded
$(function () {
    loadNotification(getRequsetsList());
    const admin = getAdminInfo();
  
 
      $("#titleAdmin").text(admin.username);
    
  });
 //end loade

// part of  notification ^_^
 
function createNotification(name){
    var colors = [
        "bg-primary",
        "bg-success",
        "bg-danger",
        "bg-warning",
        "bg-dark",
        "bg-secondary",
      ];
    
      var rand = Math.floor(Math.random() * 6);
      var notification = `<a class="dropdown-item d-flex align-items-center" href="#">
                            <div class="mr-3">
                                <div class="icon-circle ${colors[rand]}">
                                    <i class="fas fa-users text-white"></i>
                                </div>
                                </div>
                                <div>
                                    <span class="font-weight-bold">A new request is sent from ${name}!</span>
                                </div>
                            </a>`;
    
      return notification;
}

function loadNotification(arr) {
    $("#notificationContainer").empty();
  
    if (arr.length != 0) {
      arr.forEach((element) => {
        $("#notificationContainer").append(createNotification(element.username));
      });
      $("#numberOfNotification").text(arr.length);
      $("#notificationContainer").append(
        '<a class="dropdown-item text-center small text-gray-500" href="#"> Show All Alerts </a>'
      );
    } else {
      $("#numberOfNotification").text("0");
      $("#notificationContainer").append(
        '<span class="dropdown-item text-center small text-gray-500">No Notifications Avilable</span>'
      );
    }
  }


    function getAdminInfo() {
        return JSON.parse(sessionStorage.getItem("emp"));
      }


      function getRequsetsList() {
        return JSON.parse(localStorage.getItem("ListRequest"));
      }

    
            
        
//create Atendens report
$("#attendsReport").on("click",()=>{
    let tableAtendens=`<div class="table-responsive">
    <table class="table table-bordered" id="attendsReportDatatable" width="100%" cellspacing="0">
          <thead>
                <th>Code</th>
                <th>Name</th>
                <th>Arrive Time</th>
                <th>Late</th>
            </thead>
    </table>
</div>`;

$("#tableCard").show(500);
$("#TableTitle").text("Attendance Report");
$("#myCardBody").html(tableAtendens);
$("#attendsReportDatatable").DataTable({

  ajax: {
      url:_daileyReportsUrl,
      type: "GET",
      error: function(e){},
      dataSrc: function(d){
          return d[d.length-1].attends;      
      },
  },
  columns: [
    { data: "code" },
    { data: "name" },
    {
      mData: function (data) {
        return `${data.arrivedAt.hour} : ${data.arrivedAt.minute} `;
      },
    },
    {
      mData: function (data) {
        if (data.arrivedAt.hour >= 9) {
          return `${data.arrivedAt.hour - 9} : ${data.arrivedAt.minute} `;
        } else {
          return `0 : 0 `;
        }
      },
    },
  ],
})

}) 
 
// create Late report
$("#lateReport").on("click", () => {
    var tablelate = `<div class="table-responsive">
                  <table class="table table-bordered" id="lateReportDatatable" width="100%" cellspacing="0">
                        <thead>
                              <th>Code</th>
                              <th>Name</th>
                              <th>Late</>
                          </thead>
                  </table>
              </div>`;
  
    $("#tableCard").show(500);
    $("#TableTitle").text("Late Report");
    $("#myCardBody").html(tablelate);
    $("#lateReportDatatable").DataTable({
      ajax: {
        url: _daileyReportsUrl,
        type: "GET",
        error: function (err) {},
        dataSrc: function (data) {
          const attends = data[data.length - 1].attends;
          return attends.filter((ele) => {
            return ele.arrivedAt.hour >= 9;
          });
        },
      },
      columns: [
        { data: "code" },
        { data: "name" },
        {
          mData: function (data) {
            return `${data.arrivedAt.hour - 9} : ${data.arrivedAt.minute} `;
          },
        },
      ],
    });
  });
  
  //create Absent Rwport
  $("#absentReport").on("click", ()=>{
    let tableAbsent = `<div class="table-responsive">
      <table class="table table-bordered" id="absentReportDatatable" width="100%" cellspacing="0">
            <thead>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Arrive Time</th>
              </thead>
      </table>
  </div>`;

  $("#tableCard").show(500);
  $("#TableTitle").text("Absent Report");
  $("#myCardBody").html(tableAbsent);
 $("#absentReportDatatable").DataTable({
        ajax:{
            url:_daileyReportsUrl,
            type:"GET",
            error:function(err){},
            dataSrc:function(data){
                return data[data.length - 1].absent;
            },
        },
        columns: [{ data: "code" }, { data: "name" }, { data: "arrivedAt" }],
    })
  });

  // create Execuse Report
  
$("#excuseReport").on("click", () => {
    let tableExecuse = `<div class="table-responsive">
                  <table class="table table-bordered" id="execuseReportDatatable" width="100%" cellspacing="0">
                        <thead>
                              <th>Code</th>
                              <th>Name</th>
                              <th>Excuse Time</th>
                          </thead>
                  </table>
              </div>`;
  
    $("#bgImg").hide(500);
    $("#tableCard").show(500);
    $("#TableTitle").text("Execuse Report");
    $("#myCardBody").html(tableExecuse);
    $("#execuseReportDatatable").DataTable({
      ajax: {
        url: _daileyReportsUrl,
        type: "GET",
        error: function (err) {},
        dataSrc: function (data) {
          return data[data.length - 1].excuse;
        },
      },
      columns: [
        { data: "code" },
        { data: "name" },
        {
          mData: function (data) {
              console.log(data);
            return `${data.time.hour} : ${data.time.minute} `;
          },
        },
      ],
    });
  });

  // Get All Emplloyees
  $("#allEmployees").on("click", () => {
    let tableAllData = `<div class="table-responsive">
                  <table class="table table-bordered" id="fullEmployeeDatatable" width="100%" cellspacing="0">
                        <thead>
                              <th>Code</th>
                              <th>Name</th>
                              <th>Email</th>
                              <th>Address</th>
                              <th>Birth Date</th>
                          </thead>
                  </table>
              </div>`;
  
    $("#tableCard").show(500);
    $("#TableTitle").text("Full Employee Report");
    $("#myCardBody").html(tableAllData);
    $("#fullEmployeeDatatable").DataTable({
      ajax: {
        url: _url,
        type: "GET",
        error: function (e) {},
        dataSrc: function (d) {
            console.log(d);
          return d;
        },
      },
      columns: [
        { data: "empCode" },
        { data: "username" },
        { data: "email" },
        { data: "address" },
        { data: "datebirth" },
      ],
    });
  });

  //Monthely Report
  $("#monthleyReport").on("click", () => {
    let tableMonthely = `<div class="table-responsive">
                  <table class="table table-bordered" id="monthleyReportDatatable" width="100%" cellspacing="0">
                        <thead>
                              <th>Code</th>
                              <th>Name</th>
                              <th>Attends</th>
                              <th>Absent</th>
                              <th>Excuse</th>
                          </thead>
                  </table>
              </div>`;
  
    $("#tableCard").show(500);
    $("#TableTitle").text("Monthley Report");
    $("#myCardBody").html(tableMonthely);
    $("#monthleyReportDatatable").DataTable({
      ajax: {
        url: _monthelyReportUrl,
        type: "GET",
        error: function (err) {},
        dataSrc: function (data) {
        
          return data[data.length - 1].employees;
        },
      },
      columns: [
        { data: "code" },
        { data: "name" },
        { data: "attendsCount" },
        { data: "absentCount" },
        { data: "excuseCount" },
      ],
    });
  });

// Table  New Employees Requistes
  function createRequestTable() {
    var tableRequest = `<div class="table-responsive">
                  <table class="table table-bordered text-center" id="requestDataTable" width="100%" cellspacing="0">
                        <thead>
                              <th>Username</th>
                              <th>Address</th>
                              <th>Email</th>
                              <th>Date of birth</th>
                              <th>Approve</th>
                              <th>Reject</th>
                          </thead>
                  </table>
              </div>`;

    $("#tableCard").show(500);
    $("#TableTitle").text("Requests Table");
    $("#myCardBody").html(tableRequest);
    $("#requestDataTable").DataTable({
      data: getRequsetsList(),
      columns: [
        { data: "username" },
        { data: "address" },
        { data: "email" },
        { data: "datebirth" },
        {
          defaultContent: `<button id="addEmp" class="btn btn-success text-white">Approve</button>`,
        },
        {
          defaultContent: `<button id="removeRequest" class="btn btn-danger text-white">Reject</button>`,
        },
      ],
    });
  }

  $("#content-wrapper").on("click", "#addEmp", function () {
    // function data() return an obj of user data of button which fire the event
    var data = $("#requestDataTable")
      .DataTable()
      .row($(this).parent().parent())
      .data();
  
    console.log(data);
    // add obj user to json file
    $.ajax({
      url: "../resource/employee.json",
      type: "GET",
      success: function (resource) {
        const code = generateEmployeeCode(resource);
        data.empCode = code;
        resource.push(data);
        saveJson(resource);
        deleteRequest(data);
      },
      error: function (err) {
        console.log(err);
      },
    });
  });
  
  $("#content-wrapper").on("click", "#removeRequest", function () {
    var data = $("#requestDataTable")
      .DataTable()
      .row($(this).parent().parent())
      .data();
    deleteRequest(data);
  });

  // Creat Number Code  Unique 
function generateEmployeeCode(arr) {
    // flag to stop itreation
    let flag = true;
    let randomCode;
    do {
      // create code for the first time
      randomCode = Math.floor(100000 + Math.random() * 900000);
  
      // search if there some one have the same code
      var repted = arr.findIndex((e) => {
        return e.empCode == randomCode;
      });
  
      // case if no one has the same code stop itreation
      if (repted == -1) {
        flag = false;
      }
      // no continue
    } while (flag);
  
    return randomCode;
  }
  
  function deleteRequest(request) {
      // get request from localStorage
    const ListRequest = getRequsetsList();
    // search on request list  
    index = ListRequest.findIndex((e) => {
      return e.email == request.email && e.username == request.username;
    });
    // if is found  -->deleted
    if (index != -1) {
      ListRequest.splice(index, 1);
    }
     
    localStorage.setItem("ListRequest", JSON.stringify(ListRequest));
    loadNotification(ListRequest);
    createRequestTable();
  }
   
  // to  clear session  
  $("#AdminLogout").on("click", () => {
    sessionStorage.clear();
  });

  function saveJson(jsonDataToSave) {
    var data = new Blob([JSON.stringify(jsonDataToSave)], {
      type: "application/json",
    });
    var link = document.createElement("a");
    link.href = window.webkitURL.createObjectURL(data);
    link.setAttribute("download", "employee");
    link.click();
  }
  