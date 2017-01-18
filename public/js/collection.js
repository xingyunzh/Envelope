
var theUser = localStorage.user ? JSON.parse(localStorage.user) : null;

$(function(){
    if(!theUser) {
        window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxd9afdfa36e78cc2c&redirect_uri='
            + encodeURIComponent('http://www.xingyunzh.com/envelope/myhome.html')
            + '&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect';

        return;
    }

    updateCount();
    getCollection();
});


function updateCount() {
    httpHelper().authRequest("GET", "/envelope/api/collect/count/" + theUser._id)
        .then(function (count) {
            $('#collected-number-span').text(count);

            var level = getLevelByCount(count);
            $('.grow-progress-block>img').attr('src', 'http://envelope.oss-cn-shanghai.aliyuncs.com/resource/pet_' + (level + 1) + '.png');

            $('#requiredCardCount').html(getRequiredCardCount(count));

        }).fail(function (error) {
            console.log("Server Error" + JSON.stringify(error));
        });
}

function getCollection() {
    httpHelper().authRequest('GET', '/envelope/api/collect/cards/' + theUser._id + '?limit=10').then(function (collects) {
        var card = $(".card-sender-thumb");

        _.forEach(collects, function (collect, index) {
            if(index > 0){
                card = card.clone();
                $(".collected-cards-area").append(card);
            }
            var image = collect.card.sender.headImgUrl ? collect.card.sender.headImgUrl : "http://envelope.oss-cn-shanghai.aliyuncs.com/duola.jpg";
            $(".user-icon", card).attr("src", image);
            $(".signed-name", card).text(collect.card.sender.nickname);
            $("a", card).attr("href", '/envelope/api/card/view/id/'+collect.card._id);
            $(".collect-create-date", card).text(stamp(new Date(collect.createDate)));
        });

    }).fail(function (error) {
        alert("Server Error:" + JSON.stringify(error));
    });
}

function stamp(date){
    if(date){
       return (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();
    }
    return "";
}
