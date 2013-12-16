module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		compass: {
			dist: {
				options: {
					sassDir: 'src/stylesheets/',
					cssDir: 'stylesheets',
					outputStyle: 'expanded'
				}
			}
		},
		watch: {
			files: ['Gruntfile.js', 'src/stylesheets/**/*.scss'],
			tasks: ['compass']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Default task(s).
	grunt.registerTask('default', ['compass']);
};