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
        self.ui.mainStack.setCurrentWidget(self.ui.memberRegularPage)

    # 建立按鈕功能
    def setup_control(self):
        """navBar"""
        self.ui.rosterBtn.clicked.connect(self.show_regularPage)
        self.ui.newGameBtn.clicked.connect(self.show_gameEdit)
        ### """MemberPages""" ###
        """regularPage"""
        self.ui.browseBenchBtn.clicked.connect(self.show_benchPage)
        self.ui.editRegularBtn.clicked.connect(self.show_regularEdit)
        """regularEditPage"""
        self.ui.saveRegularBtn.clicked.connect(self.show_regularPage)
        #TODO: to make sure that there are [regularPage, regularEditPage, benchPage, benchEditPage]

    # 檢查球員檔案
    
    # memberPages
    def show_regularPage(self):
        self.ui.mainStack.setCurrentWidget(self.ui.memberRegularPage)
    def show_benchPage(self):
        self.ui.mainStack.setCurrentWidget(self.ui.memberBenchPage)
    def show_regularEdit(self):
        self.ui.mainStack.setCurrentWidget(self.ui.memberRegularEditPage)
    def show_benchEdit(self):
        self.ui.mainStack.setCurrentWidget(self.ui.memberBenchPage)
    # gameEditPage
    def create_new_record(self):
        #TODO: 創建新的比賽檔案
        self.show_gameEdit()
    def show_gameEdit(self):
        self.ui.mainStack.setCurrentWidget(self.ui.gameEditPage)
