import numpy as np

# 已知的均值
known_mean = 10

# 初始方差估计
initial_variance = 13

# 设置迭代次数和学习率
iterations = 100000
learning_rate = 0.01

# 生成8个样本
num_samples = 8

# 开始迭代优化方差值
for iteration in range(iterations):
    # 生成服从指定均值和方差的正态分布样本
    samples = np.random.normal(known_mean, np.sqrt(initial_variance), num_samples)
    
    # 计算生成样本的均值和方差
    sample_mean = np.mean(samples)
    sample_variance = np.var(samples)
    
    # 计算均值误差
    mean_error = known_mean - sample_mean
    
    # 更新方差估计
    initial_variance += learning_rate * mean_error
    
    # 打印每次迭代的方差估计
    print(f"Iteration {iteration + 1}: Estimated Variance = {initial_variance}")

# 最终估计的方差值
final_variance = initial_variance
print(f"Final Estimated Variance = {final_variance}")

# 生成符合要求的8个样本
final_samples = np.random.normal(known_mean, np.sqrt(final_variance), num_samples)
print("Generated Samples with Final Variance:")
print(final_samples)
