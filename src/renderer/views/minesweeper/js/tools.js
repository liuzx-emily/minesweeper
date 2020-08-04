const tools = {
  /*  
  在 0-n 的范围内（不包括n），随机抽取几个不重复的数字。
  参数：count 抽取数量， range 范围， cannotHave 不能包含的数字
   */
  getRandomNumbersInRange(count, range, cannotHave) {
    var arr = [];
    var json = {};
    while (arr.length < count) {
      var k = Math.floor(Math.random() * range);
      if (k === cannotHave) {
        continue;
      }

      if (!json[k]) {
        json[k] = true;
        arr.push(k);
      }
    }
    return arr;
  },

}
export default tools