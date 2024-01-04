## API设计
### 〇、数据类型约定
#### 用户 user
|字段|类型|说明|
|-------------|-------------|-------------|
|openid|string|微信绑定的openid|
|userInfo|userInfo|个人信息|
|healthInfo|healthInfo|健康状况|
|bindTHU|bool|绑定清华身份情况|
|todos|todo[]|待办事项|
|partiActs|activity[]|参与的活动|
|initiActs|activity[]|发起的活动|
|appoints|appoint[]|预约的场馆|
|posts|post[]|帖子|
|achRange|int|成就可见范围(全部可见/粉丝可见/自己可见)0/1/2 初始为0|
|actRange|int|活动可见范围|
|postRange|int|帖子可见范围|
#### 个人信息 UserInfo
|字段|类型|说明|
|-------------|-------------|-------------|
|avatarUrl|string|用户头像|
|nickName|string|用户昵称|
|signature|string|用户签名|
|followings|int[]|关注列表|
|followingNum|int|关注人数|
|followers|int[]|粉丝列表|
|followerNum|int|粉丝数|
|id|int|用户id|
|following_state|string|关注状况|
#### 健康状况 healthInfo
|字段|类型|说明|
|-------------|-------------|-------------|
|updateTime|string|最近更新日期|
|height|double|身高|
|weight|double|体重|
|vitalCapacity|int|肺活量|
|bmi|double|BMI指数|
|time_800m|string|800m|
|grade_800m|double|800m成绩|
|time_1000m|string|1000m|
|grade_1000m|double|1000m成绩|
|time_50m|string|50m|
|grade_50m|double|50m成绩|
|longjump|string|立定跳远|
|grade_longjump|double|立定跳远|
|sitreach|string|坐位体前屈|
|grade_sitreach|double|坐位体前屈|
|situp|string|仰卧起坐|
|grade_situp|int|仰卧起坐|
|pullup|string|引体向上|
|grade_pullup|int|引体向上|

grade前缀的为分数成绩
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
|sportType|string|运动类型|
|sportState|int|运动状态(初始为0)|

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
|likeNum|int|点赞数|
|likeList|int[]|点赞者的Id|
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
|date|string|日期|
|data|int[12]|睡眠情况|
#### 帖子 post
|字段|类型|说明|
|-------------|-------------|-------------|
|id|int|帖子id|
|userId|int|楼主id|
|name|string|楼主昵称|
|avatar|string|楼主头像|
|title|string|标题|
|time|string|发布时间|
|content|string|内容|
|images|string[]|图片|
|likeList|int[]|点赞人的id|
|replies|reply[]|回复|
#### 回复 reply
|字段|类型|说明|
|-------------|-------------|-------------|
|floor|int|楼层|
|userId|int|发布人|
|name|string|发布人名称|
|avatar|string|发布人头像|
|time|string|发布时间|
|content|string|内容|
|likeList|int[]|点赞人的id|
|aboveId|int|(如果楼层间回复)回复的楼层,初始为0|
|aboveName|string|回复楼层发布人|
|aboveContent|string|回复楼层的内容|
### 一、用户管理部分
#### 首次登录时生成id与token
```HTTP
[GET] /user/getId
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
|token|string|唯一token，用作后续请求头|
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
#### 关注用户
[POST] /user/addAttention
##### 请求参数
|参数|类型|说明|
|-------------|-------------|-------------|
|hostId|int|自己用户id|
|customerId|int|其他用户id|
#### 取消关注用户
[POST] /user/delAttention
##### 请求参数
|参数|类型|说明|
|-------------|-------------|-------------|
|hostId|int|自己用户id|
|customerId|int|其他用户id|

#### 搜索用户
```HTTP
[GET] /user/search
```
##### 请求参数
|参数|类型|说明|
|-------------|-------------|-------------|
|key|string|搜索关键字|

查找用户nickName包含key的用户||用户id与key相等的用户

##### 响应数据
|参数|类型|说明|
|-------------|-------------|-------------|
|userList|[]|用户列表

|参数|类型|说明|
|-------------|-------------|-------------|
|userId|int|用户id|
|avatar|string|用户头像|
|name|string|昵称|


#### 获取个人主页信息
```HTTP
[GET] /user/getPersonal
```
##### 请求参数
|参数|类型|说明|
|-------------|-------------|-------------|
|hostId|int||
|customerId|int||

##### 响应数据
|参数|类型|说明|
|-------------|-------------|-------------|
|nickName|string||
|avatarUrl|string||
|signature|string||
|followings|int[]|关注|
|followers|int[]|粉丝|
|following_state|string|关注情况|
|posts|post[]|发布的帖子|
|partActs|partAct[]|参与的活动|
|iniActs|iniAct[]|发起的活动|

##### iniAct
|参数|类型|说明|
|-------------|-------------|-------------|
|title|string|标题|
|participants|int[]|参与人|
|partNumMin|int|人数最小值|
|partNumMax|int|人数最大值|
|date|string|日期|
|start|string|开始时间|
|end|string|结束时间|
|label|string|备注|
|tags|string[]|标签|
|id|int|活动id|

##### partAct
|参数|类型|说明|
|-------------|-------------|-------------|
|title|string|标题|
|promoter|int|发起人|
|participants|int[]|参与人|
|partNumMin|int|人数最小值|
|partNumMax|int|人数最大值|
|date|string|日期|
|start|string|开始时间|
|end|string|结束时间|
|label|string|备注|
|tags|string[]|标签|
|id|int|活动id|

#### post
|参数|类型|说明|
|-------------|-------------|-------------|
|id|int|帖子id|
|title|string|标题|
|time|string|发布时间|
|likeNum|int|点赞数|
|commentNum|int|评论数|

#### 获取隐私范围
```HTTP
[POST] /user/getRange
```
#### 传入参数
|参数|类型|说明|
|-------------|-------------|-------------|
|id|int|用户id|

#### 返回参数
|参数|类型|说明|
|-------------|-------------|-------------|
|achRange|int|成就可见范围(全部可见/粉丝可见/自己可见)0/1/2 初始为0|
|actRange|int|活动可见范围|
|postRange|int|帖子可见范围|

#### 改变隐私范围
```HTTP
[POST] /user/changeRange
```
#### 传入参数
|参数|类型|说明|
|-------------|-------------|-------------|
|id|int|用户id|
|achRange|int|成就可见范围(全部可见/粉丝可见/自己可见)0/1/2 初始为0|
|actRange|int|活动可见范围|
|postRange|int|帖子可见范围|

### 二、计划处理部分

#### 获取指定日期的事务
```HTTP
[GET] /schedule/todos
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

