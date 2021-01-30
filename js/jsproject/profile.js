let employee=JSON.parse(sessionStorage.getItem('emp'));


const listAttendens = [];
var listMonthely = [];
var monthReportDate;
var reportCreateFlag = false;

$(function(){
   
    if(employee.email !== "dinawaheed3@gmail.com")
    {
        $("#tittelProfile").text("MyAccount");
        $("#takeAttendence").hide();
        $("#savebtn").hide();
        $("#monthbtn").hide();
    }else{
        $("#tittelProfile").text("SubAdmin");
        $("#takeAttendence").show();
        takeAllAbsent();
    }
    $("#profileUsername").text(employee.username);
    $("#imgProfile").attr("src",employee.imgs);


    fetch("../resource/monthelyReport.json")
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      monthReportDate = res[res.length - 1].date;
      listMonthely = res[res.length - 1].employees;
      console.log(monthReportDate);
    })
    .catch((err) => {
      console.log(err);
    }); //end

 

});


$("#show-dailey-report").on("click",()=>{
    $("#daileyReportUserName").text(employee.username);
    $("#daileyReportEmail").text(employee.email);
    $("#daileyReportAddress").text(employee.address);
    $("#dailyReportImg").attr("src",employee.imgs);
     $("#daileyReport").show(500);
    $("#monthelyReport").hide(500);
    $("#attendsCard").hide(500);
    $("#excuseCard").hide(500);
})


$("#show-monthely-report").on("click", () => {
    $("#daileyReport").hide(500);
    $("#monthelyReport").show(500);
    $("#attendsCard").hide(500);
    $("#excuseCard").hide(500);

    index = listMonthely.findIndex((emp) => {
        return emp.code == employee.empCode;
      });
      console.log(employee)
       console.log(index);
       console.log(listMonthely)
      const attend = listMonthely[index].attendsCount;
      const absent = listMonthely[index].absentCount;
      const excuse = listMonthely[index].excuseCount;
    
      $("#monthlylateNumber").text(`${excuse} times`);
      $("#monthlyAbsentNumber").text(`${absent} times`);
      $("#monthlyAttendensNumber").text(`${attend} times`);
  });
  
  $("#show-attends-from").on("click", () => {
    $("#daileyReport").hide(500);
    $("#monthelyReport").hide(500);
    $("#attendsCard").show(500);
    $("#excuseCard").hide(500);
  });

  $("#showExcuseFrom").on("click", ()=>{
    $("#daileyReport").hide(500);
    $("#monthelyReport").hide(500);
    $("#attendsCard").hide(500);
    $("#excuseCard").show(500)
  })

// Model Log-out
$('#exampleModal').on('show.bs.modal', event => {
    var button = $(event.relatedTarget);
    var modal = $(this);

});

$("#btnAttend").on('click',() => {
 
    const code=$("#inputCodeAttend").val();
    const date= new Date();
    //check if code is emptyCells: 
    if(code === ""){
        $("#attendensMessage").addClass("alert-danger");
        $("#attendensMessage").text('Please Enter Your Code');
       return;
    }

    
      //date.getHours() <= 8 && date.getHours() >= 10
  if (true) {
    toTakeAttendens(code, date);

  } else {
    $("#attendensMessage").addClass("alert-danger");
    $("#attendensMessage").html("Error: <br> Attends report has been closed");
  }

  // setInterval(() => {
  //   if (Date.getHours() == 10) {
  //     createDaileyReport(attendsList);
  //   }
  // }, 900000); // check every 15 minutes if clock is 10 am

})


