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
    var query = getQueryString();

    if ('code' in query) {
        $('.login-button').hide();
        getUserInfoAndCollect(query.code,query.state);
    }
    else if(localStorage.user && localStorage.token){
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
        window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxd9afdfa36e78cc2c&redirect_uri=' 
        + encodeURIComponent('http://www.xingyunzh.com/envelope/myhome.html')
        + '&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect';
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

function getUserInfoAndCollect(code,senderId){
    httpHelper().authRequest('POST', '/envelope/api/user/login/wechat',{
        code:code,
        app:'camproz'
    }).then(function(data){
        localStorage.user = JSON.stringify(data.user);
        theUser = data.user;
        $('#nickname-span').text(theUser.nickname);
        $('#nickname-span').show();
        return true;

    }).then(function(){
        if (senderId && senderId != '123') {
            return httpHelper().authRequest('POST', '/envelope/api/collect', {
                sender:senderId,
                me:theUser._id
            }).then(function(collect){
                alert("已收藏 id:"+collect._id);
                //window.location.reload();
            });
        }else{
            return true;
        }
        
    }).fail(function(error){
        alert("Server Error" + JSON.stringify(error));
    });
}

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

    var ms = new Date().getMilliseconds();
    var logoIndex = ms % theThemeConfig.logoCandidates.length;

    httpHelper().authRequest("POST", '/envelope/api/card/create', {
        theme:theThemes[theThemeIndex]._id,
        themeConfig:theThemeConfig._id,
        sender:theUser._id,
        textIndex:theTextIndex,
        logoIndex:logoIndex
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

function getQueryString(){
    // This function is anonymous, is executed immediately and 
    // the return value is assigned to QueryString!
    var query_string = {};
    var query = window.location.href.split('?')[1];
    if (query !== undefined) {
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            // If first entry with this name
            if (typeof query_string[pair[0]] === "undefined") {
                query_string[pair[0]] = decodeURIComponent(pair[1]);
                // If second entry with this name
            } else if (typeof query_string[pair[0]] === "string") {
                var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
                query_string[pair[0]] = arr;
                // If third or later entry with this name
            } else {
                query_string[pair[0]].push(decodeURIComponent(pair[1]));
            }
        } 
    } 

    return query_string;
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