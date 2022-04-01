paper.install(window);

window.onload = function () {
  paper.setup("gridCanvas");
  const gridLayer = project.activeLayer;
  const colors = {
    top: "magenta",
    front: "cyan",
    side: "yellow",
    cleared: "#333",
  };
  const nodeSettings = {
    radius: 5,
    fillColor: "#ccc",
  };
  const unitSize = 50;
  const jumps = {
    X: new Point(unitSize, 0).rotate(30),
    Z: new Point(unitSize, 0).rotate(150),
    Y: new Point(0, unitSize),
  };

  const gridPoints = generateGrid(
    view.bounds.topLeft,
    view.bounds.bottomRight,
    jumps.X,
    jumps.Y,
    nodeSettings
  );

  let xLines = new Layer();
  gridPoints.forEach(node => {
    generateGridLine(node.position, jumps.X, .3);
  })

  let yLines = new Layer();
  gridPoints.forEach(node => {
    generateGridLine(node.position, jumps.Y, .3);
  })
  
  let zLines = new Layer();
  gridPoints.forEach(node => {
    generateGridLine(node.position, jumps.Z, .3);
  })

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
