/**
 * Gulp settings
 * Created by Alexey S. Kiselev on April 2017.
 */

const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefix = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const minifycss = require('gulp-minify-css');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const pump = require('pump');
const minifier = require('gulp-uglify');
const uglifyjs = require('uglify-js-harmony');
const babelify = require('babelify');
const buffer = require('vinyl-buffer');
const minify = require('gulp-minify');
const merge = require('merge-stream');

// General options
let options = {
    files: {
        css: 'styles.css',
        cssmin: 'styles.min.css'
    },
    path: {
        build: './public/'
    },
    vendors: [
        'react',
        'react-dom'
    ],
    jsentries: [
        [
            './frontend/components/CustomersMain.jsx'
        ],
        [
            './frontend/components/LoginMain.jsx'
        ],
        [
            './frontend/components/CustomerMain.jsx'
        ]
    ],
    jsoutputs: [
        'customers.js',
        'login.js',
        'customer.js'
    ]
};

// CSS Files
gulp.task('css',()=>{
    gulp.src('./frontend/css/*.css')
        .pipe(concat(options.files.css))
        .pipe(autoprefix('last 2 versions'))
        .pipe(gulp.dest(options.path.build))
        .pipe(rename(options.files.cssmin))
        .pipe(minifycss({compatibility: 'ie8', keepBreaks: false, processImport: false}))
        .pipe(gulp.dest(options.path.build));
});

// Vendors Files
gulp.task('scripts:vendors',()=>{
    const b = browserify({
        debug: true
    });
    options.vendors.forEach(lib => {
        b.require(lib);
    });
    console.log('vendors.js now contains', options.vendors.toString());
    b.bundle()
        .pipe(source('vendors.js'))
        .pipe(gulp.dest(options.path.build));
});

// Minified Vendors Files
gulp.task('scripts:vendors:min', ['scripts:vendors'], (cb) => {
    pump([
        gulp.src(options.path.build + 'vendors.js'),
        minifier({
            compress: {
                unused: true,
                dead_code: true,
                warnings: false,
                drop_debugger: true,
                conditionals: true,
                evaluate: true,
                drop_console: true,
                sequences: true,
                booleans: true
            },
            output: {
                comments: false
            }
        }, uglifyjs),
        concat('vendors.min.js'),
        gulp.dest(options.path.build)
    ], cb);
});

// Multiple JS and React JSX output files
gulp.task('scripts', () => {
    let tasks = options.jsentries.map((entry, key) => {
        console.log('...Starting bundle', options.jsoutputs[key]);
        return browserify({
            entries: entry,
            extensions: ['.jsx','.js'],
            debug: false,
            cache: {},
            packageCache: {}
        })
            .external(options.vendors)
            .transform('babelify', {
                presets: ['es2015', 'react']
            })
            .bundle()
            .on('error', function (err) {
                console.log(err.toString());
                this.emit('end');
            })
            .pipe(source(options.jsoutputs[key]))
            .pipe(buffer())
            .pipe(gulp.dest(options.path.build))
            .pipe(minify({
                ext: {
                    min: '.min.js'
                }
            }))
            .pipe(gulp.dest(options.path.build));
    });
    return merge.apply(this, tasks);
});

// Default Task
gulp.task('default', ['css', 'scripts']);
