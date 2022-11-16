from PyQt6 import QtWidgets, QtGui, QtCore
from UI import Ui_MainWindow

class MainWindow_controller(QtWidgets.QMainWindow):
    def __init__(self):
        super().__init__() # in python3, super(Class, self).xxx = super().xxx
        self.ui = Ui_MainWindow()
        self.ui.setupUi(self)
        self.setup_control()
        self.ui.outerStack.setCurrentWidget(self.ui.mainPage) # 設定程式進入畫面

    def setup_control(self):
        """teamPage"""
        self.ui.browseBenchBtn.clicked.connect(self.browseBench)
        self.ui.editRegularBtn.clicked.connect(self.editRegular)

    def browseBench(self):
        print("browseBench started")
    
    def editRegular(self):
        print("editRegular started")
        self.ui.mainStack.setCurrentWidget(self.ui.teamEditPage)
