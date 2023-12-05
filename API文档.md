## API设计
### 〇、数据类型约定
#### 用户 user
|字段|类型|说明|
|-------------|-------------|-------------|
|openid|string|微信绑定的openid|
|id|int|用户id|
|userInfo|userInfo|个人信息|
|healthInfo|healthInfo|健康状况|
|customSettings|customSettings|个性化设置|
|bindTHU|bool|绑定清华身份情况|
|todos|todo[]|待办事项|
|partiActs|activity[]|参与的活动|
|initiActs|activity[]|发起的活动|
|appoints|appoint[]|预约的场馆|
|sports|sportDaily[]|运动信息|
|sleeps|sleepDaily[]|睡眠情况|
|eats|eatDaily[]|饮食信息|
|healthDailies|healthDaily[]|健康日报|
|healthWeeklies|healthWeekly[]|健康周报 注：健康周报动态变化，为过去一周的集中统计，每日更新|
|achievements|achievement[]|用户成就|
|posts|post[]|个人帖子|
#### 个人信息 UserInfo
|字段|类型|说明|
|-------------|-------------|-------------|
|avatarUrl|string|用户头像|
|nickName|string|用户昵称|
|sign|string|用户签名|
|followings|int[]|关注列表|
|followingNum|int|关注人数|
|followers|int[]|粉丝列表|
|followerNum|int|粉丝数|
#### 健康状况 healthInfo
|字段|类型|说明|
|-------------|-------------|-------------|
|updateTime|string|最近更新日期|
|age|int|年龄|
|gender|string|性别|
|height|double|身高|
|weight|double|体重|
|bmi|double|BMI指数|
|grade|double|体测成绩|
|grade_800m|double|800m成绩|
|grade_1000m|double|1000m成绩|
|grade_50m|double|50m成绩|
|grade_jump|double|立定跳远|
|grade_sar|double|坐位体前屈|
|grade_situp|int|仰卧起坐|
|grade_pullup|int|引体向上|
#### 个性化设置 customSettings
|字段|类型|说明|
|-------------|-------------|-------------|
|model|int|显示模式|
|ddlRange|string|ddl提醒范围|
|storageRange|string|存储范围|
|blacklist|int[]|屏蔽列表|
#### 待办事项 todo
|字段|类型|说明|
|-------------|-------------|-------------|
|title|string|标题|
|date|string|日期(格式为年/月/日)|
|start|string|开始时间(格式为xx:xx)|
|end|string|结束时间|
|label|string|备注|
|type|string|类型|
|state|int|状态(0代表未开始，1代表进行中，2代表已完成，3代表未完成)|
|sportType|int|运动类型|
|sportState|string|运动完成情况（如跑步时间）|
#### 活动 activity
|字段|类型|说明|
|-------------|-------------|-------------|
|promoter|int|发起人|
|participants|int[]|参与人|
|partnum|int[2]|人数范围|
|date|string|活动时间|
|detail|string|详情|
|images|string[]|图片|
|tags|string[]|标签|
|state|int|活动状态|
#### 预约的场馆 appoint
|字段|类型|说明|
|-------------|-------------|-------------|
|gym|string|场馆|
|place|string|场所|
|start|string|开始时间|
|end|string|结束时间|
#### 运动信息 sportDaily
|字段|类型|说明|
|-------------|-------------|-------------|
|stepnum|int|今日步数|
|calorie|int|消耗热量|
|today|string[]|今日运动完成情况|
|weekly|int[]|一周运动量变化趋势|
|TODO|||
#### 睡眠信息 sleepDaily
|字段|类型|说明|
|-------------|-------------|-------------|
|state|string[2]|昨日睡眠情况|
|length|int|睡眠时长|
|suggest|string|建议睡眠时间|
|weekly|int[]|一周睡眠量变化趋势|
#### 饮食信息 eatDaily
|字段|类型|说明|
|-------------|-------------|-------------|
|calorie|int|建议摄入热量|
|foods|string|推荐菜品|
#### 用户成就 achievement
|字段|类型|说明|
|-------------|-------------|-------------|
|type|int|成就类型|
|icon|string|图标|
|state|完成情况|
### 一、用户管理部分
#### 首次登录时生成id
```HTTP
[GET] /getId
```
通过code调用API，获取用户的openid，如果这个openid在用户集中返回id，否则生成一个id，为用户总数+1，同时用户总数+1
获取openid可以参考
wx.request({
             url: 'https://api.weixin.qq.com/sns/jscode2session',data: {app:'wx0ed6410d0f2b476f',secret:'737153f44349fdde120da7fedce92666',code:res.code},success:function(response{{varopenid=response.data.openid;
                    }})})
