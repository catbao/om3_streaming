import random
import csv

random_numbers = random.choices(range(1, 41), k=64)

# 指定输出文件名和CSV文件的模式（'w'表示写入）
filename = 'random_numbers2.csv'
mode = 'w'

# 打开文件并创建CSV写入对象
with open(filename, mode, newline='') as file:
    writer = csv.writer(file)

    # 写入表头
    writer.writerow(['t', 'v'])

    # 逐行写入t和v到CSV文件
    for t, v in enumerate(random_numbers):
        writer.writerow([t, v])

print("随机数已成功写入到文件", filename)
