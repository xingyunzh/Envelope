/**
 * Created by brillwill on 2017/1/3.
 */
$(function(){
    refreshThemeConfigs();
    $("#theThemeConfigPanel").show();
});

function getAdminToken(){
    return $("#admin-token-input").val();
}

function refreshThemeConfigs(){
    httpHelper().adminRequest(getAdminToken(), 'GET', './console/themeconfigs').then(function (data) {
        var configs = data;
        _.forEach(configs, function (config) {
            $('#theme-config-panel-ul').append(cellForConfig(config));
        });
    }).fail(function (error) {
        alert(error);
    });
}

function cellForConfig(config){
    var onDelete = "deleteConfig(" + JSON.stringify(config) + ")";
    var formatted = '<table class="table table-bordered">';
    formatted += '<tr><td>_id</td><td>'+config._id+'<button class="btn btn-sm btn-danger delete pull-right" onclick=' + onDelete + '><span class="glyphicon glyphicon-remove"></span></button></td>';
    formatted += '<tr><td>Category</td><td>'+config.category+'</td>';
    formatted += '<tr><td>Text Candidates</td><td>'+JSON.stringify(config.textCandidates)+'</td>';
    formatted += '<tr><td>Logo Candidates</td><td>'+JSON.stringify(config.logoCandidates)+'</td>';
    formatted += '<tr><td>CreateDate</td><td>'+new Date(config.createDate).toLocaleString()+'</td>';
    formatted += '</table>';
    return formatted;
}


function onSubmitButton(){
    var textCandidates = JSON.parse($('#theThemeConfigTextCandidates').val());
    if(!_.isArray(textCandidates)){
        alert("Text Candidates is not valid JSON!");
        return;
    }
    
    var logos = JSON.parse($('#theThemeConfigLogoCandidates').val());
    if(!_.isArray(logos)){
        alert("Logo Candidates is not valid JSON!");
        return;
    }

    var params = {
        category : $('#theThemeConfigCategory').val(),
        textCandidates : textCandidates,
        logoCandidates:logos
    };

    httpHelper().adminRequest(getAdminToken(),"POST", './api/tconfig/create', params).then(function(data){
        location.reload();
    }).fail(function(error){
        alert(error);
    });
}

function onResetButton(){
    $('#theThemeConfigCategory').val("");
    $('#theThemeConfigTextCandidates').val("");
}

function deleteConfig(config){
    httpHelper().adminRequest(getAdminToken(),"GET", './api/tconfig/delete/'+config._id).then(function(data){
        location.reload();
    }).fail(function(error){
        alert(error);
    });
}