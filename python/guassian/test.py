import numpy as np
import scipy.signal
import matplotlib.pyplot as plt
import pandas as pd

# signal = np.array([2, 3, 5, 7, 10, 7, 5, 3, 2])
min_value = 1
max_value = 100
desired_length = 100

def normalized_gaussian_kernel(size, sigma):
    kernel = scipy.signal.gaussian(size, std=sigma)
    kernel_sum = np.sum(kernel)
    normalized_kernel = kernel / kernel_sum
    return normalized_kernel

# signal = np.random.choice(np.arange(min_value, max_value + 1), size=desired_length, replace=False)
data = pd.read_csv('./python/regression/data.csv')
signal = data.iloc[:, 1].values
sigma = 25
size = 6 * sigma
# size = 7

gaussian_kernel = normalized_gaussian_kernel(size, sigma)
if sigma != 1:
    gaussian_kernel_sum = gaussian_kernel.reshape(6, 25).sum(axis=1)
smoothed_signal = np.convolve(signal, gaussian_kernel, mode="same")
if sigma == 1:
    np.savetxt("./python/guassian/ave_smoothed_signal.txt", smoothed_signal, fmt='%.2f')
else:
    np.savetxt("./python/guassian/smoothed_signal.txt", smoothed_signal, fmt='%.2f')

time = np.arange(len(signal))

fig, ax = plt.subplots()

ax.plot(time, signal, label="Original Signal")
ax.plot(time, smoothed_signal, label="Smoothed Signal")

ax.legend()
ax.set_title("Original and Smoothed Signal")

plt.show()

