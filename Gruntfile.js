module.exports = function(grunt) {
	
	
  	grunt.loadNpmTasks('grunt-browserify')
	
  	grunt.initConfig({
	  	pkg: grunt.file.readJSON('package.json'),
    	
		browserify: {
			files: {
				'public/app.js': ['client/index.js'],
			},
			options: {
				 debug : true
			}
    	}
  	});
	
    grunt.registerTask('default', ['browserify']);
}