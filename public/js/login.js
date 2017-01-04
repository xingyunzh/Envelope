/**
 * Created by brillwill on 2017/1/4.
 */

$(function(){
   $('.login-status').hide();
});

function onLoginButton(){
    var params = {
        email : $('#email-input').val(),
        password : $('#password-input').val()
    }

    
    if(!params.email || !params.password){
        alert("email or password can not be empty!");
        return;
    }
    
    $('.btn-login').attr('disabled', true);
    $('.login-status').show();
    $('.login-result').text("");

    httpHelper().authRequest("POST", "./api/user/login/email", params).then(function(data){
        if(data.user != null){
            localStorage.user = data.user;
        }
        else {
            throw "用户名或密码不正确。";
        }

        $('.login-result').text("登录成功!");
        $('.login-status').hide();
        $('.btn-login').removeAttr("disabled");

        history.go(-1);
        location.reload();
    }).fail(function(data){
        $('.login-result').text("登录失败!" + JSON.stringify(data));
        $('.login-status').hide();
        $('.btn-login').removeAttr("disabled");
    });
}

function onClearButton(){
    $('#email-input').val("");
    $('#password-input').val("");
    $('.login-status').hide();
}