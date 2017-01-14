/**
 * Created by brillwill on 2016/12/29.
 */
var theUser = localStorage.user ? JSON.parse(localStorage.user) : null;

$(function(){

    wechatInit();

    if(!theSpecificSenderData.theCard){
        alert("此人卡片未创建!");
        return;
    }

    var textIndex = theSpecificSenderData.theCard.textIndex;
    $("#ev-card-text-id").text(theSpecificSenderData.theCard.themeConfig.textCandidates[textIndex]);

    $('#master-img').attr('src', theSpecificSenderData.theCard.theme.imageURL);
    $('.signed-name').text(theSpecificSenderData.theCard.sender.nickname);
    var userImage = theSpecificSenderData.theCard.sender.headImgUrl;
    if(!userImage){
        userImage="http://envelope.oss-cn-shanghai.aliyuncs.com/duola.jpg";
    }
    $('#userIcon-img').attr('src', userImage);
    $('.wx_pic>img').attr('src', theSpecificSenderData.theCard.themeConfig.logoCandidates[theSpecificSenderData.theCard.logoIndex]);

    if(theUser){
        if(theUser._id == theSpecificSenderData.theCard.sender._id){
            //view my own card
            $('.card-status-bar').hide();
        }
        else {
            getIfCollected().then(function(collected){
                if(collected){
                    $('.card-status-bar span').text("您已经收藏过此卡！");
                }
                else {
                    doCollectCard();
                }
            });
        }
    }
    else {
        $('.card-status-bar').hide();
    }

    updateCount();
});

function wechatInit(){
    var card = theSpecificSenderData.theCard;

    wx.config({
        debug:false,
        appId:wechatConfig.appId,
        timestamp:wechatConfig.timestamp,
        nonceStr:wechatConfig.nonceStr,
        signature:wechatConfig.signature,
        jsApiList:[
            'onMenuShareTimeline',
            'onMenuShareAppMessage'
        ]
    });

    wx.ready(function(){
        console.log('ready');
        wx.onMenuShareTimeline({
            title:card.sender.nickname + '祝:' + card.theme.title,
            link:window.location.href,
            imgUrl:card.themeConfig.logoCandidates[card.logoIndex],
            success:function(){
                console.log('分享成功');
            },cancel:function(){
                console.log('取消分享');
            }
        });

        wx.onMenuShareAppMessage({
            title:card.sender.nickname + '祝:' + card.theme.title,
            desc:card.themeConfig.textCandidates[card.textIndex],
            link:window.location.href,
            imgUrl:card.themeConfig.logoCandidates[card.logoIndex],
            // type:'link',
            // dataUrl:null,
            success:function(){
                console.log('分享成功');
            },cancel:function(){
                console.log('取消分享');
            }
        });
    });

    wx.error(function(res){
        console.log('error',res);
    });

}

function updateCount() {
    httpHelper().authRequest("GET", "/envelope/api/collect/count/" + theSpecificSenderData.theCard.sender._id)
        .then(function (count) {
            $('#count-span').text("" + count);
//            $('#sprite-img').attr('src', "http://envelope.oss-cn-shanghai.aliyuncs.com/chicken.jpg");
        }).fail(function (error) {
        alert("Server Error" + JSON.stringify(error));
    });
}

function getIfCollected() {
    return httpHelper().authRequest('GET', '/envelope/api/collect/exist?me='+theUser._id+'&card='+theSpecificSenderData.theCard._id);
}

function handleCollectCard(){
    if(theUser){
        if(theSpecificSenderData.theCard.sender._id == theUser._id){
            window.location.href = '/envelope/myhome.html';
        }
        else {
            doCollectCard();
        }
    }
    else {
        window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxd9afdfa36e78cc2c&redirect_uri=' 
        + encodeURIComponent('http://www.xingyunzh.com/envelope/myhome.html')
        + '&response_type=code&scope=snsapi_userinfo&state='
        +  theSpecificSenderData.theCard.sender._id
        + '#wechat_redirect';
    }
}

function doCollectCard(){
    httpHelper().authRequest('POST', '/envelope/api/collect', {
        sender:theSpecificSenderData.theCard.sender._id,
        me:theUser._id
    }).then(function(collect){
        alert("收藏成功！");
        $('.card-status-bar').show();
        $('.card-status-bar span').text("成功收藏此卡！");
    }).fail(function(error){
        alert("Server Error" + JSON.stringify(error));
    });
}