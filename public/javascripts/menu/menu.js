// Actions---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

var commitCategoryChangesAction = function(options) {var pattern = '/merchant/commitCategoryChanges'; for(key in options) { pattern = pattern.replace(':'+key, options[key] || ''); } return pattern };
var commitSubcategoryChangesAction = function(options) {var pattern = '/merchant/commitSubcategoryChanges'; for(key in options) { pattern = pattern.replace(':'+key, options[key] || ''); } return pattern };
var commitItemChangesAction = function(options) {var pattern = '/merchant/commitItemChanges'; for(key in options) { pattern = pattern.replace(':'+key, options[key] || ''); } return pattern };
var clickItemAction = function(options) {var pattern = '/merchant/item'; for(key in options) { pattern = pattern.replace(':'+key, options[key] || ''); } return pattern };
var newItemAction = function(options) {var pattern = '/merchant/newItem'; for(key in options) { pattern = pattern.replace(':'+key, options[key] || ''); } return pattern };
var resetEntireDatabaseAction = function(options) {var pattern = '/merchant/resetDatabase'; for(key in options) { pattern = pattern.replace(':'+key, options[key] || ''); } return pattern };
var addNewCategoryAction = function(options) {var pattern = '/merchant/addCategory?title=:title'; for(key in options) { pattern = pattern.replace(':'+key, options[key] || ''); } return pattern };
var addNewSubcategoryPaneAction = function(options) {var pattern = '/merchant/addList?title=:title'; for(key in options) { pattern = pattern.replace(':'+key, options[key] || ''); } return pattern };
var addNewSubcategoryAction = function(options) {var pattern = '/merchant/addSubcategory?title=:title'; for(key in options) { pattern = pattern.replace(':'+key, options[key] || ''); } return pattern };
var addItemAction = function(options) {var pattern = '/merchant/addItem'; for(key in options) { pattern = pattern.replace(':'+key, options[key] || ''); } return pattern };
var checkUniqueItemAction = function(options) {var pattern = '/merchant/checkUniqueItem'; for(key in options) { pattern = pattern.replace(':'+key, options[key] || ''); } return pattern };


// Functions-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Utility functions-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function resetContextMenu() {
    $('.item-dropdown').remove();
    $('.sub-dropdown').remove();
    $('.cat-dropdown').remove();
};

// Startup functions-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    
$(document).ready(function () {
    //$('.category-tab').first().parent().addClass('active');
    //$('.tab-pane').first().addClass('active');
});


// Dirty/clean functions-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

window.onbeforeunload = null;

function uncommittedChanges() {
    return 'You have unsaved changes on your Menu.';
};

function dirty() {
    window.onbeforeunload = uncommittedChanges;
    $('#menu-header').animate({backgroundColor: '#C0C0C0'}, 300);
    $('#publish-icon').removeClass('icon-star').addClass('icon-star-empty');
    $('#publish-button').removeClass('committed').addClass('uncommitted');
};

function deleteDirty() {
    $('#item-target').empty();
    dirty();
    resetContextMenu();
}


// Database functions----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

$(document).on('click', '#reset-database', function() {
    $.get(resetEntireDatabaseAction(), function() {
        location.reload(true);
    });
    return false;
});

