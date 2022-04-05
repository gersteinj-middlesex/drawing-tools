paper.install(window);

window.onload = function () {
  paper.setup("gridCanvas");

  /*****************************
   * Setting up layers, global *
   * variables, and config     *
   * objects                   *
   *****************************/

  let drawingActive = false;
  let currentMode = "edit";
  let currentPath;
  const gridLayer = project.activeLayer;
  let xLines = new Layer();
  let yLines = new Layer();
  let zLines = new Layer();
  let drawingLayer = new Layer();
  let buttonsLayer = new Layer();
  // TODO: find better way to arrange layers
  gridLayer.bringToFront();
  buttonsLayer.bringToFront();
  const colors = {
    top: "magenta",
    front: "cyan",
    side: "yellow",
    inactive: "#fff9",
    plain: "white"
  };
  const nodeSettings = {
    radius: 10,
    fillColor: colors.inactive,
    strokeColor: "black",
    data: {
      active: false,
    }
  };
  const drawingSettings = {
    strokeColor: new Color(0, 0, 0, .5),
    fillColor: colors.plain,
    strokeWidth: 10,
    closed: true,
  };
  const unitSize = 50;
  const jumps = {
    X: new Point(unitSize, 0).rotate(30),
    Z: new Point(unitSize, 0).rotate(150),
    Y: new Point(0, unitSize),
  };
  const gridLineScale = .45;

  const buttonNames = ["top", "front", "side", "esc", "edit"]
  const buttonLabelSettings = {
    fontSize: 50,
    fontFamily: "cabin, cabin sketch, cabin, sans-serif",
    fillColor: "white",
    shadowColor: "black",
    shadowOffset: new Point(0, 0),
    shadowBlur: 10,
    strokeColor: "black"
  }

  const buttonBoxSettings = {
    fillColor: new Color(20, 20, 20, .65),
    strokeColor: "black",
    shadowColor: "black",
    shadowBlur: 10,
  }

  const drawingModes = {
    top: () => {
      console.log('setting top mode');
      xLines.visible = true;
      yLines.visible = false;
      zLines.visible = true;
    },
    front: () => {
      xLines.visible = true;
      yLines.visible = true;
      zLines.visible = false;
    },
    side: () => {
      xLines.visible = false;
      yLines.visible = true;
      zLines.visible = true;
    },
    edit: () => {
      xLines.visible = true;
      yLines.visible = true;
      zLines.visible = true;
    }
  }

  /*****************************
   * Create buttons            *
   *****************************/
  buttonsLayer.activate();
  let count = 0
  let buttons = buttonNames.map(name => {
    let buttonHeight = buttonLabelSettings.fontSize * 1.5;
    thisButton = { content: name, point: new Point(20, buttonHeight * (count + 1)) }
    let buttonLabel = new PointText({ ...buttonLabelSettings, ...thisButton });
    count += 1

    let buttonBox = new Path.Rectangle(buttonLabel.bounds.expand(25, 5));
    buttonBox.style = buttonBoxSettings;

    let g = new Group(buttonBox, buttonLabel);
    g.on({
      click: (event) => {
        let buttonLabel = event.target.children[1].content;
        if (buttonLabel == "esc") { drawingActive = false; }
        else {
          currentMode = buttonLabel;
          drawingModes[currentMode]();
        }
      },
      mouseleave: (event) => { console.log('bye'); }
    })
    return g;
  });

  console.log(buttons);

  /*****************************
   * Activate grid layer       *
   * Create grid nodes         *
   *****************************/

  gridLayer.activate();
  const nodes = generateGrid(
    view.bounds.topLeft,
    view.bounds.bottomRight,
    jumps.X,
    jumps.Y,
    nodeSettings
  );


  /*****************************
   * Iterate through all nodes *
   * Create grid lines         *
   * Add click event to nodes  *
   *****************************/

  nodes.forEach(node => {
    xLines.activate();
    generateGridLine(node.position, jumps.X, gridLineScale);
    yLines.activate();
    generateGridLine(node.position, jumps.Y, gridLineScale);
    zLines.activate();
    generateGridLine(node.position, jumps.Z, gridLineScale);

    node.onClick = event => {
      console.log(drawingLayer.children);
      if (!drawingActive) {
        currentPath = new Path(drawingSettings);
        currentPath.add(event.target.position);
        drawingActive = true;
      } else {
        currentPath.add(event.target.position);
      }

    }
  })

  /*****************************
   * Activate drawing layer    *
   * Hide/show axes            *
   * Respond to keyboad UI     *
   *****************************/

  drawingLayer.activate();
  view.onKeyDown = event => {
    let k = event.key;

    console.log(`Current Mode: ${currentMode}`);
  }
  view.draw();
};


function generateGridLine(center, jump, scale) {
  let p = new Path.Line(center.subtract(jump.multiply(scale)), center.add(jump.multiply(scale)));
  p.strokeColor = "#00ccff33";
  p.strokeWidth = 8;
}

function generateGrid(start, end, xJump, yJump, nodeSettings) {
  let gridPoints = [];
  for (let x = 0; x * xJump.x <= end.x; x++) {
    let firstPoint = new Point(xJump.x * x, 0);
    if (x % 2 == 0) {
      firstPoint.y += yJump.y / 2;
    }

    generateColumn(firstPoint, end, yJump).map((p) => {
      gridPoints.push(p);
    });
  }
  let nodes = gridPoints.map((point) => {
    nodeSettings.position = point;
    return new Path.Circle(nodeSettings);
  });
  return nodes;
}

function generateColumn(start, end, yJump) {
  let columnPoints = [];
  for (let y = start.y; y < end.y; y += yJump.y) {
    columnPoints.push(new Point(start.x, y));
  }
  return columnPoints;
}

function resizeFunction() {
  console.log("resized");
}
