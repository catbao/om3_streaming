import numpy as np
import matplotlib.pyplot as plt
import pandas as pd

# np.random.seed(0)
data = pd.read_csv('./python/regression/new_data_quadratic.csv')
X = data.iloc[:, 0].values.reshape(-1, 1)
y = data.iloc[:, 1].values.reshape(-1, 1)

# 使用多项式回归拟合数据
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression

poly_features = PolynomialFeatures(degree=2) # 使用2次多项式特征
X_poly = poly_features.fit_transform(X)
poly_model = LinearRegression()
poly_model.fit(X_poly, y)

params = poly_model.coef_
intercept = poly_model.intercept_

print("params:", params)
print("intercept:", intercept)
residuals = y - poly_model.predict(X_poly)
mse = np.square(residuals).sum() / len(residuals)
print("model.mse:", mse)

# 绘制原始数据和拟合曲线
plt.scatter(X, y, color='b', label='Average')
plt.plot(X, poly_model.predict(X_poly), color='r', label='Fitted line')
plt.xlabel('X')
plt.ylabel('y')
plt.legend()
plt.subplots_adjust(left=0, right=1, top=1, bottom=0)
plt.show()
