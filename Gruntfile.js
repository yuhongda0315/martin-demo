module.exports = function(grunt){

    require('load-grunt-tasks')(grunt); //加载所有的任务
    //require('time-grunt')(grunt); 如果要使用 time-grunt 插件

    grunt.initConfig({
      connect: {
        options: {
                hostname: '10.10.112.167', //默认就是这个值，可配置为本机某个 IP，localhost 或域名 wifi 10.10.112.95  wlan:10.10.130.50
                livereload: 35050  //声明给 watch 监听的端口
            },
         server: {
           options: {
            // protocol: 'https',
             open: true,
             port: 8066,
             base: {
              path: './',
              options: {
                index: 'index.html',
                maxAge: 300000
              }
            }
           }
         }
        },
        watch: {
            livereload: {
                options: {
                    livereload: '<%=connect.options.livereload%>'  //监听前面声明的端口  35729
                },

                files: [  //下面文件的改变就会实时刷新网页
                    'index.html',
                    'css/**/*.css',
                    'js/**/*.js'
                ]
            }
        },
        clean: {
          doc: ["im/doc"]
        },
        jsdoc : {
          dist : {
              src: ['im/datamodel.js'],
              options: {
                  destination: 'im/doc',
                  template : "node_modules/ink-docstrap/template",
                  configure : "node_modules/ink-docstrap/template/jsdoc.conf.json"
              }
          }
      }
    });

    grunt.registerTask('doc', [
        'clean:doc',
        'jsdoc'
    ]);
    
    grunt.registerTask('serve', [
        'connect:server',
        'watch'
    ]);
}
