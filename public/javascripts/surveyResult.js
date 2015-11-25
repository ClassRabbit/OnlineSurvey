$(function() {
  // $('.scoreType1').each(function(){
  //   var cnt = 0;
  //   $(this).find('.opt').each(function() {
  //     console.log($(this).text());
  //   });
  // });

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
    $(this).find('.respondent').text(cnt + '명');
    if(sum/cnt) {
      $(this).find('.average').text((sum/cnt) + '점');
    }
    else {
      $(this).find('.average').text('-');
    }
  });

  $('table').find('tr:gt(0)').each(function() {
    console.log($(this).find('td:first').text());
    var test = $(this).find('td:first');
    console.log(moment(test).format('MMMM Do YYYY, h:mm:ss a'));
  });
  //$('#surveyDeadline').val(moment(survey.deadline).format('YYYY-MM-DD'));

});
