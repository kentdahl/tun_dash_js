module.exports = {
 
    // production mode
    mode: "production",
 
    // input file
    entry: "./src/js/app.js",
 
    // output file
    output: {
 
        // file name
        filename: "./public/js/tun_dash_app.js",
 
        // complete path
        path: __dirname
    }
}
