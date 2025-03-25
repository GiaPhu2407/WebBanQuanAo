import * as tf from "@tensorflow/tfjs";

// Dữ liệu giả lập: Số lần xem và điểm cho sản phẩm
const productViews = tf.tensor([1, 2, 3, 4, 5]); // Số lần xem sản phẩm
const productScores = tf.tensor([1, 2, 3, 4, 5]); // Điểm sản phẩm

// Tạo mô hình tuyến tính đơn giản để tính điểm
const model = tf.sequential();
model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

model.compile({ loss: "meanSquaredError", optimizer: "sgd" });

// Huấn luyện mô hình với dữ liệu
model.fit(productViews, productScores, { epochs: 10 }).then(() => {
  // Dự đoán điểm cho sản phẩm dựa trên số lần xem mới
  const prediction = model.predict(tf.tensor([6])) as tf.Tensor; // Dự đoán điểm cho sản phẩm với 6 lần xem
  prediction.dataSync(); // Truy xuất dữ liệu từ Tensor
  console.log(prediction.dataSync()); // In kết quả dự đoán
});
