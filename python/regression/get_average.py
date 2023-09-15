import pandas as pd

data = pd.read_csv('./python/regression/data_quadratic.csv')
grouped_data = data.groupby(data.index // 25)['v'].mean()
new_data = pd.DataFrame({'t': range(0, 400), 'v': grouped_data})
new_data['t'] = range(12, len(new_data)*25,25)
new_data.to_csv('./python/regression/new_data_quadratic.csv', index=False)
