var express = require('express'),
    app = express(),
    port = process.env.PORT || 6969,
    bodyParser = require('body-parser');

var AuthRoutes = require('./api/routes/authRoutes');
var UserRoutes = require('./api/routes/userRoutes');
var SortingRoutes = require('./api/routes/sortingRoutes');
var SignUpRoutes = require('./api/routes/signupRoutes');
var CourseRoutes = require('./api/routes/courseRoutes');
var TopicRoutes = require('./api/routes/topicRoutes');
var LessonRoutes = require('./api/routes/lessonRoutes');
var ContentRoutes = require('./api/routes/contentRoutes');
var LearnedCourseRoutes = require('./api/routes/learnedCourseRoutes');
var AlgoRoutes = require('./api/routes/algoRoutes');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// var routes = require('./api/routes/sortingRoutes'); //importing route
// routes(app); //register the route

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware

    next();
});

app.use('/sort', SortingRoutes);
app.use('/login', AuthRoutes);
app.use('/signup', SignUpRoutes);
app.use('/course', CourseRoutes);
app.use('/topic', TopicRoutes);
app.use('/lesson', LessonRoutes);
app.use('/content', ContentRoutes);
app.use('/create', UserRoutes);
app.use('/learned', LearnedCourseRoutes);
app.use('/algo', AlgoRoutes);

app.listen(port);


console.log('Visualgoture API server started on: ' + port);