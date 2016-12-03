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
  phoneNumber = $('#phoneNumberId').val();
  result = $.post("https://wequeue-timqian1.c9users.io/user",  
    {"phone":phoneNumber,"company":companyName,"service":service},
    function(result){
      console.log("New success message");

      $("#companyName").text(result.company);
      $("#queueNumber").text(result.queuePosition);
      $("#ticketNumber").text(result.ticketNumber);
      $("#service").text(result.service);
      $("#waitTime").text(result.waitTime);

      realQueuePosition = result.queuePosition + 1;
      displayQueuePosList(realQueuePosition, realQueuePosition);        

      $("#serviceListContainer").hide();
      $("#waitTimeContainer").show();

      setInterval(function () {
        updateDisplayQueue(phoneNumber, companyName, service)
      }, 15000);

    }).fail(function(result) {
      console.log(result);
  });  
}

function displayServices(companyName, callbackName) {
  var url = "https://wequeue-timqian1.c9users.io/services/" + companyName;

  return $.get(url, function(result){
    $('#dynamicServiceList').empty();
    $.each(result, function(index, service) {
      $('#dynamicServiceList').append('<button class="btn btn-lg btn-primary btn-block" onclick="'+callbackName+'(\'' + service.service + '\')">' + service.serviceName + ' <span class="badge pull-right">' + service.queueLength + '</span</button>')  
    });
  });

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
  $.post("https://wequeue-timqian1.c9users.io/deleteUser",{"company": companyName,"service":serviceName}, function(result) {
    displayServices(companyName,"deleteUser");
  });
}

function updateDisplayQueue(phone, company, service) {
  $.post("https://wequeue-timqian1.c9users.io/getPosition", {"phone":phone,"company":company,"service":service}, function(result) {
      if (result.queuePosition <= 0) {
        $("#waitTime").text(0);
        $("#queueInfo").empty();
        $("#queueInfo").append('<h1>You are up!</h1>')
      } else {
        displayQueuePosList(result.queuePosition+1, result.queueLength);
        $("#waitTime").text(result.waitTime);
      }
      
  })

}

//logic starts

companyName = getParameterByName('company');

