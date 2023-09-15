import random
import numpy as np
import math

# target_sum = 144
# num_samples = 6
# min_val = 10
# max_val = 38
# μ = 24

target_sum = 89
num_samples = 6
min_val = 3
max_val = 28
μ = 15

# target_sum = 311
# num_samples = 14
# min_val = 3
# max_val = 38
# μ = 22

final_result = 0
times = 1000

for i in range(1,times):
    # 生成n-2个随机整数数据点在 [min_val, max_val] 区间内
    random_samples = [random.uniform(min_val, max_val) for _ in range(num_samples)]
    random_samples = np.round(random_samples).astype(int)

    current_sum = sum(random_samples)

    # 调整数据点，使它们的和等于目标和
    while current_sum != target_sum:
    # while np.abs(current_sum - target_sum) > 0.01:

        index_to_adjust = random.randint(0, num_samples - 1)
        
        # adjustment = random.choice([-1, 1])
        if current_sum < target_sum:
            # adjustment = random.choice([-1, 1])
            adjustment = 1
        else:
            adjustment = 1
        
        # 进行微调
        random_samples[index_to_adjust] += adjustment
        if random_samples[index_to_adjust] >= min_val and random_samples[index_to_adjust] <= max_val:
            current_sum += adjustment

        # 确保数据点在 [min_val, max_val] 区间内
        random_samples[index_to_adjust] = max(min_val, min(random_samples[index_to_adjust], max_val))

    # print("Randomly Sampled Integer Data:", random_samples)
    # print("Sum of Sampled Data:", current_sum)
    variance_sum = 0
    for sample in random_samples:
        variance_sum += (sample-μ)**2
    variance_sum += (min_val-μ)**2
    variance_sum += (max_val-μ)**2
    variance_sum = variance_sum / (num_samples+2)
    # print("Variance_sum:", variance_sum)
    # print(i, "th:", np.sqrt(variance_sum))
    final_result += np.sqrt(variance_sum)

print(final_result / times)
