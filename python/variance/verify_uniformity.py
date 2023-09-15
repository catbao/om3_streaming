import numpy as np
import matplotlib.pyplot as plt

# 定义区间[min, max]
min_val = 3
max_val = 28

# 进行多次随机采样
sample_size = 6
num_samples = 1000000
samples = np.random.uniform(min_val, max_val, (num_samples, sample_size))
sorted_samples = np.sort(samples, axis=1)
average_samples = [0] * 6
rows, cols = sorted_samples.shape
for i in range(rows):
    for j in range(cols):
        average_samples[j] += sorted_samples[i,j]

for i in range(cols):
    average_samples[i] = average_samples[i] / num_samples

print(average_samples)
