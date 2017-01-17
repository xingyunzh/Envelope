
var theUser = localStorage.user ? JSON.parse(localStorage.user) : null;

$(function(){
    getCollection();
});

function getCollection(){
    if(!!theUser){
        httpHelper().authRequest('GET', '/envelope/api/collect/cards/'+theUser._id).then(function(collects){
            $('#count-span').text(""+collects.length);

            _.forEach(collects, function(collect){
                $('#collects-list-div').append('<a class="list-group-item" href="/envelope/api/card/view/id/'+collect.card._id+'"> <i>From: </i>'+collect.card.sender.nickname+'</a>');
            });

        }).fail(function(error){
            alert("Server Error:"+JSON.stringify(error));
        });
    }else{
        window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxd9afdfa36e78cc2c&redirect_uri=' 
        + encodeURIComponent('http://www.xingyunzh.com/envelope/myhome.html')
        + '&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect';
    }
}