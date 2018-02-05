Must set heroku environment variables as belows, to set the mongodb hosted db url and jwt salt token

heroku config:set JWT_SECRET="fakljdfahfuiew497r9@@!"
heroku config:set MONGODB_URI="mongodb://rihan_xyz:Abcd1234@ds123258.mlab.com:23258/todo_db"

to check if set properly, run "heroku config"