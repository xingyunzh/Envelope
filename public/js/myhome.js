/**
 * Created by brillwill on 2017/1/3.
 */
$(function(){
   if(localStorage.user && localStorage.token){
       $('#nickname-span').text(JSON.parse(localStorage.user).nickname);
       $('#nickname-span').show();
       $('.login-button').hide();
   }
   else {
       delete localStorage.user
       delete localStorage.token

       $('#nickname-span').hide();
       $('.login-button').show();
   }

    $('.login-button').click(function(){
        window.location.href = './login.html';
    });

});

