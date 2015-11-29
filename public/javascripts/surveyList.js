$(function (){
  $('.deadlineArea').each(function() {
    var nowDate = new Date();
    var deadline = new Date($(this).text());
    //console.log(moment(deadline).format('YYYY-MM-DD'));
    if(nowDate > deadline) {
      $(this).empty();
      $(this).append('<b class="isDead"> (마감)</b>')
    }
    else {
      $(this).text(' ( ~ ' + moment(deadline).format('YYYY-MM-DD') + ')');
    }

  });

  $(".sendMail").on('click', function (event) {
    $('#main').addClass('loading');
  });
});
