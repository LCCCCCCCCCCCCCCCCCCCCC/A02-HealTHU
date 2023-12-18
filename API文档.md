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
|state|int|状态(0代表未完成，1代表已完成)|
|readOnly|bool|是否能被修改|

state不为0或为公共活动时，todo均只读
#### 活动 activity
|字段|类型|说明|
|-------------|-------------|-------------|
|pubTime|string|发布时间|
|title|string|标题|
|promoter|int|发起人|
|participants|int[]|参与人Id|
|partNumMin|int|人数最小值|
|partNumMax|int|人数最大值|
|date|string|日期(格式为年/月/日)|
|start|string|开始时间(格式为xx:xx)|
|end|string|结束时间|
|label|string|备注|
|detail|string|详情|
|images|string[]|图片|
|tags|string[]|标签|
|state|int|活动状态|
|comments|comment[]|活动评价|

##### 活动评价 comment
|字段|类型|说明|
|-------------|-------------|-------------|
|id|int|按照评价添加顺序即可|
|commenterId|int|评价人Id|
|nickName|string|评价人昵称|
|avatarUrl|string|头像|
|comment|string|内容|
|likes|int|点赞数|
|likesId|int[]|点赞者的Id|
|pubTime|string|发布时间|


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

注：建议按时间顺序返回
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

#### 完成事务
```HTTP
[POST] /schedule/{id}/doTodo
```
|字段|类型|说明|
|-------------|-------------|-------------|
|id|int|用户id|
|todo|todo|事项(可参照之前由date, title, start, end唯一决定)|

进行的操作:将state设置为1，readOnly设置为True(不管先前如何)

### 三、活动处理部分

#### 发起活动
```HTTP
[POST] /activity/{id}/addAct
```
##### 传入参数
|字段|类型|说明|
|-------------|-------------|-------------|
|activity|activity|发起的活动信息|

提示：不仅要改变活动相关信息，还要在用户的todo中添加这一项活动，todo的各项属性与act的同名属性基本相同，在todo的标题前添加"(我发起的)", 类型就是"活动"，state=0(未完成)，readOnly=true(不可修改)
在发起成功后最好每个活动也带一个id，和用户id逻辑类似

#### 查找活动
```HTTP
[GET] /activity/{id}/findAct
```

##### 传入参数
|字段|类型|说明|
|-------------|-------------|-------------|
|promoter|id|发起人(可选)|
|participants|id|参与人(可选)|
|keyForSearch|string|用于查找的关键字(返回tag与其相同和标题、备注中包含关键字的所有活动)(可选)|
|minDate|string|最早日期(可选)|
|maxDate|string|最晚日期(可选)|
|isRandom|bool|是否随机返回最多20条活动(无前置限制)|

##### 响应数据
|字段|类型|说明|
|-------------|-------------|-------------|
|title|string|标题|
|promoter|string|发起人|
|participantNum|int|参与人数量|
|partNumMin|int|人数最小值|
|partNumMax|int|人数最大值|
|date|string|日期(格式为年/月/日)|
|start|string|开始时间(格式为xx:xx)|
|end|string|结束时间|
|label|string|备注|
|tags|string[]|标签|
|state|int|活动状态|


#### 查看活动详情
```HTTP
[GET] /activity/{id}/getActDetail
```

##### 传入参数
|字段|类型|说明|
|-------------|-------------|-------------|
|actId|int|活动id|

##### 响应数据
|字段|类型|说明|
|-------------|-------------|-------------|
|activity|activity|得到的活动(完整信息)|



#### 参与活动
```HTTP
[POST] /activity/{id}/partAct
```

##### 传入参数
|字段|类型|说明|
|-------------|-------------|-------------|
|id|int|用户id|
|otherid|int|发起人id|
|actId|actId|参与的活动|
|message|string|申请时附带的一段信息|

(完毕后同样会在todos中添加一段事项，前缀"(申请中)")

#### 获取活动申请信息
```HTTP
[GET] /activity/{id}/getApplication
```

##### 传入参数
|字段|类型|说明|
|-------------|-------------|-------------|
|id|int|用户id|

