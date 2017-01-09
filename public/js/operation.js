/**
 * Created by brillwill on 2017/1/9.
 */

$(function(){
    refresh();
});

function refresh(){
    var userCount = httpHelper().request('GET', './api/user/count').then(function(number){
        $('#op-user-count').text(number);
    });

    var userLogin = httpHelper().request('GET', './api/log/count/action/i').then(function(number){
        $('#op-user-login-span').text(number);
    });

    var createCard = httpHelper().request('GET', './api/log/count/action/c').then(function(number){
        $('#op-create-card-span').text(number);
    });

    var viewCard = httpHelper().request('GET', './api/log/count/action/v?resource=' + encodeURIComponent("\/card\\Wview\\Wuser\/")).then(function(number) {
        $('#op-view-card-span').text(number);
    });

    var viewCardById = httpHelper().request('GET', './api/log/count/action/v?resource=' + encodeURIComponent("\/card\\Wview\\Wid\/")).then(function(number) {
        $('#op-view-card-by-id-span').text(number);
    });

    var viewMyHome = httpHelper().request('GET', './api/log/count/action/v?resource=' + encodeURIComponent("myhome\.html$")).then(function(number) {
        $('#op-view-myhome-span').text(number);
    });


    var collectCards = httpHelper().request('GET', './api/log/count/action/l').then(function(number) {
        $('#op-collect-card-span').text(number);
    });

    var errors = httpHelper().request('GET', './api/log/count/action/e').then(function(number) {
        $('#op-error-span').text(number);
    });

    $.when(userCount, userLogin, createCard, viewCard, viewCardById, viewMyHome, collectCards, errors).catch(function(error){
        alert("Some Error occurred!" + JSON.stringify(error));
    });
}