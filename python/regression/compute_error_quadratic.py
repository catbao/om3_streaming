import numpy as np
from scipy.optimize import curve_fit
import pandas as pd

# 定义二次多项式模型
def quadratic_function(x, a, b, c):
    return a * x**2 + b * x + c

data = pd.read_csv('./python/regression/data_quadratic.csv')
x = data.iloc[:, 0].values.reshape(-1, 1)
y = data.iloc[:, 1].values.reshape(-1, 1)

# # 使用curve_fit函数拟合二次多项式
# params, covariance = curve_fit(quadratic_function, x, y)

# # 拟合参数
# a, b, c = params

# 预测值


data1 = pd.read_csv('./python/regression/data_quadratic.csv')
x1 = data1.iloc[:, 0].values.reshape(-1, 1)
y1 = data1.iloc[:, 1].values.reshape(-1, 1)
# y_pred = quadratic_function(x1, -2.74811687e-05, 2.60542577e-01, 45.74663318)
y_pred = quadratic_function(x1, -2.74808385e-05, 2.60538796e-01, 45.75310187)

print("len(y1):",len(y1))
print("len(y_pred):",len(y_pred))
# 计算残差（误差）
residuals = y1 - y_pred

squared_residuals = residuals ** 2

sum_squared_residuals = np.sum(squared_residuals)/len(residuals)

# print("拟合参数(a, b, c):", a, b, c)
print("With_average_mse:", sum_squared_residuals)
