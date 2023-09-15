import numpy as np
import random

# target_sum1 = 36
# target_sum2 = 53
# num_samples1 = 2
# num_samples2 = 2
# min_val1 = 10
# max_val1 = 38
# min_val2 = 23
# max_val2 = 32
# μ = 24
# μ1 = 21
# μ2 = 27

# target_sum1 = 14
# target_sum2 = 48
# num_samples1 = 2
# num_samples2 = 2
# min_val1 = 3
# max_val1 = 23
# min_val2 = 4
# max_val2 = 28
# μ = 15
# μ1 = 10
# μ2 = 20

target_sum1 = 127
target_sum2 = 141
num_samples1 = 6
num_samples2 = 6
min_val1 = 3
max_val1 = 28
min_val2 = 11
max_val2 = 38
μ = 22
μ1 = 19.75
μ2 = 23.75

final_result = 0
times = 1000

final_result = 0

# 初始标准差估计
initial_std_variance1 = (max_val1 - min_val1) / 1.96 #通常用于 95% 置信区间
initial_std_variance2 = (max_val2 - min_val2) / 1.96

# 设置迭代次数和学习率
# iterations = 100000
# learning_rate = 0.01
times = 1000

for i in range(0,times):
    # 生成服从指定均值和方差的正态分布样本
    samples1 = np.random.normal(μ1, initial_std_variance1, num_samples1)
    samples1 = np.round(samples1).astype(int)
    samples1 = np.clip(samples1, min_val1, max_val1)
    samples2 = np.random.normal(μ2, initial_std_variance2, num_samples2)
    samples2 = np.round(samples2).astype(int)
    samples2 = np.clip(samples2, min_val2, max_val2)

    # samples = [17, 23, 28, 28, 12, 3]
    # print("samples1:", samples1)
    # print("samples2:", samples2)

    current_sum1 = sum(samples1)
    current_sum2 = sum(samples2)
    while current_sum1 != target_sum1:
        # 随机选择一个数据点的索引
        index_to_adjust = random.randint(0, num_samples1 - 1)
        
        if current_sum1 < target_sum1:
            # adjustment = random.choice([-1, 1])
            adjustment = 1
        else:
            adjustment = -1
        
        # 进行微调
        samples1[index_to_adjust] += adjustment
        if samples1[index_to_adjust] >= min_val1 and samples1[index_to_adjust] <= max_val1:
            current_sum1 += adjustment

        # 确保数据点在 [min_val, max_val] 区间内
        samples1[index_to_adjust] = max(min_val1, min(samples1[index_to_adjust], max_val1))
    
    while current_sum2 != target_sum2:
        index_to_adjust = random.randint(0, num_samples2 - 1)
        
        if current_sum2 < target_sum2:
            # adjustment = random.choice([-1, 1])
            adjustment = 1
        else:
            adjustment = -1
        
        samples2[index_to_adjust] += adjustment
        if samples2[index_to_adjust] >= min_val2 and samples2[index_to_adjust] <= max_val2:
            current_sum2 += adjustment

        # 确保数据点在 [min_val, max_val] 区间内
        samples2[index_to_adjust] = max(min_val2, min(samples2[index_to_adjust], max_val2))

    # print("samples:", samples)
    # new_elements = np.array([3,23])  
    # samples = np.append(samples, new_elements)

    # 计算生成样本的方差
    variance_sum = 0
    for sample in samples1:
        variance_sum += (sample-μ)**2
    variance_sum += (min_val1-μ)**2
    variance_sum += (max_val1-μ)**2
    for sample in samples2:
        variance_sum += (sample-μ)**2
    variance_sum += (min_val2-μ)**2
    variance_sum += (max_val2-μ)**2
    variance_sum = variance_sum / 16
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
