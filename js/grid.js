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
    jumps.Y
  );

  console.log(gridPoints);
  gridPoints.forEach(point => {
      new Path.Circle({
        position: point,
        radius: 5,
        strokeColor: "purple"
      })
  })


  
  view.draw();
};

function generateGrid(start, end, xJump, yJump) {
  let gridPoints = []
  for(let x = 0; x*xJump.x <= end.x; x++){
    let firstPoint = new Point(xJump.x*x, 0);
    if (x % 2 == 0) {
      firstPoint.y += yJump.y/2;
    }

    generateColumn(firstPoint, end, yJump).map(p => {
      gridPoints.push(p);
    });
  }
  return gridPoints;
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
