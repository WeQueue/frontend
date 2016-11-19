// functions

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

function submit(service) {
  result = $.post("https://wequeue-timqian1.c9users.io/user",  
    {"phone":$('#phoneNumberId').val(),"company":companyName,"service":service},
    function(result){
      console.log("New success message");

      $("#companyName").text(result.company);
      $("#queueNumber").text(result.queuePosition);
      $("#service").text(result.service);
      $("#waitTime").text(result.waitTime);

      displayQueuePosList(result.queuePosition, result.queuePosition);        

      $("#dynamicServiceList").hide();
      $("#waitTimeContainer").show();
  }).fail(function(result) {
    console.log(result);
  });  
}

function displayServices(companyName) {
  var url = "https://wequeue-timqian1.c9users.io/services/" + companyName;
  var res;
  return $.get(url, function(result){
    $.each(result, function(index, service) {
      $('#dynamicServiceList .container').append('<button class="btn btn-lg btn-primary btn-block" onclick="submit(\'' + service.service + '\')">' + service.serviceName + ' <span class="badge pull-right">' + service.queueLength + '</span</button>')
    });
  }).then();

  return res;
}

function displayQueuePosList(queuePos, queueLength) {
  console.log('called');
  $('#queuePosList').empty();

  if (queuePos >= 3) { $('#queuePosList').append('<h5>' + parseInt(queuePos-2) + '</h5>'); }
  if (queuePos >= 2) { $('#queuePosList').append('<h4>' + parseInt(queuePos-1) + '</h4>'); }
  $('#queuePosList').append('<h1>' + queuePos + '</h1>');
  if (queueLength - queuePos >= 1) { $('#queuePosList').append('<h4>' + parseInt(queuePos+1) + '</h4>'); }
  if (queueLength - queuePos >= 2) { $('#queuePosList').append('<h5>' + parseInt(queuePos+2) + '</h5>'); }  
}




//logic starts

companyName = getParameterByName('company');
$("#waitTimeContainer").hide();
displayServices(companyName);