$(document).on('click', '#publish-button', function() {
     if ($(this).hasClass('uncommitted')) {
        var max = $('.menu-item').length;
        var count = 0;
        
        function checkDirtyReload() {
            count++;
            if(count == max) {
                window.onbeforeunload = null;
                location.reload();
            }
        };
        
        $('#publish-icon').css('display', 'none');
        $('#publish-icon-loading').css('display', 'inline');
        
        function itemPost(categoryTitle, subcategoryTitle, subData) {
            if (subData === "success") {
                $("div.tab-pane.sidebar-nav#" + categoryTitle + " div.collapse.subcategory-collapse[subcategory-title='" + subcategoryTitle + "'] a.menu-item").each(function () {
                    if ($(this).attr('item-id') !== undefined) {
                        if($(this).parent().css('display') !== 'none') {
                            $.post(commitItemChangesAction(), {'item-id': $(this).attr('item-id'), 'item-title': $(this).attr('item-title'), 'item-price': $(this).attr('item-price')}).done(function(itemData) {
                                checkDirtyReload();
                            });
                        }
                        else {
                            $.post(commitItemChangesAction(), {'item-id': $(this).attr('item-id'), 'item-title': $(this).attr('item-title'), 'item-price': $(this).attr('item-price'), 'delete': 'true'}).done(function(itemData) {
                                checkDirtyReload();
                            });
                        }
                    }
                    else {
                        $.post(commitItemChangesAction(), {'category-title': categoryTitle, 'subcategory-title': subcategoryTitle, 'item-title': $(this).attr('item-title'), 'item-price': $(this).attr('item-price')}).done(function(itemData) {
                            checkDirtyReload();
                        });
                    }
                });
            }
        };
        
        function subcategoryPost(categoryTitle, data) {
            if (data === "success") {
                $("div.tab-pane.sidebar-nav#" + categoryTitle + " > ul.sub-high > li.nav-header").each(function () {
                    var subcategoryTitle = $(this).attr('subcategory-title');
                    var subcategoryId = $(this).attr('subcategory-id');
                    
                    if (subcategoryId !== undefined) {
                        if ($(this).css('display') !== 'none') {
                            $.post(commitSubcategoryChangesAction(), {'subcategory-id': subcategoryId, 'subcategory-title': subcategoryTitle}).done(function(subData) {
                                itemPost(categoryTitle, subcategoryTitle, subData);
                            });
                        }
                        else {
                            test = 'success';
                            itemPost(categoryTitle, subcategoryTitle, test);
                            $.post(commitSubcategoryChangesAction(), {'subcategory-id': subcategoryId, 'subcategory-title': subcategoryTitle, 'delete': 'true'}).done(function(subData) {
                            });
                        }
                    }
                    else {
                        $.post(commitSubcategoryChangesAction(), {'category-title': categoryTitle, 'subcategory-title': subcategoryTitle}).done(function(subData) {
                            itemPost(categoryTitle, subcategoryTitle, subData);
                        });
                    }
                });
            }
        };

        $('a.category-tab').each(function() {
            var categoryTitle = $(this).attr('category-title');
            if ($(this).attr('category-id') !== undefined) {
                if ($(this).parent().css('display') !== 'none') {
                    $.post(commitCategoryChangesAction(), {'category-id': $(this).attr('category-id'), 'category-title': categoryTitle}).done(function(data) {
                        subcategoryPost(categoryTitle, data);
                    });
                }
                else {
                    test = 'success';
                    subcategoryPost(categoryTitle, test);
                    $.post(commitCategoryChangesAction(), {'category-id': $(this).attr('category-id'), 'category-title': categoryTitle, 'delete': 'true'}).done(function(data) {
                    });
                }
            }
            else {
                $.post(commitCategoryChangesAction(), {'category-title': categoryTitle}).done(function(data) {
                    subcategoryPost(categoryTitle, data);
                });
            }
        });
    }
    return false;
});


// Item functions--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

$(document).on('click', '.menu-item', function() {
    resetContextMenu();
    $('#item-target').empty();
    var loading = $('<img>').attr('src', '/public/img/item-loading.gif').attr('id', 'item-icon-loading');
    $('#item-target').append(loading);
    $.post(clickItemAction(), {'category-title': $(this).attr('category-title'), 'subcategory-title': $(this).attr('subcategory-title'), 'item-title': $(this).attr('item-title'), 'item-price': $(this).attr('item-price')}).done(function(data) {
        $('#item-target').empty();
        $('#item-target').append(data);
    });
    return false;
});

$(document).on('click', '.add-item-button', function() {
    var subParent = $(this).parent('span').parent('li.nav-header');
    var catParent = subParent.parent('ul').parent('div.tab-pane.sidebar-nav');
    $.post(newItemAction(), {'category-title': catParent.attr('id'), 'subcategory-title': subParent.attr('subcategory-title')}).done(function(data) {
        $('#item-target').empty();
        $('#item-target').append(data);
        $('#item-target input.new-item-name').focus();
    });
    return false;
});

function deleteItem(item) {
    if (item.attr('item-id') !== undefined) {
        item.parent().css('display', 'none');
    }
    else {
        item.parent().remove();
        // Add a confirmation display to #item-target
    }
};

