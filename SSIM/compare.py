import cv2
from skimage.metrics import structural_similarity as ssim

# Load the two images
img1 = cv2.imread('./picture/5.11i.png')
img2 = cv2.imread('./picture/5.11j.png')

# 读取透明图片
# img = cv2.imread("./picture/1.jpg")
# # img[:, :, 3] = 255
# print(img)

# Convert the images to grayscale
gray_img1 = cv2.cvtColor(img1, cv2.COLOR_BGR2GRAY)
gray_img2 = cv2.cvtColor(img2, cv2.COLOR_BGR2GRAY)

# Calculate the SSIM score
score = ssim(gray_img1, gray_img2)

print("The SSIM score between the two images is: ", score)

