paper.install(window);

window.onload = function () {
  paper.setup("gridCanvas");

  /*****************************
   * Setting up layers, global *
   * variables, and config     *
   * objects                   *
   *****************************/

  let drawingActive = false;
  let currentPath;
  const gridLayer = project.activeLayer;
  let xLines = new Layer();
  let yLines = new Layer();
  let zLines = new Layer();
  let drawingLayer = new Layer();
  gridLayer.bringToFront();
  const colors = {
    top: "magenta",
    front: "cyan",
    side: "yellow",
    inactive: "#fff6",
  };
  const nodeSettings = {
    radius: 10,
    fillColor: colors.inactive,
    strokeColor: "black",
    data: {
      active: false,
    }
  };
  const drawingLineSettings = {
    strokeColor: "red",
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
        currentPath = new Path(drawingLineSettings);
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
    console.log(k);
    if (k == "t") {
      xLines.visible = true;
      yLines.visible = false;
      zLines.visible = true;
    } else if (k == 'f') {
      xLines.visible = true;
      yLines.visible = true;
      zLines.visible = false;
    } else if (k == 's') {
      xLines.visible = false;
      yLines.visible = true;
      zLines.visible = true;
    } else if (k == 'a') {
      xLines.visible = true;
      yLines.visible = true;
      zLines.visible = true;
    } else if (k == 'c') {
      xLines.visible = false;
      yLines.visible = false;
      zLines.visible = false;
    }
    else if (k == 'escape') {
      drawingActive = false;
    }
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
  let nodes = [];
  gridPoints.forEach((point) => {
    nodeSettings.position = point;
    nodes.push(new Path.Circle(nodeSettings));
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
