import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import math
from scipy.ndimage.filters import gaussian_filter1d

# data = pd.read_csv('./smoothing/16_numbers.csv')  
# data = pd.read_csv('./smoothing/32_numbers.csv') 
data = pd.read_csv('./smoothing/64_numbers.csv') 
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

# sampled_x = [4,7, 8,13,14,15, 16,21, 25,26,31, 32,34,39, 40,42,47, 48,53, 60,63] #8 pixels
# adjust_weights = [0.5,0.5,4/7,4/7,4/7,4/7,0.125,0.125,0.375,0.375,0.375,0.5,0.5,0.5,0.5,0.5,0.5,0.625,0.625,0.25,0.25]
adjust_weights = [5/8,3/8,3/7,4/7,3/7,4/7,6/8,2/8,5/8,3/8,5/8,5/8,3/8,3/8,1/2,1/2,1/2,3/8,5/8,1/4,3/4]
k=0
def gaussian_filter2(data, sigma):
    n = len(data)
    smoothed_data = np.zeros_like(data)

    weights = np.exp(-0.5 * (np.arange(-n, n + 1) / sigma)**2)
    print(weights)
    # weights[n] *= 2
    # weights[n+1] *= 2

    # 对每个数据点应用滤波器
    for i in range(n):
        weighted_sum = 0.0
        weight_sum = 0.0
        for j in range(-n, n + 1):
            if i + j >= 0 and i + j < n:
                weighted_sum += data[i + j] * (weights[j + n]) 
                weight_sum += (weights[j + n])
                # weighted_sum += data[i + j] * (weights[j + n]*adjust_weights[i+j]) 
                # weight_sum += (weights[j + n]*adjust_weights[i+j])
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
print("ave_vals_smoothed:")
print(ave_vals_smoothed)

plt.plot(x, smoothed_y, label='Smoothed')

# sampled_x = [1,2,5,7,8,9,10,13,14]
# sampled_y = [25,14,28,5,12,38,11,34,23]
# sampled_x = [2,5,10,13,20,24,26,31]
# sampled_y = [2,29,4,33,11,28,36,12]
# sampled_x = [7,13,16,21,34,40,48,53] #4 pixels
# sampled_y = [31,3,37,1,39,6,38,1]

# sampled_x = [4,7, 8,13,14,15, 16,21, 25,26,31, 32,34,39, 40,42,47, 48,53, 60,63] #8 pixels
# sampled_y = [6,31, 16,3,27,15, 37,1, 32,9,23, 8,39,37, 6,37,14, 38,1, 6,33]
sampled_x = [3.5,4,7, 8,11.5,13,14,15, 16,19.5,21, 25,26,27.5,31, 32,34,35.5,39, 40,42,43.5,47, 48,51.5,53, 59.5,60,63] #add new weighted mean
sampled_y = [19.375,6,31, 16,15,3,27,15, 37,25.625,1, 32,9,22.5,23, 8,39,23.125,37, 6,37,20,14, 38,18.75,1, 22.5,6,33]

