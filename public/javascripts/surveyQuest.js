$(function() {
  $('form').each(function(index, item) {
    if($(item).find('.necessary').length) {
      $(item).find('input').prop('required', true);
      $(item).find('textarea').prop('required', true);
    }
  });

  $(document).on('click','input:checkbox[name="optMulti"]', function(){
    if($(this).hasClass('optMultiEtc')) {                           //클릭한게 기타일때
      if($(this).parents('form').find('.optMultiEtcText').length == 0) {   //기타 텍스트가 없으면
        $(this).parents('form').append('<input type="text" name="optMultiEtcText" id="optMultiEtcText" class="optMultiEtcText">');
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
        $(this).parents('form').append('<input type="text" name="optEtcText" id="optEtcText" class="optEtcText">');
      }
    }
    else {
      if($(this).parents('form').find('.optEtcText').length != 0) {
        $(this).parents('form').find('.optEtcText').remove();
      }
    }
  });

  $(document).on('click','.questFin', function(){
    $('form').each(function(){
      var isNotEmpty = false;
      //console.log($(this).find('[name="longSubjective"]').val());
      if($(this).find('.necessary').length != 0) {
        if($(this).find('[name="opt"]').length != 0) {
          $(this).find('[name="opt"]').each(function() {
            if($(this).prop('checked')){
              if(!isNotEmpty) {
                isNotEmpty = true;
              }
            }
          });
        }
        else if ($(this).find('[name="optMulti"]').length != 0) {
          $(this).find('[name="optMulti"]').each(function() {
            if($(this).prop('checked')){
              if(!isNotEmpty) {
                isNotEmpty = true;
              }
            }
          });
        }
        else if ($(this).find('[name="subjective"]').length != 0) {
          if($(this).find('[name="subjective"]').val() != "") {
            if(!isNotEmpty) {
              isNotEmpty = true;
            }
          }
        }
        else if ($(this).find('[name="longSubjective"]').length != 0) {
          if($(this).find('[name="longSubjective"]').val() != "") {
            if(!isNotEmpty) {
              isNotEmpty = true;
            }
          }
        }
        else if ($(this).find('[name="date"]').length != 0) {
          if($(this).find('[name="date"]').val() != "") {
            if(!isNotEmpty) {
              isNotEmpty = true;
            }
          }
        }
        else if ($(this).find('[name="dateTime"]').length != 0) {
          if($(this).find('[name="dateTime"]').val() != "") {
            if(!isNotEmpty) {
              isNotEmpty = true;
            }
          }
        }
        else if ($(this).find('[name="scoreValue"]').length != 0) {
          $(this).find('[name="scoreValue"]').each(function() {
            if($(this).prop('checked')){
              if(!isNotEmpty) {
                isNotEmpty = true;
              }
            }
          });
        }
        if(!isNotEmpty) {
          alert("필수를 다 입력해주세요.")
          return false;
        }
      }

    });


    // - db설계
    // 이메일
    // survey명
    // 몇번문제, 답  or 몇번문제, 기타, 텍스트

    var email = $('input[name="email"]').val();
    var surveyId = $('input[name="surveyId"]').val();
    var quests = [];

    $('form').each(function(index, item){
      var type;
      if ($(item).find('.opt') || $(item).find('.optMulti')) {
        type = 0;
      }
      else if($(item).find('.subjective')) {
        type = 1;
      }
      else if($(item).find('.longSubjective')) {
        type = 2;
      }
      else if($(item).find('.date')) {
        type = 3;
      }
      else if($(item).find('.dateTime')) {
        type = 4;
      }
      else if($(item).find('.scoreValue')) {
        type = 5;
      }

      // var test = $(item).serializeArray();
      // for(t in test) {
      //   console.log(index);
      //   console.log(test[t]);
      // }

      quests.push({
        index: index,
        type: type,
        answer: $(item).serializeArray()
      });
    }); //form.each

    $.ajax({
      type: 'POST',
      url: '/quest/new',
      dataType: 'json',
      data: {
        surveyId: surveyId,
        email: email,
        quests: JSON.stringify(quests)
      },
      success: function(result) {
        if(result){
          console.log('complete');
        }
        else {
          console.log('err');
        }
        //$('#main').removeClass('loading');
        //window.location.replace('/main');

      },
      complete: function() {

      }
    });

  });
});



//     $('form').find('input').each(function(){
//     if(!$(this).prop('required')){
//         console.log("NR");
//     } else {
//         console.log("IR");
//     }
// });

    // var test = $('form:eq(0)').serializeArray();
    // for (i in test) {
    //   console.log(test[i]);
    // }
