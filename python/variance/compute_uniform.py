import numpy as np

min = 3
max = 28
μ = 15
n = 8

# min = 10
# max = 38
# μ = 24
# n = 8

# min = 3
# max = 38
# μ = 22
# n = 16

# interval = (max - min) / ((n-2)*2)
# variance = 0
# for i in range(1,n-1):
#     if i == 1 or i == n-2:
#         temp = (min + i*interval - μ) ** 2
#     else:
#         temp = (min + i*interval*2 - μ) ** 2
#     variance += temp

interval = (max - min) / (n-1)
variance = 0
for i in range(1, n-1):
    temp = np.round(min + i * interval).astype(int)
    print(temp)
    variance += (temp - μ) ** 2

variance += (min - μ)**2
variance += (max - μ)**2
print("std_variance:", np.sqrt(variance/n))