$(document).on('contextmenu', '.menu-item', function(e) {
    resetContextMenu();
    var item = $(this);
    var dropdown = $('<div>').addClass('dropdown').addClass('item-dropdown');
    var dropdownToggle = $('<a>').addClass('dropdown-toggle').addClass('item-dropdown-toggle').attr('data-toggle', 'dropdown').attr('href', '#');
    var dropdownUl = $('<ul>').addClass('dropdown-menu').addClass('item-dropdown-menu').attr('role', 'menu').attr('aria-labelledby', 'dLabel');
    var dropdownDeleteList = $('<li>');
    var dropdownDeleteAnchor = $('<a>').attr('tabindex', '-1').attr('href', '#').text('Delete Item');
    dropdown.append(dropdownToggle).append(dropdownUl.append(dropdownDeleteList.append(dropdownDeleteAnchor)));
    
    $(this).parent().append(dropdown);
    dropdown.css('position', 'fixed');
    dropdown.css('left', e.pageX);
    dropdown.css('top', e.pageY);
    dropdown.addClass('open');
    
    dropdownDeleteAnchor.on('click', function() {
       deleteItem(item);
       deleteDirty();
    });
    
    dropdownToggle.on('blur', function() {
        $(this).parent().remove();
    });
    
    dropdown.on('blur', function() {
        $(this).remove();
    });
    
    return false;
});

$(document).on('blur', 'div.new-price input.new-item', function() {
    var price = +$(this).val();
    if (!isNaN(price) && $(this).val() !== '' && price !== 0) {
        $('div.control-group.new-price').removeClass('error');
        $('div.control-group.new-price').addClass('success');
        $(this).tooltip("hide");
    }
    else {
        $('div.control-group.new-price').removeClass('success');
        $('div.control-group.new-price').addClass('error');
        $(this).tooltip("show");
    }
});
    
$(document).on('blur', 'input.new-item-name', function() {
    var name = $(this).val();
    //check only within cat/subcat
    if (name !== '' && $("a.menu-item[item-title='" + name + "']").length === 0) {
        $('div.control-name').removeClass('error');
        $('div.control-name').addClass('success');
        $(this).tooltip("hide");
    }
    else {
        $('div.control-name').removeClass('success');
        $('div.control-name').addClass('error');
        $(this).tooltip("show");
    }
});

$(document).on('click', 'input.new-item-submit', function() {
    $('input.new-item').blur();
    var successes = $('div.control-new-item.success').length;
    if (successes === 2) {
        var inputParent = $(this).parent('form.new-item-form').parent('div.item-group[category-title][subcategory-title]');
        $.post(addItemAction(), {'category-title': inputParent.attr('category-title'), 'subcategory-title': inputParent.attr('subcategory-title'), 'item-title': $('input.new-item-name').val(), 'item-price': +$('div.new-price input.new-item').val()}).done(function(data) {
            if(data !== 'failure') {
                // add item to the bottom of the subcategory list
                var itemList = $("div.tab-pane.sidebar-nav#" + inputParent.attr('category-title') + " div.collapse.subcategory-collapse[subcategory-title='" + inputParent.attr('subcategory-title') + "'] > ul.nav.nav-list.sub-low");
                
                itemList.append(data);
                itemList.click();
                
                // click on item programmatically
                
                itemList.children('li').last().children('a').click();
                dirty();
            }
        });
        return false;
    }
    else {
        return false;
    }
});

$(document).on('click', 'h3.item-itemtitle', function() {
    $(this).hide();
    var item = $(this);
    var input = $('<input>').attr('type', 'text').attr('maxlength', 32).addClass('item-name-change');
    input.val(item.text());
    var submit = $('<input>').attr('type', 'submit').hide();
    var form = $('<form>').attr('action', '#').addClass('item-name-form');
    function finish() {
        form.remove();
        item.show();
    };
    form.submit(function() {
        if (input.val() && input.val() != item.text() && $("a.menu-item[item-title='" + input.val() + "']").length === 0)
        {
            $.post(checkUniqueItemAction(), {'category-title': item.parents('div.item-group').attr('category-title'), 'subcategory-title': item.parents('div.item-group').attr('subcategory-title'), 'item-title': input.val()}).done(function(data) {
                if (data === 'success') {
                    var itemParent = item.parent();
                    var itemAnchor = $("div.tab-pane.sidebar-nav#" + itemParent.attr('category-title') + " div.collapse.subcategory-collapse[subcategory-title='" + itemParent.attr('subcategory-title') + "'] > ul.nav.nav-list.sub-low > li > a.menu-item[item-title='" + item.attr('item-title') + "']");
                    itemAnchor.find('> span.item-text').text(input.val());
                    itemAnchor.attr('item-title', input.val());
                    item.text(input.val());
                    item.attr('item-title', input.val());
                    dirty();
                    finish();
                }
                else if (data === 'invalid') {
                    alert('Item name already exists (placeholder for actual error handling');
                }
            });
            return false;
        }
        else
        {
            alert('Invalid item (placeholder for actual error handling');
            finish();
            return false;
        }
    });
    form.append(input).append(submit);
    item.after(form);
    input.focus();
    input.select();
    input.blur(function () {
        finish();
    });
});
    
