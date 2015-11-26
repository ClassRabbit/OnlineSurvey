$(function() {
  // $('.scoreType1').each(function(){
  //   var cnt = 0;
  //   $(this).find('.opt').each(function() {
  //     console.log($(this).text());
  //   });
  // });

  $('.scoreType1').each(function(){
    var chart = [];
    var cnt = 0;
    $(this).find('.opt').each(function(){
      chart.push({
        name: $(this).find('.optName').text(),
        value: $(this).find('.optValue').text()
      });
      cnt += parseInt($(this).find('.optValue').text());
    });
    //$(this).append('<table> ');
    //var chartHtml = '<table>';
    $(this).find('.opt').empty();
    for(var i in chart) {
      var percent = Math.round(chart[i].value/cnt*100);
      var width = Math.round((percent/100));
      var name = chart[i].name
      $(this).find('.chartArea').append('<div class="row">');
      $(this).find('.chartArea').append('<div class="col-sm-2">'+ chart[i].name +' : </div>');
      $(this).find('.chartArea').append('<div class="col-sm-10">'+ '<img src="/image/chart.jpg" width="'+percent+'%" height="15px"> '+ chart[i].value +'표(' +  percent +'%)</div>');
      // $(this).append('<tr><td>' + name + '</td><td><img src="/image/chart.jpg" width="'+percent+'%" height="15px">' +  percent + '%</td></tr>');
      $(this).find('.chartArea').append('</div>');
      $(this).find('.chartArea').append('<br>');
    }
    //$(this).append('</table>');



    for(var i in chart) {
      console.log(chart[i]);
    }
  });



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
    $(this).find('.1point').text($(this).find('.1point').text() + '명');
    $(this).find('.2point').text($(this).find('.2point').text() + '명');
    $(this).find('.3point').text($(this).find('.3point').text() + '명');
    $(this).find('.4point').text($(this).find('.4point').text() + '명');
    $(this).find('.5point').text($(this).find('.5point').text() + '명');
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
