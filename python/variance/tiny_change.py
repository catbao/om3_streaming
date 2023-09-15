import random
import numpy as np 
import sympy as sp

# min = 1
# max = 28
# μ = 15
# n = 8

min = 3
max = 38
μ = 22
n = 16

target_sum = n*μ-min-max
print(target_sum)

# No loop
x, y = sp.symbols('x y')

eq1 = sp.Eq(min*x + max*y, target_sum)
eq2 = sp.Eq(x + y, n-2)

solution = sp.solve((eq1, eq2), (x, y))
initial_max_num = np.ceil(solution[y])
initial_min_num = (n-2)-initial_max_num

# initial samples
samples = np.concatenate((min * np.ones(initial_min_num), max * np.ones(initial_max_num)))

current_sum = sum(samples)
if current_sum != target_sum:
    left = current_sum - target_sum  # current_sum must greater than target_sum
    index = initial_min_num
    samples[index] -= left
    current_sum -= left
    if(current_sum != target_sum):
        print("Error!")

result = 0
for point in samples:
    temp = (point - μ) ** 2
    result = result + temp
result = result + (min-μ)**2 + (max-μ)**2
result = result / n
print(samples)
print(result)

# i=0
# samples = np.full((n-2), max)
# # current_sum = sum(samples)
# # initial, all max 
# current_sum = max * (n-2)
# if current_sum != target_sum:
#     left = current_sum - target_sum
#     while left > (max-min): # close to max
#         left = left - (max-min)
#         current_sum = current_sum - (max-min)
#         samples[i] = min
#         i=i+1
#     samples[i] = samples[i] - left
#     current_sum = current_sum - (max-min)


        

