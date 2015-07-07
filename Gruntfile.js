var fs = require('fs');

module.exports = function(grunt) {

    var JsFiles = JSON.parse(fs.readFileSync('./src/concat.js.json'));
    var CssFiles = JSON.parse(fs.readFileSync('./src/concat.css.json'));

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		distFolder: './dist',
		uglify: {
			build: {
				src : './dist/<%= pkg.name %>.js',
				dest: './dist/<%= pkg.name %>.min.js'
			}
		},
		concat: {
			options: {
				separator: ''
			},
			dist: {
				src: JsFiles,
				dest: './dist/<%= pkg.name %>.js'
			}
		},
        cssmin: {
            target: {
                files: [{
                    src: CssFiles,
                    dest: './dist/assets/css/<%= pkg.name %>.min.css'
                }]
            }
        },
		less: {
			dist: {
				options: {
					cleancss: true,
					paths: [
                        './src/less/*.less'
                    ]
				},
				files: {
					'./dist/assets/css/<%= pkg.name %>.css': './src/less/main.less'
				}
			}
		},
		jsvalidate: {
			options:{
				globals: {},
				esprimaOptions: {},
				verbose: false
			},
			targetName:{
				files:{
					files: [
                        './src/lib/common/**.js'
                    ]
				}
			}
		},
        replace: {
            dev: {
                options: {
                    patterns: [
                        {
                            match: 'jsfile',
                            replacement: '<%= pkg.name %>.js'
                        },
                        {
                            match: 'cssfile',
                            replacement: '<%= pkg.name %>.min.css'
                        },
                        {
                            match: 'pkgtitle',
                            replacement: '<%= pkg.title %>'
                        }
                    ]
                },
                files: [
                    {src: './src/index.html', dest: './dist/index.html'}
                ]
            },
            dist: {
                options: {
                    patterns: [
                        {
                            match: 'jsfile',
                            replacement: '<%= pkg.name %>.min.js'
                        },
                        {
                            match: 'cssfile',
                            replacement: '<%= pkg.name %>.min.css'
                        },
                        {
                            match: 'pkgtitle',
                            replacement: '<%= pkg.title %>'
                        }
                    ]
                },
                files: [
                    {src: './src/index.html', dest: './dist/index.html'}
                ]
            },
            nsis32: {
                options: {
                    patterns: [
                        {
                            match: 'pkgname',
                            replacement: '<%= pkg.name %>'
                        },
                        {
                            match: 'pkgtitle',
                            replacement: '<%= pkg.title %>'
                        },
                        {
                            match: 'pkgorg',
                            replacement: '<%= pkg.organization %>'
                        },
                        {
                            match: 'pkgversion',
                            replacement: '<%= pkg.version %>'
                        },
                        {
                            match: 'platform',
                            replacement: 'win32'
                        }
                    ]
                },
                files: [
                    {src: './res/nsis/setup.nsi', dest: './releases/setup32.nsi'}
                ]
            },
            nsis64: {
                options: {
                    patterns: [
                        {
                            match: 'pkgname',
                            replacement: '<%= pkg.name %>'
                        },
                        {
                            match: 'pkgtitle',
                            replacement: '<%= pkg.title %>'
                        },
                        {
                            match: 'pkgorg',
                            replacement: '<%= pkg.organization %>'
                        },
                        {
                            match: 'pkgversion',
                            replacement: '<%= pkg.version %>'
                        },
                        {
                            match: 'platform',
                            replacement: 'win64'
                        }
                    ]
                },
                files: [
                    {src: './res/nsis/setup.nsi', dest: './releases/setup64.nsi'}
                ]
            }
        },
		compress: {
			dev: {
				options: {
					mode: 'zip',
					archive: './releases/<%= pkg.name %>-<%= pkg.version %>.nw'
				},
				files: [
					// {src: ['./dist'], filter: 'isFile'},
					{
                        expand: true,
                        cwd: './dist',
                        src: [
                            'index.html',
                            'package.json',
                            '<%= pkg.name %>.js',
                            'assets/**'
                        ]
                    }
				]
			},
            dist: {
                options: {
                    mode: 'zip',
                    archive: './releases/<%= pkg.name %>-<%= pkg.version %>.nw'
                },
                files: [
                    // {src: ['./dist'], filter: 'isFile'},
                    {
                        expand: true,
                        cwd: './dist',
                        src: [
                            'index.html',
                            'package.json',
                            '<%= pkg.name %>.min.js',
                            'assets/**'
                        ]
                    }
                ]
            }
		},
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: './bower_components/bootstrap/dist/',
                        src: 'fonts/**',
                        dest: './dist/assets/'
                    },
                    {
                        expand: true,
                        cwd: './src/assets/',
                        src: '**',
                        dest: './dist/assets/'
                    },
                    {src: './src/app.ico', dest: './dist/assets/app.ico'}
                ]
            },
            win32: {
                files: [
                    {
                        expand: true,
                        cwd: './res/nwjs/',
                        src: 'win32/**',
                        dest: './releases/'
                    }
                ]
            },
            win64: {
                files: [
                    {
                        expand: true,
                        cwd: './res/nwjs/',
                        src: 'win64/**',
                        dest: './releases/'
                    }
                ]
            }
        },
        exec: {
            nwjs: {
                cwd: './res/nwjs/win64/',
                cmd: 'nw.exe ../../../releases/<%= pkg.name %>-<%= pkg.version %>.nw'
            },
            ico_win32: {
                cwd: './res/resourcer/',
                cmd: 'Resourcer.exe -op:upd -src:../../releases/win32/nw.exe -type:14 -name:IDR_MAINFRAME -file:../../src/app.ico'
            },
            ico_win64: {
                cwd: './res/resourcer/',
                cmd: 'Resourcer.exe -op:upd -src:../../releases/win64/nw.exe -type:14 -name:IDR_MAINFRAME -file:../../src/app.ico'
            },
            pack_win32: {
                cwd: './releases/win32',
                cmd: 'copy /b /y nw.exe + ..\\<%= pkg.name %>-<%= pkg.version %>.nw <%= pkg.name %>.exe'
            },
            pack_win64: {
                cwd: './releases/win64',
                cmd: 'copy /b /y nw.exe + ..\\<%= pkg.name %>-<%= pkg.version %>.nw <%= pkg.name %>.exe'
            }
        },
        clean: {
            win32: [
                './releases/win32/'
            ],
            win64: [
                './releases/win32/'
            ],
            nw32: [
                './releases/win32/nw.exe'
            ],
            nw64: [
                './releases/win64/nw.exe'
            ]
        }
	});

    grunt.registerTask('nwpackage', 'Create nw.js package', function(arg1) {
        if (arg1 == null) {
            console.log('Missing arguement');
            return;
        }

        var package = JSON.parse(fs.readFileSync('package.json'));
        var properties = package.nwjs[arg1]

        delete package.devDependencies;
        delete package.nwjs;

        for (var i in properties) {
            if (properties.hasOwnProperty(i))
                package[i] = properties[i];
        }

        fs.writeFileSync(
            './dist/package.json',
            JSON.stringify(package, null, '  ')
        );
    });

    grunt.registerTask('release', 'Create nw.js executables', function(arg1) {
        if (arg1 == null) {
            console.log('Missing arguement');
            return;
        }

        runt.task.run('default');
        runt.task.run('nwpackage:dist');
        runt.task.run('e:');
        // fs.copyDir()
    });

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-replace');
	grunt.loadNpmTasks('grunt-jsvalidate');
    grunt.loadNpmTasks('grunt-exec');

	grunt.registerTask('default'       , ['jsvalidate', 'concat', 'less', 'cssmin', 'uglify']);
    grunt.registerTask('prepare'       , ['copy:dist']);
    grunt.registerTask('run'           , ['default', 'replace:dev', 'nwpackage:dev', 'compress:dev', 'exec:nwjs']);
    grunt.registerTask('release-prep'  , ['default', 'replace:dist', 'nwpackage:release', 'compress:dist']);
    grunt.registerTask('release-win32' , ['release-prep', 'clean:win32', 'copy:win32', 'exec:ico_win32', 'exec:pack_win32', 'clean:nw32', 'replace:nsis32']);
    grunt.registerTask('release-win64' , ['release-prep', 'clean:win64', 'copy:win64', 'exec:ico_win64', 'exec:pack_win64', 'clean:nw64', 'replace:nsis64']);
};
