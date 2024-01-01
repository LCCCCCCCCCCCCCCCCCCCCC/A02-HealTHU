import os
import subprocess
import time
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta


# 添加从today开始第七天的课程
def addClassEveryday():
    from .models import Thuinfo
    from schedule.models import Todo, Schedule
    print('add class everyday')
    today = datetime.now()
    afterday = today + timedelta(days=6)
    afterday = afterday.strftime('%Y-%m-%d')
    # 遍历thu_info
    thu_infos = Thuinfo.objects.all()
    for thu_info in thu_infos:
        thu_class = thu_info.classInfo
        schedule = thu_class.schedule
        # 遍历schedule查找日期等于afterday的课程
        for i in range(len(schedule)):
            if afterday in schedule[i]['date']:
                # 找到课程后，添加到todo数据库中
                targetSchedule = Schedule.objects.filter(id=thu_info.id).first()
                if not targetSchedule:
                    # create a new schedule
                    newSchedule = Schedule.objects.create(id=thu_info.id, todos=[], partiActs=[], initiActs=[],
                                                          appoints=[],
                                                          applications=[])
                    newSchedule.save()
                    targetSchedule = newSchedule
                    pass
                newTodo = Todo.objects.create(
                    title=schedule[i]['name'],
                    date=afterday.replace('-', '/'),
                    start=schedule[i]['start'],
                    end=schedule[i]['end'],
                    label='课表',
                    type='课程',
                    state=0,
                    sportType=0,
                    sportState='',
                    readOnly=1,
                    promoter=thu_info.id,
                    jobId='')
                newTodoId = newTodo.id
                targetSchedule.todos.append(newTodoId)
                targetSchedule.save()


def healthTestProcess(data_string):
    data_list = eval(data_string)
    result = {}
    for item in data_list:
        key = item[0]
        value = item[1]
        result[key] = value
    return result


def calendarDate(calendar_start, day_of_week, week_number):
    # 解析calendar_start字符串为日期对象
    calendar_start_date = datetime.strptime(calendar_start, "%Y-%m-%d")

    # 计算第一周的起始日期
    first_week_start = calendar_start_date - timedelta(days=calendar_start_date.weekday())

    # 计算目标周的起始日期
    target_week_start = first_week_start + timedelta(weeks=(week_number - 1))
    target_week_day = target_week_start + timedelta(days=(day_of_week - 1))

    return target_week_day.strftime("%Y-%m-%d")


def classTime(start, end):
    start_mapping = {
        1: "08:00",
        2: "08:50",
        3: "09:50",
        4: "10:40",
        5: "11:30",
        6: "13:30",
        7: "14:20",
        8: "15:20",
        9: "16:10",
        10: "17:05",
        11: "17:55",
        12: "19:20",
        13: "20:10",
        14: "21:00"
    }
    end_mapping = {
        1: "08:45",
        2: "09:35",
        3: "10:35",
        4: "11:25",
        5: "12:15",
        6: "14:15",
        7: "15:05",
        8: "16:05",
        9: "16:55",
        10: "17:50",
        11: "18:40",
        12: "20:05",
        13: "20:55",
        14: "21:45"
    }
    return start_mapping[start], end_mapping[end]


def classProcess(first_day, data_string):
    lines = data_string.split('\n')
    nameLine = lines[2].strip()
    locationLine = lines[3].strip()
    typeLine = lines[4].strip()
    name = nameLine[nameLine.index("'") + 1:nameLine.rindex("'")]
    location = locationLine[locationLine.index("'") + 1:locationLine.rindex("'")]
    type = int(typeLine.split(':')[1].strip()[0])
    basenum = int(lines[8].strip())
    results = []

    if basenum == 0:
        examlines = data_string.split('-----')[1]
        day_of_week_start = examlines.find("dayOfWeek") + 11
        day_of_week_end = examlines.find(",", day_of_week_start)
        day_of_week = int(examlines[day_of_week_start:day_of_week_end])

        begin_start = examlines.find("begin") + 8
        begin_end = examlines.find(",", begin_start)
        begin = examlines[begin_start:begin_end - 1]

        end_start = examlines.find("end") + 6
        end_end = examlines.find(",", end_start)
        end = examlines[end_start:end_end - 1]

        week_number_start = examlines.find("weekNumber") + 12
        week_number_end = examlines.find("}", week_number_start)
        week_number = int(examlines[week_number_start:week_number_end])
        exam_date = calendarDate(first_day, day_of_week, week_number)
        result = {}
        result['name'] = name
        result['location'] = location
        result['type'] = type
        result['start'] = begin
        result['end'] = end
        result['date'] = [exam_date]
        results.append(result)
    else:
        courselines = data_string.split('-----')[1]
        baselines = courselines.split('----')[0]
        lines = baselines.split('\n')
        day_of_week_list = []
        begin_list = []
        end_list = []
        if basenum + 2 == len(lines):
            day_of_week_start = lines[1].find("dayOfWeek") + 11
            day_of_week_end = lines[1].find(",", day_of_week_start)
            day_of_week = int(lines[1][day_of_week_start:day_of_week_end])
            day_of_week_list.append(day_of_week)
            begin_start = lines[1].find("begin") + 7
            begin_end = lines[1].find(",", begin_start)
            begin = int(lines[1][begin_start:begin_end])
            begin_list.append(begin)
            end_start = lines[1].find("end") + 5
            end_end = lines[1].find(",", end_start)
            end = int(lines[1][end_start:end_end])
            end_list.append(end)
        elif basenum + 4 == len(lines):
            day_of_week_start = lines[2].find("dayOfWeek") + 11
            day_of_week_end = lines[2].find(",", day_of_week_start)
            day_of_week = int(lines[2][day_of_week_start:day_of_week_end])
            day_of_week_list.append(day_of_week)
            begin_start = lines[2].find("begin") + 7
            begin_end = lines[2].find(",", begin_start)
            begin = int(lines[2][begin_start:begin_end])
            begin_list.append(begin)
            end_start = lines[2].find("end") + 5
            end_end = lines[2].find(",", end_start)
            end = int(lines[2][end_start:end_end])
            end_list.append(end)
        else:
            for i in range(basenum):
                day_of_week_start = lines[i + 3].find("dayOfWeek") + 11
                day_of_week_end = lines[i + 3].find(",", day_of_week_start)
                day_of_week = int(lines[i + 3][day_of_week_start:day_of_week_end])
                day_of_week_list.append(day_of_week)
                begin_start = lines[i + 3].find("begin") + 7
                begin_end = lines[i + 3].find(",", begin_start)
                begin = int(lines[i + 3][begin_start:begin_end])
                begin_list.append(begin)
                end_start = lines[i + 3].find("end") + 5
                end_end = lines[i + 3].find(",", end_start)
                end = int(lines[i + 3][end_start:end_end])
                end_list.append(end)
        weekslines = courselines.split('----')[1].split('---')
        for i, list in enumerate(weekslines):
            if list == '\n':
                break
            week_list = eval(list.strip())
            result = {}
            result['name'] = name
            result['location'] = location
            result['type'] = type
            result['date'] = []
            result['start'] = classTime(begin_list[i], end_list[i])[0]
            result['end'] = classTime(begin_list[i], end_list[i])[1]
            for item in week_list:
                result['date'].append(calendarDate(first_day, day_of_week_list[i], item))
            results.append(result)
    return results


