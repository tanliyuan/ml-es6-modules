/** YOU DON'T NEED THIS FILE TO USE THE MACHINE LEARNING MODULES
 * @name drawer.js
 * @description
 * function in charge of the drawing process. Keeps a local instace of one algorithm and draws based on his predictions.
 * @copyright Davide Ghiotto
 */
import { getFunction, boost } from "./input.js";
let id = 1;
export const Drawer = function(algorithm, canvas, options) {
  this.id = id++;
  this.algorithm = algorithm;
  this.canvas = canvas;
  this.ctx = canvas.getContext("2d");
  if (this.ctx) {
    canvas.addEventListener("click", e => this.mouseClick(this.eventClick(e)));
    this.options = options || {
      margin: {
        soft: true
      },
      data_radius: 6,
      test_radius: 4
    };
    this.WIDTH = canvas.width;
    this.HEIGHT = canvas.height;
    this.options.ss = this.options.ss || 20;
    this.options.density = this.options.density || 3;
  } else console.warn("Could not get context from canvas: " + canvas);
};

Drawer.prototype = {
  getOptions: function() {
    let options = {
      group: "drawer" + this.id,
      margin: {
        group: "margin",
        soft: {
          id: "soft",
          type: "radio",
          name: "margin" + this.id,
          value: "soft",
          checked: this.options.margin.soft
        },
        hard: {
          id: "hard",
          type: "radio",
          name: "margin" + this.id,
          value: "hard",
          checked: !this.options.margin.soft
        }
      },
      data_radius: {
        id: "data_radius",
        type: "range",
        min: 1,
        max: 10,
        step: 1,
        value: 6
      },
      test_radius: {
        id: "test_radius",
        type: "range",
        min: 1,
        max: 10,
        step: 1,
        value: 4
      },
      ss: {
        id: "ss",
        type: "range",
        min: 1,
        max: 50,
        step: 1,
        value: 20
      },
      density: {
        id: "density",
        type: "range",
        min: 1,
        max: 10,
        step: 1,
        value: 3
      },
      boosted: {
        id: "boosted",
        type: "checkbox",
        value: "boosted",
        checked: this.options.boosted,
        disabled: true
      }
    };
    if (this.options.boosted) {
      options.input_functions = {
        group: "input_functions",
        x2: {
          id: "x2",
          type: "checkbox",
          value: "x2",
          name: "input_functions" + this.id,
          checked: false
        },
        y2: {
          id: "y2",
          type: "checkbox",
          value: "y2",
          name: "input_functions" + this.id,
          checked: false
        },
        x3: {
          id: "x3",
          type: "checkbox",
          value: "x3",
          name: "input_functions" + this.id,
          checked: false
        },
        y3: {
          id: "y3",
          type: "checkbox",
          value: "y3",
          name: "input_functions" + this.id,
          checked: false
        },
        x2y2: {
          id: "x2y2",
          type: "checkbox",
          value: "x2y2",
          name: "input_functions" + this.id,
          checked: false
        },
        x2_y2: {
          id: "x2_y2",
          type: "checkbox",
          value: "x2_y2",
          name: "input_functions" + this.id,
          checked: false
        },
        xy: {
          id: "xy",
          type: "checkbox",
          value: "xy",
          name: "input_functions" + this.id,
          checked: false
        },
        sinx: {
          id: "sinx",
          type: "checkbox",
          value: "sinx",
          name: "input_functions" + this.id,
          checked: false
        },
        siny: {
          id: "siny",
          type: "checkbox",
          value: "siny",
          name: "input_functions" + this.id,
          checked: false
        },
        cosx: {
          id: "cosx",
          type: "checkbox",
          value: "cosx",
          name: "input_functions" + this.id,
          checked: false
        },
        cosy: {
          id: "cosy",
          type: "checkbox",
          value: "cosy",
          name: "input_functions" + this.id,
          checked: false
        },
        sinxcosy: {
          id: "sinxcosy",
          type: "checkbox",
          value: "sinxcosy",
          name: "input_functions" + this.id,
          checked: false
        },
        sinycosx: {
          id: "sinycosx",
          type: "checkbox",
          value: "sinycosx",
          name: "input_functions" + this.id,
          checked: false
        },
        sinxcosydot: {
          id: "sinxcosydot",
          type: "checkbox",
          value: "sinxcosydot",
          name: "input_functions" + this.id,
          checked: false
        },
        sinycosxdot: {
          id: "sinycosxdot",
          type: "checkbox",
          value: "sinycosxdot",
          name: "input_functions" + this.id,
          checked: false
        }
      };
    }
    return options;
  },
  setOptions: function(options) {
    this.options = options || {};
  },
  getBoosting: function() {
    if (this.options.boosted) {
      let input_functions = [];
      for (let i in this.options.input_functions)
        if (this.options.input_functions[i])
          input_functions.push(getFunction(i));
      return input_functions;
    } else return [];
  },
  setManager: function(manager) {
    this.manager = manager;
  },
  setAlgorithm: function(algorithm) {
    this.algorithm = algorithm;
  },
  getAlgorithm: function() {
    return this.algorithm;
  },
  draw: function(points, labels) {
    //clear
    this.ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT);
    //draw grid
    this.drawGrid();
    //draw axes
    this.drawAxes();
    //draw data points
    this.drawDataPoints(points, labels);
  },
  drawGrid: function() {
    let boosting = [];
    if (this.options.boosted) {
      boosting = this.getBoosting();
    }
    for (let x = 0.0; x <= this.WIDTH; x += this.options.density) {
      for (let y = 0.0; y <= this.HEIGHT; y += this.options.density) {
        let X = (x - this.WIDTH / 2) / this.options.ss;
        let Y = (y - this.HEIGHT / 2) / this.options.ss;
        let point = boost(boosting, [X, Y]);
        let predicted_class = this.algorithm.predictClass(point);
        let predicted_value = 0;
        if (this.options.margin.soft)
          predicted_value = this.algorithm.predict(point);
        else predicted_value = predicted_class;

        this.ctx.fillStyle = getColor(predicted_value, predicted_class);
        this.ctx.fillRect(
          x - this.options.density / 2 - 1,
          y - this.options.density - 1,
          this.options.density + 2,
          this.options.density + 2
        );
      }
    }
  },
  drawAxes: function() {
    this.ctx.beginPath();
    this.ctx.strokeStyle = "rgb(50,50,50)";
    this.ctx.lineWidth = 1;
    this.ctx.moveTo(0, this.HEIGHT / 2);
    this.ctx.lineTo(this.WIDTH, this.HEIGHT / 2);
    this.ctx.moveTo(this.WIDTH / 2, 0);
    this.ctx.lineTo(this.WIDTH / 2, this.HEIGHT);
    this.ctx.stroke();
  },
  drawDataPoints: function(points, labels) {
    let radius = this.options.data_radius || 6;
    let boosting = [];
    if (this.options.boosted) {
      boosting = this.getBoosting();
    }
    for (let i = 0; i < points.length; i++) {
      let prediction = this.algorithm.predictClass(boost(boosting, points[i]));
      this.ctx.fillStyle = getPointColor(prediction, labels[i]);
      this.drawCircle(
        points[i][0] * this.options.ss + this.WIDTH / 2,
        points[i][1] * this.options.ss + this.HEIGHT / 2,
        radius
      );
    }
  },
  drawTestPoints: function(points, labels) {
    let radius = this.options.test_radius || 4;
    for (let i = 0; i < points.length; i++) {
      let prediction = this.algorithm.predictClass(boost(points[i]));
      this.ctx.fillStyle = getPointColor(prediction, labels[i]);
      this.drawCircle(
        points[i][0] * this.options.ss + this.WIDTH / 2,
        points[i][1] * this.options.ss + this.HEIGHT / 2,
        radius
      );
    }
  },
  drawCircle: function(x, y, r) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, Math.PI * 2, true);
    this.ctx.closePath();
    this.ctx.stroke();
    this.ctx.fill();
  },
  mouseClick: function({ x, y, shiftPressed, ctrlPressed }) {
    let point = [
      (x - this.WIDTH / 2) / this.options.ss,
      (y - this.HEIGHT / 2) / this.options.ss
    ];
    if (ctrlPressed) this.manager.removePoint(point);
    else {
      let label = shiftPressed ? 1 : -1;
      this.manager.addPoint(point, label);
    }
    this.manager.notifyAll();
  },
  eventClick: function(e) {
    //get position of cursor relative to top left of canvas
    let x = 0;
    let y = 0;
    if (e.pageX || e.pageY) {
      x = e.pageX;
      y = e.pageY;
    }
    x -= this.canvas.offsetLeft;
    y -= this.canvas.offsetTop;
    return { x: x, y: y, shiftPressed: e.shiftKey, ctrlPressed: e.ctrlKey };
  }
};

function getPointColor(predicted, real) {
  if (predicted * real > 0) {
    if (predicted > 0) return "rgb(150,250,150)";
    else return "rgb(250,150,150)";
  } else {
    if (predicted > 0) return "rgb(105,147,250)";
    else return "rgb(240,226,63)";
  }
}

function getColor(predicted, real) {
  let ri, gi;
  if (predicted < 0) {
    // less red 250-150
    ri = 150 - 100 * predicted; //with value = -1 ===> ri = 250
    gi = 250 + 100 * predicted; //with value = -1 ===> gi = 150
  } else {
    //less green 150-250
    ri = 250 - 100 * predicted; //with value = 1 ===> ri = 150
    gi = 150 + 100 * predicted; //with value = 1 ===> gi = 250
  }
  if (real > 0) gi += 5;
  else ri += 35;
  return "rgb(" + Math.floor(ri) + "," + Math.floor(gi) + ",150)";
}