#### 获取最近若干天的ddl
```HTTP
[GET] /schedule/getDDL
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
[POST] /schedule/deleteTodo
```
##### 传入参数
|字段|类型|说明|
|-------------|-------------|-------------|
|id|int|用户id|
|date|string|日期|
|title|string|标题|
|start|string|开始时间|
|end|string|结束时间|

#### 事务的改
```HTTP
[GET] /schedule/changeTodo
```
##### 传入参数
|字段|类型|说明|
|-------------|-------------|-------------|
|id|int|用户id|
|oldDate|string|日期|
|oldTitle|string|标题|
|oldStart|string|开始时间|
|oldEnd|string|结束时间|
|newDate|string|日期|
|newTitle|string|标题|
|newStart|string|开始时间|
|newEnd|string|结束时间|
|newLabel|string|新备注|
|newType|string|新类型|

#### 完成事务
```HTTP
[POST] /schedule/{id}/doTodo
```
|字段|类型|说明|
|-------------|-------------|-------------|
|id|int|用户id|
|date|string|日期|
|title|string|标题|
|start|string|开始时间|
|end|string|结束时间|


进行的操作:将state设置为1，readOnly设置为True(不管先前如何)

### 三、活动处理部分

#### 发起活动
```HTTP
[POST] /activity/addAct
```
##### 传入参数
|字段|类型|说明|
|-------------|-------------|-------------|
|activity|activity|发起的活动信息|

提示：不仅要改变活动相关信息，还要在用户的todo中添加这一项活动，todo的各项属性与act的同名属性基本相同，在todo的标题前添加"(我发起的)", 类型就是"活动"，state=0(未完成)，readOnly=true(不可修改)
在发起成功后最好每个活动也带一个id，和用户id逻辑类似

#### 查找活动
```HTTP
[GET] /activity/findAct
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
[GET] /activity/getActDetail
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
[POST] /activity/partAct
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
[GET] /activity/getApplication
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
[POST] /activity/appReply
```
##### 传入参数
|字段|类型|说明|
|-------------|-------------|-------------|
|id|int|用户id|
|isAgree|int|是否同意加入|
|applicationId|int|申请信息|

