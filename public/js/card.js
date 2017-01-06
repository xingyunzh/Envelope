/**
 * Created by brillwill on 2016/12/29.
 */
var theUser = localStorage.user ? JSON.parse(localStorage.user) : null;

$(function(){
    $("#ev-card-text-id").text(theSpecificSenderData.theCard.text);

    $('#sprite-img').attr('style', theSpecificSenderData.theCard.theme.spriteCSS);
    $('#master-img').attr('src', theSpecificSenderData.theCard.theme.imageURL);
    $('.signed-name').text(theSpecificSenderData.theCard.sender.nickname);
    $('.signed-name').attr('style', theSpecificSenderData.theCard.theme.nicknameCSS);
    $('#userIcon-img').attr('src', theSpecificSenderData.theCard.sender.headImgUrl);
    $('#userIcon-img').attr('style', theSpecificSenderData.theCard.theme.headiconCSS);

    if(theUser){
        // $('#nickname-span').text(theUser.nickname);
        if(theUser._id == theSpecificSenderData.theCard.sender._id){
            $('.card-collected').hide();
            $('.collect-card').hide();
        }
        else {
            getIfCollected().then(function(collected){
                if(collected){
                    $('.card-collected').show();
                    $('.collect-card').hide();
                }
                else {
                    $('.card-collected').hide();
                    $('.collect-card').show();
                }
            })
        }
    }
    else {
        $('#nickname-span').text("");
        $('.card-collected').hide();
        $('.collect-card').show();
        $('.collect-card').text("登录收集");
    }

    updateCount();
});

function updateCount() {
    httpHelper().authRequest("GET", "/envelope/api/collect/count/" + theSpecificSenderData.theCard.sender._id)
        .then(function (count) {
            $('#count-span').text("" + count);
            $('#sprite-img').attr('src', "http://envelope.oss-cn-shanghai.aliyuncs.com/chicken.jpg");
        }).fail(function (error) {
        alert("Server Error" + JSON.stringify(error));
    });
}

function getIfCollected() {
    return httpHelper().authRequest('GET', '/envelope/api/collect/exist?me='+theUser._id+'&card='+theSpecificSenderData.theCard._id);
}

function handleCollectCard(){
    if(theUser){
        httpHelper().authRequest('POST', '/envelope/api/collect', {
            sender:theSpecificSenderData.theCard.sender._id,
            me:theUser._id
        }).then(function(collect){
            alert("已收藏 id:"+collect._id);
            window.location.reload();
        }).fail(function(error){
            alert("Server Error" + JSON.stringify(error));
        });
    }
    else {
        window.location.href = '/envelope/login.html';
    }
}