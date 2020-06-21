(function() {
  // https://gist.github.com/le-rag/692653570e1eac4afed2
  window.onload = function() {
    // d&d customize
    window.ondragover = function(e) {e.preventDefault()}
    window.ondrop = function(e) {
      e.preventDefault();
      draw(e.dataTransfer.files[0]); 
    };
  };

  function draw(file){
    const img = new Image();
    img.src = URL.createObjectURL(file);

    const canvas = document.getElementById("image_canvas");
    const ctx = canvas.getContext("2d");

    // call ctx.drawImage when the image got loaded
    img.onload = function() {
      // img set 
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);

      // pixel count
      const img_raw_data = ctx.getImageData(0, 0, img.width, img.height).data;
      const color_map = _parse_img(img_raw_data);
      _create_color_table(color_map);
    }
  };

  // convert [ canvas 2d context image data ] -> {RGB_CODE => count} list
  function _parse_img(img_raw_data){
    const map = new Map();

    for(i=0; i<img_raw_data.length; i+=4) {
      const pixel = {'r' : img_raw_data[i],
                     'g' : img_raw_data[i+1],
                     'b' : img_raw_data[i+2],
                     // 'alpha' : img_raw_data[i+3] 
                    };
          
      // hex color ode
      const rgb_code =   ('00' + pixel.r.toString(16)).slice(-2)
                       + ('00' + pixel.g.toString(16)).slice(-2)
                       + ('00' + pixel.b.toString(16)).slice(-2);
          
      // count up
      if(!map.has(rgb_code)) {
        map.set(rgb_code, 1);
      } else {
        map.set(rgb_code, map.get(rgb_code)+1);
      }
    }
    // order by count desc
    return new Map([...map.entries()].sort((a, b) => b[1] - a[1]));
  }

  function _create_color_table(color_map){
    const tbody = document.getElementById('color_list');
    // reset table
    while (tbody.firstChild) {
      tbody.removeChild(tbody.lastChild);
    }

    // output color_code and pixel_count
    color_map.forEach(function(value, key){
      // tr
      const tr = document.createElement('tr');
      // td(color_code)
      const td_color_code = document.createElement('td');
      td_color_code.innerHTML = `<div style="background-color:#${key}">#${key}</div>`;
      tr.appendChild(td_color_code);
      // td(color_count)
      const td_color_count = document.createElement('td');
      td_color_count.textContent = value;
      tr.appendChild(td_color_count);

      tbody.appendChild(tr);
    });
  }
})();