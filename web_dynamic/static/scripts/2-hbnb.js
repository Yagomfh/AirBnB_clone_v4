function arrayRemove (arr, value) {
  return arr.filter(function (ele) {
    return ele !== value;
  });
}

function truncate (source, size) {
  return source.length > size ? source.slice(0, size - 1) + '…' : source;
}

let clickedAmen = [];

window.addEventListener('DOMContentLoaded', (event) => {
  $('input[type="checkbox"]').click(function () {
    if ($(this).is(':checked')) {
      clickedAmen.push($(this).attr('data-name'));
      console.log(clickedAmen);
    } else if ($(this).is(':not(:checked)')) {
      clickedAmen = arrayRemove(clickedAmen, $(this).attr('data-name'));
      console.log(clickedAmen);
    }
    $('.amenities h4').text(truncate(clickedAmen.join(', '), 25));
  });
  const url = 'http://0.0.0.0:5001/api/v1/status/';
  $.get(url, function (data, textStatus) {
    console.log(textStatus);
    if (textStatus === 'success') {
      console.log(textStatus);
      $('#api_status').attr('class', 'available');
    } else {
      $('#api_status').removeAttr('class', 'available');
    }
  });
});
