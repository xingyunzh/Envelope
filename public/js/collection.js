
$(function(){

});

function getCollection(){
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