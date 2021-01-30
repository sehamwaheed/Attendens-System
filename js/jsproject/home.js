$("#exampleModal").on("show.bs.modal", (event) => {
  var button = $(event.relatedTarget);
  var modal = $(this);
});


//register form


$("#Form").submit(function (event) {
       
  var vFormRegester = $(this);


  if (vFormRegester[0].checkValidity() === false) {
    event.preventDefault();
    event.stopPropagation();
  } else {
      
    var username = $("#username").val();
    var password = $("#password").val();
    var address = $("#address").val();
    var email = $("#email-register").val();
    var date = $("#date").val();
    res = new Employee(username, address, email, date, password );
    res.password=password;
     
    var arrlocal=loadRequest();
    arrlocal.push(res);
  
    localStorage.setItem("ListRequest",JSON.stringify(arrlocal));
        
  }

  vFormRegester.addClass("was-validated");
});


function loadRequest() {
  return JSON.parse(localStorage.getItem("ListRequest") || "[]");
}






// login  form 

$("#Form2").submit(function (event) {
  var vFormlog = $(this);

  if (vFormlog[0].checkValidity() === false) {
    event.preventDefault();
    event.stopPropagation();
  } else {
            
          var email =$("#emaillog").val();
          var loginpass =$("#passwordlog").val();
          
         var data = [];

        $.ajax({
          url: "../resource/employee.json",
          type: "get",
          success: function (res) {
            
            // Check if User is in Json File
            index = res.findIndex((mails) => {
              return email == mails.email;
            });
    
            // check if type of  user 
            if (index == -1) {
              alert("There Is no User with this mail");
            } else if (index == 0 && res[index].password == loginpass) {
              sessionStorage.setItem("emp", JSON.stringify(res[index]));
              open("../admin.html", "_self");
            } else if (index == 1 && res[index].password == loginpass) {
              open("../profile.html", "_self");
              sessionStorage.setItem("emp", JSON.stringify(res[index]));
            } else if (res[index].password == loginpass) {
              sessionStorage.setItem("emp", JSON.stringify(res[index]));
              open("../profile.html", "_self");
            }
          },
          error: function (ErrorMessage) {
            console.log(ErrorMessage);
          },
        });
        
       
  }

  vFormlog.addClass("was-validated");
});


