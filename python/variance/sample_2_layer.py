import random
import numpy as np

# target_sum1 = 36
# target_sum2 = 53
# num_samples1 = 2
# num_samples2 = 2
# min_val1 = 10
# max_val1 = 38
# min_val2 = 23
# max_val2 = 32
# μ = 24

# target_sum1 = 14
# target_sum2 = 48
# num_samples1 = 2
# num_samples2 = 2
# min_val1 = 3
# max_val1 = 23
# min_val2 = 4
# max_val2 = 28
# μ = 15

target_sum1 = 127
target_sum2 = 141
num_samples1 = 6
num_samples2 = 6
min_val1 = 3
max_val1 = 28
min_val2 = 11
max_val2 = 38
μ = 22

final_result = 0
times = 1000

for i in range(1,times):
    random_samples1 = [random.randint(min_val1, max_val1) for _ in range(num_samples1)]
    random_samples2 = [random.randint(min_val2, max_val2) for _ in range(num_samples2)]
    random_samples1 = np.round(random_samples1).astype(int)
    random_samples2 = np.round(random_samples2).astype(int)

    current_sum1 = sum(random_samples1)
    current_sum2 = sum(random_samples2)

    # 调整数据点，使它们的和等于目标和
    while current_sum1 != target_sum1:
        # 随机选择一个数据点的索引
        index_to_adjust = random.randint(0, num_samples1 - 1)
        
        # 随机选择一个增加或减少的值
        if current_sum1 < target_sum1:
            # adjustment = random.choice([-1, 1])
            adjustment = 1
        else:
            adjustment = -1
        
        # 进行微调
        random_samples1[index_to_adjust] += adjustment
        if random_samples1[index_to_adjust] >= min_val1 and random_samples1[index_to_adjust] <= max_val1:
            current_sum1 += adjustment

        # 确保数据点在 [min_val, max_val] 区间内
        random_samples1[index_to_adjust] = max(min_val1, min(random_samples1[index_to_adjust], max_val1))

    while current_sum2 != target_sum2:
        index_to_adjust = random.randint(0, num_samples2 - 1)
        
        if current_sum2 < target_sum2:
            # adjustment = random.choice([-1, 1])
            adjustment = 1
        else:
            adjustment = -1
        
        random_samples2[index_to_adjust] += adjustment
        if random_samples2[index_to_adjust] >= min_val2 and random_samples2[index_to_adjust] <= max_val2:
            current_sum2 += adjustment

        random_samples2[index_to_adjust] = max(min_val2, min(random_samples2[index_to_adjust], max_val2))

    # print("Randomly Sampled Integer Data:", random_samples)
    # print("Sum of Sampled Data:", current_sum)
    variance_sum = 0
    for sample in random_samples1:
        variance_sum += (sample-μ)**2
    variance_sum += (min_val1-μ)**2
    variance_sum += (max_val1-μ)**2
    for sample in random_samples2:
        variance_sum += (sample-μ)**2
    variance_sum += (min_val2-μ)**2
    variance_sum += (max_val2-μ)**2

    variance_sum = variance_sum / 16
    # print("Variance_sum:", variance_sum)
    final_result += np.sqrt(variance_sum)

print(final_result/times)
