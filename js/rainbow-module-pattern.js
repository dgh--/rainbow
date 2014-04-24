
/* constants - these may be better namespaced within the rainbow object -
   although for now they'll do here */

var REDUCTION_FACTOR = 64;
var UNMODIFIED_LENGTH_X_COLOR_ARRAY = 1536;
var LENGTH_X_COLOR_ARRAY = UNMODIFIED_LENGTH_X_COLOR_ARRAY / REDUCTION_FACTOR;
var LENGTH_X_COLOR_ARRAY_SEGMENT = LENGTH_X_COLOR_ARRAY / 6;

/* functions and variables are namespaced within the
   rainbow object using the Module pattern */

var rainbow = (function() { 

  Array.prototype.last_item = function() {
    return this[(this.length)-1];
  };

  Number.prototype.toHex = function() {
    if (this < 16) { return '0' + this.toString(16); }
    else { return this.toString(16); }
  };
  
  if (!String.prototype.format) {
    String.prototype.format = function() {
      var args = arguments;
      return this.replace(/{(\d+)}/g, function(match, number) { 
        return typeof args[number] != 'undefined' ? args[number] : match;
      });
    };
  };

  return {

    getRandomInt: function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    color: function(r, g, b) {
      var r = r, g = g, b = b;
      this.hex = function() {
        return '({0},{1},{2})'.format(r.toHex(), g.toHex(), b.toHex());
      }
      this.rgb = function() {
        return '({0},{1},{2})'.format(r.toString(), g.toString(), b.toString());
      }
      this.fillStyle = function() {
        return 'rgb{0}'.format(this.rgb());
      }
      this.rgba = function(a) {
        return 'rgba({0}, {1}, {2}, {3})'.format(r.toString(), g.toString(), b.toString(), a.toString());
      } 
    },

    current_square_number: 0,

    fillSq: function(new_color) {
      var targetElement = document.getElementById('square{0}'.format(rainbow.current_square_number));
      var square = targetElement.getContext('2d');
      //square.fillStyle = rainbow.xColorArray[x].fillStyle();
      square.fillStyle = new_color.fillStyle();
      square.fillRect(0, 0, 128, 128);
      rainbow.current_square_number++;
      if (rainbow.current_square_number == 5) {
        rainbow.current_square_number = 0;
      };
    },

    XPos: function(canvas, evt) {
      var rect = canvas.getBoundingClientRect();
      return evt.clientX - rect.left;
    },

    randomPick: function() {
      for (var i = 0; i < 5; i++) {
        var r = rainbow.getRandomInt(0, 255);
        var g = rainbow.getRandomInt(0, 255);
        var b = rainbow.getRandomInt(0, 255);
        var randCol = new rainbow.color(r, g, b);
        rainbow.fillSq(randCol);
      }
    },

    getColorAtPoint: function(selector, evt) {
      var rect = selector.getBoundingClientRect();
      var x = evt.clientX - rect.left;
      var y = evt.clientY - rect.top;
      var context = selector.getContext('2d');
      imagedata = context.getImageData(x, y, 1, 1)['data'];
      var c = new rainbow.color(imagedata[0], imagedata[1], imagedata[2]);
      x = new rainbow.color(imagedata[0], imagedata[1], imagedata[2]);
      return c;
    },

    populateXColorArray: function() {
      var r = 255, g = 0, b = 0;
      var color_boundaries = [0];
      for (var j = 1; j <= 6; j++) {
        color_boundaries[j] = color_boundaries[j-1] + LENGTH_X_COLOR_ARRAY_SEGMENT;
      }
      var xColorArray = {};
      var final_value = color_boundaries.last_item();

      for (var x = 0; x <= final_value; x++) {                                                                           
        if (x>color_boundaries[0] && x<=color_boundaries[1]) {                                                           
          g += REDUCTION_FACTOR;                                                                                         
        } else if (x>color_boundaries[1] && x<=color_boundaries[2]) {                                                    
          r -= REDUCTION_FACTOR;                                                                                         
        } else if (x>color_boundaries[2] && x<=color_boundaries[3]) {                                                    
          b += REDUCTION_FACTOR;                                                                                         
        } else if (x>color_boundaries[3] && x<=color_boundaries[4]) {                                                    
          g -= REDUCTION_FACTOR;                                                                                         
        } else if (x>color_boundaries[4] && x<=color_boundaries[5]) {                                                    
          r += REDUCTION_FACTOR;                                                                                         
        } else if (x>color_boundaries[5] && x<=color_boundaries[6]) {                                                    
          b -= REDUCTION_FACTOR;                                                                                         
        }                                                                                                                
        xColorArray[x] = new rainbow.color(r,g,b);
      }
      return xColorArray;
    },
    rainbow: document.getElementById('bar'),
    bar: document.getElementById('bar').getContext('2d'),

    drawColorPalette: function(selector, overlayColor){
      // selector = 'selector-light' / 'selector-dark';
      var selector     = document.getElementById(selector);
      var selectorCont = selector.getContext('2d');
      var palette      = selectorCont.createLinearGradient(0, 0, 256, 0);
      palette.addColorStop(0 / 6, '#ff0000');
      palette.addColorStop(1 / 6, '#ffff00');
      palette.addColorStop(2 / 6, '#00ff00');
      palette.addColorStop(3 / 6, '#00ffff');
      palette.addColorStop(4 / 6, '#0000ff');
      palette.addColorStop(5 / 6, '#ff00ff');
      palette.addColorStop(6 / 6, '#ff0000');
      selectorCont.fillStyle = palette;
      selectorCont.fillRect(0, 0, 256, 256);
      var overlay = selectorCont.createLinearGradient(0, 0, 0, 256);
      /*overlay.addColorStop(0, 'rgba(0, 0, 0, 0)');
      overlay.addColorStop(1, 'rgba(0, 0, 0, 1)');*/
      overlay.addColorStop(0, overlayColor.rgba(0));
      overlay.addColorStop(1, overlayColor.rgba(1));
      selectorCont.fillStyle = overlay;
      selectorCont.fillRect(0, 0, 256, 256);
    },

  }
})();


