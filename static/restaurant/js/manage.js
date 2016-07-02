function open_restaurant(e) {
    var open_btn = $(this);
    open_btn.removeClass('btn-default');
    open_btn.addClass('btn-warning active');

    var close_btn = $('#close_restaurant');
    close_btn.removeClass('btn-warning');
    close_btn.addClass('btn-default');
}
function close_restaurant(e) {
    var close_btn = $(this);
    close_btn.removeClass('btn-default');
    close_btn.addClass('btn-warning active');

    var open_btn = $('#open_restaurant');
    open_btn.removeClass('btn-warning');
    open_btn.addClass('btn-default');
}