##### 请求参数
|参数|类型|位置|说明|
|-------------|-------------|--|-------------|
|code|int|body|用户id|
##### 响应状态
|状态码|说明|
|-------------|-------------|
|200|获取成功|
|400|获取失败|
|405|请求方法错误|
##### 响应数据
|字段|类型|说明|
|-------------|-------------|-------------|
|id|int|用户id|
#### 获取用户信息
```HTTP
[GET] /user/getDetail
```
获取当前登录用户的信息。
##### 请求参数
|参数|类型|位置|说明|
|-------------|-------------|--|-------------|
|hostId|int|body|主体用户id|
|customerId|int|body|客体用户id|
##### 响应状态
|状态码|说明|
|-------------|-------------|
|200|获取成功|
|405|请求方法错误|
##### 响应数据
|字段|类型|说明|
|-------------|-------------|-------------|
|userinfo|userInfo|用户信息|
#### 修改用户信息
```HTTP
[POST] /user/{id}/changeInfo
```
##### 请求参数
|参数|类型|位置|说明|
|-------------|-------------|--|-------------|
|nickName|string|修改后的昵称（可选）|
|其余参数也是|
##### 响应状态
|状态码|说明|
|-------------|-------------|
|200|修改成功|
|400|修改失败|
|405|请求方法错误|
#### 获取关注情况
[GET] /user/getAttention
##### 请求参数
|参数|类型|说明|
|-------------|-------------|-------------|
|id|int|自己用户id|
##### 响应数据
|字段|类型|说明|
|-------------|-------------|-------------|
|attention|int|1代表已关注，2代表未关注，0代表是同一个用户，3代表在黑名单内|
#### 改变用户关注状态
[PUT] /user/changeAttention
##### 请求参数
|参数|类型|说明|
|-------------|-------------|-------------|
|id|int|自己用户id|
|otherid|int|其他用户id|
|attention|int|需要变为的关注状态，同上|
#### 绑定清华身份
```HTTP
[PUT] /user/{id}/bindTHU
```
##### 请求参数
|参数|类型|说明|
|-------------|-------------|-------------|
|xuehao|string|学号|
|password|string|密码|
##### 响应状态
|状态码|说明|
|-------------|-------------|
|200|绑定成功|
|400|绑定失败|
|405|请求方法错误|
##### 响应数据
|字段|类型|说明|
|-------------|-------------|-------------|
|bindTHU|bool|绑定清华身份情况|
* 通过清华身份获取信息后，定时在后端添加到事项等中，不在前端处理

### 二、计划处理部分
#### 获取指定日期的事务
```HTTP
[GET] /schedule/{id}/todos
```
##### 传入参数
|字段|类型|说明|
|-------------|-------------|-------------|
|id|int|用户id|
|date|string|日期(格式为年/月/日)|
（响应状态略）
##### 响应数据
|字段|类型|说明|
|-------------|-------------|-------------|
|todos|todo[]|待办事项|

#### 获取最近若干天的ddl (# not supported ?)
```HTTP
[GET] /schedule/{id}/getDDL
```
|字段|类型|说明|
|-------------|-------------|-------------|
|id|int|用户id|
|date|string|起始日期(格式为年/月/日)|
|range|int|共计天数|
##### 响应数据
|字段|类型|说明|
|-------------|-------------|-------------|
|ddls|todo[]|筛选出的这一段时间的ddl|

#### 事务的删
```HTTP
[GET] /schedule/{id}/deleteTodo
```
##### 传入参数
|字段|类型|说明|
|-------------|-------------|-------------|
|id|int|用户id|
|oldTodo|todo|修改前事项|
注意: 假设todo由 date, title, start, end唯一决定

#### 事务的改
```HTTP
[GET] /schedule/{id}/changeTodo
```
##### 传入参数
|字段|类型|说明|
|-------------|-------------|-------------|
|id|int|用户id|
|oldTodo|todo|修改前事项|
|newtodo|todo|修改后事项|
注意: 假设todo由 date, title, start, end唯一决定

#### 发起活动
```HTTP
[GET] /schedule/{id}/addAct
```
##### 传入参数
|字段|类型|说明|
|-------------|-------------|-------------|
|activity|activity|发起的活动信息|
#### 查找活动
```HTTP
[GET] /schedule/{id}/findAct
```
##### 传入参数
|字段|类型|说明|
|-------------|-------------|-------------|
|key|string|关键字（可选）|
|nickName|string|用户昵称（可选）|
|tag|string|标签（可选）|
|Date|string|日期（可选）（下略）|
##### 响应数据
|字段|类型|说明|
|-------------|-------------|-------------|
|acticities|activity[]|得到的活动|
#### 参与活动
```HTTP
[GET] /schedule/{id}/partAct
```
##### 传入参数
|字段|类型|说明|
|-------------|-------------|-------------|
|id|int|用户id|
|otherid|int|发起人id|
|activity|activity|参与的活动|

