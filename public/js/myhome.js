/**
 * Created by brillwill on 2017/1/3.
 */
var theThemes = null;
var theThemeConfig = null;
var theUser = null;

var theThemeIndex = 0;
var theTextIndex = 0;

var theCurrentCard = null;

$(function(){
   if(localStorage.user && localStorage.token){
       theUser = JSON.parse(localStorage.user);
       $('#nickname-span').text(theUser.nickname);
       $('#nickname-span').show();
       $('.login-button').hide();
   }
   else {
       delete localStorage.user;
       delete localStorage.token;

       $('#nickname-span').text("我");
       $('.login-button').show();
       $('.create-button').hide();
       $('.logout-button').hide();
   }

    $('.login-button').click(function(){
        window.location.href = './login.html';
    });

    $('.create-button').text('加载中').attr('disabled', true);

    $.when(getThemes(), getThemeConfig()).then(function (value) {
        return getCurrentCard();
    }).then(function(card){
        if(card){
            theCurrentCard = card;
            _.forEach(theThemes, function(item, index){
                if(item._id == card.theme._id){
                    theThemeIndex = index;
                    return false;
                }
            });

            _.forEach(theThemeConfig.textCandidates, function(item, index){
                if(item == card.text){
                    theTextIndex = index;
                    return false;
                }
            });
        }

        configMyHomeWithTheme();
        configMyHomeWithThemeConfig();

        $('.create-button').text('生成卡片').removeAttr('disabled');
    }).fail(function(error){
        alert("Server Error:"+JSON.stringify(error));
    });

    getCollects();
});

function getThemes(){
    return httpHelper().authRequest('GET', '/envelope/api/theme').then(function(themes){
        theThemes = themes;

        return true;
    });
}

function getThemeConfig(){
    return httpHelper().authRequest('GET', '/envelope/api/tconfig/current').then(function(config){
       theThemeConfig = config;

        return true;
    });
}

function getCollects(){
    if(theUser){
        httpHelper().authRequest('GET', '/envelope/api/collect/cards/'+theUser._id).then(function(collects){
            $('#count-span').text(""+collects.length);

            _.forEach(collects, function(collect){
                $('#collects-list-div').append('<a class="list-group-item" href="/envelope/api/card/view/id/'+collect.card._id+'"> <i>From: </i>'+collect.card.sender.nickname+'</a>');
            });

        }).fail(function(error){
            alert("Server Error:"+JSON.stringify(error));
        });
    }
}

function getCurrentCard(){
    if(theUser){
        return httpHelper().authRequest('GET', '/envelope/api/card/user/'+theUser._id);
    }
    else {
        return null;
    }
}

function configMyHomeWithTheme(){
    $('#master-img').attr('src', theThemes[theThemeIndex].imageURL);
}

function configMyHomeWithThemeConfig(){
    $('#text-a').text(theThemeConfig.textCandidates[theTextIndex]);
}

//event
function createCard(){
    if (theCurrentCard && theCurrentCard.theme._id == theThemes[theThemeIndex]._id
        && theCurrentCard.text == theThemeConfig.textCandidates[theTextIndex]) {
        window.location.href = '/envelope/api/card/view/user/' + theUser._id;

        return;
    }

    httpHelper().authRequest("POST", '/envelope/api/card/create', {
        theme:theThemes[theThemeIndex]._id,
        sender:theUser._id,
        text:theThemeConfig.textCandidates[theTextIndex]
    }).then(function(data){
        window.location.href = '/envelope/api/card/view/user/'+theUser._id;
    }).fail(function(error){
        alert("Server Error:"+JSON.stringify(error));
    });
}

function logout(){
    delete localStorage.user;
    delete localStorage.token;

    location.reload();
}

function handleThemeClick(){
    if(theThemeIndex < theThemes.length - 1){
        theThemeIndex++;
    }
    else {
        theThemeIndex = 0;
    }

    configMyHomeWithTheme();
}

function handleTextClick(){
    if(theTextIndex < theThemeConfig.textCandidates.length - 1){
        theTextIndex++;
    }
    else {
        theTextIndex = 0;
    }

    configMyHomeWithThemeConfig();
}