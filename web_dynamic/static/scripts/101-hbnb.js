function arrayRemove (arr, value) {
  return arr.filter(function (ele) {
    return ele !== value;
  });
}

function truncate (source, size) {
  return source.length > size ? source.slice(0, size - 1) + '…' : source;
}

function checkPlural (num) {
  if (num > 1) {
    return 's';
  } else {
    return '';
  }
}

$.ajax({
  url: 'http://0.0.0.0:5001/api/v1/places_search',
  dataType: 'json',
  type: 'post',
  contentType: 'application/json',
  data: '{}',
  success: function (data, textStatus, jQxhr) {
    for (const p in data) {
      $('section.places').append('\n' +
                                 '<article>\n' +
                                 '<div class="title_box">\n' +
                                 '<h2>' + data[p].name + '</h2>\n' +
                                 '<div class="price_by_night">$' + data[p].price_by_night + '</div>\n' +
                                 '</div>\n' +
                                 '<div class="information">\n' +
                                 '<div class="max_guest">' + data[p].max_guest + ' Guest' + checkPlural(data[p].max_guest) + '</div>\n' +
                                 '<div class="number_rooms">' + data[p].number_rooms + ' Bedroom' + checkPlural(data[p].number_rooms) + '</div>\n' +
                                 '<div class="number_bathrooms">' + data[p].number_bathrooms + ' Bathroom' + checkPlural(data[p].number_bathrooms) + '</div>\n' +
                                 '</div>\n' +
                                 '<div class="description">\n' +
                                 data[p].description + '</div>\n' + 
                                 '<div class="reviews">' +
                                 '<h2>Reviews</h2>' +
                                 '<span class="reviewSpan" data-id="' +
                                 data[p].id +
                                 '">Show</span>' +
                                 '</div></article>');
    }
  },
  error: function (jqXhr, textStatus, errorThrown) {
    console.log(errorThrown);
  }
});

let clickedAmen = [];
let amenitiesId = [];
let clickedStates = [];
let statesId = [];
let clickedCities = [];
let citiesId = [];

window.addEventListener('DOMContentLoaded', (event) => {
  $('input[type="checkbox"]').click(function () {
    if ($(this).is(':checked')) {
      if ($(this).parents('.amenities').length) {
        clickedAmen.push($(this).attr('data-name'));
        amenitiesId.push($(this).attr('data-id'));
      }
      if ($(this).parents('.locations').length) {
        if ($(this).parents('h2').length) {
          clickedStates.push($(this).attr('data-name'));
          statesId.push($(this).attr('data-id'));
        } else {
          clickedCities.push($(this).attr('data-name'));
          citiesId.push($(this).attr('data-id'));
        }
      }
    } else if ($(this).is(':not(:checked)')) {
      if ($(this).parents('.amenities').length) {
        clickedAmen = arrayRemove(clickedAmen, $(this).attr('data-name'));
        amenitiesId = arrayRemove(amenitiesId, $(this).attr('data-id'));
      }
      if ($(this).parents('.locations').length) {
        if ($(this).parents('h2').length) {
          clickedStates = arrayRemove(clickedStates, $(this).attr('data-name'));
          statesId = arrayRemove(statesId, $(this).attr('data-id'));
        } else {
          clickedCities = arrayRemove(clickedCities, $(this).attr('data-name'));
          citiesId = arrayRemove(citiesId, $(this).attr('data-id'));
        }
      }
    }
    const citiesAndStates = clickedStates.concat(clickedCities);
    $('.amenities h4').text(truncate(clickedAmen.join(', '), 25));
    $('.locations h4').text(truncate(citiesAndStates.join(', '), 25));
  });
  const url = 'http://0.0.0.0:5001/api/v1/status/';
  $.get(url, function (data, textStatus) {
    if (textStatus === 'success') {
      $('#api_status').attr('class', 'available');
    } else {
      $('#api_status').removeAttr('class', 'available');
    }
  });

  $('button[type="button"]').click(function () {
    const dict = {
      amenities: amenitiesId,
      states: statesId,
      cities: citiesId
    };
    $.ajax({
      url: 'http://0.0.0.0:5001/api/v1/places_search',
      dataType: 'json',
      type: 'post',
      contentType: 'application/json',
      data: JSON.stringify(dict),
      success: function (data, textStatus, jQxhr) {
        $('section.places').empty();
        for (const p in data) {
          $('section.places').append('\n' +
                                     '<article>\n' +
                                     '<div class="title_box">\n' +
                                     '<h2>' + data[p].name + '</h2>\n' +
                                     '<div class="price_by_night">$' + data[p].price_by_night + '</div>\n' +
                                     '</div>\n' +
                                     '<div class="information">\n' +
                                     '<div class="max_guest">' + data[p].max_guest + ' Guest' + checkPlural(data[p].max_guest) + '</div>\n' +
                                     '<div class="number_rooms">' + data[p].number_rooms + ' Bedroom' + checkPlural(data[p].number_rooms) + '</div>\n' +
                                     '<div class="number_bathrooms">' + data[p].number_bathrooms + ' Bathroom' + checkPlural(data[p].number_bathrooms) + '</div>\n' +
                                     '</div>\n' +
                                     '<div class="description">\n' +
                                     data[p].description + '</div></article>');
        }
      },
      error: function (jqXhr, textStatus, errorThrown) {
        console.log(errorThrown);
      }
    });
  });
  $(document).on('click', '.reviewSpan', function(){
    if ($(this).text() === 'Show') {
      $(this).parent().append('<ul></ul>');
      const reviews = $(this).parent();
      let reviewAPICall = 'http://0.0.0.0:5001/api/v1/places/' + $(this).attr('data-id') + '/reviews';
      $.get(reviewAPICall, function (data, textStatus) {
        for (review in data) {
          let text = data[review].text;
          let year = data[review].created_at.substr(0, 4);
          let month = data[review].created_at.substr(5, 2);
          let day = data[review].created_at.substr(8, 2);
          console.log(data[review].created_at);
          console.log(year + month + day);
          let userAPICall = 'http://0.0.0.0:5001/api/v1/users/' + data[review].user_id;
          $.get(userAPICall, function (user, textStatus) {
            let reviewHTML = '<li><h3>From ' +
                             user.first_name +
                             ' ' +
                             user.last_name +
                             ' (' +
                             [day, month, year].join('/') +
                             '):' +
                             '</h3><p>' +
                             text +
                             '</p></li>';
            reviews.find('ul').append(reviewHTML);
          });
        };
      });
      $(this).text('Hide');
    } else {
      $(this).text('Show');
      $(this).parent().find('ul').remove();
    }
  });
});
