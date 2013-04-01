// Actions---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

var loginAction = function(options) {var pattern = '/merchant/login?username=:username&rawPassword=:rawPassword'; for(key in options) { pattern = pattern.replace(':'+key, options[key] || ''); } return pattern };
var logoutAction = function(options) {var pattern = '/merchant/logout'; for(key in options) { pattern = pattern.replace(':'+key, options[key] || ''); } return pattern };


// Registration functions------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


// Account functions-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

$(document).on('click', '#login-submit', function() {
    $.get(loginAction({username: $('#login-username').val(), rawPassword: $('#login-password').val()}), function(data) {
        document.location.href = '/merchant/menu'
        return false;
    });
    return false;
});

$(document).on('click', '#logout-button', function() {
    $.get(logoutAction(), function(data) {
        document.location.href = '/merchant'
        return false;
    });
    return false;
});

$(document).ready(function () {
    if ($('[rel=tooltip]').length) {
        $('[rel=tooltip]').tooltip();
    }
});