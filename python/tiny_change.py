import random
import numpy as np 

min = 10
max = 20
μ = 18
n = 16
target_sum = n*μ-min-max
print(target_sum)

i=0
# samples = [max,max,max,max,max,max]
samples = np.full((n-2), max)
# current_sum = sum(random_samples)
# initial, all max 
current_sum = max * (n-2)
if current_sum != target_sum:
    left = current_sum - target_sum
    while left > (max-min): # close to max
        left = left - (max-min)
        current_sum = current_sum - (max-min)
        samples[i] = min
        i=i+1
    samples[i] = samples[i] - left
    current_sum = current_sum - (max-min)

result = 0
for point in samples:
    temp = (point - μ) * (point - μ)
    result = result + temp
result = result + min + max
result = result / n
print(samples)
print(result)

        

# import numpy as np

# n = 6
# min_val = 3
# max_val = 28
# c = 89  

# x = np.random.randint(min_val, max_val + 1, n)

# # 迭代优化
# while True:
#     # 计算当前的 c_current
#     c_current = np.sum(x)
    
#     # 如果当前 c 与已知 c 相等或足够接近，算法结束
#     if np.abs(c_current - c) < 1e-6:
#         break
    
#     # 计算当前的 max(sum(xi^2))
#     max_xi_squared = np.max(x ** 2)
    
#     # 找到具有最大潜力提高 xi^2 的元素的索引
#     max_xi_squared_index = np.argmax(x ** 2)
    
#     # 根据最大潜力元素的索引进行微调，使其向 c 靠近
#     if c_current < c:
#         x[max_xi_squared_index] += 1
#     else:
#         x[max_xi_squared_index] -= 1
    
#     # 保持 xi 在 [min_val, max_val] 区间内
#     x[max_xi_squared_index] = np.clip(x[max_xi_squared_index], min_val, max_val)

# # 打印结果
# print("Optimized x:", x)
# print("max(sum(xi^2)):", np.max(x ** 2))
# print("sum(xi):", np.sum(x))

