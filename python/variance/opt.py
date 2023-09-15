import numpy as np
import random

# target_sum = 144
# num_samples = 6
# min_val = 10
# max_val = 38
# μ = 24

# target_sum = 89
# num_samples = 6
# min_val = 3
# max_val = 28
# μ = 15

target_sum = 311
num_samples = 14
min_val = 3
max_val = 38
μ = 22

final_result = 0

# 初始标准差估计
initial_std_variance = (max_val - min_val) / 1.96 #通常用于 95% 置信区间

# 设置迭代次数和学习率
# iterations = 100000
# learning_rate = 0.01
times = 1000

for i in range(0,times):
    # 生成服从指定均值和方差的正态分布样本
    samples = np.random.normal(μ, initial_std_variance, num_samples)
    samples = np.round(samples).astype(int)
    samples = np.clip(samples, min_val, max_val)

    # samples = [17, 23, 28, 28, 12, 3]
    print("samples:", samples)

    current_sum = sum(samples)
    while current_sum != target_sum:
        # 随机选择一个数据点的索引
        index_to_adjust = random.randint(0, num_samples - 1)
        
        if current_sum < target_sum:
            # adjustment = random.choice([-1, 1])
            adjustment = 1
        else:
            adjustment = -1
        
        # 进行微调
        samples[index_to_adjust] += adjustment
        if samples[index_to_adjust] >= min_val and samples[index_to_adjust] <= max_val:
            current_sum += adjustment

        # 确保数据点在 [min_val, max_val] 区间内
        samples[index_to_adjust] = max(min_val, min(samples[index_to_adjust], max_val))

    # print("samples:", samples)
    # new_elements = np.array([3,23])  
    # samples = np.append(samples, new_elements)

    # 计算生成样本的方差
    # sample_mean = np.mean(samples)
    variance_sum = 0
    for sample in samples:
        variance_sum += (sample-μ)**2
    variance_sum += (min_val-μ)**2
    variance_sum += (max_val-μ)**2
    variance_sum = variance_sum / (num_samples+2)
    # print("Variance_sum:", variance_sum)
    final_result += np.sqrt(variance_sum)
    
    print(f"Iteration {i + 1}: Estimated Variance = {np.sqrt(variance_sum)}")
    # print("sample_mean:",sample_mean)

# 最终估计的方差值
final_variance = final_result / times
print(f"Final Estimated Variance = {final_variance}")

# 生成符合要求的8个样本
# final_samples = np.random.normal(known_mean, final_variance, num_samples)
# print("Generated Samples with Final Variance:")
# print(final_samples)
