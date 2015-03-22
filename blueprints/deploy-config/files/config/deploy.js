module.exports = {
  development: [
    { // redis is the name of a plugin
      name: 'redis-deploy',
      plugin: 'redis',
      host: 'localhost',
      port: 6379,
      files: 'dist/index.html' // a glob or array of globs (default is dist/index.html) 
    },
    { // s3 is the name of a plugin
      name: 's3_deploy',
      plugin: 's3',
      gzip: false, // if undefined or set to true, files are gziped
      gzipExtensions: ['js', 'css', 'svg'], // if undefined, js, css & svg files are gziped
      accessKeyId: '<your-access-key-goes-here>',
      secretAccessKey: process.env['AWS_ACCESS_KEY'],
      bucket: '<your-bucket-name>',
      keyPrefix: 'folderPath',
      files: 'dist/**/*', // a glob or array of globs (default is dist/**/*)
      exclude: 'dist/index.html' // a glob or array of globs (default is dist/index.html) 
    },
    {
      plugin: 'cloudfront',
      // example params
      origins: {
        ui: {
          url: 'http://'+plugins.s3_deploy.bucket+'.s3.amazonaws.com'
        },
        data: {
          // EC2 server parameters here for example
        }
      }
    }
    {
      plugin: 'route53',
      dns: [
        {
          type: 'cname',
          alias: true,
          domain: 'mydomain.com',
          subdomain: plugins.s3.bucket,
          host: plugins.cloudfront.output.uri 
        }
      ]
    }
  ],

  staging: {
    buildEnv: 'staging', // Override the environment passed to the ember asset build. Defaults to 'production'
    store: {
      host: 'staging-redis.example.com',
      port: 6379
    },
    assets: {
      accessKeyId: '<your-access-key-goes-here>',
      secretAccessKey: process.env['AWS_ACCESS_KEY'],
      bucket: '<your-bucket-name>'
    }
  },

  production: {
    store: {
      host: 'production-redis.example.com',
      port: 6379,
      password: '<your-redis-secret>'
    },
    assets: {
      accessKeyId: '<your-access-key-goes-here>',
      secretAccessKey: process.env['AWS_ACCESS_KEY'],
      bucket: '<your-bucket-name>'
    }
  }
}
