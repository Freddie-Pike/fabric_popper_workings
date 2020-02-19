function updatePopperReference(markup, isFabricEvent = true) {
  if (isFabricEvent) {
    // Can use markup.target as shorthand but just bein' wild.
    $("#popper-reference").css("left", markup.transform.target.left);
    $("#popper-reference").css("top", markup.transform.target.top);
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
    stroke: "green",
    strokeWidth: 5
  });
  updatePopperReference(rect, false);

  // const topLogger = {
  //   name: "topLogger",
  //   enabled: true,
  //   phase: "main",
  //   fn(popperInfo) {
  //     // console.log(`popper popperInfo is`);
  //     // console.log(popperInfo);
  //     console.log(popperInfo.state.elements.reference.style.transform);
  //     let rotation = popperInfo.state.elements.reference.style.transform;
  //     let rotationDeg = rotation.split(/[()]/)[1];
  //     rotation = parseFloat(rotationDeg.substring(0, rotationDeg.length - 3));
  //     if (Math.sign(rotation) === -1) {
  //       console.log("negative rotation");
  //       return;
  //     }

  //     if (rotation >= 0 && rotation < 90) {
  //       updatePopperPlacement(popperInstance, rotation);
  //       console.log("bottom-start");
  //     } else if (rotation >= 90 && rotation < 180) {
  //       updatePopperPlacement(popperInstance, rotation);
  //       console.log("top-start");
  //     } else if (rotation >= 180 && rotation < 270) {
  //       updatePopperPlacement(popperInstance, rotation);
  //       console.log("right-start");
  //     } else if (rotation >= 270 && rotation < 360) {
  //       updatePopperPlacement(popperInstance, rotation);
  //       console.log("bottom-end");
  //     }
  //   }
  // };
  var popperInstance = Popper.createPopper($("#popper-reference")[0], $("#popper-popover")[0], {
    placement: "right-start",
    // strategy: 'fixed',
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [-10, 20]
        }
      }
    ]
  });

  canvas.on("object:moving", function(markup) {
    console.log("Moving A rectangle");
    console.log(markup);
    // console.log(markup.target.left);
    // console.log(markup.target.top);

    updatePopperReference(markup);
    popperInstance.update();
  });
  canvas.on("object:scaling", function(markup) {
    console.log("Scaling A rectangle");
    console.log(markup);
    // console.log(markup.target.left);
    // console.log(markup.target.top);

    updatePopperReference(markup);
    popperInstance.update();
  });
  canvas.on("object:rotating", function(markup) {
    console.log("Rotating A rectangle");
    console.log(markup);

    updatePopperReference(markup);
    popperInstance.update();
  });

  canvas.add(rect);
});
