$(document).ready(function() {
            
    var itemAction = #{jsAction @MenuNavigation.clickItem(':id')/};
    
    $('a.menuItem').click(function() {
        $('#itemTarget').load(itemAction({id: this.id}));
    });
    
    $('.collapse').on('show', function() {
        $('#icon' + this.dataset.ic).removeClass('icon-chevron-right').addClass('icon-chevron-down');
    });
    
    $('.collapse').on('hide', function() {
        $('#icon' + this.dataset.ic).removeClass('icon-chevron-down').addClass('icon-chevron-right');
    });
    
    $('#addCategoryButton').click(function() {
        var list = $('<li>').attr('style', 'margin-bottom:0px');
        var input = $('<input>').attr('type', 'text').addClass('input').attr('placeholder', 'New Category').addClass('newCatText');
        var submit = $('<input>').attr('type', 'submit').hide();
        var form = $('<form>').attr('action', '#').addClass('form-inline').attr('id', 'newCat');
        var formAction = #{jsAction @MenuNavigation.addCategoryWithValidate(':accountId', ':title')/};
        var listAction = #{jsAction @MenuNavigation.addItemList(':accountId', ':title')/};
        form.submit(function() {
            $.get(formAction({accountId: '${account.id}', title: input.val()}), function(data) {
                $('#addCategory').before(data);
                $.get(listAction({accountId: '${account.id}', title: input.val()}), function(listData) {
                    list.hide();
                    $('.tab-content.item-pane').append(listData);
                    $('.category-tab').last().click();
                    list.remove();
                    return false;
                });
                return false;
            });
            return false;
        });
        list.append(form.append(input).append(submit));
        list.insertBefore('#addCategory');
        input.focus();
        input.on('blur', function() {
            list.remove();
        });
    });
});