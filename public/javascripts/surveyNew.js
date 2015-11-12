$(function() {
  var contentCnt = 0;           //현재 설문 항목 수

//contentScript

  $(document).on("click",".contentAdd", function(){
		contentCnt++;
		$('.contentArea').append($('#contentTemplate').html());
    $('.content:eq(' + (contentCnt-1) + ')').find('.contentNum').append(contentCnt);
    console.log($('.content:eq(' + (contentCnt-1) + ')').find('.contentNum').text());
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
    $(this).parents('.contentValue').find('.objOptValue:last').attr('id','objOptValue_'+(optCnt-1));
    $(this).parents('.contentValue').find('.objOptValue:last').attr('name','objOptValue_'+(optCnt-1));
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
    var textValues = [];
    var thisContentValue = $(this).parents('.contentValue');
    $(this).parents('.objOpt').remove();
    thisContentValue.find('.objOpt:gt(0)').each(function (index, item){
      textValues.push($(item).find('.objOptValue').val());
      $(item).remove();
    });
    thisContentValue.find('.objBtnArea').remove();
    for(idx in textValues){
      thisContentValue.append($('#objOptTemplate').html());
      thisContentValue.find('.objOptValue:last').val(textValues[idx]);
      thisContentValue.find('.objOptValue:last').attr('id','objOptValue_'+(1+parseInt(idx)));
      thisContentValue.find('.objOptValue:last').attr('name','objOptValue_'+(1+parseInt(idx)));
    }
    if(thisContentValue.find('.objEtc').length != 0) {
      thisContentValue.find('.objEtc').remove();
      thisContentValue.append($('#objEtcTemplate').html());
      thisContentValue.append($('#objBtnAreaTemplate_2').html());
    } else {
      thisContentValue.append($('#objBtnAreaTemplate_1').html());
    }
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

		switch(	$(this).val())
		{
			case '객관식':
				$(this).parents('.content').find('.contentValue').append($('#objectiveTemplate').html());
				break;
			case '단일 입력':
				$(this).parents('.content').find('.contentValue').append($('#subjectiveTemplate').html());
				break;
      case '의견':
  			$(this).parents('.content').find('.contentValue').append($('#longSubjectiveTemplate').html());
  			break;
      case '날짜 입력':
    		$(this).parents('.content').find('.contentValue').append($('#dateTemplate').html());
    		break;
      case '날짜,시간 입력':
      	$(this).parents('.content').find('.contentValue').append($('#dateTimeTemplate').html());
      	break;
		}

  });
});
