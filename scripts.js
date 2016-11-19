$("#waitTimeContainer").hide();

function getParameterByName(name, url) {
  if (!url) {
    url = window.location.href;
  }
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

companyName = getParameterByName('company');

function submit(service) {
  // result = $.post("http://172.20.10.3:3000/user",
  result = $.post("https://wequeue-timqian1.c9users.io/user",  
    {"phone":$('#phoneNumberId').val(),"company":companyName,"service":service},
    function(result){
      console.log("New success message");

      console.log(result);

      $("#companyName").text(result.company);
      $("#queueNumber").text(result.queuePosition);
      $("#service").text(result.service);
      $("#waitTime").text(result.waitTime);

        

      $("#optionsList").hide();
      $("#waitTimeContainer").show();
  }).fail(function(result) {
    console.log(result);
  });  
}

