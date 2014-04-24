/* static namespacing using direct assignment */

var rainbow = {};




Number.prototype.toHex = function() {
  if (this < 16) { return '0' + this.toString(16); }
  else { return this.toString(16); }
}

if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined' ? args[number] : match;
    });
  };
}


rainbow.getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

rainbow.color = function(r, g, b) {
  var r = r; g = g; b = b;
  this.hex = function() {
    return '({0},{1},{2})'.format(r.toHex(), g.toHex(), b.toHex());
  }
  this.rgb = function() {
    return '({0},{1},{2})'.format(r.toString(), g.toString(), b.toString());
  }
  this.fillStyle = function() {
    return 'rgb{0}'.format(this.rgb());
  }
}


rainbow.fillSqConstruct = function() {
  var c = 0;
  return function(x, color) {
    return function() {
      var output = document.getElementById('square{0}'.format(c));
      var square = output.getContext('2d');
      if (color == null) {
        square.fillStyle = rainbow.xColorArray[x].fillStyle();
      } else {
        square.fillStyle = color.fillStyle();
      };

      square.fillRect(0, 0, 128, 128);

      c += 1;

      if (c == 5) {c = 0; };
    }();
  }
}


rainbow.getXPos = function(canvas, evt) {
  public_canvas = canvas;
  var rect = canvas.getBoundingClientRect();
  return evt.clientX - rect.left;
};


rainbow.randomPick = function() {
  for (var i = 0; i < 4; i++) {
    var r = rainbow.getRandomInt(0, 255);
    var g = rainbow.getRandomInt(0, 255);
    var b = rainbow.getRandomInt(0, 255);
    var randCol = new rainbow.color(r, g, b);
    rainbow.fillSq(x = null, randCol);
  }
};


rainbow.getColorAtPoint = function(selector, evt) {
  var rect = selector.getBoundingClientRect();
  var x = evt.clientX - rect.left;
  var y = evt.clientY - rect.top;
  var context = selector.getContext('2d');
  imagedata = context.getImageData(x, y, 1, 1)['data'];
  var c = new rainbow.color(imagedata[0], imagedata[1], imagedata[2]);
      x = new rainbow.color(imagedata[0], imagedata[1], imagedata[2]);
  return c;

}

rainbow.fillSq = new rainbow.fillSqConstruct();
rainbow.r = 255, rainbow.g = 0, rainbow.b = 0;
rainbow.xColorArray = {};


for (x =    0; x <  255; x++) { rainbow.xColorArray[x] = new rainbow.color(rainbow.r, rainbow.g++, rainbow.b  ); }
  rainbow.xColorArray[255] = new rainbow.color(rainbow.r, rainbow.g, rainbow.b);
for (x =  256; x <  511; x++) { rainbow.xColorArray[x] = new rainbow.color(rainbow.r--, rainbow.g  , rainbow.b  ); }
  rainbow.xColorArray[511] = new rainbow.color(rainbow.r, rainbow.g, rainbow.b);
for (x =  512; x <  767; x++) { rainbow.xColorArray[x] = new rainbow.color(rainbow.r  , rainbow.g  , rainbow.b++); }
  rainbow.xColorArray[767] = new rainbow.color(rainbow.r, rainbow.g, rainbow.b);
for (x =  768; x < 1023; x++) { rainbow.xColorArray[x] = new rainbow.color(rainbow.r  , rainbow.g--, rainbow.b  ); }
  rainbow.xColorArray[1023] = new rainbow.color(rainbow.r, rainbow.g, rainbow.b);
for (x = 1024; x < 1279; x++) { rainbow.xColorArray[x] = new rainbow.color(rainbow.r++, rainbow.g  , rainbow.b  ); }
  rainbow.xColorArray[1279] = new rainbow.color(rainbow.r, rainbow.g, rainbow.b);
for (x = 1280; x < 1535; x++) { rainbow.xColorArray[x] = new rainbow.color(rainbow.r  , rainbow.g  , rainbow.b--); }
  rainbow.xColorArray[1535] = new rainbow.color(rainbow.r, rainbow.g, rainbow.b);

/* there must be some way of doing the above more succinctly */

rainbow.rainbow = document.getElementById('bar');
rainbow.bar = rainbow.rainbow.getContext('2d');


for (var x = 0; x < 1536; x+=20) {
  rainbow.bar.fillStyle = rainbow.xColorArray[x].fillStyle();
  rainbow.bar.fillRect(x/2, 0, 20, 10);
}

rainbow.rainbow.addEventListener('click', function(evt) {
	var x = Math.floor(rainbow.getXPos(rainbow.rainbow, evt) * 2);
  rainbow.fillSq(x);
}, false);

document.getElementById('random').addEventListener('click', rainbow.randomPick);

document.getElementById('submitdata').addEventListener('click', function() {
  /* this needs some tweaking */
  $.ajax({
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(datum),
    dataType: 'json',
    url: '/submit_data',
    success: function (e) {
        console.log(e);
    }
});
});

document.getElementById('selector-light').addEventListener('click', function(evt) {
  var selector     = document.getElementById('selector-light');
  var selectorCont = selector.getContext('2d');
  var c = rainbow.getColorAtPoint(selector, evt);
  rainbow.fillSq(x = null, c);
});

document.getElementById('selector-dark').addEventListener( 'click', function(evt) {
  var selector     = document.getElementById('selector-dark');
  var c = rainbow.getColorAtPoint(selector, evt);
  rainbow.fillSq(x = null, c);
});

rainbow.randomPick();

(function(){
  var selector     = document.getElementById('selector-light');
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
  overlay.addColorStop(0, 'rgba(0, 0, 0, 0)');
  overlay.addColorStop(1, 'rgba(0, 0, 0, 1)');
  selectorCont.fillStyle = overlay;
  selectorCont.fillRect(0, 0, 256, 256);
})();
(function(){
  var selector     = document.getElementById('selector-dark');
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
  overlay.addColorStop(0, 'rgba(255, 255, 255, 0)');
  overlay.addColorStop(1, 'rgba(255, 255, 255, 1)');
  selectorCont.fillStyle = overlay;
  selectorCont.fillRect(0, 0, 256, 256);
})();
