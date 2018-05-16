(function() {

  ACXM.Dialog = {
    show: showDialogueBox,
    hide: hideDialogueBox
  };

  function showDialogueBox(options) {

    // remove focus on all inputs
    $("input").blur();

    var currentDialogue = '#' + options.id;

    if ($('.dialogueOverlay').length) {

      // Another dialogue is open, increment z-index
      var currentZindex = $('.dialogueOverlay').css("z-index") + 1;

      if ($(currentDialogue).length) {
        // This dialogue is already open, do nothing
        return false;
      }
    }

    var loaderHTML = '<div class="loader"></div>'; // loading animation for *Status* Dialogue
    var closeBtn = '<div class="xbtn"></div>'; // close button for *Error* Dialogue
    var buttonHTML = ''; // buttons for *Confirm* Dialogue

    // create buttons if *Confirm* Dialogue
    if (options.buttons && options.type == 'confirm') {
      $.each(options.buttons, function(label, params) {

        // create markup for the buttons:
        buttonHTML += '<input type="button" class="acxiom-button ' + params['class'] + '" value="' + label + '" />';

        if (!params.action) {
          params.action = function() {
          };
        }

      });
    }

    var markup = [
      '<div id="', options.id, '" class="dialogueOverlay ', options.type, '">',
      '<div class="dialogueBox">', loaderHTML, closeBtn,
      '<div class="title">', options.title, '</div>',
      '<div class="message">', options.message, '</div>',
      '<div class="btns">', buttonHTML, '</div></div></div>'
    ].join('');

    //$(markup).hide().appendTo('body').fadeIn();
    $(markup).hide().appendTo('body').fadeIn(200, function() {
      $(this).find('.dialogueBox').slideToggle(400)
    });
    $(currentDialogue).css({"z-index": currentZindex});
    $(currentDialogue).find('.dialogueBox').css({"margin-left": -($(currentDialogue).find('.dialogueBox').outerWidth() / 2) + "px" });


    if (options.type == 'success') {

      // timer to close *Success* Dialogue
      $(currentDialogue).timer = null;
      $(currentDialogue).timer = setTimeout(function() {
        hideDialogueBox(options.id);
      }, 2600);
    }

    // click handler for X btn on *Error* Dialogue
    $('.dialogueBox .xbtn').click(function() {
      hideDialogueBox(options.id);
    });

    // assign click functions to buttons if *Confirm* Dialogue
    if (options.buttons && options.type == 'confirm') {

      // set focus on primary button
      $('.dialogueBox .acxiom-button.primary').focus();

      var buttons = $('.dialogueBox .acxiom-button'),
        i = 0;

      $.each(options.buttons, function(label, params) {
        buttons.eq(i++).click(function() {

          // use action from options
          params.action();

          // hide DialogueBox
          hideDialogueBox(options.id);
          return false;
        });
      });
    }
  }

  function hideDialogueBox(dialogueID) {

    var theDialogue = '#' + dialogueID;
    var theDelay = 0;

    if ($(theDialogue).hasClass('status')) {
      // timer to close *Status* Dialogue
      theDelay = 800;
    }
    $(theDialogue).timer = null;
    $(theDialogue).timer = setTimeout(function() {
      $(theDialogue + ' .dialogueBox').slideToggle(400, function() {
        $(theDialogue).fadeOut(200, function() {
          $(theDialogue).remove();
          $(theDialogue).timer = null;
        })
      });
    }, theDelay);

  }
})();