function toTakeAttendens(_code, _time) {
    //get data from the ajax
    $.ajax({
      url:"../resource/employee.json",
      type: "get",
      success: (arremps) => {
        index = arremps.findIndex((employee) => {
          return employee.empCode == _code;
        });
  
        if (index != -1) {
          const emp = {
            code:arremps[index].empCode,
            name: arremps[index].username,
            arrivedAt: { hour: _time.getHours(), minute: _time.getMinutes() },
          };
  
          if (repted(_code)) {
            $("#attendensMessage").addClass("alert-danger");
            $("#attendensMessage").html(`This Code was Entered Before`);
            return;
          }
  
          listAttendens.push(emp);
          incrementAttendsCount(_code);
  
          $("#attendensMessage").removeClass("alert-danger");
          $("#attendensMessage").html(`Success
          <br>The empolyee:  ${emp.name} <br>
          Arrive At:  ${_time.getHours()} : ${_time.getMinutes()}.`);
          removeEmpFromAbsent(_code);
          return;
        }
  
        $("#attendensMessage").addClass("alert-danger");
        $("#attendensMessage").html(`Error: <br>
        Employee code is not founded`);
      },
      error: (e) => {
        console.log(e);
        $("#attendensMessage").addClass("alert-danger");
        $("#attendensMessage").text(`Error Falied To load `);
      },
    });
  }

  function repted(code) {
    index = listAttendens.findIndex((emp) => {
      return emp.code == code;
    });
  
    if (index != -1) {
      return true;
    }
  
    return false;
  }
  
  function incrementAttendsCount(code) {
    index = listMonthely.findIndex((e) => {
      return e.code == code;
    });

    if(index == -1){
      return;
    }
  
    listMonthely[index].attendsCount++;
  }
  
  function incrementAbsentCount(code) {
    index = listMonthely.findIndex((e) => {
      return e.code == code;
    });

    if(index == -1){
      return;
    }
  
    listMonthely[index].absentCount++;
  }
  
  function incrementExcuseCount(code) {

     
    index = listMonthely.findIndex((e) => {

      return e.code == code;

    });
     if(index == -1){
       return;
     }
    listMonthely[index].excuseCount++;
  }

  //take all employees absent 
  function takeAllAbsent() {
      //get all employees 
    $.ajax({
      url: "../resource/employee.json",
      type: "GET",
      success: function (data) {
          // define array
        var absent = [];
        //loop  all employee
        data.forEach((e) => {
            //push object in array 
          absent.push({ code: e.empCode, name: e.username, arrivedAt: "absent" });
        });
        // save array in localstorage
        localStorage.setItem("UsersTemp", JSON.stringify(absent));
      },
    });
  }

// this function take  code remove employee from absent  if  he attended
  function removeEmpFromAbsent(code) {
    const absentList = JSON.parse(localStorage.getItem("UsersTemp")); // get absent list
    index = absentList.findIndex((e) => {
      // get the index of the user attends
      return e.code == code;
    });
  
    absentList.splice(index, 1);
    //remove the emp from absent list
    localStorage.setItem("UsersTemp", JSON.stringify(absentList)); // return arr with the new update
  }


  $("#savebtn").on("click",()=>{

    createDaileyReport(listAttendens);
  })

  $("#monthbtn").on("click",()=>{
   creatMonthelyReport();

  })
  

  function createDaileyReport(_report) {
    const date = new Date().toLocaleDateString();
    const absent = JSON.parse(localStorage.getItem("UsersTemp"));
    const report = new daileyReport(date, _report, absent, []);
    $.ajax({
      url: "../resource/dailyReport.json",
      type: "GET",
      success: (data) => {
        data.push(report);
  
        console.log(absent);
        absent.forEach((e) => {
          incrementAbsentCount(e.code);
        });
  
        console.table(listMonthely);
        saveJson(data, "daileyReport");
        // saveJson(
        //   { date: monthReportDate, employees: listMonthely },
        //   "monthelyReport"
        // );
        reportCreateFlag = true;
      },
      error: (e) => {
        console.log(e);
      },
    });
  
    localStorage.removeItem("UsersTemp");
  }

  // save new json file with new updates
function saveJson(jsonDataToSave, fileName) {
    var data = new Blob([JSON.stringify(jsonDataToSave)], {
      type: "application/json",
    });
    var link = document.createElement("a");
    link.href = window.webkitURL.createObjectURL(data);
    link.setAttribute("download", fileName);
    link.click();
  }


  

  
function getReport() {

    // load reports
    $.ajax({
      url: "../resource/dailyReport.json",
      type: "get",
      success: (reportsData) => {
        // search by date
        showDailyReport(reportsData[reportsData.length-1].attends, employee);
      },
      error: (err) => {
        console.log(err);
      },
    });
    // show info
  }

  
  
