$.fn.multisteps = function (config) {
  var $container = $(this);
  // 2 required params
  // array of steps, e.g. ['a', 'b']
  var steps = config.steps;

  // optional params
  var currentStep = config.currentStep || 0; // current step index
  var margin = config.margin || {
    left: 10,
    right: 10,
    top: 15,
    bottom: 15
  }; // margin of viewbox to container
  var wordSide = config.wordSide === 'right' ? 'right' : 'left'; // word on left or right
  var radius = config.radius || 10; // point radius
  var activeRadius = config.activeRadius || 15; // acitve point radius
  var pointsInteval = config.pointsInteval || 20; // interval between adjacent points
  var barWidth = config.barWidth || 5; // width of bar which connects points;
  var wordPointInterval = config.wordPointInterval || 5;  // interval between step word and point

  // data process;
  var width = $container.innerWidth() - margin.left - margin.right;
  var height = $container.innerHeight() - margin.top - margin.bottom;

  // draw
  // clean
  $container.html('').css({
    'overflow': 'auto'
  });
  // draw view box
  var $viewbox = $('<div class="multisteps-viewbox"></div>');
  $viewbox.appendTo($container);
  $viewbox.css({
    'width': width,
    'height': height,
    'margin-left': margin.left,
    'margin-right': margin.right,
    'margin-top': margin.top,
    'margin-bottom': margin.bottom
  });
  // draw points and words
  var html = '';
  steps.forEach(function (d, i) {
    var style = '';
    if (i < currentStep) {
      style = 'style="top:' + i * (2 * radius + pointsInteval) + 'px"';
      html += '<div class="word step-completed" ' + style + ' data-index=' + i + '>' + d + '</div>';
      html += '<div class="point step-completed" ' + style + ' data-index=' + i + '></div>';
    } else if (i === currentStep) {
      style = 'style="top:' + (i * (2 * radius + pointsInteval) - (activeRadius - radius)) + 'px"';
      html += '<div class="word active" ' + style + ' data-index=' + i + '>' + d + '</div>';
      html += '<div class="point active" ' + style + ' data-index=' + i + '></div>';
    } else {
      style = 'style="bottom:' + (steps.length - 1 - i) * (2 * radius + pointsInteval) + 'px"';
      html += '<div class="word step-uncompleted" ' + style + ' data-index=' + i + '>' + d + '</div>';
      html += '<div class="point step-uncompleted" ' + style + ' data-index=' + i + '></div>';
    }
  });
  $viewbox.html(html);
  $viewbox.find('.word').css({
    width: width - 2 * radius - wordPointInterval,
    'line-height': 2 * radius + 'px',
    'text-align': wordSide === 'left' ? 'right' : 'left',
    left: wordSide === 'left' ? 0 : 2 * radius + wordPointInterval
  });
  $viewbox.find('.word.active').css({
    width: width - radius - activeRadius - wordPointInterval,
    'line-height': 2 * activeRadius + 'px',
    left: wordSide === 'left' ? 0 : radius + activeRadius + wordPointInterval
  });
  $viewbox.find('.point').css({
    width: 2 * radius,
    height: 2 * radius,
    'border-radius': radius,
    left: wordSide === 'left' ? width - 2 * radius : 0
  });
  $viewbox.find('.point.active').css({
    width: 2 * activeRadius,
    height: 2 * activeRadius,
    'border-radius': activeRadius,
    left: wordSide === 'left' ? width - radius - activeRadius : radius - activeRadius
  });
  // draw bar
  var $backgroundBar = $('<div class="background-bar"></div>').css({
    width: barWidth,
    left: wordSide === 'left' ? width - (radius + barWidth / 2) : radius - barWidth / 2,
    top: radius,
    height: (currentStep === steps.length - 1) ? currentStep * (2 * radius + pointsInteval) : height - 2 * radius
  });
  var $inactiveBar = $('<div class="inactive-bar"></div>').css({
    width: barWidth,
    left: wordSide === 'left' ? width - (radius + barWidth / 2) : radius - barWidth / 2,
    top: currentStep * (2 * radius + pointsInteval) + radius,
    height: (currentStep === steps.length - 1) ? 0 : height - currentStep * (2 * radius + pointsInteval) - 2 * radius
  });
  $viewbox.prepend($inactiveBar).prepend($backgroundBar);

};





