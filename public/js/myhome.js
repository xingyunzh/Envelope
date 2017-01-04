/**
 * Created by brillwill on 2017/1/3.
 */
var theThemes = null;
var theThemeConfig = null;
var theUser = null;

var theThemeIndex = 0;
var theTextIndex = 0;

$(function(){
   if(localStorage.user && localStorage.token){
       theUser = JSON.parse(localStorage.user);
       $('#nickname-span').text(theUser.nickname);
       $('#nickname-span').show();
       $('.login-button').hide();
   }
   else {
       delete localStorage.user
       delete localStorage.token

       $('#nickname-span').hide();
       $('.login-button').show();
       $('.create-button').hide();
   }

    $('.login-button').click(function(){
        window.location.href = './login.html';
    });

    getThemes();
    getThemeConfig();
    getUserCount();
    getCollects();
});

function getThemes(){
    httpHelper().request('GET', '/envelope/api/theme').then(function(themes){
        theThemes = themes;
        configMyHomeWithTheme(themes[0]);
    }).fail(function(error){
        alert("Server Error:"+JSON.stringify(error));
    });
}

function getThemeConfig(){
    httpHelper().request('GET', '/envelope/api/tconfig/current').then(function(config){
       theThemeConfig = config;
        configMyHomeWithThemeConfig(config);
    }).fail(function(error){
        alert("Server Error:"+JSON.stringify(error));
    });
}

function getUserCount(){
    if(theUser){
        httpHelper().request('GET', '/envelope/api/collect/count/'+theUser._id).then(function(count){
            $('#count-span').text(""+count);
        }).fail(function(error){
            alert("Server Error:"+JSON.stringify(error));
        });
    }
}

function getCollects(){
    if(theUser){
        httpHelper().request('GET', '/envelope/api/collect/cards/'+theUser._id).then(function(cards){
            _.forEach(cards, function(card){
                $('#collects-list-div').append('<a class="list-group-item">'+card.sender.nickname+'</a>');
            });

        }).fail(function(error){
            alert("Server Error:"+JSON.stringify(error));
        });
    }
}

function configMyHomeWithTheme(theme){
    $('#master-img').attr('src', theme.imageURL);
}

function configMyHomeWithThemeConfig(config){
    $('#text-a').text(config.textCandidates[0]);
}

//event
function createCard(){
    httpHelper().authRequest("POST", '/envelope/api/card', {
        theme:theThemes[theThemeIndex],
        sender:theUser._id,
        text:theThemeConfig.textCandidates[theTextIndex]
    }).then(function(data){
        alert("Card Created Successfully!");
    }).fail(function(error){
        alert("Server Error:"+JSON.stringify(error));
    });
}