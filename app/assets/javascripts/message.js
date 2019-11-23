$(function(){ 

  var buildMessageHTML = function(message) {
    image = (message.image) ? `<img class= "lower-message__image" src=${message.image} >` : "";
      var html = `<div class="messages__message" data-message-id="${message.id}"> 
                    <div class="messages__message__upper-message">
                      <div class="messages__message__upper-message__user-name">
                        ${message.user_name}
                      </div>
                      <div class="messages__message__upper-message__date">
                        ${message.created_at}
                      </div>
                    </div>
                    <div class="messages__message__lower-message">
                      <p class="messages__message__lower-message__content">
                        ${message.content}
                      </p>
                        ${image}
                    </div>
                  </div>`
      return html;
  };

  $('.new_message').on('submit', function(e){
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action')
    $.ajax({
      url: url,
      type: 'POST',
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data){
      var html = buildMessageHTML(data);
      $('.messages').animate({scrollTop: $('.messages')[0].scrollHeight}, 'fast');
      $('.messages').append(html);    
      $('form')[0].reset();
      $('.form__submit').prop('disabled', false);
    })
      .fail(function(){
        alert('"メッセージ送信に失敗しました"');
      });
      return false;
  });

  var reloadMessages = function() {
    if (window.location.href.match(/\/groups\/\d+\/messages/)){
      var last_message_id = $('.messages__message:last').data("message-id");

      $.ajax({
        url: "api/messages",
        type: 'get',
        dataType: 'json',
        data: {id: last_message_id}
      })
      .done(function(messages) {
        var insertHTML = '';
        messages.forEach(function (message){
          insertHTML = buildMessageHTML(message);
          $('.messages').append(insertHTML);
          $('form')[0].reset();
        })
        $('.messages').animate({scrollTop: $('.messages')[0].scrollHeight}, 'fast');
      })
      .fail(function() {
        alert('自動更新に失敗しました');
      });
    }
  };
  setInterval(reloadMessages, 7000);
});