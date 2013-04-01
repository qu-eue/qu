// Actions---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

var validateUniqueUsernameAction = function(options) {var pattern = '/validateUniqueUsername?username=:username'; for(key in options) { pattern = pattern.replace(':'+key, options[key] || ''); } return pattern };
var validateUniqueEmailAction = function(options) {var pattern = '/validateUniqueEmail?email=:email'; for(key in options) { pattern = pattern.replace(':'+key, options[key] || ''); } return pattern };


// Functions-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Startup functions-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Registration functions

$(document).on('blur', 'input#inputUsername', function() {
    $.get(validateUniqueUsernameAction({username: this.value}), function(usernameData) {
        if (usernameData === 'success') {
            $('.control-username').removeClass('error');
            $('.control-username').addClass('success');
            $('input#inputUsername').tooltip("hide");
        }
        else if (usernameData === 'nonunique') {
            $('.control-username').addClass('error');
            $('.control-username').removeClass('success');
            $('input#inputUsername').data('tooltip').options.title = 'Username already taken';
            $('input#inputUsername').tooltip("show");
        }
        else if (usernameData === 'invalid') {
            $('.control-username').addClass('error');
            $('.control-username').removeClass('success');
            $('input#inputUsername').data('tooltip').options.title = 'Invalid username';
            $('input#inputUsername').tooltip("show");
        }
        else
        {
            $('.control-username').removeClass('success');
            $('.control-username').removeClass('failure');
        }
    });
});

$(document).on('blur', 'input#inputEmail', function() {
    $.get(validateUniqueEmailAction({email: this.value}), function(emailData) {
        if (emailData === 'success') {
            $('.control-email').removeClass('error');
            $('.control-email').addClass('success');
            $('input#inputEmail').tooltip("hide");
        }
        else if (emailData === 'nonunique') {
            $('.control-email').addClass('error');
            $('.control-email').removeClass('success');
            $('input#inputEmail').data('tooltip').options.title = 'Email address already registered';
            $('input#inputEmail').tooltip("show");
        }
        else if (emailData === 'invalid') {
            $('.control-email').addClass('error');
            $('.control-email').removeClass('success');
            $('input#inputEmail').data('tooltip').options.title = 'Invalid email address';
            $('input#inputEmail').tooltip("show");
        }
        else
        {
            $('.control-email').removeClass('success');
            $('.control-email').removeClass('failure');
        }
    });
});

$(document).on('blur', 'input#inputPassword', function() {

    var password = $(this).val();
    
    if (password.length <= 15 && password.length >= 6) {
        $('.control-password').removeClass('error');
        $('.control-password').addClass('success');
        $('input#inputPassword').tooltip("hide");
    }
    else
    {
        $('.control-password').addClass('error');
        $('.control-password').removeClass('success');
        $('input#inputPassword').tooltip("show");
    }
});

$(document).on('blur', 'input#inputConfirm', function() {

    var cpassword = $(this).val();
    var password = $('input#inputPassword').val();
    
    if (cpassword === password && cpassword.length <= 15 && cpassword.length >= 6) {
        $('.control-confirm').removeClass('error');
        $('.control-confirm').addClass('success');
        $('input#inputConfirm').tooltip("hide");
    }
    else
    {
        $('.control-confirm').addClass('error');
        $('.control-confirm').removeClass('success');
        $('input#inputConfirm').tooltip("show");
    }
});

$(document).on('click', 'button#submit-button', function() {
    $('input.check-submit').blur();
    var successes = $('div.control-check-submit.success').length;
    if (successes === 4) {
        
    }
    else {
        return false;
    }
});