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

      setInterval(updateDisplayQueue($('#phoneNumberId').val(), companyName, service), 1000);
    }).fail(function(result) {
    console.log(result);
  });  
}

function displayServices(companyName, callbackName) {
  var url = "https://wequeue-timqian1.c9users.io/services/" + companyName;
  var res;
  $('#dynamicServiceList').empty();
  return $.get(url, function(result){
    $.each(result, function(index, service) {
      $('#dynamicServiceList').append('<button class="btn btn-lg btn-primary btn-block" onclick="'+callbackName+'(\'' + service.service + '\')">' + service.serviceName + ' <span class="badge pull-right">' + service.queueLength + '</span</button>')
    });
  });

  return res;
}

function displayQueuePosList(queuePos, queueLength) {
  $('#queuePosList').empty();

  if (queuePos >= 3) { $('#queuePosList').append('<h5>' + parseInt(queuePos-2) + '</h5>'); }
  if (queuePos >= 2) { $('#queuePosList').append('<h4>' + parseInt(queuePos-1) + '</h4>'); }
  $('#queuePosList').append('<h1>' + queuePos + '</h1>');
  if (queueLength - queuePos >= 1) { $('#queuePosList').append('<h4>' + parseInt(queuePos+1) + '</h4>'); }
  if (queueLength - queuePos >= 2) { $('#queuePosList').append('<h5>' + parseInt(queuePos+2) + '</h5>'); }  
}


// Admin functions
// If you do not supply a user name then just pop (handled by api)
function deleteUser(serviceName) {
  $.post("https://wequeue-timqian1.c9users.io/deleteUser",{"company": companyName,"service":serviceName}, function() {
    console.log("Deleted")
    displayServices(companyName,"submit");
  });
}

function updateDisplayQueue(phone, company, service) {
  $.post("https://wequeue-timqian1.c9users.io/getPosition", {"phone":phone,"company":company,"service":service}, function(result) {
      displayQueuePosList(result.queuePosition, result.queueLength);
  })
}

//logic starts

companyName = getParameterByName('company');

