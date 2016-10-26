module.exports = function (grunt) {

    grunt.initConfig({
        browserify: {
            dev: {
                options: {
                    transform: [['babelify', { presets: ['react', 'es2015'] }]]
                },
                src: ['public/js/source/app.jsx'],
                dest: 'public/js/app.js'
            }
        },
        less: {
            dev: {
                options: {
                    paths: ["public/css"]
                },
                files: { "public/css/app.css": "public/css/app.less" }
            }
        },
        express: {
            dev: {
                options: {
                    script: 'bin/www.js',
                }
            }
        },
        watch: {
            css: {
                files: ['public/css/app.less'],
                tasks: ['less']
            },
            scripts: {
                files: ['public/js/source/**/*.jsx'],
                tasks: ['browserify']
            },
            express: {
                files: ['routes/*.js', 'controllers/*.js','models/**', 'config/**', 'helpers/**', '*.js'],
                tasks: ['express:dev'],
                options: {
                    spawn: false
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-browserify");
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['browserify', 'less', 'express', 'watch']);

};