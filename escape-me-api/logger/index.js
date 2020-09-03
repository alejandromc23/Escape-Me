module.exports = {
    Logger: require('./logger'),
    
    FileLogger: require('./file-logger'),
    singletonFileLogger: require('./singleton-file-logger'),
    
    ConsoleLogger: require('./file-logger'),
    singletonConsoleLogger: require('./singleton-console-logger')
}