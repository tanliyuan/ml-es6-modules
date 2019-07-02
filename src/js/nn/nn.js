import { Net, Vol, Trainer } from "./convnet";
export const NeuralNet = function() {};
NeuralNet.prototype = {
  train: function(data, labels, options) {
    options = options || {};
    let layer_defs = options.layer_defs || [];
    if (layer_defs.length === 0) {
      layer_defs.push({ type: "input", out_sx: 1, out_sy: 1, out_depth: 2 });
      layer_defs.push({ type: "fc", num_neurons: 4, activation: "tanh" });
      layer_defs.push({ type: "fc", num_neurons: 4, activation: "tanh" });
      layer_defs.push({ type: "fc", num_neurons: 4, activation: "tanh" });
      layer_defs.push({ type: "softmax", num_classes: 2 });
    }

    this.net = new Net();
    this.net.makeLayers(layer_defs);

    let training_options = options.training || {};
    let trainer = new Trainer(this.net, {
      learning_rate: training_options.learning_rate || 0.01,
      momentum: training_options.momentum || 0.1,
      batch_size: training_options.batch_size || 10,
      l2_decay: training_options.l2_decay || 0.001
    });

    let x = new Vol(1, 1, 2, 0.0);

    let maxiter = training_options.iters || 1000;
    for (let iters = 0; iters < maxiter; iters++) {
      for (let i = 0; i < data.length; i++) {
        x.w = data[i];
        if (labels[i] === 1) trainer.train(x, 1);
        else trainer.train(x, 0);
      }
    }
  },

  predict: function(point) {
    let input = new Vol(1, 1, 2, 0.0);
    input.w = point;
    let a = this.net.forward(input, false);
    return (Math.tanh(a.w[1] - a.w[0]) + 1) / 2;
  },
  predictClass: function(point) {
    let input = new Vol(1, 1, 2, 0.0);
    input.w = point;
    let a = this.net.forward(input, false);
    return a.w[0] > a.w[1] ? -1 : 1;
  }
};
