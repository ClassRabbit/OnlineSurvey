$(function() {
  var contentCnt = 0;           //현재 설문 항목 수
  var contents;


  var surveyId = $('#surveyId').val();
  console.log(surveyId);
  if(surveyId) {
    $('#main').addClass('loading');
    console.log("inhere");
    $.ajax({
      type: 'POST',
      url: '/survey/editing',
      dataType: 'json',
      data: {
        surveyId: surveyId,
      },
      success: function(survey) {
        console.log("complete");
        $('#surveyTitle').val(survey.title);
        if(survey.deadline){
          $('#surveyDeadline').val(moment(survey.deadline).format('YYYY-MM-DD'));
        }
        $('#surveyComment').val(survey.comment);
        var contents = JSON.parse(survey.contents);
        for(i in contents) {
          $('.contentArea').append($('#contentTemplate').html());
          $('.content:eq(' + contentCnt + ')').addClass('active');
          $('.content:eq(' + contentCnt + ')').find('.contentNum').append((contentCnt+1));
          $('.content:eq(' + contentCnt + ')').find('.contentNum').append($('#contentDelAreaTemplate').html());
          if(contents[i].necessary){
            $('.content:eq(' + contentCnt + ')').find('.contentNecessary').prop('checked',true);
          }
          $('.content:eq(' + contentCnt + ')').find('.contentTitle').val(contents[i].title);
          $('.content:eq(' + contentCnt + ')').find('.contentComment').val(contents[i].comment);
          $('.content:eq(' + contentCnt + ')').find('.contentType').val(contents[i].type);
          switch(contents[i].type) {
            case '0':
              $('.content:eq(' + contentCnt + ')').find('.contentValue').append($('#objectiveTemplate').html());
              if(contents[i].objMultiValue) {
                $('.content:eq(' + contentCnt + ')').find('.objMultiValue').prop('checked',true);
              }
              for(j in contents[i].optValues) {
                if(j==0) {
                  $('.content:eq(' + contentCnt + ')').find('.objBtnArea').remove();
                  $('.content:eq(' + contentCnt + ')').find('.objOptValue').val(contents[i].optValues[j]);
                }
                else {
                  $('.content:eq(' + contentCnt + ')').find('.objBtnArea').remove();
                  $('.content:eq(' + contentCnt + ')').find('.contentValue').append($('#objOptTemplate').html());
                  $('.content:eq(' + contentCnt + ')').find('.objOptValue:last').val(contents[i].optValues[j]);
                }
              }
              if(contents[i].etcValue) {
                $('.content:eq(' + contentCnt + ')').find('.contentValue').append($('#objEtcTemplate').html());
                $('.content:eq(' + contentCnt + ')').find('.contentValue').append($('#objBtnAreaTemplate_2').html());
              }
              else {
                $('.content:eq(' + contentCnt + ')').find('.contentValue').append($('#objBtnAreaTemplate_1').html());
              }
              break;
            case '1':
              $('.content:eq(' + contentCnt + ')').find('.contentValue').append($('#subjectiveTemplate').html());
              break;
            case '2':
              $('.content:eq(' + contentCnt + ')').find('.contentValue').append($('#longSubjectiveTemplate').html());
              break;
            case '3':
              $('.content:eq(' + contentCnt + ')').find('.contentValue').append($('#dateTemplate').html());
              if(contents[i].dateTimeValue) {
                  $('.content:eq(' + contentCnt + ')').find('.date').empty();
                  $('.content:eq(' + contentCnt + ')').find('.date').append('<input type="datetime-local" name="dateTimeValue" class="dateTimeValue form-control" disabled>');
                  $('.content:eq(' + contentCnt + ')').find('.dateTimeValue').prop('checked',true);
              }
              break;
            case '4':
              $('.content:eq(' + contentCnt + ')').find('.contentValue').append($('#scoreTemplate').html());
              break;
          }
          contentCnt++;
        }
        //console.log(contents.length);
        $('#main').removeClass('loading');
        console.log(survey);
      },
      complete: function() {

      }
    });
  }



  $(document).on("click",".surveyFin", function(){

    $('#main').addClass('loading');

    var surveyId = $('#surveyId').val();
    var surveyTitle;
    var surveyDeadline;
    var surveyComment;
    var contents = [];
    var content;

    var baseValue = $('form:eq(0)').serializeArray();         //첫번째 폼은 무조건 base값들
    for(i in baseValue) {
      switch(baseValue[i].name) {
        case 'surveyTitle':
          surveyTitle = baseValue[i].value;
          break;
        case 'surveyDeadline':
          surveyDeadline = baseValue[i].value;
          break;
        case 'surveyComment':
          surveyComment = baseValue[i].value;
          break;
      }
    }

    $('form:gt(0)').each(function (index, item){        //두번쨰 값부터는 content들
      var contentValue = $(item).serializeArray();
      content = new Object();
      for(i in contentValue) {
        switch(contentValue[i].name) {
          case 'contentTitle':
            content.title = contentValue[i].value;
            break;
          case 'contentNecessary':
            content.necessary = true;
            break;
          case 'contentComment':
            content.comment = contentValue[i].value;
            break;
          case 'contentType':
            content.type = contentValue[i].value;
            if(contentValue[i].value == 0) {
              content.optValues = [];
            }
            break;
          case 'objMultiValue':
            content.objMultiValue = true;
            break;
          case 'objOptValue':
            content.optValues.push(contentValue[i].value);
            break;
          case 'objEtcValue':
            content.etcValue = true;
          case 'dateTimeValue':
            content.dateTimeValue = true;
        }
      }
      contents.push(content);
    });

    $.ajax({
      type: 'POST',
      url: '/survey/new',
      dataType: 'json',
      data: {
        surveyId: surveyId,
        surveyTitle: surveyTitle,
        surveyDeadline: surveyDeadline,
        surveyComment: surveyComment,
        contents: JSON.stringify(contents)
      },
      success: function(data) {
        $('#main').removeClass('loading');
        window.location.replace('/');

      },
      complete: function() {

      }
    });
  });


  $(document).on("click",".surveySave", function(){

    $('#main').addClass('loading');

    var surveyId = $('#surveyId').val();
    var surveyTitle;
    var surveyDeadline;
    var surveyComment;
    var contents = [];
    var content;

    var baseValue = $('form:eq(0)').serializeArray();         //첫번째 폼은 무조건 base값들
    for(i in baseValue) {
      switch(baseValue[i].name) {
        case 'surveyTitle':
          surveyTitle = baseValue[i].value;
          break;
        case 'surveyDeadline':
          surveyDeadline = baseValue[i].value;
          break;
        case 'surveyComment':
          surveyComment = baseValue[i].value;
          break;
      }
    }

    $('form:gt(0)').each(function (index, item){        //두번쨰 값부터는 content들
      var contentValue = $(item).serializeArray();
      content = new Object();
      for(i in contentValue) {
        switch(contentValue[i].name) {
          case 'contentTitle':
            content.title = contentValue[i].value;
            break;
          case 'contentNecessary':
            content.necessary = true;
            break;
          case 'contentComment':
            content.comment = contentValue[i].value;
            break;
          case 'contentType':
            content.type = contentValue[i].value;
            console.log('is contentValue? = ' + contentValue[i].value);
            if(contentValue[i].value == 0) {
              content.optValues = [];
            }
            break;
          case 'objMultiValue':
            content.objMultiValue = true;
            break;
          case 'objOptValue':
            content.optValues.push(contentValue[i].value);
            break;
          case 'objEtcValue':
            content.etcValue = true;
          case 'dateTimeValue':
            content.dateTimeValue = true;
        }
      }
      contents.push(content);
    });

    $.ajax({
      type: 'PUT',
      url: '/survey/new',
      dataType: 'json',
      data: {
        surveyId: surveyId,
        surveyTitle: surveyTitle,
        surveyDeadline: surveyDeadline,
        surveyComment: surveyComment,
        contents: JSON.stringify(contents)
      },
      success: function(data) {
        console.log(data);
        $('#surveyId').val(data._id);
        $('#main').removeClass('loading');
      },
      complete: function() {

      }
    });


  });

  $(document).on("click",".contentAdd", function(){

    //contents = $('form.content.active').serializeArray();

    //$('form.content.active').removeClass('active');
		$('.contentArea').append($('#contentTemplate').html());
    $('.content:eq(' + contentCnt + ')').addClass('active');
    $('.content:eq(' + contentCnt + ')').find('.contentNum').append((contentCnt+1));
    //$('.content:eq(' + contentCnt + ')').find('.contentNum').append('<h4>' + (contentCnt+1) + '</h4>');
    //$('.content:eq(' + contentCnt + ')').find('.contentNum').append('<div class="contentDelArea"><a class="contentDel "><span class="glyphicon glyphicon-remove"></span></a></div>');
    $('.content:eq(' + contentCnt + ')').find('.contentNum').append($('#contentDelAreaTemplate').html());
    $('.content:eq(' + contentCnt + ')').find('.contentValue').append($('#objectiveTemplate').html());
    contentCnt++;
	});

  $(document).on("click", ".contentDel" , function() {
    var thisNum = $(this).parents('.content').find('.contentNum').text();
    thisNum--;
    $('.content').each(function (index, item){
      if(index > thisNum) {
        $(item).find('.contentNum').empty();
        $(item).find('.contentNum').append(index);
        //$(item).find('.contentNum').append('<div class="contentDelArea"><a class="contentDel "><span class="glyphicon glyphicon-remove"></span></a></div>');
        $('.content:eq(' + contentCnt + ')').find('.contentNum').append($('#contentDelAreaTemplate').html());
      }
    });
    $(this).parents('.content').remove();
    contentCnt--;
  });

  $(document).on("click", ".objOptCreate" , function() {
    var optCnt = $(this).parents('.contentValue').find('.objOpt').length;
    if(optCnt == 10) {
      return;
    }
		$(this).parents('.content').find('.contentValue').append($('#objOptTemplate').html());
    optCnt++;
    //$(this).parents('.contentValue').find('.objOptValue:last').attr('id','objOptValue_'+(optCnt-1));
    //$(this).parents('.contentValue').find('.objOptValue:last').attr('name','objOptValue_'+(optCnt-1));
		//console.log($(this).parents('.Content').find('.objectiveEtc').length);
		if($(this).parents('.content').find('.objEtc').length == 0) {
      $(this).parents('.content').find('.contentValue').append($('#objBtnAreaTemplate_1').html());
		} else {
		  $(this).parents('.content').find('.objEtc').remove();
		  $(this).parents('.content').find('.contentValue').append($('#objEtcTemplate').html());
      $(this).parents('.content').find('.contentValue').append($('#objBtnAreaTemplate_2').html());
		}
		$(this).parent().remove();
	});

  $(document).on("click", ".objOptDel" , function() {
    $(this).parents('.objOpt').remove();
    // var textValues = [];
    // var thisContentValue = $(this).parents('.contentValue');
    // $(this).parents('.objOpt').remove();
    // thisContentValue.find('.objOpt:gt(0)').each(function (index, item){
    //   textValues.push($(item).find('.objOptValue').val());
    //   $(item).remove();
    // });
    // thisContentValue.find('.objBtnArea').remove();
    // for(idx in textValues){
    //   thisContentValue.append($('#objOptTemplate').html());
    //   thisContentValue.find('.objOptValue:last').val(textValues[idx]);
    //   thisContentValue.find('.objOptValue:last').attr('id','objOptValue_'+(1+parseInt(idx)));
    //   thisContentValue.find('.objOptValue:last').attr('name','objOptValue_'+(1+parseInt(idx)));
    // }
    // if(thisContentValue.find('.objEtc').length != 0) {
    //   thisContentValue.find('.objEtc').remove();
    //   thisContentValue.append($('#objEtcTemplate').html());
    //   thisContentValue.append($('#objBtnAreaTemplate_2').html());
    // } else {
    //   thisContentValue.append($('#objBtnAreaTemplate_1').html());
    // }
	});

  $(document).on("click", ".objEtcCreate" , function() {
		$(this).parents('.content').find('.contentValue').append($('#objEtcTemplate').html());
		$(this).parents('.content').find('.contentValue').append($('#objBtnAreaTemplate_2').html());
		$(this).parents('.objBtnArea').remove();
	});

  $(document).on("click", ".objEtcDel" , function() {
		$(this).parents('.contentValue').find('.objBtnArea').remove();
		$(this).parents('.contentValue').append($('#objBtnAreaTemplate_1').html());
		$(this).parents('.objEtc').remove();
	});

  $(document).on('click','input:checkbox[name="dateTimeValue"]', function(){
    if(this.checked) {
      $(this).parents('.contentValue').find('.date').empty();
      $(this).parents('.contentValue').find('.date').append('<input type="datetime-local" name="dateTimeValue" class="dateTimeValue form-control" disabled>');
    }
    else {
      $(this).parents('.contentValue').find('.date').empty();
      $(this).parents('.contentValue').find('.date').append('<input type="date" name="dateValue" class="dateValue form-control" disabled>');
    }
  });

  $(document).on("change", ".contentType" , function() {
		$(this).parents('.content').find('.contentValue').empty();
    console.log($(this).val());
		switch(	$(this).val())
		{
			case '0':
				$(this).parents('.content').find('.contentValue').append($('#objectiveTemplate').html());
				break;
			case '1':
				$(this).parents('.content').find('.contentValue').append($('#subjectiveTemplate').html());
				break;
      case '2':
  			$(this).parents('.content').find('.contentValue').append($('#longSubjectiveTemplate').html());
  			break;
      case '3':
    		$(this).parents('.content').find('.contentValue').append($('#dateTemplate').html());
    		break;
      // case '4':
      // 	$(this).parents('.content').find('.contentValue').append($('#dateTimeTemplate').html());
      // 	break;
      case '4':
        $(this).parents('.content').find('.contentValue').append($('#scoreTemplate').html());
        console.log($(this).parents('.content').find('.scoreValue').length);
        break;
		}

  });
});
