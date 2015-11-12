$(function() {
  var contentCnt = 0;           //현재 설문 항목 수
  var contents;
//contentScript
  $(document).on("click",".surveyFin", function(){
    formValues = $('form').serializeArray();

    // for(i in formValues) {
    //   if(formValues[i].name == 'serveyTitle') {
    //     console.log(formValues[i]);
    //   }
    //
    // }

    var surveyTitle;
    var surveyComment;
    var contents = [];
    var content;
    var beforeIsOpt = false;
    // if(content)  {
    //   console.log("true");
    // } else {
    //   console.log("false");
    // }

    for(i in formValues) {
      switch(formValues[i].name) {
        case 'surveyTitle':
          surveyTitle = formValues[i].value;
          break;
        case 'surveyComment':
          surveyComment = formValues[i].value;
          break;
        case 'contentTitle':
          if(content) {
            contents.push(content);
          }
          content = new Object();
          content.title = formValues[i].value;
          break;
        case 'contentNecessary':
          content.necessary = true;
          break;
        case 'contentComment':
          content.comment = formValues[i].value;
          break;
        case 'contentType':
          content.type = formValues[i].value;
          if(formValues[i].value == 0) {
            content.optValues = [];
          }
          break;
        case 'objMultiValue':
          content.objMultiValue = true;
          break;
        case 'objOptValue':
          content.optValues.push(formValues[i].value);
          break;
        case 'objEtcValue':
          content.etcValue = true;
      }
    }
    if(content) {
      contents.push(content);
    }

    for(i in contents) {
      console.log(contents[i].optValues.toString());
    }


  });

  $(document).on("click",".contentAdd", function(){

    contents = $('form.content.active').serializeArray();

    $('form.content.active').removeClass('active');
		$('.contentArea').append($('#contentTemplate').html());
    $('.content:eq(' + contentCnt + ')').addClass('active');
    $('.content:eq(' + contentCnt + ')').find('.contentNum').append(contentCnt+1);
    contentCnt++;
	});

  $(document).on("click", ".contentDel" , function() {
    var thisNum = $(this).parents('.content').find('.contentNum').text();
    thisNum--;
    $('.content').each(function (index, item){
      if(index > thisNum) {
        $(item).find('.contentNum').empty();
        $(item).find('.contentNum').append(index);
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
		$(this).parent().remove();
	});

  $(document).on("click", ".objEtcDel" , function() {
		$(this).parents('.contentValue').find('.objBtnArea').remove();
		$(this).parents('.contentValue').append($('#objBtnAreaTemplate_1').html());
		$(this).parents('.objEtc').remove();
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
        $(this).parents('.content').find('.subjectiveValue').attr('disabled',true);
				break;
      case '2':
  			$(this).parents('.content').find('.contentValue').append($('#longSubjectiveTemplate').html());
        $(this).parents('.content').find('.longSubjectiveValue').attr('disabled',true);
  			break;
      case '3':
    		$(this).parents('.content').find('.contentValue').append($('#dateTemplate').html());
        $(this).parents('.content').find('.dateValue').attr('disabled',true);
    		break;
      case '4':
      	$(this).parents('.content').find('.contentValue').append($('#dateTimeTemplate').html());
        $(this).parents('.content').find('.dateTimeValue').attr('disabled',true);
      	break;
      case '5':
        $(this).parents('.content').find('.contentValue').append($('#scoreTemplate').html());
        console.log($(this).parents('.content').find('.scoreValue').length);
        $(this).parents('.content').find('.scoreValue').attr('disabled',true);
        break;
		}

  });
});
