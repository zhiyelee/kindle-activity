/**
 * Created by zhiye on 4/26/15.
 */

$(document).ready(function () {
  var ndForm = $('#s');
  ndForm.submit(function (e) {
    var key = $('.search').val();
    $.get('/search', { key: key}, function (data) {
      console.log(data)
    });
    e.preventDefault();
  })

});
