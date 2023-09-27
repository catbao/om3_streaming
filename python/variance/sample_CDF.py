import random
import numpy as np
import sympy as sp
import math

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

num_samples = 16
min_val = 3
max_val = 38
μ = 22

target_sum = (num_samples-2)*μ-min_val-max_val
final_result = 0

# for uniform sample
array = []
x, y = sp.symbols('x y')

eq1 = sp.Eq(((num_samples-2)/2)*x + ((num_samples-2)/2)*y, target_sum)
eq2 = sp.Eq(x + y, n-2)

solution = sp.solve((eq1, eq2), (x, y))
initial_max_num = np.ceil(solution[y])

