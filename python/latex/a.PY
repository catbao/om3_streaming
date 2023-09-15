import numpy as np
import sympy

min = 3
max = 38
μ = 22
n = 16

#input: min_value min, max_value max, average value μ, data size n
#output: sampled data array
def sample(min, max, μ, n):
    target_sum = n * μ - min - max
    # solving a system of two linear equations
    eq1 = sp.Eq(min * x + max * y, target_sum)
    eq2 = sp.Eq(x + y, n - 2)
    solution = sympy.solve((eq1, eq2), (x, y))
    max_num = np.ceil(solution[y])
    min_num = (n - 2) - max_num
    # initialize samples
    samples = np.concatenate((min * np.ones(min_num), max * np.ones(max_num)))
    current_sum = sum(samples)
    if current_sum != target_sum:
        left = current_sum - target_sum
        samples[min_num] -= left  # modify at most one sample