def update_info():
    from .models import Thuinfo
    thuinfos = Thuinfo.objects.all()  # 获取所有的Thuinfo对象
    current_dir = os.getcwd()

    # 进入上级目录
    os.chdir('./thu-info-lib-7.1.5')

    for thuinfo in thuinfos:
        # 更新healthInfo
        # 假设你有一个新的healthInfo对象，可以通过以下方式进行更新
        # thuinfo.healthInfo = new_health_info
        # 其中new_health_info是一个新的ThuHealthuInfo对象
        userId = thuinfo.studentNum
        password = thuinfo.studentPass
        healthResult = subprocess.run(
            f'OPENSSL_CONF=${{PWD}}/openssl.cnf node -r esm demo_report.js {userId} {password}', shell=True, check=True,
            stdout=subprocess.PIPE)
        output = healthResult.stdout.decode('utf-8')
        result = healthTestProcess(output)
        thuinfo.healthInfo.height = result['身高']
        thuinfo.healthInfo.weight = result['体重']
        thuinfo.healthInfo.bmi = result['体重'] * 10000 / (result['身高'] * result['身高'])
        thuinfo.healthInfo.vitalCapacity = result['肺活量']
        thuinfo.healthInfo.grade_vitalCapacity = result['肺活量分数']
        thuinfo.healthInfo.time_800m = result['800M跑']
        thuinfo.healthInfo.grade_800m = result['800M跑分数']
        thuinfo.healthInfo.time_1000m = result['1000M跑']
        thuinfo.healthInfo.grade_1000m = result['1000M跑分数']
        thuinfo.healthInfo.time_50m = result['50M跑']
        thuinfo.healthInfo.grade_50m = result['50M跑分数']
        thuinfo.healthInfo.longjump = result['立定跳远']
        thuinfo.healthInfo.grade_longjump = result['立定跳远分数']
        thuinfo.healthInfo.sitreach = result['坐位体前屈']
        thuinfo.healthInfo.grade_sitreach = result['坐位体前屈分数']
        thuinfo.healthInfo.situp = result['仰卧起坐']
        thuinfo.healthInfo.grade_situp = result['仰卧起坐分数']
        thuinfo.healthInfo.pullup = result['引体向上']
        thuinfo.healthInfo.grade_pullup = result['引体向上分数']
        thuinfo.healthInfo.save()

        # 更新classInfo
        # 假设你有一个新的classInfo对象，可以通过以下方式进行更新
        # thuinfo.classInfo = new_class_info
        # 其中new_class_info是一个新的ThuClass对象
        classResult = subprocess.run(
            f'OPENSSL_CONF=${{PWD}}/openssl.cnf node -r esm demo_schedule.js {userId} {password}', shell=True,
            check=True, stdout=subprocess.PIPE)
        output = classResult.stdout.decode('utf-8')
        output = output.split('------')
        first_day_start = output[0].find("firstDay") + 11
        first_day_end = output[0].find("'", first_day_start)
        first_day = output[0][first_day_start:first_day_end]
        class_info = []
        for i in range(1, len(output)):
            class_info.extend(classProcess(first_day, output[i]))
        thuinfo.classInfo.schedule = class_info
        thuinfo.classInfo.save()

        # 保存更新后的对象
        thuinfo.save()
    os.chdir(current_dir)


# 调用函数进行更新
# update_info()
thuInfo_update_schedule = BackgroundScheduler()
class_update_schedule = BackgroundScheduler()
thuInfo_update_schedule.add_job(update_info, 'interval', weeks=1)
thuInfo_update_schedule.start()
class_update_schedule.add_job(addClassEveryday, 'cron', hour=0, minute=1)
class_update_schedule.start()