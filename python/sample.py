import random

# 已知数据
target_sum = 89
num_samples = 6
min_val = 3
max_val = 28

# 生成6个随机整数数据点在 [min_val, max_val] 区间内
random_samples = [random.randint(min_val, max_val) for _ in range(num_samples)]

# 计算当前数据点的和
current_sum = sum(random_samples)

# 调整数据点，使它们的和等于目标和
while current_sum != target_sum:
    # 随机选择一个数据点的索引
    index_to_adjust = random.randint(0, num_samples - 1)
    
    # 随机选择一个增加或减少的值
    adjustment = random.choice([-1, 1])
    
    # 进行微调
    random_samples[index_to_adjust] += adjustment
    current_sum += adjustment

    # 确保数据点在 [min_val, max_val] 区间内
    random_samples[index_to_adjust] = max(min_val, min(random_samples[index_to_adjust], max_val))

# 打印结果
print("Randomly Sampled Integer Data:", random_samples)
print("Sum of Sampled Data:", current_sum)
variance_sum = 0
for sample in random_samples:
    variance_sum += (sample-15)*(sample-15)
variance_sum += (min_val-15)*(min_val-15)
variance_sum += (max_val-15)*(max_val-15)
variance_sum = variance_sum / 8
print("Variance_sum:", variance_sum)
