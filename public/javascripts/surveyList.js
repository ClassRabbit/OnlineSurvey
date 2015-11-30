$(function (){
  $('.deadlineArea').each(function() {
    var nowDate = new Date();
    var deadline = new Date($(this).text());
    //console.log(moment(deadline).format('YYYY-MM-DD'));
    if(nowDate > deadline) {
      $(this).empty();
      $(this).append('<b class="isDead"> (마감)</b>')
      $(this).parents('.list-group-item').find('.spanRight').remove();
    }
    else {
      $(this).text(' ( ~ ' + moment(deadline).format('YYYY-MM-DD') + ')');
    }

  });

  $(".surveyDeleteArea").on('click', function (event) {
    $('#main').addClass('loading');
    var surveyId = $(this).parents('.list-group-item').find('.surveyIdArea').val();
    $.ajax({
      type: 'DELETE',
      url: '/survey/new',
      dataType: 'json',
      data: {
        surveyId: surveyId
      },
      success: function(result) {
        if(result) {
          window.location.replace('/survey/complete');
        }
      },
      complete: function() {
        $('#main').removeClass('loading');
      }
    });
  });

  $(".sendMail").on('click', function (event) {
    if(!($.trim($(this).parents('.modal-content').find('.email').val()))) {
      return alert('메일 주소를 입력하셔야 합니다.');
    }
    $('#main').addClass('loading');
    var surveyTitle = $(this).parents('.modal-content').find('.modal-title').text();
    var email = $(this).parents('.modal-content').find('.email').val();
    var surveyId = $(this).parents('.modal-content').find('.surveyId').val();
    var button = $(this);
    $.ajax({
      type: 'POST',
      url: '/mail',
      dataType: 'json',
      data: {
        email: email,
        surveyTitle: surveyTitle,
        surveyId: surveyId
      },
      success: function(result) {
        if(result) {
          button.parents('.modal-footer').find('.mailResultArea').append('<div class="mailResult"><b>메일이 성공적으로 보내졌습니다!</b></div>');
          button.remove();
        }
      },
      complete: function() {
        $('#main').removeClass('loading');
      }
    });
  });
});
