/**
 * Created by brillwill on 2017/1/9.
 */

$(function(){
    refresh();
});

function getAdminToken(){
    return $("#admin-token-input").val();
}

function refresh(){
    var userCount = httpHelper().adminRequest(getAdminToken(), 'GET', './api/user/count').then(function(number){
        $('#op-user-count').text(number);
    });

    var userLogin = httpHelper().adminRequest(getAdminToken(), 'GET', './api/log/count/action/i').then(function(number){
        $('#op-user-login-span').text(number);
    });

    var createCard = httpHelper().adminRequest(getAdminToken(), 'GET', './api/log/count/action/c').then(function(number){
        $('#op-create-card-span').text(number);
    });

    var viewCard = httpHelper().adminRequest(getAdminToken(), 'GET', './api/log/count/action/v?resource=' + encodeURIComponent("\/card\\Wview\\Wuser\/")).then(function(number) {
        $('#op-view-card-span').text(number);
    });

    var viewCardById = httpHelper().adminRequest(getAdminToken(), 'GET', './api/log/count/action/v?resource=' + encodeURIComponent("\/card\\Wview\\Wid\/")).then(function(number) {
        $('#op-view-card-by-id-span').text(number);
    });

    var viewMyHome = httpHelper().adminRequest(getAdminToken(), 'GET', './api/log/count/action/v?resource=' + encodeURIComponent("myhome\.html$")).then(function(number) {
        $('#op-view-myhome-span').text(number);
    });


    var collectCards = httpHelper().adminRequest(getAdminToken(), 'GET', './api/log/count/action/l').then(function(number) {
        $('#op-collect-card-span').text(number);
    });

    var errors = httpHelper().adminRequest(getAdminToken(),'GET', './api/log/count/action/e').then(function(number) {
        $('#op-error-span').text(number);
    });

    $.when(userCount, userLogin, createCard, viewCard, viewCardById, viewMyHome, collectCards, errors).catch(function(error){
        alert("Some Error occurred!" + JSON.stringify(error));
    });
}

function handleRecentError(){
    httpHelper().adminRequest(getAdminToken(), "GET", './api/log/error/20').then(function(data){
        $("#recent-error-ul").empty();
        _.forEach(data, function(item){
            $("#recent-error-ul").append("<li class='list-group-item'>"+JSON.stringify(item, null, "<br>")+"</li>");
        });
    }).catch(function(error){
        $("#recent-error-ul").empty();
        $("#recent-error-ul").append("<li class='list-group-item-danger'>console error:" + JSON.stringify(error) + "</li>");
    });
}