/**
 * Created by zhiye on 4/26/15.
 */

$(document).ready(function () {
  var ndForm = $('#s');
  ndForm.submit(function (e) {
    var key = $('.search').val()
      , ndItemList = $('.item-list');
    $.get('/search', { key: key}, function (data) {
      if (data.length === 0) {
        ndItemList.html('<div class="center-block no-result"> No items MATCHED. </div>');
      } else {
        ndItemList.html(render(data))
      }
    });
    e.preventDefault();
  });

  function render(items) {
    var html = [];

    for (var i = 0; i < items.length; i++) {
      var tpl = ''
        , item = items[i];
      tpl = '<article class="item">' +
              '<div class="item-content">' + item.content + '</div>' +
              '<footer> <a class="link" href="/' + item.url + '"> >></a> </footer>' +
            '</article>';
      html.push(tpl)
    }

    return html.join('');
  }

});
