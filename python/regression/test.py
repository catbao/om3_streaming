import pandas as pd

data = pd.read_csv('./python/regression/data_quadratic.csv')
data['t'] = range(0, len(data))
# data = data.drop('t_new', axis=1)
data.to_csv('./python/regression/data_quadratic.csv', index=False)