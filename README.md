# doudizhu-stand-alone

[cocos官方主页](https://www.cocos.com/)
=========================


游戏主要的实现思路
=========================
- 通过数据监听实现视图自动改变，通过订阅-发布模式执行下一步逻辑。
- 利用localStorage实现本地数据缓存
- 通过自定义字段userId，区别玩家与机器
- 进入游戏房间后，玩家点击准备按钮，执行发牌和抢地主逻辑，每局抢地主顺序（随机），机器是否抢地主（随机）
- AI出牌分自己出牌和跟牌，其中出牌时，主要根据是否是地主、地主余牌数量，跟牌时，主要根据上一手的牌型，上一手的玩家是否是地主，地主余牌数量

关于胜率
=========================
个人觉得斗地主游戏本身就有一定的运气成分，目前抢地主逻辑是随机的，我本人斗地主水平也一般，自测AI胜率在15%左右。


游戏顺序
=========================
登录 -> 游戏大厅 -> 房间列表 -> 游戏房间 -> 游戏大厅

预览
=========================
[web-mobile](https://vyulinlin.github.io/doudizhu-stand-alone/dist/web-mobile/)
[web-desktop](https://vyulinlin.github.io/doudizhu-stand-alone/dist/web-desktop/)

![](https://raw.githubusercontent.com/vyulinlin/doudizhu-stand-alone/master/image/hall.png)
![](https://raw.githubusercontent.com/vyulinlin/doudizhu-stand-alone/master/image/notReady.png)
![](https://raw.githubusercontent.com/vyulinlin/doudizhu-stand-alone/master/image/landlord.png)
![](https://raw.githubusercontent.com/vyulinlin/doudizhu-stand-alone/master/image/lose.png)
![](https://raw.githubusercontent.com/vyulinlin/doudizhu-stand-alone/master/image/win.png)

关于
=========================
此项目使用Cocos Creator v2.4.2 开发
 
计划完成单机版斗地主经典模式和癞子模式，目前只完成经典模式。

页面展示使用了作者tingshu开源的[ddz_game](https://github.com/tinyshu/ddz_game)项目的客户端部分。

算法部分借鉴了liyl1991开源的[landlord](https://github.com/liyl1991/landlord)项目中的AILogic.js和GameRule.js。

目前（2020-03-02）上面的两个项目还是有很多坑，不过填坑的过程也是学习的过程，感谢两位大佬的开源精神，让我可以快速开发这个单机小游戏。

网上看到的一个[AI算法设计思想](https://www.iteye.com/blog/programming-1491470)

<!-- 打赏作者杯咖啡 -->
.
=========================
芸芸众生，相遇相识是一种缘份。如果觉得此项目对你有帮助，可以给个star，或者给个star，哈

<!-- <img src="" width="220" height="220" alt="赞赏码" style="float: left;"/> -->
