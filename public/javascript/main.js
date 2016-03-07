var ajaxCall = function(route, params, successhandler){
  $.ajax({
    type: 'POST',
    url: route,
    contentType: "application/json",
    async: true,
    data:JSON.stringify(params),
    success: successhandler,
    error: function(data){
      console.log(JSON.stringify(data));
      return false;}
  });
};

