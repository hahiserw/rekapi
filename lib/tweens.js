$(function () {

  function getCrosshairCoords (crosshair) {
    var pos = crosshair.position();
    return {
      x: pos.left + crosshair.width()/2
      ,y: pos.top + crosshair.height()/2
    };
  }

  var ANIM_LENGTH = 2000;
  var canvas = $('canvas')[0];
  var kapi = new Kapi(canvas, {
      'fps': 60
      ,'height': 400
      ,'width': 500
    })
    ,circle = new Kapi.Actor({
      'draw': function (canvas_context, state) {
        canvas_context.beginPath();
          canvas_context.arc(
            state.x || 0,
            state.y || 0,
            state.radius || 50,
            0,
            Math.PI*2,
            true);
          canvas_context.fillStyle = state.color || '#444';
          canvas_context.fill();
          canvas_context.closePath();
          return this;
        }
      });
  kapi.canvas_style('background', '#eee');

  var crosshairs = {
    'from': $('.crosshair.from')
    ,'to': $('.crosshair.to')
  };

  crosshairs.from.add(crosshairs.to).draggable({
    'containment': 'parent'
    ,'drag': handleDrag
  });

  function handleDrag (evt, ui) {
    var target = $(evt.target);
    var pos = target.data('pos');
    var timeToModify = pos === 'from' ? 0 : ANIM_LENGTH;
    circle.modifyKeyframe(timeToModify, getCrosshairCoords(crosshairs[pos]));
  }

  kapi.addActor(circle);
  circle.keyframe(0, _.extend(getCrosshairCoords(crosshairs.from), {
      'color': '#333'
      ,'radius': 25
    }))
    .keyframe(ANIM_LENGTH, _.extend(getCrosshairCoords(crosshairs.to), {

    }));

  kapi.play();

});