// EVENT LISTENERS

rainbow.rainbow.addEventListener('click', function(evt) {
  var rect = rainbow.rainbow.getBoundingClientRect();
  xPos = evt.x - rect.left;
  colorNo = Math.floor((xPos * 2) / REDUCTION_FACTOR);
  rainbow.fillSq(rainbow.xColorArray[colorNo]);
});

$(document).ready(function() {
  document.getElementById('random').addEventListener('click', rainbow.randomPick);
})





document.getElementById('submitdata').addEventListener('click', function() {

  // populate variable datum with some sample data;
  // TODO: write out some JavaScript to 
  var datum = {'colourset':
            [
              'rgba(255,255,255, 0.2',
              'rgba(255,0,0, 0.2',
              'rgba(0,255,0, 0.2',
              'rgba(0,0,255, 0.2',
              'rgba(0,0,0, 0.2',
            ]};

  $.ajax({
    type: 'POST',
    //contentType: 'application/json',
    //data: JSON.stringify(datum),
    data: {'json': JSON.stringify(datum)},
    //

    //dataType: 'json',
    url: 'http://localhost:7475/submit_data.php',
    success: function (e) {
        console.log(e);
    },
  });
});

document.getElementById('selector-light').addEventListener('click', function(evt) {
  var selector     = document.getElementById('selector-light');
  var selectorCont = selector.getContext('2d');
  var c = rainbow.getColorAtPoint(selector, evt);
  rainbow.fillSq(c);
});

document.getElementById('selector-dark').addEventListener( 'click', function(evt) {
  var selector     = document.getElementById('selector-dark');
  var c = rainbow.getColorAtPoint(selector, evt);
  console.info(c.rgb());
  rainbow.fillSq(c);
});



(function() {
  rainbow.xColorArray = rainbow.populateXColorArray();
  top_color_bar_width = rainbow.rainbow.width;
  step_width = top_color_bar_width / (1536 / REDUCTION_FACTOR);
  var c = 0;
  for (var i = 0; i <= (1536 / REDUCTION_FACTOR); i += 1) {
    rainbow.bar.fillStyle = rainbow.xColorArray[i].fillStyle();
    rainbow.bar.fillRect(i*step_width, 0, step_width, 10);
  }
  var black = new rainbow.color(0, 0, 0);
  var white = new rainbow.color(255, 255, 255);
  rainbow.randomPick();
  rainbow.drawColorPalette('selector-light', white);
  rainbow.drawColorPalette('selector-dark', black);
})();



