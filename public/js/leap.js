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
    var threshold = 100;
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