##### 响应数据
|字段|类型|说明|
|-------------|-------------|-------------|
|applications|application[]||

#### 申请信息 application
|字段|类型|说明|
|-------------|-------------|-------------|
|title|string|活动标题|
|applyerId|int|申请者id|
|actId|int|活动id|
|message|string|申请时附带的一段信息|

#### 同意/不同意申请
```HTTP
[POST] /activity/{id}/appReply
```
##### 传入参数
|字段|类型|说明|
|-------------|-------------|-------------|
|id|int|用户id|
|appId|int|申请者id|
|actId|int|活动id|
|isAgree|int|是否同意加入|
|applicationId|int|申请信息|

提示：也是act端和todo端都要进行更改，如果同意，申请者todo事项的前缀从"(申请中)"改为"(我参与的)"，否则删除这条事项。同时，删掉被申请者的这条申请信息，对活动参与人进行更改。

#### 删除活动
```HTTP
[POST] /activity/{id}/deleteAct
```

##### 传入参数
|字段|类型|说明|
|-------------|-------------|-------------|
|id|int|发起人id|
|actId|int|活动id|

#### 修改活动
```HTTP
[POST] /activity/{id}/changeAct
```
##### 传入参数
|字段|类型|说明|
|-------------|-------------|-------------|
|id|int|发起人id|
|actId|int|活动id|
|newtitle|string|标题|
|newpartnum|int[2]|人数范围|
|newlabel|string|备注|
|newdetail|string|详情|
|newimages|string[]|图片|
|newtags|string[]|标签|

#### 退出活动
```HTTP
[POST] /activity/{id}/exitAct
```
##### 传入参数
|字段|类型|说明|
|-------------|-------------|-------------|
|id|int|发起人id|
|exitId|int|申请退出的id|
|actId|int|活动id|

注：上边三个操作也要修改todos事项

#### 对活动进行评价
```HTTP
[POST] /activity/{id}/commentAct
```
##### 传入参数
|字段|类型|说明|
|-------------|-------------|-------------|
|id|int|发起人id|
|commentId|int|评价人id|
|actId|int|活动id|
|comment|string|评价内容|
|pubTime|string|评价时间|

点赞略，按照活动id和评价id令点赞数+1即可
删除略，同样按两个id索引

### 四、运动处理部分

#### 获取场馆预约信息
```HTTP
[GET] /sport/{id}/getAppoints
```
##### 传入参数
|字段|类型|说明|
|-------------|-------------|-------------|
|id|int|查找的id|
|date|string|当天时间|

##### 返回参数
|字段|类型|说明|
|-------------|-------------|-------------|
|appoints|appoint[]|七天内的场馆预约|

#### 获取运动信息
TODO

### 五、消息部分

#### 获取距今一定范围的若干条消息
```HTTP
[GET] /message/{id}/getMessages
```
##### 传入参数
|字段|类型|说明|
|-------------|-------------|-------------|
|id|int|用户id|
|start|int|从第x条|
|end|int|到第y条|

比如获取最近的20条消息，则x=1，y=20，按时间倒序返回

##### 返回参数
|字段|类型|说明|
|-------------|-------------|-------------|
|messages|message[]|简略message|
|unread|int|未读消息数量(所有)|

|字段|类型|说明|
|-------------|-------------|-------------|
|id|int|同样累加|
|date|string|时间|
|state|int|0表示未读,1表示已读|
|title|string|标题|
|label|string|简略内容,只回复前若干个字符和...|
|sender|string|发件者名称|

#### 查看具体消息
```HTTP
[GET] /message/{id}/getMessage
```
##### 传入参数
|字段|类型|说明|
|-------------|-------------|-------------|
|id|int|用户id|
|messageId|int|消息Id|

##### 返回参数
|字段|类型|说明|
|-------------|-------------|-------------|
|date|string|时间|
|title|string|标题|
|label|string|完整内容|
|sender|string|发件者名称|
|senderId|int|发件者Id|
|senderUrl|string|发件者头像|
|toUrl|string|(可选)跳转到的具体位置，比如帖子下的评论|

将帖子标记为已读略，同样传两个Id

