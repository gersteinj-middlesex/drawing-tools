paper.install(window);

window.onload = function () {
  paper.setup("gridCanvas");
  let drawingActive = false;
  let startPoint;
  let endPoint;
  const gridLayer = project.activeLayer;
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
  const unitSize = 50;
  const jumps = {
    X: new Point(unitSize, 0).rotate(30),
    Z: new Point(unitSize, 0).rotate(150),
    Y: new Point(0, unitSize),
  };

  const nodes = generateGrid(
    view.bounds.topLeft,
    view.bounds.bottomRight,
    jumps.X,
    jumps.Y,
    nodeSettings
  );

  let xLines = new Layer();
  let yLines = new Layer();
  let zLines = new Layer();
  const gridLineScale = .45;
  let drawingLayer = new Layer();

  nodes.forEach(node => {
    xLines.activate();
    generateGridLine(node.position, jumps.X, gridLineScale);
    yLines.activate();
    generateGridLine(node.position, jumps.Y, gridLineScale);
    zLines.activate();
    generateGridLine(node.position, jumps.Z, gridLineScale);
    
    node.onClick = event => {
      if(!drawingActive) {
        event.target.data.active = true;
        startPoint = event.target.position;
        drawingActive = true;
      } else {
        endPoint = event.target.position;
        console.log("draw!");
        drawingActive = false;
        new Path.Line(startPoint, endPoint).strokeColor = "red";
      }
      console.log(startPoint);
    }
  })

  gridLayer.bringToFront();
  drawingLayer.activate();
  view.draw();
};

function generateGridLine(center, jump, scale) {
  let p = new Path.Line(center.subtract(jump.multiply(scale)), center.add(jump.multiply(scale)));
  p.strokeColor = "#00ccff33";
  p.strokeWidth = 3;
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
