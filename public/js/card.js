/**
 * Created by brillwill on 2016/12/29.
 */


$(function(){
    $("#ev-card-text-id").text(theSpecificSenderData.theCardText);

    $('#sprite-img').attr('style', theSpecificSenderData.theCardTheme.spriteCSS);
    $('#master-img').attr('src', theSpecificSenderData.theCardTheme.imageURL);
    $('.signed-name').text(theSpecificSenderData.theCardSender.nickname);
    $('.signed-name').attr('style', theSpecificSenderData.theCardTheme.nicknameCSS);
    $('#userIcon-img').attr('src', theSpecificSenderData.theCardSender.headImgUrl);
    $('#userIcon-img').attr('style', theSpecificSenderData.theCardTheme.headiconCSS);
    
    updateCount();
});

function updateCount(){
    httpHelper().request("GET", "/envelope/api/collect/count/" + theSpecificSenderData.theCardSender._id)
        .then(function(count){
        $('#count-span').text(""+count);
            $('#sprite-img').attr('src', "http://envelope.oss-cn-shanghai.aliyuncs.com/chicken.jpg");
    }).fail(function(error){
        alert("Server Error" + JSON.stringify(error));
    });
}