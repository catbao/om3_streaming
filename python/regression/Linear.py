import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
from sklearn.linear_model import LinearRegression

# X = np.array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).reshape(-1, 1) 
# y = np.array([2, 4, 5, 4, 6, 5, 4, 3, 2, 1])  
data = pd.read_csv('./python/regression/new_data.csv')
X = data.iloc[:, 0].values.reshape(-1, 1)
y = data.iloc[:, 1].values.reshape(-1, 1)

# 线性回归模型对象
model = LinearRegression()

# 使用最小二乘法进行回归拟合
model.fit(X, y)

print("model.coef_:", model.coef_)
print("model.intercept_:", model.intercept_)
residuals = y - model.predict(X)
mse = np.square(residuals).sum() / len(residuals)
print("model.mse:", mse)

plt.figure(figsize=(640/80, 400/80), dpi=80)
plt.scatter(X, y, color='blue', label='Average')
plt.plot(X, model.predict(X), color='red', label='Regression Line')

plt.legend()
plt.xlabel('X')
plt.ylabel('y')

# plt.show()
