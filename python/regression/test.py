import pandas as pd

data = pd.read_csv('/Users/bao/Desktop/om3_streaming/python/regression/daily-minimum-temperatures-in-me.csv')
data['t'] = range(0, len(data))
# data = data.drop('t_new', axis=1)
data.to_csv('/Users/bao/Desktop/om3_streaming/python/regression/daily-minimum-temperatures-in-me.csv', index=False)
