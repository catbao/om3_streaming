import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import math
from scipy.ndimage.filters import gaussian_filter1d

# data = pd.read_csv('./smoothing/16_numbers.csv')  
# data = pd.read_csv('./smoothing/32_numbers.csv') 
data = pd.read_csv('./smoothing/64_numbers2.csv') 
x = data['x'].values
y = data['y'].values

def gaussian_filter(data, sigma):
    n = len(data)
    smoothed_data = np.zeros_like(data)

    # 计算高斯滤波器权重
    weights = np.exp(-0.5 * (np.arange(-n, n + 1) / sigma)**2)
    print(weights)

    # 对每个数据点应用滤波器
    for i in range(n):
        weighted_sum = 0.0
        weight_sum = 0.0
        for j in range(-n, n + 1):
            if i + j >= 0 and i + j < n:
                weighted_sum += data[i + j] * weights[j + n]
                weight_sum += weights[j + n]
        smoothed_data[i] = weighted_sum / weight_sum

    return smoothed_data

# sampled_x = [2,4, 10,11, 21,23, 24,29,31, 32,38,39, 40,42,47, 48,54,55, 56,61] #8 pixels
adjust_weights = [3/8,5/8, 3/8,5/8, 3/8,5/8, 2/8,6/8,2/8, 3/8,5/8,3/8, 2/8,6/8,6/8, 1/2,1/2,1/2, 5/8,3/8]

def gaussian_filter2(data, sigma):
    n = len(data)
    smoothed_data = np.zeros_like(data)

    weights = np.exp(-0.5 * (np.arange(-n, n + 1) / sigma)**2)
    # print(weights)

    # 对邻域数据点应用滤波器
    for i in range(n):
        weighted_sum = 0.0
        weight_sum = 0.0
        for j in range(-n, n + 1):
            if i + j >= 0 and i + j < n:
                # weighted_sum += data[i + j] * (weights[j + n]) 
                # weight_sum += (weights[j + n])
                weighted_sum += data[i + j] * (weights[j + n]*adjust_weights[i+j]) 
                weight_sum += (weights[j + n]*adjust_weights[i+j])
        smoothed_data[i] = weighted_sum / weight_sum
        # k = k+1

    return smoothed_data


pixel_count = 8

split_arr = np.split(y, pixel_count)
min_vals = np.array([])
max_vals = np.array([])
ave_vals_origin = np.array([])

for i, sub_arr in enumerate(split_arr):
    min_val = np.min(sub_arr)
    max_val = np.max(sub_arr)
    ave_val = np.mean(sub_arr)
    min_vals = np.append(min_vals, min_val)
    max_vals = np.append(max_vals, max_val)
    ave_vals_origin = np.append(ave_vals_origin, ave_val)
    print(f"The min&max of {i}th pixel: {min_val},{max_val}")
    # print(f"The max of {i+1} pixel: {max_val}")

print("ave_vals_origin:")
print(ave_vals_origin)

need_index = []        
for i in range(pixel_count-1):
    last_i = pixel_count*i+pixel_count-1
    first_i = pixel_count*i+pixel_count
    y_last_i = y[pixel_count*i+pixel_count-1]
    y_first_i = y[pixel_count*i+pixel_count]
    if(y_last_i > y_first_i):
        temp = y_last_i
        y_last_i = y_first_i
        y_first_i = temp
    min_last = min_vals[i]
    max_last = max_vals[i]
    min_first = min_vals[i+1]
    max_first = max_vals[i+1]
    if (min_last <= y_last_i) and (max_last >= y_first_i) and (min_first <= y_last_i) and (max_first >= y_first_i):
        continue
    else:
        need_index.append(last_i)
        need_index.append(first_i)
print("need index:")
print(need_index)


plt.plot(x, y, label='Original')

# 使用高斯滤波器进行平滑
smoothed_y = gaussian_filter(y, sigma=1)
print("smoothed_y:")
print(smoothed_y)

smoothed_y_ave = np.split(smoothed_y, pixel_count)
ave_vals_smoothed = np.array([])
# print("smoothed_y_ave:")
# print(smoothed_y_ave)

for i, sub_arr in enumerate(smoothed_y_ave):
    ave_val = np.mean(sub_arr)
    ave_vals_smoothed = np.append(ave_vals_smoothed, ave_val)
# print("ave_vals_smoothed:")
# print(ave_vals_smoothed)

plt.plot(x, smoothed_y, label='Smoothed')


sampled_x = [2,4, 10,11, 21,23, 24,29,31, 32,38,39, 40,42,47, 48,54,55, 56,61] #8 pixels
sampled_y = [2,35, 33,5, 3,39, 30,2,30, 38,9,28, 39,2,4, 17,13,30, 29,5]


sampled_y = gaussian_filter2(sampled_y,sigma=1)
print("sampled_smoothed_y:")
print(sampled_y)
plt.plot(sampled_x, sampled_y, label='Sampled_smoothed')

# sampled_y_ave = [15.5,17.5,19,19.3,23,23,19.5,18] #8 pixels,sampled average
# MSE = 0
# for i in range(len(sampled_y_ave)):
#     MSE += (sampled_y_ave[i] - ave_vals_smoothed[i]) * (sampled_y_ave[i] - ave_vals_smoothed[i])
# MSE = MSE / len(sampled_y_ave)
# RMSE = math.sqrt(MSE)
# RRMSE = RMSE / (23-15.5)
# print(MSE,RMSE,RRMSE)

# RRMSE_pixel = math.sqrt(13) / pixel_count / 2
# print(RRMSE_pixel)

plt.legend()
plt.xlabel('X')
plt.ylabel('Y')
plt.title('Line Plot with Gaussian Smoothing')

plt.xticks(range(0, len(y)+1, 8))
plt.grid(axis='x')
plt.yticks(range(0, 40, 5))
plt.grid(axis='y')

plt.show()