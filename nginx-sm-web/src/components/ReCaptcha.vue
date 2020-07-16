<template>
  <div ref="root"></div>
</template>

<script>
  window.APP_RECAPTCHA = {
    waitQueue: [],
    wait: (callback) => {
      if(window.grecaptcha) callback();
      else window.APP_RECAPTCHA.waitQueue.push(callback);
    }
  };
  window.APP_RECAPTCHA_CALLBACK = () => {
    for(let callback of window.APP_RECAPTCHA.waitQueue) callback();
  };

  export default {
    name: 'ReCaptcha',
    props: ['value', 'sitekey'],
    data: () => ({
      instanceId: null
    }),
    mounted() {
      window.APP_RECAPTCHA.wait(() => {
        this.instanceId = window.grecaptcha.render(this.$refs.root, {
          callback: (response) => this.$emit('input', response),
          sitekey: this.sitekey,
          theme : 'light'
        });
      });
    },
    methods: {
      reset() {
        if(this.instanceId !== null && window.grecaptcha) window.grecaptcha.reset(this.instanceId);
        this.$emit('input', '');
      }
    },
    created() {
      let dependencyExists = false;
      let dependencySrc = 'https://www.google.com/recaptcha/api.js?onload=APP_RECAPTCHA_CALLBACK&render=explicit';
      let scripts = document.getElementsByTagName('script');
      for(let script of scripts) if(script.src === dependencySrc) dependencyExists = true;
      if(!dependencyExists) {
        let script = document.createElement('script');
        script.src = dependencySrc;
        script.async = true;
        script.defer = true;
        document.body.append(script);
      }
    }
  }
</script>

<style scoped>

</style>