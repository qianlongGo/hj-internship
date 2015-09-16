/**
 * Created by 谦龙 on 2015/9/14.
 */
$(function () {
     var aSec=$('.nav').find('a');
     var aUl=$('.nav').find('ul');
    for(var i=0;i<aSec.elements.length;i++){
        $(aSec.elements[i]).attr("index",i);
        $(aUl.elements[i]).attr("index",i);
    }
    aSec.on('mouseover', function () {
        var index=parseInt($(this).attr('index'))+1;
        $(this).css({"top":"-10px"});
        aUl.eq(index).addClass('toRotate');
    });
    aSec.on('mouseout', function () {
        var index=parseInt($(this).attr('index'))+1;
        $(this).css({"top":"0px"});
        aUl.eq(index).removeClass('toRotate')
    })

    $('.box').animate({
        "top":"150",
        "left":"100"
    })
})
