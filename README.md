# HealTHU 项目说明及代码编写规范

本项目旨在通过动态性规划对大学生生活进行管理，从而达到生活健康的目的，目前面向主体位清华大学学生。

前端: 采用框架 Vant Weapp (https://youzan.github.io/vant-weapp/#/home)

后端：Django 

文件结构：

- 📂 frontend **前端代码**
- 📂 backend **后端代码**
- [会议记录.md](./会议记录.md) **团队会议纪要**
- [测试报告.md](./测试报告.md) **软件测试报告**
- [需求规格说明书.md](./需求规格说明书.md) **需求原型与交互设计文档**
- [API文档.md](./API文档.md) **开发过程中前后端对接API**
- [README.md](./README.md) **代码编写规范**

## 代码编写规范

### 1. 命名规范

- 1.1 变量名应具有描述性，能够清晰表达其用途，并采用驼峰命名法。例如：firstName, lastName
- 1.2 函数名也应具有描述性并采用驼峰命名法，清晰表达函数的功能。例如：calculateTotal, displayInfo
- 1.3 常量名应全部大写，使用下划线分隔，且必须具有描述性。例如：MAX_LENGTH, PI_VALUE

注意命名的大小写。

### 2. 注释规范

- 2.1 注释应该描述代码的功能、输入和输出等信息，方便他人理解并维护代码
- 2.2 代码变更时，需要及时更新注释，保持注释与代码的一致性

### 3. 格式规范

- 3.1 使用适当的缩进和空格/空行，增强代码的可读性
- 3.2 限制代码行长度在100个字符之内，避免出现过长的代码行
- 3.3 统一使用单引号或双引号

### 4. 异常处理规范

- 4.1 异常处理机制必须包含在代码中，避免未捕获的异常导致程序崩溃
- 4.2 异常信息应清晰明了，帮助快速定位和解决问题
- 4.3 尽量避免不必要的异常处理，减少 try-catch 嵌套

### 5. 代码复用规范

- 5.1 尽量避免重复代码，多次使用的代码块应封装成函数或类，方便复用和维护

### 6. 版本控制规范

- 6.1 使用Git管理代码
- 6.2 提交代码时，需要填写清晰的提交信息，描述修改的内容和新增功能，方便他人理解代码变更
- 6.3 使用规范的开发环境和工具，保持统一的开发平台

### 7. 测试规范

- 7.1 编写单元测试用例对代码进行测试覆盖，确保代码质量
- 7.2 在提交代码之前，必须进行代码审查和自测

## 附：Git Commit Message 规范

2023/11

Conventional Commits 是由众多开源项目贡献者共同约定的一个规范，用来约定 Git Commit 内容的书写方式，让 commit 内容更有价值、条理，使提交历史明确可追溯。一条规范的 commit 的通常结构如下：

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Commit Message 结构化

#### type

commit 的类型如下，其中删除线标注部分为本次项目正常情况下不会涉及的条目：

- feat：实现了新功能或新特性
- build：用于影响项目构建的修改或依赖项修改
- fix：修复 bug
- perf：更改了代码，以提高程序性能
- refa：代码重构
- docs：文档修改
- style：代码风格和格式修改
- test：用于测试用例的新增与修改
- chore：其他修改（不在上述类型中的修改）
- revert：恢复上一次提交
- ci：持续集成相关文件修改
- workflow：工作流相关文件修改
- release: 发布新版本

#### scope（可选）

commit 影响的范围，例如：route，component，utils，build……

#### subject

一个简短的概述，用于描述这次 commit 的修改内容。

#### body（可选）

commit 的具体修改内容，可以分为多行。

#### footer（可选）

本次修改的脚注，通常是 BREAKING CHANGE 或者所修复 bug 的 issue 标号。针对重大修改使用「`BREAKING CHANGE: `」来标记。

### Commit Message 示例

Conventional Commits 不仅约定了一个很好的规范，还提供了可扩展性。下面是一些对比示例：

```diff
- fix a bug
+ fix(scripts): 修复了 JavaScript 脚本中绘图部分折线图代表色不是 #39C5BB 的问题 (#39)
```

注：

1. 注意全角和半角标点符号的使用问题。结构化 commit 中连接 `<type>(<scope>)` 部分与 `<subject>` 部分的冒号应为半角符号，`<footer>` 部分涉及 issue 标号的部分应使用半角括号包裹起来（上述 commit message 表示修复了 issue#39 所反映的问题）。
2. 非汉字字符与汉字字符（除汉字标点符号）间应保留空格。
3. `<subject>` 和 `<body>` 部分的语种没有限制，但如果 `<subject>` 以英文单词开头，首字母不需要大写。

## 附：Merge/Pull Request 规范

Merge Request（或者 Pull Request）将开发者开发的代码内容以一种请求合并的方式来合并到它的目标分支上，这个请求的接收人（Reviewer）一般是项目、团队的负责人或者其他合作成员。

在 Github 上，一次完整的「开发-请求合并-合并成功」流程如下所示：

1. 创建新分支，并在这个分支上进行代码的修改。分支的名称应当能够大体反映本次开发流程的主题：
   
2. 拉取远程仓库，并在本地跟踪新建分支，在该分支上完成一切后续开发工作。主分支是受保护的，仅接受 Pull Request。不应当出现任何直接以主分支为目标的 push 请求（注意： Github 上只有给仓库所属的组织氪金升级才能解锁分支保护功能）。

   ```shell
   $ git clone ...
   $ git checkout --track origin/your-branch-name
   ```

3. 在 Github 上提交 Pull request，合理选择 Squash 或 Rebase：


4. 等待 Reviewer 的 Review。Review 完成后，Review 人员可以选择 Approve 或者 Request Changes。如果 Reviewer 选择 Request Changes，则开发者需要根据 Reviewer 的意见进行修改，修改完成后再次提交 Pull Request；如果 Reviewer 选择 Approve，则开发者可以选择 Merge Pull Request，将本次开发的内容合并到主分支上，并删除工作分支。
