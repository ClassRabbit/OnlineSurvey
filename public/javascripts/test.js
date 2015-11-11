$(function() {
  var max_fields      = 10; //maximum input boxes allowed
  var wrapper         = $(".input_fields_wrap"); //Fields wrapper
  var add_button      = $(".add_field_button"); //Add button ID
  console.log('yes');
  var x = 0; //initlal text box count
  $('.add_field_button').click(function(e){ //on add input button click
    e.preventDefault();
    if(x < max_fields){ //max input box allowed
      x++; //text box increment
      $('.form-group').append('<div class="wrapper"><input class="textInput" type="text" id="mytext_'+ idx +'" name="mytext_'+ x +'"/><a href="#" class="remove_field">Remove</a></div>'); //add input box
    }
  });

  $(document).on("click",".remove_field", function(e){ //user click on remove text
    e.preventDefault(); $(this).parent('div').remove(); x--;
    var valueArr = [];
    $('.textInput').each(function (index, item){
      valueArr.push($(item).val());
      e.preventDefault(); $(item).parent('div').remove();
    })
    for(idx in valueArr){
      if(idx == 0) {
        $('.form-group').append('<div class="wrapper"><input class="textInput" type="text" id="mytext_'+ idx +'" name="mytext_'+ idx +'" value="'+valueArr[idx]+'"/>');
      } else {
        $('.form-group').append('<div class="wrapper"><input class="textInput" type="text" id="mytext_'+ idx +'" name="mytext_'+ idx +'" value="'+valueArr[idx]+'"/><a href="#" class="remove_field">Remove</a></div>');
      }

    }
  });
});
