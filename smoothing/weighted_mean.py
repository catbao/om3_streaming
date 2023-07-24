# array = [[0,0,1,0,2,1,1,0],
#          [1,0,1,2,0,1,0,2],
#          [2,1,4,1,1,1,1,2],
#          [1,0,1,2,2,0,1,2],
#          [0,3,0,2,1,1,3,0],
#          [3,3,0,0,1,3,0,0],
#          [1,0,0,1,1,1,1,2],
#          [0,1,1,0,0,0,1,0]]
# top_value = 37.5
# for row in array:
#     for column in row:

matrix = [
         [0,0,1,0,2,1,1,0],
         [1,0,1,2,0,1,0,2],
         [2,1,4,1,1,1,1,2],
         [1,0,1,2,2,0,1,2],
         [0,3,0,2,1,1,3,0],
         [3,3,0,0,1,3,0,0],
         [1,0,0,1,1,1,1,2],
         [0,1,1,0,0,0,1,0]
]

coefficient = [37.5, 32.5, 27.5, 22.5, 17.5, 12.5, 7.5, 2.5]

# Initialize an empty list to store the column sums
column_sums = [0] * len(matrix[0])

i=-1
for row in matrix:
    i = i+1
    for j, value in enumerate(row):
        column_sums[j] += value * coefficient[i]

for value in column_sums:
    value = value / 8
    print(value)
print(column_sums)


