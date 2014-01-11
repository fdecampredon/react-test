module.exports = function(grunt) {
	
	
  	grunt.loadNpmTasks('grunt-browserify')
	
  	grunt.initConfig({
	  	pkg: grunt.file.readJSON('package.json'),
    	
		browserify: {
			'public/index.js': ['client/index.js'],
			options: {
				 debug : true
			}
    	}
  	});
	
    grunt.registerTask('default', ['browserify']);
}