function showDailyReport(report, user) {
    // search for the user
    index = report.findIndex((employee) => {
      return employee.code == user.empCode;
      
    });
     // case 1: the user is attended
    //        show the arrivedAt
   //        show the late date
  //                         dailyCard
    console.log(index);
    console.log(user);
    console.log(report[index]);
    if (index != -1) {
      $("#dailyCard").removeClass("border-left-danger");
      $("#dailyArriveTitel").text("Arrive Time");
      $("#dailyArriveNumber").text(
        `${report[index].arrivedAt.hour} : ${report[index].arrivedAt.minute} `
      );
      if (report[index].arrivedAt.hour >= 9) {
        $("#dailyLateNumber").text(
          `${report[index].arrivedAt.hour - 9} : ${
            report[index].arrivedAt.minute } `
        );
      } else {
        $("#dailyLateNumber").html("***");
      }
      return;
    }
     // case 2: the user us absent
    //        show absent
    //        show the late date ***
    $("#dailyCard").addClass("border-left-danger");
    $("#dailyArriveTitel").text("Absent");
    $("#dailyArriveNumber").html('<i class="fas fa-user-alt-slash"></i>');
    $("#dailyLateNumber").html('<i class="fas fa-user-alt-slash"></i>');
  

  }



  // create monthely report
function creatMonthelyReport() {
    $.ajax({
      // load employee data
      url: "../resource/employee.json",
      type: "GET",
      success: function (employees) {
        const employeesList = [];
        employees.forEach((employee) => {
          employeesList.push({
            code: employee.empCode,
            name: employee.username,
            attendsCount: 0,
            absentCount: 0,
            excuseCount: 0,
          });
        });
  
        const date = new Date();
        const month = new MonthlyReport(date.toDateString(), employeesList);
        saveJson(month, "monthelyReport");
      },
    });
  }
  
  $("#excuseButton").on("click", () => {
    const code = $("#employeeCodeExcuseInput").val();
    // check Time
    const time = new Date();
  
    if (code === "") {
      $("#excuseMessage").addClass("alert-warning");
      $("#excuseMessage").html("Waring: <br> Enter Code Please");
      return;
    }
 
  
    //time.getHours() >= 10 && time.getHours() <= 16 && reportCreateFlag
    if (true) {
      takeExcuse(code);
      $("#excuseMessage").removeClass("alert-warning");
      $("#excuseMessage").text(`Success`);
    } else {
      $("#excuseMessage").addClass("alert-warning");
      $("#excuseMessage").text(`excuse report has been closed`);
    }
  });

  // take code
// get the report of that day and put the in excuse
// check numberOfPermission of excuse
// case 1 is there place
// put code and Time
// case 2 no place return
function takeExcuse(code) {
    $.ajax({
      url: "../resource/dailyReport.json",
      type: "get",
      success: (reports) => {
        const last = reports[reports.length - 1];
        const numberOfPermission = last.excuse.length;
        // finde name of employee that has the Code
  
        index = last.attends.findIndex((e) => {
          return e.code == code;
        });
  
        if (index == -1) {
          $("#excuseMessage").addClass("alert-info");
          $("#excuseMessage").text(`Code is not correct`);
          return;
        }
  
        if (numberOfPermission != 5) {
          const date = new Date();
          last.excuse.push({
            code: code,
            name: last.attends[index].name,
            time: {
              hour: date.getHours(),
              minute: date.getMinutes(),
            },
          });
  
          incrementExcuseCount(code);
          // saveJson(
          //   { date: monthReportDate, employees: listMonthely },
          //   "monthelyReport"
          // );
          // saveJson(reports, "daileyReport");
        } else {
          $("#excuseMessage").addClass("alert-info");
          $("#excuseMessage").text(`sorry <br> We reached the maximum excuse limit`);
        }
      },
    });
  }
  

function generateMonthelyReport(){

  const date = new Date().toDateString();
  const day= date.split(" ")[2];

   if(day == "1" || day == "01"){

     creatMonthelyReport();
   }
}

