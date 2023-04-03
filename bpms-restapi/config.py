from app import app
from flaskext.mysql import MySQL

mysql = MySQL()

app.config['MYSQL_DATABASE_USER'] = 'sql12610273'
app.config['MYSQL_DATABASE_PASSWORD'] = 'A8UYGQgGGJ'
app.config['MYSQL_DATABASE_DB'] = 'sql12610273'
app.config['MYSQL_DATABASE_HOST'] = 'sql12.freesqldatabase.com'

mysql.init_app(app)
