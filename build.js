const { build } = require('electron-builder');

build({
  config: {
    appId: 'chatyanker',
    files: ['dist/**/*'],
    directories :{
      output: "out"
    },
    // win: {
    //   icon: "assets/icon.ico",
    // },
  },
});