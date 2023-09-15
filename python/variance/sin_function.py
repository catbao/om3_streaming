# import numpy as np
# import matplotlib.pyplot as plt

# # 生成 x 值，设置周期为 2π，并重复 20 次
# x = np.linspace(0, 8 * np.pi, 1000)  # 增加周期为 20 倍，生成更多点

# # 计算正弦函数的 y 值
# y = np.sin(x)

# # 创建图表
# plt.figure(figsize=(8, 6))

# # 绘制正弦函数的图线
# plt.plot(x, y, label='sin(x)', color='blue')

# # 添加标题和标签
# plt.title('Periodic Function')
# plt.xlabel('x')
# plt.ylabel('y')

# # 添加图例
# plt.legend()

# # 显示图表
# plt.show()


import numpy as np
from scipy.stats import norm
import matplotlib.pyplot as plt
import csv

# 定义周期性上升趋势函数
def x_plus_sinx(x):
    distribution = norm(0, 1)
    return x / 200 + 500 * np.sin(x / 24000) + 50 * distribution.ppf(np.random.random())

np.set_printoptions(suppress=True, precision=2)
x = np.linspace(0, 1000000, 10000).astype(int)  # 生成 0 到 1000000 范围内的 1000 个点
y = [x_plus_sinx(val) for val in x]

# x_rounded = np.round(x, decimals=2)
# y_rounded = np.round(y, decimals=2)

# data = np.column_stack((x, y))
# np.savetxt('data.csv', data, delimiter=',')
x_str = [format(val) for val in x]
y_str = [format(val, ".2f") for val in y]

# 将 x 和 y 数据保存到 CSV 文件
with open('data.csv', 'w', newline='') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(["t", "v"])  # 写入表头
    writer.writerows(zip(x_str, y_str))  # 写入数据

plt.figure(figsize=(640/80, 400/80), dpi=80)

plt.plot(x, y, label='x_plus_sinx', color='blue')

plt.title('Upward Trend Function')
plt.xlabel('x')
plt.ylabel('y')

plt.legend()

# 显示图表
plt.show()
