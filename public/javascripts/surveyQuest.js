$(function() {

  var deadline = $('#deadline').text();

  if(deadline !== '미지정') {
    if(new Date(deadline) < $.now()) {
      $('#main').addClass('loading');
      $('#spinnerImg').remove();
      $('#spinnerText').empty();
      $('#spinnerText').append('<h3>죄송합니다. 만기된 설문으로 더 이상 설문에 응하실 수 없습니다.</h3> <p>');
      $('#spinnerText').append('<button id="windowCloseBtn" class="btn btn-danger">뒤로 가기</button>');
    }
  }

  $(document).on('click','#windowCloseBtn', function(){
    history.go(-1)();
  });

  $('form').each(function(index, item) {
    if($(item).find('.necessary').length) {
      $(item).find('input').prop('required', true);
      $(item).find('textarea').prop('required', true);
    }
  });

  $(document).on('click','input:checkbox[name="optMulti"]', function(){
    if($(this).hasClass('optMultiEtc')) {                           //클릭한게 기타일때
      if($(this).parents('form').find('.optMultiEtcText').length == 0) {   //기타 텍스트가 없으면
        $(this).parents('form').find('.panel-body').append('<input type="text" name="optMultiEtcText" id="optMultiEtcText" class="optMultiEtcText">');
        $(this).parents('form').find('.optMulti').attr('checked', false);
      }
      else {
        $(this).parents('form').find('.optMultiEtcText').remove();
      }
    }
    else {
      if($(this).parents('form').find('.optMultiEtcText').length != 0) {
        $(this).parents('form').find('.optMultiEtcText').remove();
        $(this).parents('form').find('.optMultiEtc').attr('checked', false);
      }
    }
  });

  $(document).on('click','input:radio[name="opt"]', function(){
    if($(this).hasClass('optEtc')) {                           //클릭한게 기타일때
      if($(this).parents('form').find('.optEtcText').length == 0) {   //기타 텍스트가 없으면
        $(this).parents('form').find('.panel-body').append('<input type="text" name="optEtcText" id="optEtcText" class="optEtcText">');
      }
    }
    else {
      if($(this).parents('form').find('.optEtcText').length != 0) {
        $(this).parents('form').find('.optEtcText').remove();
      }
    }
  });


  console.log($(this).find('[name="scoreValue"]').length);
  $(document).on('click','.questFin', function(){
    if($('[name="email"]').val() == "") {
      alert("이메일을 입력하세요!");
      return;
    }
    var isEmpty;
    $('form').each(function(){
      //console.log($(this).find('[name="longSubjective"]').val());
      isEmpty = false;
      if($(this).find('.necessary').length != 0) {
        isEmpty = true;
        if($(this).find('[name="opt"]').length != 0) {
          $(this).find('[name="opt"]').each(function() {
            if($(this).prop('checked')){
              if(isEmpty) {
                isEmpty = false;
              }
            }
          });
        }
        else if ($(this).find('[name="optMulti"]').length != 0) {
          $(this).find('[name="optMulti"]').each(function() {
            if($(this).prop('checked')){
              if(isEmpty) {
                isEmpty = false;
              }
            }
          });
        }
        else if ($(this).find('[name="subjective"]').length != 0) {
          if($(this).find('[name="subjective"]').val() != "") {
            if(isEmpty) {
              isEmpty = false;
            }
          }
        }
        else if ($(this).find('[name="longSubjective"]').length != 0) {
          if($(this).find('[name="longSubjective"]').val() != "") {
            if(isEmpty) {
              isEmpty = false;
            }
          }
        }
        else if ($(this).find('[name="date"]').length != 0) {
          if($(this).find('[name="date"]').val() != "") {
            if(isEmpty) {
              isEmpty = false;
            }
          }
        }
        else if ($(this).find('[name="dateTime"]').length != 0) {
          if($(this).find('[name="dateTime"]').val() != "") {
            if(isEmpty) {
              isEmpty = false;
            }
          }
        }
        else if ($(this).find('[name="scoreValue"]').length != 0) {
          $(this).find('[name="scoreValue"]').each(function() {
            console.log('this is ' + this);
            console.log('this checked : ' + this.checked);
            console.log('now isEmpty value : ' + isEmpty);
            if(this.checked){

              isEmpty = false;
              return false;
            }
          });
        }
        if(isEmpty) {
          alert("필수를 다 입력해주세요.");
          return false;
        }
      }
    });
    if(isEmpty) {
      return;
    }

    $('#main').addClass('loading');
    // - db설계
    // 이메일
    // survey명
    // 몇번문제, 답  or 몇번문제, 기타, 텍스트

    var email = $('input[name="email"]').val();
    var surveyId = $('input[name="surveyId"]').val();
    var results = [];
    $('form').each(function(index){
      var type;
      console.log($(this).html());
      if ($(this).find('.opt').length != 0 || $(this).find('.optMulti').length != 0) {
        type = 0;
      }
      else if($(this).find('.subjective').length != 0) {
        type = 1;
      }
      else if($(this).find('.longSubjective').length != 0) {
        type = 2;
      }
      else if($(this).find('.date').length != 0 || $(this).find('.dateTime').length != 0) {
        type = 3;
      }
      // else if($(this).find('.dateTime').length != 0) {
      //   type = 4;
      // }
      else if($(this).find('.scoreValue').length != 0) {
        type = 4;
      }

      results.push({
        index: index,
        type: type,
        answer: $(this).serializeArray()
      });
    }); //form.each

    $.ajax({
      type: 'POST',
      url: '/quest/new',
      dataType: 'json',
      data: {
        surveyId: surveyId,
        email: email,
        results: results
      },
      success: function(result) {
        //$('#main').removeClass('loading');
        if(result){
          console.log('complete');
          $('#spinnerImg').remove();
          $('#spinnerText').empty();
          $('#spinnerText').append('<h3>설문이 완료되었습니다. 감사합니다.</h3> <p>');
          $('#spinnerText').append('<button id="windowCloseBtn" class="btn btn-success">뒤로 가기</button>');
        }
        else {
          console.log('err');
          $('#spinnerImg').remove();
          $('#spinnerText').empty();
          $('#spinnerText').append('<h3>이메일이 중복되었습니다. 설문을 더이상 하실 수 없습니다.</h3> <p>');
          $('#spinnerText').append('<button id="windowCloseBtn" class="btn btn-danger">뒤로 가기</button>');
        }


      },
      complete: function() {
        $('#main').addClass('end');
      }
    });

  });
});