$(document).on('click', 'span.item-itemprice', function() {
    function uncommittedChanges() {
        return 'You have unsaved changes on your Menu.';
    };
    
    $(this).hide();
    var item = $(this);
    var input = $('<input>').attr('type', 'text').attr('maxlength', 8).addClass('item-price-change');
    input.val(item.text().substring(1, item.text().length));
    var submit = $('<input>').attr('type', 'submit').hide();
    var form = $('<form>').attr('action', '#').addClass('item-price-form');
    function finish() {
        form.remove();
        item.show();
    };
    form.submit(function() {
        if (input.val())
        {
            $.post(checkUniqueItemAction(), {'category-title': item.parents('div.item-group').attr('category-title'), 'subcategory-title': item.parents('div.item-group').attr('subcategory-title'), 'item-price': input.val()}).done(function(data) {
                if (data === 'success') {
                    var itemParent = item.parent();
                    var itemPrice = parseFloat(input.val()).toFixed(2);
                    var itemAnchor = $("div.tab-pane.sidebar-nav#" + itemParent.attr('category-title') + " div.collapse.subcategory-collapse[subcategory-title='" + itemParent.attr('subcategory-title') + "'] > ul.nav.nav-list.sub-low > li > a.menu-item[item-title='" + itemParent.find('> h3.item-itemtitle').attr('item-title') + "']");
                    itemAnchor.find('> span.item-price').text('$' + itemPrice);
                    itemAnchor.attr('item-price', itemPrice);
                    item.text('$' + itemPrice);
                    dirty();
                    finish();
                }
                else if (data === 'invalid') {
                    alert('Item price is invalid (placeholder for actual error handling');
                }
            });
            return false;
        }
        else
        {
            finish();
            return false;
        }
    });
    form.append('$').append(input).append(submit);
    item.after(form);
    input.focus();
    input.select();
    input.blur(function () {
        finish();
    });
});


// Subcategory functions-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

$(document).on('click', '.icon-chevron-right', function() {
    $(this).removeClass('icon-chevron-right').addClass('icon-chevron-down');
    return true;
});

$(document).on('click', '.icon-chevron-down', function() {
    $(this).removeClass('icon-chevron-down').addClass('icon-chevron-right');
    return true;
});

$(document).on('click', '#add-subcategory-button', function() {
    var addSub = $(this).parent('li#add-subcategory');
    var subParent = addSub.parent('ul.sub-high');
    var list = $('<li>');
    var input = $('<input>').attr('type', 'text').attr('placeholder', 'New Subcategory').attr('maxlength', 24).addClass('new-subcategory-text');
    var submit = $('<input>').attr('type', 'submit').hide();
    var form = $('<form>').attr('action', '#').addClass('form-inline').addClass('new-subcategory');
    form.submit(function() {
        if(subParent.children("li.nav-header[subcategory-title='" + input.val() + "']").length === 0) {
            $.get(addNewSubcategoryAction({title: input.val()}), function(data) {
                if (data !== 'failed') {
                    addSub.before(data);
                    dirty();
                    list.hide();
                    list.remove();
                    return false;
                }
                else {
                    alert('Subcategory already exists in database (placeholder for actual error handling)!');
                }
                return false;
            });
            return false;
        }
        else {
            alert('Subcategory already exists (placeholder for actual error handling)');
            return false;
        }
    });
    list.append(form.append(input).append(submit));
    list.insertBefore(addSub);
    input.focus();
    input.on('blur', function() {
        list.remove();
    });
    return false;
});

