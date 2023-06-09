from app import app
from flaskext.mysql import MySQL

mysql = MySQL()
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['CORS_RESOURCES'] = {r"/*": {"origins": "*"}}

app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = ''
app.config['MYSQL_DATABASE_DB'] = 'flask_rest_api'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'


mysql.init_app(app)
