// version 1.0
$.fn.multisteps = function (config) {
  var $container = $(this);
  // required params
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
  var wordSide = config.wordSide || 'left'; // words' position relative to points, left、 right、top or bottom
  var radius = config.radius || 10; // point radius
  var activeRadius = config.activeRadius || 15; // acitve point radius
  var pointsInteval = typeof config.pointsInteval === 'number' ? config.pointsInteval : 'equalSplit'; // interval between adjacent points, e.g. 10, 20, default will be euqal split in data process;
  var barWidth = config.barWidth || 5; // width of bar which connects points;
  var wordPointInterval = config.wordPointInterval || 5;  // interval between step word and point
  var showIndex = config.showIndex || false; // show index number in point circle or not

  // data process;
  var width = $container.innerWidth() - margin.left - margin.right;
  var height = $container.innerHeight() - margin.top - margin.bottom;
  pointsInteval = (function () { // euqal split
    var m = (currentStep === 0 || currentStep === steps.length - 1) ? (radius + activeRadius) : 2 * activeRadius;
    if (pointsInteval === 'equalSplit') {
      if (wordSide === 'left' || wordSide === 'right') {
        return (height - m) / (steps.length - 1 || 1) - 2 * radius;
      } else {
        return (width - m) / (steps.length - 1 || 1) - 2 * radius;
      }
    }
    return pointsInteval;
  }());

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
  var $backgroundBar;
  var $inactiveBar;
  if (wordSide === 'left' || wordSide === 'right') {
    steps.forEach(function (d, i) {
      var style = '';
      var indexContent = showIndex ? (i + 1) : '';
      if (i < currentStep) {
        style = 'style="top:' + i * (2 * radius + pointsInteval) + 'px"';
        html += '<div class="word step-completed" ' + style + ' data-index=' + i + '>' + d + '</div>';
        html += '<div class="point step-completed" ' + style + ' data-index=' + i + '>' + indexContent + '</div>';
      } else if (i === currentStep) {
        style = 'style="top:' + (i * (2 * radius + pointsInteval) - (activeRadius - radius)) + 'px"';
        html += '<div class="word active" ' + style + ' data-index=' + i + '>' + d + '</div>';
        html += '<div class="point active" ' + style + ' data-index=' + i + '>' + indexContent + '</div>';
      } else {
        style = 'style="top:' + (height - (steps.length - 1 - i) * (2 * radius + pointsInteval) - 2 * radius) + 'px"';
        html += '<div class="word step-uncompleted" ' + style + ' data-index=' + i + '>' + d + '</div>';
        html += '<div class="point step-uncompleted" ' + style + ' data-index=' + i + '>' + indexContent + '</div>';
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
      left: wordSide === 'left' ? width - 2 * radius : 0,
      'text-align': 'center',
      'line-height': 2 * radius + 'px',
    });
    $viewbox.find('.point.active').css({
      width: 2 * activeRadius,
      height: 2 * activeRadius,
      'border-radius': activeRadius,
      left: wordSide === 'left' ? width - radius - activeRadius : radius - activeRadius,
      'line-height': 2 * activeRadius + 'px',
    });
    // draw bar
    $backgroundBar = $('<div class="background-bar"></div>').css({
      width: barWidth,
      left: wordSide === 'left' ? width - (radius + barWidth / 2) : radius - barWidth / 2,
      top: radius,
      height: (currentStep === steps.length - 1) ? currentStep * (2 * radius + pointsInteval) : height - 2 * radius
    });
    $inactiveBar = $('<div class="inactive-bar"></div>').css({
      width: barWidth,
      left: wordSide === 'left' ? width - (radius + barWidth / 2) : radius - barWidth / 2,
      top: currentStep * (2 * radius + pointsInteval) + radius,
      height: (currentStep === steps.length - 1) ? 0 : height - currentStep * (2 * radius + pointsInteval) - 2 * radius
    });
    $viewbox.prepend($inactiveBar).prepend($backgroundBar);

  } else { // wordside === 'top' or 'bottom'
    steps.forEach(function (d, i) {
      var style = '';
      var indexContent = showIndex ? (i + 1) : '';
      if (i < currentStep) {
        style = 'style="left:' + i * (2 * radius + pointsInteval) + 'px"';
        html += '<div class="word step-completed" ' + style + ' data-index=' + i + '>' + d + '</div>';
        html += '<div class="point step-completed" ' + style + ' data-index=' + i + '>' + indexContent + '</div>';
      } else if (i === currentStep) {
        style = 'style="left:' + (i * (2 * radius + pointsInteval) - (activeRadius - radius)) + 'px"';
        html += '<div class="word active" ' + style + ' data-index=' + i + '>' + d + '</div>';
        html += '<div class="point active" ' + style + ' data-index=' + i + '>' + indexContent + '</div>';
      } else {
        style = 'style="left:' + (width - (steps.length - 1 - i) * (2 * radius + pointsInteval) - 2 * radius) + 'px"';
        html += '<div class="word step-uncompleted" ' + style + ' data-index=' + i + '>' + d + '</div>';
        html += '<div class="point step-uncompleted" ' + style + ' data-index=' + i + '>' + indexContent + '</div>';
      }
    });
    $viewbox.html(html);
    $viewbox.find('.word').each(function () {
      var w = $(this).width();
      var h = $(this).height();
      var left = parseInt($(this).css('left').split('px')[0], 10);
      $(this).css({
        left: left - w / 2 + radius,
        'text-align': 'center',
        top: wordSide === 'top' ? height - 2 * radius - wordPointInterval - h : 2 * radius + wordPointInterval,
      });
      if ($(this).hasClass('active')) {
        $(this).css({
          left: left - w / 2 + activeRadius,
          top: wordSide === 'top' ? height - activeRadius - radius - wordPointInterval - h : activeRadius + radius + wordPointInterval,
        });
      }
    });
    $viewbox.find('.point').css({
      width: 2 * radius,
      height: 2 * radius,
      'border-radius': radius,
      top: wordSide === 'top' ? height - 2 * radius : 0,
      'text-align': 'center',
      'line-height': 2 * radius + 'px',
    });
    $viewbox.find('.point.active').css({
      width: 2 * activeRadius,
      height: 2 * activeRadius,
      'border-radius': activeRadius,
      top: wordSide === 'top' ? height - radius - activeRadius : radius - activeRadius,
      'line-height': 2 * activeRadius + 'px',
    });
    // draw bar
    $backgroundBar = $('<div class="background-bar"></div>').css({
      height: barWidth,
      top: wordSide === 'top' ? height - (radius + barWidth / 2) : radius - barWidth / 2,
      left: radius,
      width: (currentStep === steps.length - 1) ? currentStep * (2 * radius + pointsInteval) : width - 2 * radius
    });
    $inactiveBar = $('<div class="inactive-bar"></div>').css({
      height: barWidth,
      top: wordSide === 'top' ? height - (radius + barWidth / 2) : radius - barWidth / 2,
      left: currentStep * (2 * radius + pointsInteval) + radius,
      width: (currentStep === steps.length - 1) ? 0 : width - currentStep * (2 * radius + pointsInteval) - 2 * radius
    });
    $viewbox.prepend($inactiveBar).prepend($backgroundBar);

  }

};





