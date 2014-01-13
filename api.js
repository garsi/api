$(document).ready(function(){

  $('#START').on('click', 'button', function(){
     $.ajax('?URL?'), {
        success: function(response) {
          $('?TARGET?').html(response).?EFFECT?();
        },
        error: function(resquest, errorType, errorMessage) {
          $('?TARGET?').html("sorry there is error");
        },
        timeout: 2000,
        beforeSend: function(){
          $('?TARGET?').addClass('loading');
        },
        complete: function(){
          $('?TARGET?').removeCLass('loading');
        }
    }
});




});