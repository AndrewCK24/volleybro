from PyQt6 import QtWidgets, QtGui, QtCore
from UI import Ui_MainWindow
import json

class MainWindow_controller(QtWidgets.QMainWindow):
    def __init__(self):
        super().__init__() # in python3, super(Class, self).xxx = super().xxx
        self.ui = Ui_MainWindow()
        self.ui.setupUi(self)
        self.load_roster_info()
        self.initialize_homepages()
        self.setup_control()

    # 建立按鈕功能
    def setup_control(self):
        """navBar"""
        self.ui.dashboardBtn.clicked.connect(self.show_dashboard)
        self.ui.rosterBtn.clicked.connect(self.show_regularPage)
        self.ui.historyBtn.clicked.connect(self.show_historyPage)
        self.ui.newGameBtn.clicked.connect(self.create_new_record)
        ### """rosterPages""" ###
        """regularPage, regularEditPage"""
        self.ui.browseBenchBtn.clicked.connect(self.show_benchPage)
        self.ui.editRegularBtn.clicked.connect(self.show_regularEdit)
        self.ui.saveRegularBtn.clicked.connect(self.show_regularPage)
        """benchPage, benchEditPage"""
        self.ui.browseRegularBtn.clicked.connect(self.show_regularPage)
        self.ui.editBenchBtn.clicked.connect(self.show_benchEdit)
        self.ui.saveBenchBtn.clicked.connect(self.show_benchPage)

    """球員檔案載入、編輯"""

    def load_roster_info(self):
        with open("roster.json", "w+") as r:
            roster = r.load()
    
    def initialize_homepages(self):
        #TODO: change back to landingPage
        # 可將以下含式改為包含載入所有login後所需之資訊  # self.login()
        self.ui.outerStack.setCurrentWidget(self.ui.mainPage) # 設定程式進入畫面
        self.ui.mainStack.setCurrentWidget(self.ui.memberRegularPage)
    """頁面切換"""
    def show_dashboard(self):
        self.ui.mainStack.setCurrentWidget(self.ui.dashboardPage)
    def show_historyPage(self):
        self.ui.mainStack.setCurrentWidget(self.ui.historyPage)
    # memberPages
    def show_regularPage(self):
        self.ui.mainStack.setCurrentWidget(self.ui.memberRegularPage)
    def show_benchPage(self):
        self.ui.mainStack.setCurrentWidget(self.ui.memberBenchPage)
    def show_regularEdit(self):
        self.ui.mainStack.setCurrentWidget(self.ui.memberRegularEditPage)
    def show_benchEdit(self):
        self.ui.mainStack.setCurrentWidget(self.ui.memberBenchEditPage)
    
    """賽事記錄"""
    # gameEditPage
    def create_new_record(self):
        #TODO: 創建新的比賽檔案
        self.show_gameEdit()
    def show_gameEdit(self):
        self.ui.mainStack.setCurrentWidget(self.ui.gameEditPage)

    """"""