function deleteSubcategory(sub) {
    var subParent = sub.parent().parent().parent('li.nav-header');
    var itemList = sub.parents('div.tab-pane.sidebar-nav').children('ul.nav.nav-list.sub-high').children('li.subcategory-list-data').children("div.collapse.subcategory-collapse[subcategory-title='" + sub.parent().parent().parent().attr('subcategory-title') + "']").children('ul.nav.nav-list.sub-low').children('li').children('a:visible');
    itemList.each(function() {
        deleteItem(itemList);
    });
    if (subParent.attr('subcategory-id') !== undefined) {
        subParent.css('display', 'none');
    }
    else {
        subParent.remove();
    }
    // Put action confirmation in item target
};

$(document).on('contextmenu', '.subtitle-text', function(e) {
    resetContextMenu();
    var sub = $(this);
    var dropdown = $('<div>').addClass('dropdown').addClass('sub-dropdown');
    var dropdownToggle = $('<a>').addClass('dropdown-toggle').addClass('sub-dropdown-toggle').attr('data-toggle', 'dropdown').attr('href', '#');
    var dropdownUl = $('<ul>').addClass('dropdown-menu').addClass('sub-dropdown-menu').attr('role', 'menu').attr('aria-labelledby', 'dLabel');
    var dropdownDeleteList = $('<li>');
    var dropdownDeleteAnchor = $('<a>').attr('tabindex', '-1').attr('href', '#').text('Delete Subcategory').css('font-style', 'normal');
    dropdown.append(dropdownToggle).append(dropdownUl.append(dropdownDeleteList.append(dropdownDeleteAnchor)));
    
    $(this).parent().append(dropdown);
    dropdown.css('position', 'fixed');
    dropdown.css('left', e.pageX);
    dropdown.css('top', e.pageY);
    dropdown.addClass('open');

    dropdownDeleteAnchor.on('click', function() {
        if (sub.parents('div.tab-pane.sidebar-nav').children('ul.nav.nav-list.sub-high').children('li.subcategory-list-data').children("div.collapse.subcategory-collapse[subcategory-title='" + sub.parent().parent().parent().attr('subcategory-title') + "']").children('ul.nav.nav-list.sub-low').children('li').children('a:visible').length !== 0) {
            var confirm = $('<div>').attr('id', 'sub-delete-confirmation').addClass('modal').addClass('hide').attr('tabindex', '-1').attr('role', 'dialog').attr('aria-labelledby', 'myModalLabel').attr('aria-hidden', 'true').css('border-radius', '0px 0px 0px 0px');
            var header = $('<div>').addClass('modal-header').append($('<button>').attr('type', 'button').addClass('close').attr('data-dismiss', 'modal').attr('aria-hidden', 'true').text('×')).append($('<h3>').attr('id', 'myModalLabel').text('Warning!'));
            var inside = $('<div>').addClass('modal-body').append($('<p>').text('Deleting this subcategory will delete all of its contents. Are you sure you want to continue?'));
            var footer = $('<div>').addClass('modal-footer').append($('<button>').addClass('btn').attr('data-dismiss', 'modal').attr('aria-hidden', 'true').text('Cancel')).css('border-radius', '0px 0px 0px 0px');
            var deleteButton = $('<button>').addClass('btn').addClass('btn-danger').text('Delete Subcategory');
            deleteButton.on('click', function() {
                deleteSubcategory(sub);
                deleteDirty();
                confirm.modal('hide');
                confirm.delete();
                return false;
            });
            confirm.append(header).append(inside).append(footer.append(deleteButton));
            confirm.modal('toggle');
        }
        else {
            deleteSubcategory(sub);
            deleteDirty();
        }
        return false;
    });
    
    dropdownToggle.on('blur', function() {
        $(this).parent().remove();
    });
    
    dropdown.on('blur', function() {
        $(this).remove();
    });
    
    return false;
});


// Category functions----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

$(document).on('click', '#add-category-button', function() {
    var list = $('<li>').attr('style', 'margin-bottom:0px');
    var input = $('<input>').attr('type', 'text').attr('placeholder', 'New Category').attr('maxlength', 16).addClass('new-category-text');
    var submit = $('<input>').attr('type', 'submit').hide();
    var form = $('<form>').attr('action', '#').addClass('form-inline').addClass('new-category');
    form.submit(function() {
        // Check for case and ending spaces as well
        if ($("a.category-tab[category-title='" + input.val() + "']").length === 0) {
            $.get(addNewCategoryAction({title: input.val()}), function(data) {
                if (data !=='failed') {
                    $('#add-category').before(data);
                    dirty();
                    list.hide();
                    $.get(addNewSubcategoryPaneAction({title: input.val()}), function(listData) {
                        $('.tab-content.subcategory-column').append(listData);
                        $('.category-tab').last().click();
                        list.remove();
                        return false;
                    });
                    return false;
                }
                else {
                    alert('Category already exists in database (placeholder for actual error handling)!');
                }
            });
            return false;
        }
        else {
            alert('Category already exists (placeholder for actual error handling)');
        }
    });
    list.append(form.append(input).append(submit));
    list.insertBefore('#add-category');
    input.focus();
    input.on('blur', function() {
        list.remove();
    });
    return false;
});

