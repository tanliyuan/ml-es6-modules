import { LogisticRegression as LOGREG } from "./logreg/logreg";
import { SVM } from "./svm/svm";
import { KNN } from "./knn/knn";
import { RBF } from "./rbf/rbf";
import { RandomForest as RANDF } from "./randf/randf";
import { drawer, master_drawer } from "./drawer";
import { NeuralNet } from "./nn/nn";

let drawers = [];

let data = [
  [1, 0],
  [2, 3],
  [5, 4],
  [2, 7],
  [0, 3],
  [-1, 0],
  [-3, -4],
  [-2, -2],
  [-1, -1],
  [-5, -2]
];
let labels = [1, 1, 1, 1, 1, -1, -1, -1, -1, -1];

let svm_linear = new SVM();
let svm_linear_options = {
  kernel: "linear",
  degree: 1,
  influence: 0,
  C: 1,
  SSCA: false,
  UB: 0.5,
  memoize: true,
  input_functions: [],
  karpathy: true,
  timer: null
};
svm_linear.train(data, labels, svm_linear_options);

let svm_poly = new SVM();
let svm_poly_options = {
  kernel: "poly",
  degree: 2,
  influence: 0,
  C: 1,
  SSCA: false,
  UB: 0.5,
  memoize: true,
  input_functions: [],
  karpathy: true,
  timer: null
};
svm_poly.train(data, labels, svm_poly_options);

let svm_rbf = new SVM();
let svm_rbf_options = {
  kernel: "rbf",
  degree: 2,
  influence: 0,
  C: 1,
  SSCA: false,
  UB: 0.5,
  memoize: true,
  input_functions: [],
  karpathy: true,
  timer: null
};
svm_rbf.train(data, labels, svm_rbf_options);

let knn = new KNN();
let knn_options = {
  k: 3,
  distance: "minkowski",
  p: 1.5
};
knn.train(data, labels, knn_options);

let rbf = new RBF();
let rbf_options = {
  epsilon: 0.1,
  rbfSigma: 0.5
};
rbf.train(data, labels, rbf_options);

let randf = new RANDF();
let randf_options = {
  numTrees: 100
};
randf.train(data, labels, randf_options);

let logreg = new LOGREG();
let logreg_options = {};
logreg.train(data, labels, logreg_options);

let nn = new NeuralNet();
let nn_options = {};
nn.train(data, labels, nn_options);

// update canvas on mouseclick
let mouseClick = ({ x, y, shiftPressed }) => {
  let t0 = performance.now();
  // store point
  data.push([
    (x - master.WIDTH / 2) / master.ss,
    (y - master.HEIGHT / 2) / master.ss
  ]);
  labels.push(shiftPressed ? 1 : -1);

  // draw master
  master.draw(data, labels);

  // train
  training(data, labels);

  // draw all
  drawers.forEach(drawer => drawer.draw(data, labels));

  let t1 = performance.now();
  console.info(t1 - t0 + " ms");
};

//master canvas with mouse click event listener
let master_canvas = document.getElementById("draw-canvas-test");
let master = new master_drawer(master_canvas, mouseClick, {});
master.draw(data, labels);

//create the other drawers
drawers.push(
  new drawer(svm_linear, document.getElementById("svm-linear-canvas"), {
    margin: "soft"
  })
);
drawers.push(
  new drawer(svm_poly, document.getElementById("svm-poly-canvas"), {
    margin: "soft"
  })
);
drawers.push(
  new drawer(svm_rbf, document.getElementById("svm-rbf-canvas"), {
    margin: "soft"
  })
);
drawers.push(
  new drawer(knn, document.getElementById("knn-canvas"), { margin: "soft" })
);
drawers.push(
  new drawer(rbf, document.getElementById("rbf-canvas"), { margin: "soft" })
);
drawers.push(
  new drawer(randf, document.getElementById("randf-canvas"), { margin: "soft" })
);
drawers.push(
  new drawer(logreg, document.getElementById("logreg-canvas"), {
    margin: "soft"
  })
);
drawers.push(
  new drawer(nn, document.getElementById("nn-canvas"), { margin: "soft" })
);

//draw all
drawers.forEach(drawer => drawer.draw(data, labels));

function training(data, labels) {
  svm_linear.train(data, labels, svm_linear_options);
  svm_poly.train(data, labels, svm_poly_options);
  svm_rbf.train(data, labels, svm_rbf_options);
  knn.train(data, labels, knn_options);
  rbf.train(data, labels, rbf_options);
  randf.train(data, labels, randf_options);
  logreg.train(data, labels, logreg_options);
  nn.train(data, labels, nn_options);
}

function selectPredictors(data,chosen1,chosen2) {
  let predictors = [];
  data.forEach(point => predictors.push([point[chosen1], point[chosen2]]));
  console.table(predictors);
}

let multi = [
  [1, 2, 3],
  [2, 3, 4],
  [3, 4, 5],
  [4, 5, 6],
  [5, 6, 7],
  [6, 7, 8],
  [7, 8, 9],
  [8, 9, 10]
];

selectPredictors(multi,0,1);
