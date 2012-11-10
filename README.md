##天气预报
1. 展示多个城市当天的天气情况
2. 展示 最高温度-城市数量 直方图
3. 通过比较最高气温、最低气温、风力、风速、能见度、湿度、气压这几项数据，得到其他城市与杭州的天气相似度，相似度公式：`(100 - (最高气温差*0.15+最低气温差*0.15+风力差*0.14+风速差*0.14+能见度差*0.14+湿度差*0.14+气压差*0.14))*100%`

API来源：http://code.google.com/p/weather-china/wiki/API

引用：JQuery,  [Twitter Bootstrap](http://twitter.github.com/bootstrap/), [Flot](https://github.com/flot/flot)
