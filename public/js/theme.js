/**
 * Created by brillwill on 2017/1/3.
 */
var theTheme = null;

$(function(){
    refreshThemes();
    $('#theThemePanel').hide();
    $('button.create').show();

});

function refreshThemes(){
    $.get("./console/themes").then(function(data){
        if(data.status == 'S'){
            var themes = data.body;
            _.forEach(themes, function(theme){
                $('#theme-panel-ul').append(cellForTheme(theme));
            });
        }
        else {
            throw data.body;
        }
    }).catch(function(error){
        alert(error);
    });
}

function cellForTheme(theme){
    var onSelect = "setTheTheme("+ JSON.stringify(theme) +")";
    var onDelete = "deleteTheme(" + JSON.stringify(theme) + ")";

    var formatted = '<table class="table table-bordered"><caption><button class="btn btn-primary" onclick='+ onSelect +'>Select</button>&nbsp;&nbsp;<button class="btn btn-danger" onclick='+ onDelete +'>Delete</button></caption>';
    for(var key in theme){
        if(key == "imageURL"){
            formatted += '<tr><td>' + key + '</td>' + '<td><a href="'+ theme[key] +'">URL</a></td><tr>';
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
    $('#theThemeNicknameCSS').val(data.nicknameCSS);
    $('#theThemeHeadIconCSS').val(data.headiconCSS);
    $('#theThemeSpriteCSS').val(data.spriteCSS);
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
        nicknameCSS: $('#theThemeNicknameCSS').val(),
        headiconCSS: $('#theThemeHeadIconCSS').val(),
        spriteCSS: $('#theThemeSpriteCSS').val()
    };

    if (id.length > 4) {
        //update
        $.post('./api/theme/id/'+id, data).then(function(res){
            if(res.status == "S"){
                location.reload();
            }
            else {
                throw res.body;
            }
        }).fail(function(error){
            alert(error);
        });
    }
    else {
        // create
        $.post('./api/theme/create', data).then(function(res){
            if(res.status == "S"){
                location.reload();
            }
            else {
                throw res.body;
            }
        }).fail(function(error){
            alert(error);
        });
    }
}

function deleteTheme(theme){
    var id = theme._id;
    if(id){
        $.get('./api/theme/delete/'+id).then(function(res){
            if(res.status == "S"){
                location.reload();
            }
            else {
                throw res.body;
            }
        }).fail(function(error){
            alert(error);
        });
    }
}
