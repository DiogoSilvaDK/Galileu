$(function () {
  // INDEX é usado para atribuir um ID único a cada mensagem
  var INDEX = 0;
  $("#chat-circle").click(function (e) {
    console.log('start')
    if (typeof INDEX !== 'undefined') {
      if (INDEX == 0) {
        console.log(INDEX);
        $.ajax({
          url: '/start_conversation',
          method: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({ message: 'msg'}),
          success: function (data) {
            generate_message(data.response, 'bot');
          }
        });
      }
    } else {
      console.log("INDEX não está definido");
    }
  })
  // Quando o botão de envio do chat é clicado
  $("#chat-submit").click(function (e) {
    // Previne o comportamento padrão do botão
    e.preventDefault();

    // Pega o valor do campo de entrada do chat
    var msg = $("#chat-input").val();

    // Se a mensagem estiver vazia, não faz nada
    if (msg.trim() == '') {
      return false;
    }
    generate_message(msg, 'self');
    // Envia a mensagem para o servidor e recebe a resposta
    $.ajax({
      url: '/message',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ message: msg }),
      success: function (data) {
        // Adiciona a resposta do bot ao chatbox
        generate_message(data.response, 'bot');
      }
    });
  })

  // Função para gerar uma mensagem na interface do chat
  function generate_message(msg, type) {
    // Incrementa o INDEX
    INDEX++;
    // Cria a estrutura HTML da mensagem
    var str = "";
    str += "<div id='cm-msg-" + INDEX + "' class=\"chat-msg " + type + "\">";
    str += "          <span class=\"msg-avatar " + type + "\">";
    str += "          <\/span>";
    str += "          <div class=\"cm-msg-text\">";
    str += msg;
    str += "          <\/div>";
    str += "        <\/div>";

    // Adiciona a mensagem ao final do chat
    $(".chat-logs").append(str);

    // Mostra a mensagem com um efeito de fade in
    $("#cm-msg-" + INDEX).hide().fadeIn(300);

    // Se a mensagem é do usuário, limpa o campo de entrada
    if (type == 'self') {
      $("#chat-input").val('');
    }
    // Faz o scroll do chat para a última mensagem
    $(".chat-logs").stop().animate({ scrollTop: $(".chat-logs")[0].scrollHeight }, 1000);
  }

  // Quando um botão do chat é clicado
  $(document).delegate(".chat-btn", "click", function () {
    // Pega o valor do botão
    var value = $(this).attr("chat-value");

    // Pega o nome do botão
    var name = $(this).html();

    // Habilita o campo de entrada do chat
    $("#chat-input").attr("disabled", false);

    // Gera uma nova mensagem na interface do chat com o nome do botão
    generate_message(name, 'self');
  })

  // Quando o círculo do chat é clicado
  $("#chat-circle").click(function () {
    // Mostra ou esconde o círculo do chat
    $("#chat-circle").toggle('scale');

    // Mostra ou esconde a caixa do chat
    $(".chat-box").toggle('scale');
  })

  // Quando o botão de toggle da caixa do chat é clicado
  $(".chat-box-toggle").click(function () {
    // Mostra ou esconde o círculo do chat
    $("#chat-circle").toggle('scale');

    // Mostra ou esconde a caixa do chat
    $(".chat-box").toggle('scale');
  })

})
