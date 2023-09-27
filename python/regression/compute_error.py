import numpy as np
import pandas as pd

# a = 0.49754331
# b = 32.12821028
a = 0.49754352
b = 32.12713394

# data = pd.read_csv('./python/regression/data.csv')
# x = data.iloc[:, 0].values.reshape(-1, 1)
# y = data.iloc[:, 1].values.reshape(-1, 1)

# y_pred = a * x + b

data1 = pd.read_csv('./python/regression/data.csv')
x1 = data1.iloc[:, 0].values.reshape(-1, 1)
y1 = data1.iloc[:, 1].values.reshape(-1, 1)
print(len(x1))
y_pred = a * x1 + b
residuals = y1 - y_pred

squared_residuals = residuals ** 2

print(len(squared_residuals))
sum_squared_residuals = np.sum(squared_residuals)/len(squared_residuals)

print("With_average_mse:", sum_squared_residuals)
