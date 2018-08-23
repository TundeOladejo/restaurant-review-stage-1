let mapBtn = document.querySelector('#map-btn');

      mapBtn.addEventListener('click', showMap);
      function showMap (){
        /*if(map.classList.contains('hide-map')){
          map.classList.replace('hide-map', 'show-map');
        } else {map.replace('show-map', 'hide-map');}*/
        // map.style.display = "block";
        map.classList.toggle('show-map');
      }

      mapBtn.addEventListener('keydown', function showMapWithKeyboard (e){
        if(e.keyCode == 13){
          if(window.confirm('show / hide map')){
            map.classList.toggle('show-map');
          }
        }
      });