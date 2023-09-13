# Information Architecture 資訊架構

依照使用者行為(目標) > 使用者任務(步驟) > 使用者故事(功能) 進行書寫

1. 登入系統
   1. 
2. 加入隊伍
3. 紀錄比賽
4. 檢視成績

# Functional Map 功能地圖

# Logic Flow 使用者流程

# Wireframe 線框圖

# AUTH
## 登入、註冊功能
```flow
start=>start: 使用者登入、註冊
io_account=>inputoutput: 輸入帳號
io_password=>inputoutput: 輸入密碼


start->io_account->io_password
```