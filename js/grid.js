paper.install(window);

window.onload = function () {
  paper.setup("gridCanvas");
  let colors = ["magenta", "yellow", "cyan"];
  let triangles = [];
  const segmentSize = 40;
  triangleGrid(new Point(segmentSize, 0).rotate(-30), segmentSize, colors);
  view.draw();
};

function triangleGrid(start, size, palette) {
  const doubleJump = new Point(size, 0)
    .rotate(30)
    .add(new Point(size, 0).rotate(-30));
  triangleQuadColumn(start, size, palette);
  let next = start.add(doubleJump);
  if (next.subtract(doubleJump).x < view.size.width) {
    triangleGrid(next, size, palette);
  }
}

function triangleQuadColumn(start, size, palette) {
  const pathSettings = {
    strokeColor: "#999",
    fillColor: "#333",
    closed: true,
  };
  const jump = new Point(0, size);
  let triangles = [
    new Path(pathSettings),
    new Path(pathSettings),
    new Path(pathSettings),
    new Path(pathSettings),
  ];
  triangles.forEach((tri) => {
    tri.add(start);
    tri.onClick = function () {
      clickColor(this, palette);
    };
  });
  triangles[0].add(start.add(jump.rotate(60)));
  triangles[0].add(triangles[0].lastSegment.point.add(jump.rotate(180)));
  triangles[1].add(start.add(jump.rotate(60)));
  triangles[1].add(triangles[1].lastSegment.point.add(jump.rotate(-60)));
  triangles[2].add(start.add(jump.rotate(-60)));
  triangles[2].add(triangles[2].lastSegment.point.add(jump.rotate(60)));
  triangles[3].add(start.add(jump.rotate(-60)));
  triangles[3].add(triangles[3].lastSegment.point.add(jump.rotate(180)));

  if (start.add(jump).y <= view.size.height) {
    triangleQuadColumn(start.add(jump), size, palette);
  }
}

function clickColor(obj, palette) {
  console.log("hi");
  obj.strokeColor = "#99999933";
  if (Key.isDown("t")) {
    obj.fillColor = palette[0];
  } else if (Key.isDown("f")) {
    obj.fillColor = palette[1];
  } else if (Key.isDown("s")) {
    obj.fillColor = palette[2];
  } else {
    obj.fillColor = "#333";
    obj.strokeColor = "#999";
  }
}

function makeTriangle(start, size, palette) {
  const jump = new Point(size, 0).rotate(30);
  let p = new Path({
    strokeColor: "black",
    fillColor: "white",
    closed: true,
  });
  p.add(start);
  p.add(p.lastSegment.point.add(jump));
  p.add(p.lastSegment.point.add(jump.rotate(120)));
  p.onClick = function () {
    this.strokeColor = "#0003";
    if (Key.isDown("t")) {
      this.fillColor = palette[0];
    } else if (Key.isDown("f")) {
      this.fillColor = palette[1];
    } else if (Key.isDown("s")) {
      this.fillColor = palette[2];
    } else {
      this.fillColor = "#0009";
    }
  };
  return p;
}
