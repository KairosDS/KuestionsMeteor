var digit2 = $('#digit-2');
var digit3 = $('#digit-3');
var digit4 = $('#digit-4');
var digit5 = $('#digit-5');
var digit6 = $('#digit-6');

function renderDigit(container, number) {
  var matrix;
  switch(number) {
    case 0:
      matrix = [
        true, true, true, true,
        true, false, false, true,
        true, false, false, true,
        true, false, false, true,
        true, false, false, true,
        true, false, false, true,
        true, true, true, true
      ];
      break;
    case 1:
      matrix = [
        false, false, false, true,
        false, false, false, true,
        false, false, false, true,
        false, false, false, true,
        false, false, false, true,
        false, false, false, true,
        false, false, false, true
      ];
      break;
    case 2:
      matrix = [
        true, true, true, true,
        false, false, false, true,
        false, false, false, true,
        true, true, true, true,
        true, false, false, false,
        true, false, false, false,
        true, true, true, true
      ];
      break;
    case 3:
      matrix = [
        true, true, true, true,
        false, false, false, true,
        false, false, false, true,
        false, true, true, true,
        false, false, false, true,
        false, false, false, true,
        true, true, true, true
      ];
      break;
    case 4:
      matrix = [
        true, false, false, false,
        true, false, false, true,
        true, false, false, true,
        true, true, true, true,
        false, false, false, true,
        false, false, false, true,
        false, false, false, true
      ];
      break;
    case 5:
      matrix = [
        true, true, true, true,
        true, false, false, false,
        true, false, false, false,
        true, true, true, true,
        false, false, false, true,
        false, false, false, true,
        true, true, true, true
      ];
      break;
    case 6:
      matrix = [
        true, true, true, true,
        true, false, false, false,
        true, false, false, false,
        true, true, true, true,
        true, false, false, true,
        true, false, false, true,
        true, true, true, true
      ];
      break;
    case 7:
      matrix = [
        true, true, true, true,
        true, false, false, true,
        false, false, false, true,
        false, false, false, true,
        false, false, false, true,
        false, false, false, true,
        false, false, false, true
      ];
      break;
    case 8:
      matrix = [
        true, true, true, true,
        true, false, false, true,
        true, false, false, true,
        true, true, true, true,
        true, false, false, true,
        true, false, false, true,
        true, true, true, true
      ];
      break;
    case 9:
      matrix = [
        true, true, true, true,
        true, false, false, true,
        true, false, false, true,
        true, true, true, true,
        false, false, false, true,
        false, false, false, true,
        false, false, false, true
      ];
      break;
  }
  var children = container.children();
  var len = (matrix)?matrix.length:0;
  for (var i = 0; i < len; i++) {
    children.eq(i).toggleClass('on', matrix[i]);
  }
}

function render() {
  if ( clockActive ) {
    var now = new Date();
    var diff = String(gradclock.getTime() - now.getTime());
    var len = diff.length;
    //console.log(Number(diff.charAt(len-7)), Number(diff.charAt(len-6)), Number(diff.charAt(len-5)), Number(diff.charAt(len-4)), Number(diff.charAt(len-3)));
    renderDigit(digit2, Number(diff.charAt(len-3)));
    renderDigit(digit3, Number(diff.charAt(len-4)));
    renderDigit(digit4, Number(diff.charAt(len-5)));
    renderDigit(digit5, Number(diff.charAt(len-6)));
    renderDigit(digit6, Number(diff.charAt(len-7)));
    requestAnimationFrame(render);
  }
}

//requestAnimationFrame(render);