提示：也是act端和todo端都要进行更改，如果同意，申请者todo事项的前缀从"(申请中)"改为"(我参与的)"，否则删除这条事项。同时，删掉被申请者的这条申请信息，对活动参与人进行更改。

#### 删除活动
```HTTP
[POST] /activity/deleteAct
```

##### 传入参数
|字段|类型|说明|
|-------------|-------------|-------------|
|id|int|发起人id|
|actId|int|活动id|

#### 修改活动
```HTTP
[POST] /activity/changeAct
```
##### 传入参数
|字段|类型|说明|
|-------------|-------------|-------------|
|id|int|发起人id|
|actId|int|活动id|
|newTitle|string|标题|
|newPartnum|int[2]|人数范围|
|newLabel|string|备注|
|newDetail|string|详情|
|newImages|string[]|图片|
|newTags|string[]|标签|

#### 退出活动
```HTTP
[POST] /activity/exitAct
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
[POST] /activity/commentAct
```
##### 传入参数
|字段|类型|说明|
|-------------|-------------|-------------|
|commenterId|int|评价人id|
|actId|int|活动id|
|score|int|分数|
|comment|string|评价内容|
|pubTime|string|评价时间|

#### 对评价进行点赞
```HTTP
[POST] /activity/likeComment
```
##### 传入参数
|字段|类型|说明|
|-------------|-------------|-------------|
|id|int|评价本身的id|
|actId|int|活动id|
|likerId|int|点赞人id|

#### 对评价取消点赞
```HTTP
[POST] /activity/dislikeComment
```
##### 传入参数
|字段|类型|说明|
|-------------|-------------|-------------|
|id|int|评价本身的id|
|actId|int|活动id|
|dislikerId|int|点赞人id|

#### 对评价进行删除
```HTTP
[POST] /activity/deleteComment
```
##### 传入参数
|字段|类型|说明|
|-------------|-------------|-------------|
|id|int|评价本身的id|
|actId|int|活动id|

### 四、消息部分

#### 获取消息
```HTTP
[GET] /message/getMessages
```
##### 传入参数
|字段|类型|说明|
|-------------|-------------|-------------|
|id|int|用户id|

按消息id倒序返回

##### 返回参数
下面的列表

|字段|类型|说明|
|-------------|-------------|-------------|
|id|int|消息id，每个人对应若干消息|
|time|string|时间|
|state|int|0表示未读,1表示已读|
|content|string|消息内容|
|url|string|跳转到的具体位置，比如帖子下的评论|

#### 将消息设置为已读
```HTTP
[POST] /message/read
```

##### 传入参数
|字段|类型|说明|
|-------------|-------------|-------------|
|id|int|用户id|
|messageId|int|帖子id|

#### 向某个人发送消息
```HTTP
[POST] /message/sendMessage
```
##### 传入参数
|字段|类型|说明|
|-------------|-------------|-------------|
|recieverId|int|接收者id|
|time|string|时间|
|content|string|消息内容|
|toUrl|string|跳转到的具体位置，比如帖子下的评论|

#### 删除消息
```HTTP
[POST] /message/deleteMessage
```
##### 传入参数
|字段|类型|说明|
|-------------|-------------|-------------|
|id|int|用户id|
|messageId|int|消息id|

### 五、论坛部分
#### 发布帖子
```HTTP
[POST] /bbs/addPost
```
##### 传入参数
|字段|类型|说明|
|-------------|-------------|-------------|
|id|int|用户id|
|title|string|标题|
|time|string|发布时间|
|content|string|内容|
|images|string[]|图片|

#### 删除帖子
```HTTP
[POST] /bbs/deletePost
```
##### 传入参数
|字段|类型|说明|
|-------------|-------------|-------------|
|id|int|用户id|
|postId|int|帖子id|

#### 给帖子点赞
```HTTP
[POST] /bbs/likePost
```
##### 传入参数
|字段|类型|说明|
|-------------|-------------|-------------|
|id|int|用户id|
|postId|int|帖子id|

#### 给帖子取消点赞
```HTTP
[POST] /bbs/dislikePost
```
##### 传入参数
|字段|类型|说明|
|-------------|-------------|-------------|
|id|int|用户id|
|postId|int|帖子id|

