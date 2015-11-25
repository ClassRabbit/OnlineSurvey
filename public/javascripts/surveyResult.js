$(function() {
  $('.scoreType4').each(function(){
    var sum = 0;
    var cnt = 0;
    sum += ($(this).find('.1point').text()*1);
    cnt += parseInt($(this).find('.1point').text());
    sum += ($(this).find('.2point').text()*2);
    cnt += parseInt($(this).find('.2point').text());
    sum += ($(this).find('.3point').text()*3);
    cnt += parseInt($(this).find('.3point').text());
    sum += ($(this).find('.4point').text()*4);
    cnt += parseInt($(this).find('.4point').text());
    sum += ($(this).find('.5point').text()*5);
    cnt += parseInt($(this).find('.5point').text());
    $(this).find('.average').text(sum/cnt);
    console.log(sum);
    console.log(cnt);
  });


});
