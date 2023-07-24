import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# 生成示例数据
x = np.arange(0, 1000, 0.1)
y = np.sin(x) + np.random.normal(0, 20, len(x))

# 创建DataFrame对象
df = pd.DataFrame({'x': x, 'y': y})

# 保存为CSV文件
df.to_csv('trend.csv', index=False)

# 绘制折线图
plt.plot(x, y)

# 添加标题和坐标轴标签
plt.title('Sin Function with Random Noise')
plt.xlabel('X')
plt.ylabel('Y')

# 显示图形
plt.show()