#### 发布评论
```HTTP
[POST] /bbs/addReply
```
##### 传入参数
|字段|类型|说明|
|-------------|-------------|-------------|
|postId|int|帖子id|
|id|int|评论人|
|time|string|评论时间|
|content|string|内容|
|aboveId|int|(如果楼层间回复)回复的楼层,初始为1|

#### 删除评论
```HTTP
[POST] /bbs/deleteReply
```
##### 传入参数
|字段|类型|说明|
|-------------|-------------|-------------|
|id|int|用户id|
|postId|int|帖子id|
|floor|int|楼层|

(回复楼层从1开始)

#### 点赞评论
```HTTP
[POST] /bbs/likeReply
```
##### 传入参数
|字段|类型|说明|
|-------------|-------------|-------------|
|id|int|用户id|
|postId|int|帖子id|
|floor|int|楼层|

#### 取消点赞评论
```HTTP
[POST] /bbs/dislikeReply
```
##### 传入参数
|字段|类型|说明|
|-------------|-------------|-------------|
|id|int|用户id|
|postId|int|帖子id|
|floor|int|楼层|

#### 获取帖子
```HTTP
[GET] /bbs/getPost
```
##### 传入参数
|字段|类型|说明|
|-------------|-------------|-------------|
|type|int|获取模式|
|id|int|用户id|

0:id倒序获取最新50条帖子
1:点赞数倒序获取一周内的50条帖子
2:获取用户关注的人发布的所有帖子

##### 返回参数
下面格式的数组
|字段|类型|说明|
|-------------|-------------|-------------|
|id|int|帖子id|
|title|string|标题|
|time|string|发布时间|
|name|string|发布人姓名|
|likeNum|int|点赞数|
|commentNum|int|评论数|
|images|string[]|图片|

#### 搜索帖子
```HTTP
[GET] /bbs/searchPost
```
##### 传入参数
|字段|类型|说明|
|-------------|-------------|-------------|
|key|string|关键词|

查找标题与内容匹配的帖子，返回格式同上

#### 查看帖子
```HTTP
[GET] /bbs/getPostDetail
```
##### 传入参数
|字段|类型|说明|
|-------------|-------------|-------------|
|id|int|用户id|
|postId|int|帖子id|

##### 返回参数
|字段|类型|说明|
|-------------|-------------|-------------|
|post|post|最上边定义的post结构|

### 五、清华身份部分

#### 绑定清华身份
```HTTP
[POST] /thuInfo/bindThu
```
##### 请求参数
|参数|类型|说明|
|-------------|-------------|-------------|
|id|int|id|
|thuID|string|学号|
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
  
#### 获取绑定情况
```HTTP
[GET] /thuInfo/bindState
```
##### 请求参数
|参数|类型|说明|
|-------------|-------------|-------------|
|id|int|用户id|
##### 响应数据
|字段|类型|说明|
|-------------|-------------|-------------|
|isBind|int|是否绑定|

#### 得到健康状况
```HTTP
[GET] /thuInfo/getHealthInfo
```

##### 请求参数
|参数|类型|说明|
|-------------|-------------|-------------|
|id|int|用户id|

##### 响应数据
|参数|类型|说明|
|-------------|-------------|-------------|
|healthInfo|healthInfo|健康状况(见上)|

### 六、睡眠部分
#### 获取睡眠情况
```HTTP
[GET] /sleep/getSleep
```
##### 请求参数
|参数|类型|说明|
|-------------|-------------|-------------|
|id|int|用户id|
|date|string|日期|

##### 响应数据
|参数|类型|说明|
|-------------|-------------|-------------|
|sleepDaily[8]|sleepDaily|今天以及之前七天的，按时间顺序返回，即第0项为七天以前，第7项为今天，如果当天没有则data项为[0,0,0,0,0,0,0,0,0,0,0,0],不要返回空值|

#### 睡眠信息 sleepDaily
|字段|类型|说明|
|-------------|-------------|-------------|
|date|string|日期|
|data|int[12]|睡眠情况|


#### 改变睡眠条形图
```HTTP
[POST] /sleep/changeSleep
```

##### 请求参数
|参数|类型|说明|
|-------------|-------------|-------------|
|id|int|用户id|
|date|string|日期|
|data|int[12]|当天睡眠情况|

改变那天的sleepDaily,没有就添加