# sampled_x = [3.5,4,7, 8,11.5,13,14,15, 16,19.5,21, 25,26,27.5,31, 32,34,35.5,39, 40,42,43.5,47, 48,51.5,53, 59.5,60,63] #only add average
# sampled_y = [18.5,6,31, 16,14,3,27,15, 37,24.875,1, 32,9,22.375,23, 8,39,23.375,37, 6,37,20.625,14, 38,17.5,1, 21.75,6,33]
# sampled_x = [3.5,4,7, 8,11.5,13,14,15, 16,19.5,21, 25,26,27.5,31, 32,34,35.5,39, 40,42,43.5,47, 48,51.5,53, 57.5,60,63] #only weighted average
# sampled_y = [17.5,6,31, 16,15.625,3,27,15, 37,23.125,1, 32,9,20,23, 8,39,20.625,37, 6,37,17.5,14, 38,16.25,1, 20,6,33]
# sampled_x = [3.5,4,4.5,7, 8,11.5,12.5,13,14,15, 16,19.5,20.5,21, 25,26,27.5,28.5,31, 32,34,35.5,36.5,39, 40,42,43.5,44.5,47, 48,51.5,52.5,53, 59.5,60,60.5,63] #add average & weighted average
# sampled_y = [18.5,6,17.5,31, 16,14,15.625,3,27,15, 37,24.875,23.125,1, 32,9,22.375,20,23, 8,39,23.375,20.625,37, 6,37,20.625,17.5,14, 38,17.5,16.25,1, 21.75,6,20,33]
# sampled_x = [0,3.5,4,7, 8,11.5,13,14,15, 16,19.5,21,23, 24,25,26,27.5,31, 32,34,35.5,39, 40,42,43.5,47, 48,51.5,53,55, 56,59.5,60,63] #add weighted average & firstlast
# sampled_y = [25,17.5,6,31, 16,15.625,3,27,15, 37,23.125,1,32, 24,32,9,20,23, 8,39,20.625,37, 6,37,17.5,14, 38,16.25,1,6, 30,20,6,33]
# sampled_x = [0,3.5,4,4.5,7, 8,11.5,12.5,13,14,15, 16,19.5,20.5,21,23, 24,25,26,27.5,28.5,31, 32,34,35.5,36.5,39, 40,42,43.5,44.5,47, 48,51.5,52.5,53,55, 56,59.5,60,60.5,63] #add average & weighted average & firstlast
# sampled_y = [25,18.5,6,17.5,31, 16,14,15.625,3,27,15, 37,24.875,23.125,1,32, 24,32,9,22.375,20,23, 8,39,23.375,20.625,37, 6,37,20.625,17.5,14, 38,17.5,16.25,1,6, 30,21.75,6,20,33]

# sampled_x = [0,2,4,7, 9,11,13,14, 16,20,21,22,23, 24,25,26,27,29, 32,33,34,35,37,38, 40,41,42,44,46,47, 48,49,52,53,54,55, 58,61,62,63] #only select one every bin
# sampled_y = [25,14,6,31, 12,17,3,27, 37,27,1,22,32, 24,32,9,17,27, 8,17,39,27,13,24, 6,32,37,24,26,14, 38,27,17,1,20,6, 29,23,7,33]
# sampled_x = [0,2,3.5,4,7, 9,11,11.5,13,14, 16,19.5,20,21,22,23, 24,25,26,27,27.5,29, 32,33,34,35,35.5,37,38, 40,41,42,43.5,44,46,47, 48,49,51.5,52,53,54,55, 58,59.5,61,62,63] #select one every bin and weighted ave
# sampled_y = [25,14,17.5,6,31, 12,17,15.625,3,27, 37,23.125,27,1,22,32, 24,20,9,17,32,27, 8,17,39,27,20.625,13,24, 6,32,37,17.5,24,26,14, 38,27,16.25,17,1,20,6, 29,20,23,7,33]
# sampled_x = [0,2,3.5,4,7, 9,11,11.5,13,14, 16,19.5,20,21,22,23, 24,25,26,27,27.5,29, 32,33,34,35,35.5,37,38, 40,41,42,43.5,44,46,47, 48,49,51.5,52,53,54,55, 58,59.5,61,62,63] #select one every bin and average
# sampled_y = [25,14,18.5,6,31, 12,17,14,3,27, 37,24.875,27,1,22,32, 24,32,9,17,22.375,27, 8,17,39,27,23.375,13,24, 6,32,37,20.625,24,26,14, 38,27,17.5,17,1,20,6, 29,21.75,23,7,33]

sampled_y = gaussian_filter2(sampled_y,sigma=1)
print("sampled_smoothed_y:")
print(sampled_y)
plt.plot(sampled_x, sampled_y, label='Sampled_smoothed')

sampled_y_ave = [15.5,17.5,19,19.3,23,23,19.5,18] #8 pixels
MSE = 0
for i in range(len(sampled_y_ave)):
    MSE += (sampled_y_ave[i] - ave_vals_smoothed[i]) * (sampled_y_ave[i] - ave_vals_smoothed[i])
MSE = MSE / len(sampled_y_ave)
RMSE = math.sqrt(MSE)
RRMSE = RMSE / (23-15.5)
print(MSE,RMSE,RRMSE)

RRMSE_pixel = math.sqrt(13) / pixel_count / 2
print(RRMSE_pixel)

plt.legend()
plt.xlabel('X')
plt.ylabel('Y')
plt.title('Line Plot with Gaussian Smoothing')

# plt.xticks(range(0, len(y)+1, 8))
plt.grid(axis='x')
# plt.yticks(range(0, 40, 5))
plt.grid(axis='y')

plt.show()