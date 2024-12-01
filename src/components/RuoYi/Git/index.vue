<template>
  <div>
    <svg-icon icon-class="github" @click="goto" />
  </div>
</template>

<script>
export default {
  name: 'OpenIOV',
  data() {
    return {
      url: 'https://github.com/hwyzleo'
    }
  },
  methods: {
    goto() {
      window.open(this.url)
    }
  }
}
</script>
