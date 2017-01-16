/**
 * Created by brillwill on 2017/1/3.
 */
var theTheme = null;

$(function(){
    refreshThemes();
    $('#theThemePanel').hide();
    $('button.create').show();

});

function getAdminToken(){
    return $("#admin-token-input").val();
}

function refreshThemes() {
    httpHelper().adminRequest(getAdminToken(),"GET", "./console/themes").then(function (data) {
        var themes = data;
        _.forEach(themes, function (theme) {
            $('#theme-panel-ul').append(cellForTheme(theme));
        });

    }).catch(function (error) {
        alert(error);
    });
}

function cellForTheme(theme){
    var onSelect = "setTheTheme("+ JSON.stringify(theme) +")";
    var onDelete = "deleteTheme(" + JSON.stringify(theme) + ")";

    onSelect = onSelect.replace(/"/g, "'");
    onDelete = onDelete.replace(/"/g, "'");

    var formatted = '<table class="table table-bordered"><caption><button class="btn btn-primary" onclick="'+ onSelect +'">Select</button>&nbsp;&nbsp;<button class="btn btn-danger" onclick="'+ onDelete +'">Delete</button></caption>';
    for(var key in theme){
        if(key == "imageURL"){
            formatted += '<tr><td>' + key + '</td>' + '<td><a href="'+ theme[key] +'">'+theme[key]+'</a></td><tr>';
        }
        else if(key == "__v"){
            continue;
        }
        else {
            formatted += '<tr><td>' + key + '</td>' + '<td>'+ theme[key] + '</td>';
        }
    }

    formatted += '</table>';
    return '<li class="list-group-item">'+formatted+'</li>';
}

function setTheTheme(theme){
    var themeObj = theme;
    if (typeof(theme) == "string"){
        themeObj = JSON.parse(theme);
    }

    theTheme = themeObj;
    if(theTheme){
        $('#theThemePanel').show();
        $('button.create').hide();
        refreshTheThemePanel();
    }
    else {
        $('#theThemePanel').hide();
        $('button.create').show();

        refreshTheThemePanel(true);
    }
}

function refreshTheThemePanel(clear){
    var data = {_id:""};
    if(!clear){
        data = theTheme;
    }

    $('#theThemeId').text(data._id);
    $('#theThemeCategory').val(data.category);
    $('#theThemeName').val(data.name);
    $('#theThemeImage').val(data.imageURL);
    $('#theThemeCardTemplate').val(data.cardTemplate);
    $('#theThemeTitle').val(data.title);
}

function onCreateNewButton(){
    $('#theThemePanel').show();

    $('button.create').hide();
}

function onSubmitButton(){
    var id = $('#theThemeId').text();
    var data = {
        category: $('#theThemeCategory').val(),
        name: $('#theThemeName').val(),
        imageURL: $('#theThemeImage').val(),
        cardTemplate:$('#theThemeCardTemplate').val(),
        title:$('#theThemeTitle').val()
    };

    var url = './api/theme/create';
    if (id.length > 4) {
        //update
        url = './api/theme/id/'+id;
    }

    httpHelper().adminRequest(getAdminToken(),"POST", url, data).then(function(res){
        location.reload();
    }).fail(function(error){
        alert(error);
    });
}

function deleteTheme(theme){
    var id = theme._id;
    if(id){
        httpHelper().adminRequest(getAdminToken(),"GET", './api/theme/delete/'+id).then(function(res){
            location.reload();
        }).fail(function(error){
            alert(error);
        });
    }
}
