from apscheduler.schedulers.background import BackgroundScheduler
import requests

token_schedule = BackgroundScheduler()
access_token = 'initial token(meaningless)'
def my_job():
    url = "https://api.weixin.qq.com/cgi-bin/token"
    params = {
        "grant_type": "client_credential",
        "appid": "wx0ed6410d0f2b476f",
        "secret": "737153f44349fdde120da7fedce92666"
    }

    response = requests.get(url, params=params)
    global access_token
    access_token = response.json()['access_token']
    print(access_token)

my_job()
token_schedule.add_job(my_job, 'interval', seconds=7200)
token_schedule.start()