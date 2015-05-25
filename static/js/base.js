/**
 * Created by zhiye on 4/26/15.
 */

$(document).ready(function () {
  var ndForm = $('#s');
  ndForm.submit(function (e) {
    var key = $('.search').val()
      , ndItemList = $('.item-list');

    e.preventDefault();

    $.get('/search', { key: key}, function (data) {
      if (data.length === 0) {
        ndItemList.html('<div class="no-result"><div class="center-block msg"> No items MATCHED. </div></div>');
      } else {
        ndItemList.html(getHTML(data))
      }
      $('.page-nav').remove();
    });
  });

  /**
   * render to html
   * @param items
   * @returns {string}
   */
  function getHTML(items) {
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
