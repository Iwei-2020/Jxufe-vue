<template>
  <div id="weather-v2-plugin-standard"></div>
</template>

<script>
export default {
  name: "MyWeather",
  mounted() {
    window.WIDGET = {
      CONFIG: {
        "layout": 1,
        "width": "450",
        "height": "150",
        "background": 1,
        "dataColor": "F5A623",
        "language": "zh",
        "borderRadius": 5,
        "city": "CN101240110",
        "key": "btyDTgPjkU"
      }
    };
    (function (d) {
      let c = d.createElement('link')
      c.rel = 'stylesheet'
      c.href = 'https://apip.weatherdt.com/standard/static/css/weather-standard.css?v=2.0'
      let s = d.createElement('script')
      s.src = 'https://apip.weatherdt.com/standard/static/js/weather-standard.js?v=2.0'
      let sn = d.getElementsByTagName('script')[0]
      sn.parentNode.insertBefore(c, sn)
      sn.parentNode.insertBefore(s, sn)
    })(document)
  }
}
</script>

<style scoped>

</style>
