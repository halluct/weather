$(document).ready(function() {
  var cities = ["anshan", "aomen", "baise", "beihai", "beijing", "benxi", "changde", "changsha", "chenzhou", "chengdu", "chongqing", "dali", "dalian", "dandong", "emeishan", "erlianhaote", "foshan", "fushun", "ganzhou", "guangzhou", "guilin", "haerbin", "haicheng", "haikou", "haining", "hefei", "huhehaote", "xianggang", "jinan", "jingdezhen", "jiujiang", "jiuquan", "kashi", "kaifeng", "kelamayi", "kunming", "lasa", "lanzhou", "lishui", "liuyang", "liuzhou", "luoyang", "mianyang", "mudanjiang", "nanchang", "nanjing", "nanning", "nanyang", "ningbo", "pingyao", "poyang", "qiqihaer", "sanya", "shanghai", "shaoxing", "shenyang", "shenzhen", "shijiazhuang", "suining", "taibei", "taiyuan", "tianjin", "tieling", "tulufan", "wulumuqi", "wenzhou", "wugang", "wuhan", "wutaishan", "wuzhou", "xiangtan", "yangcheng", "yangquan", "yichun", "yueyang", "yuncheng", "zhengzhou"];
  var hightTemp = [];

  var options = {
    lines: { show: true },
    points: { show: true },
    xaxis: { tickDecimals: 0, tickSize: 1 },
    yaxis: { tickDecimals: 0, tickSize: 1 }
  };
  var placeholder = $("#placeholder");
  $.plot(placeholder, [], options);

  var hangzhou = {};

  getWeatherData("hangzhou", function(res) {
    var forecasts = res.forecasts[0];
    var wind = res.wind;
    var atmosphere = res.atmosphere;
    hangzhou.high = forecasts.high;
    hangzhou.low = forecasts.low;
    hangzhou.chill = wind.chill;
    hangzhou.speed = wind.speed;
    hangzhou.visibility = atmosphere.visibility;
    hangzhou.humidity = atmosphere.humidity;
    hangzhou.pressure = atmosphere.pressure;
    console.log(hangzhou);

    $.each(cities, function(i, city) {
      getWeatherData(city);
    });
  });

  function getWeatherData(city, callback) {
    $.getJSON("http://weather.china.xappengine.com/api?city=" + city + "&callback=?", function(res) {
      drawTable(city, res);
      if(callback) {
        callback(res);
      }
    });
  }

  function drawTable(city, res) {
    var forecasts = res.forecasts[0];
    var wind = res.wind;
    var atmosphere = res.atmosphere;
    var similarity;

    if(city == "hangzhou") {
      similarity = '100%';
    } else {
      similarity = getSimilarity(forecasts, wind, atmosphere);
    }

    var html = '<tr><td>' + res.name + '</td><td>' + forecasts.date + '</td><td>'
      + '<img src="' + forecasts.image_small + '" /><span>' + forecasts.text + '</span></td><td>'
      + forecasts.low + '&#8451;</td><td>' + forecasts.high + '&#8451;</td><td>' 
      + wind.chill + '</td><td>' + wind.speed + '</td><td>' + atmosphere.visibility + '</td><td>'
      + atmosphere.humidity + '</td><td>' + atmosphere.pressure + '</td><td>'
      + similarity +'</td></tr>';

    $('.container').find('tbody').append(html);
    
    hightTemp.push(forecasts.high);
    drawChart(hightTemp);
  }
  function ifNull(value, callback) {
    if(value == null) {
      callback();
    }
  }

  function getSimilarity(forecasts, wind, atmosphere) {
    var similarity;
    var highSimi = Math.abs((forecasts.high - hangzhou.high))*0.15;
    var lowSimi = Math.abs((forecasts.low - hangzhou.low))*0.15;
    var chillSimi = Math.abs((wind.chill - hangzhou.chill))*0.14;
    var speedSimi = Math.abs((wind.speed - hangzhou.speed))*0.14;
    var visibilitySimi = Math.abs((atmosphere.visibility - hangzhou.visibility))*0.14;
    var humiditySimi = Math.abs((atmosphere.humidity - hangzhou.humidity))*0.14;
    var pressureSimi = Math.abs((atmosphere.pressure - hangzhou.pressure))*0.14;
    
    ifNull(forecasts.high, function() {
      highSimi = 0;
    });
    ifNull(forecasts.low, function() {
      lowSimi = 0;
    });
    ifNull(wind.chill, function() {
      chillSimi = 0;
    });
    ifNull(wind.speed, function() {
      speedSimi = 0;
    });
    ifNull(atmosphere.visibility, function() {
      visibilitySimi = 0;
    });
    ifNull(atmosphere.humidity, function() {
      humiditySimi = 0;
    });
    ifNull(atmosphere.pressure, function() {
      pressureSimi = 0;
    });
    similarity = (100 - (highSimi + lowSimi + chillSimi + speedSimi + visibilitySimi + humiditySimi + pressureSimi)).toFixed(2) + '%';
    return similarity;
  }

  function sortNumber(a,b){
    return a - b
  }

  function drawChart(hightTemp) {
    hightTemp.sort(sortNumber);
    console.log(hightTemp);

    var cityCountArray = [];
    for(var i = 0;i < hightTemp.length;){  
      var count = 0;  
      for(var j = i;j < hightTemp.length;j++){  
        if(hightTemp[i] == hightTemp[j]){  
          count ++;  
        }  
      }  
      cityCountArray.push( [hightTemp[i],count] );  
      i += count;  
    }

    for(var i = 0;i < cityCountArray.length;i++){  
      $.plot(placeholder, [cityCountArray], options);
    }
  }
});