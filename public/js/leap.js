var LeapController = new Leap.Controller({
  enableGestures: true,
  frameEventName: 'animationFrame'
});

LeapController.on('connect', function(){
  setInterval(function(){
    onLeapInterval(LeapController.frame());
  }, 100);
});

LeapController.connect();

function onLeapInterval(frame){
  if (frame.valid){
    // Check for two-handed in or out motion to hide/show menu
    checkTwoHandedGesture(frame);
  }
}

function checkTwoHandedGesture(frame){
  var hands = frame.hands;

  if (hands.length === 2){
    var threshold = 200;
    var leftVelocity = hands[0].palmVelocity[0];
    var rightVelocity = hands[1].palmVelocity[0];

    if (leftVelocity < threshold && rightVelocity > threshold){
      hideUi();
    }
    else if (leftVelocity > threshold && rightVelocity < threshold){
      showUi();
    }
  }
}

var uiElements = [
  'countries',
  'stats',
  'live-data',
  'credits',
  'instructions',
  'demo-instructions',
  'campaign-menu'
];

function showUi(){
  for (var i = 0, l = uiElements.length; i < l; i++){
    $("#" + uiElements[i]).show("slow", function(){});
  }
}

function hideUi(){
  for (var i = 0, l = uiElements.length; i < l; i++){
    $("#" + uiElements[i]).hide("slow", function(){});
  }
}