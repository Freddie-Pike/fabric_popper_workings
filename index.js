let popperInstance = null;

function updatePopperReference(markup, isFabricEvent = true) {
  if (isFabricEvent) {
    $("#popper-reference").css("left", markup.target.left);
    $("#popper-reference").css("top", markup.target.top);
    $("#popper-reference").css("width", markup.target.getScaledWidth());
    $("#popper-reference").css("height", markup.target.getScaledHeight());
    $("#popper-reference").css("transform", `rotate(${markup.target.angle}deg)`);
  } else {
    $("#popper-reference").css("left", markup.left);
    $("#popper-reference").css("top", markup.top);
    $("#popper-reference").css("width", markup.width);
    $("#popper-reference").css("height", markup.height);
    $("#popper-reference").css("transform", `rotate(${markup.angle}deg)`);
  }
}

async function updatePopperPlacement(popperInstance, newPlacement) {
  await popperInstance.setOptions({ placement: newPlacement });
}

$(document).ready(function() {
  var canvas = new fabric.Canvas("c");
  rect = new fabric.Rect({
    left: 80,
    top: 80,
    width: 25,
    height: 100,
    fill: "transparent",
    stroke: "blue",
    strokeWidth: 5
  });
  canvas.add(rect);
  updatePopperReference(rect, false);

  // Creating the modifier that follows the popover on rotating. Declaring default
  // popperPosition of "right" which gets overridden immeditately by the modifier.
  // The default position of right is another method of following the markup.
  var popperPosition = "right";
  const followPopoverOnRotationModifier = {
    name: "followMarkupCardRotation",
    enabled: true,
    phase: "main",
    fn(popperInfo) {
      // I kind of hate the next 3 lines, ngl haha.
      // Got to grab rotation from css transform
      let rotation = popperInfo.state.elements.reference.style.transform;
      let rotationDeg = rotation.split(/[()]/)[1];
      rotation = parseFloat(rotationDeg.substring(0, rotationDeg.length - 3));

      // Rotation starts off as -1 as a default, this return.
      if (Math.sign(rotation) === -1) {
        console.log("negative rotation so return");
        return;
      }

      // Check the rotation from 0-360 and changing the position to make the placement change as
      // smooth as possible.
      console.log(rotation);
      if (rotation >= 0 && rotation < 90) {
        popperPosition = "right-start";
      } else if (rotation >= 90 && rotation < 180) {
        popperPosition = "right-end";
      } else if (rotation >= 180 && rotation < 270) {
        popperPosition = "right-end";
      } else if (rotation >= 270 && rotation < 360) {
        popperPosition = "right-start";
      }
    }
  };

  const popperBoundaryContainer = $("#canvas-div-container")[0];
  popperInstance = Popper.createPopper($("#popper-reference")[0], $("#popper-popover")[0], {
    placement: popperPosition,
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [-10, 20]
        }
      },
      {
        name: "flip",
        enabled: true,
        options: {
          boundary: popperBoundaryContainer
        }
      },
      // YO: Comment this out if you want to try out default positioning.
      followPopoverOnRotationModifier
    ]
  });

  // Setting up fabric events.
  canvas.on("object:moving", function(markup) {
    updatePopperReference(markup);
    popperInstance.update();
  });
  canvas.on("object:scaling", function(markup) {
    updatePopperReference(markup);
    popperInstance.update();
  });
  canvas.on("object:rotating", function(markup) {
    updatePopperReference(markup);
    updatePopperPlacement(popperInstance, popperPosition);
    popperInstance.update();
  });
});
