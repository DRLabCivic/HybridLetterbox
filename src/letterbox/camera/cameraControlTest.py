# -*- coding: utf-8 -*-
# @Author: Lutz Reiter, Design Research Lab, Universität der Künste Berlin
# @Date:   2016-03-21 17:27:32
# @Last Modified by:   lutzer
# @Last Modified time: 2016-06-23 15:59:42

#import picamera
import cv2
import io
import logging
import numpy
import time

logger = logging.getLogger(__name__)


class CameraControlTest:

	"""
	Test Class for running the letterbox service on a system without picamera
	"""

	def __init__(self,automode=False):
		logger.info('init PiCamera')
		self.camera = None

		logger.info('starting  camera...')
		self.startCamera(automode)

	def __del__(self):
		self.stopCamera()
		logger.info("cleaned up CameraControl")

	def startCamera (self,automode):
		time.sleep(1) # warmup time

	def stopCamera(self):
		return

	def captureImage(self):
		logger.info('taking image')
		image = cv2.imread("tests/images/input.jpg")
		time.sleep(3)
		return image

	def startPreview(self,duration=30):
		logger.info("started camera preview")
		time.sleep(20)