function deleteCategory(cat) {
    var subList = cat.parent().parent().parent().children('div.tab-content.subcategory-column').children("div.tab-pane.sidebar-nav#" + cat.attr('category-title')).children('ul.sub-high').children('li.nav-header').children('span').children('i').children('a.subtitle-text');
    subList.each(function() {
        deleteSubcategory(subList);
    });
    if (cat.attr('category-id') !== undefined) {
        cat.parent().css('display', 'none');
        cat.parent().parent().parent().children('div.subcategory-column').children("div.tab-pane.sidebar-nav#" + cat.attr('category-title')).css('display', 'none');
    }
    else {
        cat.parent().remove();
        cat.parent().parent().parent().children('div.subcategory-column').children("div.tab-pane.sidebar-nav#" + cat.attr('category-title')).remove();
    }
};

$(document).on('contextmenu', '.category-tab', function(e) {
    resetContextMenu();
    var cat = $(this);
    var dropdown = $('<div>').addClass('dropdown').addClass('cat-dropdown');
    var dropdownToggle = $('<a>').addClass('dropdown-toggle').addClass('cat-dropdown-toggle').attr('data-toggle', 'dropdown').attr('href', '#');
    var dropdownUl = $('<ul>').addClass('dropdown-menu').addClass('cat-dropdown-menu').attr('role', 'menu').attr('aria-labelledby', 'dLabel');
    var dropdownDeleteList = $('<li>');
    var dropdownDeleteAnchor = $('<a>').attr('tabindex', '-1').attr('href', '#').text('Delete Category').css('font-style', 'normal');
    dropdown.append(dropdownToggle).append(dropdownUl.append(dropdownDeleteList.append(dropdownDeleteAnchor)));
    
    $(this).parent().append(dropdown);
    dropdown.css('position', 'fixed');
    dropdown.css('left', e.pageX);
    dropdown.css('top', e.pageY);
    dropdown.addClass('open');
    
    
    dropdownDeleteAnchor.on('click', function() {
        if (cat.parent().parent().parent().children('div.tab-content.subcategory-column').children("div.tab-pane.sidebar-nav#" + cat.attr('category-title')).children('ul.sub-high').children('li.nav-header:visible').length !== 0) {
            var confirm = $('<div>').attr('id', 'sub-delete-confirmation').addClass('modal').addClass('hide').attr('tabindex', '-1').attr('role', 'dialog').attr('aria-labelledby', 'myModalLabel').attr('aria-hidden', 'true').css('border-radius', '0px 0px 0px 0px');
            var header = $('<div>').addClass('modal-header').append($('<button>').attr('type', 'button').addClass('close').attr('data-dismiss', 'modal').attr('aria-hidden', 'true').text('×')).append($('<h3>').attr('id', 'myModalLabel').text('Warning!'));
            var inside = $('<div>').addClass('modal-body').append($('<p>').text('Deleting this category will delete all of its contents. Are you sure you want to continue?'));
            var footer = $('<div>').addClass('modal-footer').append($('<button>').addClass('btn').attr('data-dismiss', 'modal').attr('aria-hidden', 'true').text('Cancel')).css('border-radius', '0px 0px 0px 0px');
            var deleteButton = $('<button>').addClass('btn').addClass('btn-danger').text('Delete Category');
            deleteButton.on('click', function() {
                deleteCategory(cat);
                deleteDirty();
                confirm.modal('hide');
                confirm.delete();
                return false;
            });
            confirm.append(header).append(inside).append(footer.append(deleteButton));
            confirm.modal('toggle');
        }
        else {
            deleteCategory(cat);
            deleteDirty();
        }
        return false;
    });
    
    dropdownToggle.on('blur', function() {
        $(this).parent().remove();
    });
    
    dropdown.on('blur', function() {
        $(this).remove();
    });
    
    return false;
});
