/**
 * Created by brillwill on 2017/1/4.
 */

function httpHelper() {
    return httpHelper;
}

httpHelper.authRequest = function (method, url, params) {
    return $.ajax({
        method: method,
        url: url,
        data: JSON.stringify(params),
        contentType: "application/json",
        headers: {
            "x-access-token": localStorage.token
        }
    }).then(function (data, textMessage, xhr) {
        var token = xhr.getResponseHeader("set-token");
        if (!!token) {
            localStorage.token = token;
        }

        if(data.status == 'S'){
            return data.body;
        }
        else {
            throw data.body;
        }
    });
};

httpHelper.adminRequest = function(token, method, url, params){
    return $.ajax({
        method: method,
        url: url,
        data: JSON.stringify(params),
        contentType: "application/json",
        headers: {
            "x-access-token": localStorage.token,
            "x-admin-token":token
        }
    }).then(function (data, textMessage, xhr) {
        if(data.status == 'S'){
            return data.body;
        }
        else {
            throw data.body;
        }
    });
};

httpHelper.request = function (method, url, params) {
    return $.ajax({
        method: method,
        url: url,
        data: JSON.stringify(params),
        contentType: "application/json",
    }).then(function(data){
        if(data.status == 'S'){
            return data.body;
        }
        else {
            throw data.body;
        }
    });
};


