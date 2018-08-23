let restaurant;
var newMap;

/**
 * Initialize map as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {  
  initMap();
});

/**
 * Initialize leaflet map
 */
initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {      
      self.newMap = L.map('map', {
        center: [restaurant.latlng.lat, restaurant.latlng.lng],
        zoom: 16,
        scrollWheelZoom: false
      });
      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
        mapboxToken: 'pk.eyJ1IjoidGVlYmFicyIsImEiOiJjamt6ajVxeHUwc2EyM2twMmh1eWZwNmk0In0.Tp_BBEhpWuELxSKVOZTY6w',
        // '<your MAPBOX API KEY HERE>',
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
          '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'    
      }).addTo(newMap);
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.newMap);
    }
  });
}  
/* 
 window.initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
      });
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
    }
  });
} 
*/

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant)
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant)
    });
  }
}

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;

  /*const image = document.getElementById('restaurant-img');
  image.removeAttribute('id');
  const picture = image.getElementsByTagName('picture')[0];

  const imageSrc = DBHelper.imageUrlForRestaurant(restaurant);
  const largeImageSrc = imageSrc.replace('.jpg', '-large_2x.jpg');
  const normalImageSrc = imageSrc.replace('.jpg', '-normal_1x.jpg');
  const smallImageSrc = imageSrc.replace('.jpg', '-small.jpg');

  const source = document.createElement('source');
  source.setAttribute('srcset', largeImageSrc + ' 2x,' + normalImageSrc + ' 1x');
  picture.appendChild(source);

  const image = document.createElement('img');
  image.id = 'restaurant-img';
  image.className = 'restaurant-img';
  image.src = smallImageSrc;
  image.setAttribute('alt', 'Image of ' + restaurant.name + ' Restaurant');
  picture.appendChild(image);*/

  const image = document.getElementById('restaurant-img'); 
  image.className = 'restaurant-img'
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  image.setAttribute('tabindex', 0);
  // Here you will specify the different images for display

  // the -large_2x.jpg should be your own image name you have
  const largeImageSrc = image.src.replace('.jpg', '--large_2x.jpg'); 
  // the -normal_1x.jpg should be your own image name you have
  const normalImageSrc = image.src.replace('.jpg', '--normal_1x.jpg');
  // the -small.jpg should be your own image name you have
  const smallImageSrc = image.src.replace('.jpg', '--small.jpg'); 
  // then you add a srcset attribute to the image
  image.setAttribute('media', '(' + 'min-width:' + '750px' + ')');
  image.setAttribute('srcset', largeImageSrc + ' 2x,' + normalImageSrc + ' 1x');
  image.src = smallImageSrc;
  image.setAttribute('alt', 'image for ' + restaurant.name + ' Restaurant');


  const cuisine = document.getElementById('restaurant-cuisine');
  // cuisine.setAttribute('tabindex', 0);
  cuisine.innerHTML = restaurant.cuisine_type;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  fillReviewsHTML();
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('tr');
    row.setAttribute('tabindex', 0);
    const day = document.createElement('td');
    // day.setAttribute('tabindex', 0);
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    // time.setAttribute('tabindex', 0);
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews = self.restaurant.reviews) => {
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h2');
  title.setAttribute('tabindex', 0);
  title.innerHTML = 'Reviews';
  container.appendChild(title);

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.setAttribute('tabindex', 0);
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
}

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
  const li = document.createElement('li');
  const name = document.createElement('p');
  name.setAttribute('tabindex', 0);
  name.innerHTML = review.name;
  li.appendChild(name);

  const date = document.createElement('p');
  date.setAttribute('tabindex', 0);
  date.innerHTML = review.date;
  li.appendChild(date);

  const rating = document.createElement('p');
  rating.setAttribute('tabindex', 0);
  rating.innerHTML = `Rating: ${review.rating}`;
  li.appendChild(rating);

  const comments = document.createElement('p');
  comments.setAttribute('tabindex', 0);
  comments.innerHTML = review.comments;
  li.appendChild(comments);

  return li;
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant=self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = restaurant.name;
  breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
