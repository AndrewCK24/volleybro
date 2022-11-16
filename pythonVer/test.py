# -*- coding: utf-8 -*-
import sys
from PyQt5.QtWidgets import *
from PyQt5.QtCore import *


class MainWindow(QMainWindow):
     def __init__(self):
         super(MainWindow, self).__init__()
         self.resize(400, 300)

         # Button
         self.button = QPushButton(self)
         self.button.setGeometry(0, 0, 400, 300)
         self.button.setText('Main Window')
         self.button.setStyleSheet('font-size:40px')

         # Sub Window
         self.sub_window = SubWindow()

         # Button Event
         self.button.clicked.connect(self.sub_window.show)


class SubWindow(QWidget):
     def __init__(self):
         super(SubWindow, self).__init__()
         self.resize(400, 300)

         # Label
         self.label = QLabel(self)
         self.label.setGeometry(0, 0, 400, 300)
         self.label.setText('Sub Window')
         self.label.setAlignment(Qt.AlignCenter)
         self.label.setStyleSheet('font-size:40px')


if __name__ == '__main__':
     app = QApplication([])
     window = MainWindow()
     window.show()
     sys.exit(app.exec_())