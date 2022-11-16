from PyQt6 import QtWidgets, QtGui, QtCore
from UI import Ui_MainWindow

class MainWindow_controller(QtWidgets.QMainWindow):
    def __init__(self):
        super().__init__() # in python3, super(Class, self).xxx = super().xxx
        self.ui = Ui_MainWindow()
        self.ui.setupUi(self)
        self.setup_control()
        #TODO: change back to landingPage
        # 可將以下含式改為包含載入所有login後所需之資訊  # self.login()
        self.ui.outerStack.setCurrentWidget(self.ui.mainPage) # 設定程式進入畫面

    def setup_control(self):
        """teamPage"""
        self.ui.browseBenchBtn.clicked.connect(self.browseBench)
        self.ui.editRegularBtn.clicked.connect(self.editRegular)
        """regularEditPage"""
        #TODO: to make sure that there are [regularPage, regularEditPage, benchPage, benchEditPage]

    # teamPage
    def browseBench(self):
        print("browseBench started")
        print("browseBench finished")
    def editRegular(self):
        print("editRegular started")
        self.ui.mainStack.setCurrentWidget(self.ui.teamEditPage)
        print("editRegular finished")
