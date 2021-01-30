class Employee {
  constructor(_username, _address, _email, _datebirth, _password) {
    this.username = _username;
    this.address = _address;
    this.email = _email;
    this.datebirth = _datebirth;
    this.password = _password;
    
  }
  set Password(_passw) {
    this.password = _passw;
  }
  get Password() {
    return this.password;
  }
 
}


let employeesData;
var url = "../resource/employee.json";
    $.ajax({
        type: "GET",
        url: url,
        success: function (response) {
            employeesData = response;
        },
        error: function (error) {
            employeesData = false;
        }
    });


function saveJson(jsonDataToSave) {
    var data = new Blob([JSON.stringify(jsonDataToSave)], { type: "application/json" });
    var link = document.createElement("a");
    link.href = window.webkitURL.createObjectURL(data);
    link.setAttribute("download", "src");
    document.getElementsByTagName("body")[0].appendChild(link);
    link.click();
}