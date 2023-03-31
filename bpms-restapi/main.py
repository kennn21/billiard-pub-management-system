import pymysql
from app import app
from config import mysql
from flask import jsonify
from flask import flash, request


@app.route('/create', methods=['POST'])
def create_table():
    conn = mysql.connect()
    cursor = conn.cursor()
    try:
        _json = request.json
        _table_id = _json['table_id']
        _name = _json['name']
        _status = _json['status']
        _active_receipt_id = _json['active_receipt_id']
        if _name and _table_id and _status and _active_receipt_id and request.method == 'POST':
            conn = mysql.connect()
            cursor = conn.cursor(pymysql.cursors.DictCursor)
            sqlQuery = '''INSERT INTO tables(table_id, name, status, active_receipt_id) VALUES (%s, %s, %s, %s)'''
            bindData = (_table_id, _name, _status, _active_receipt_id)
            cursor.execute(sqlQuery, bindData)
            conn.commit()
            response = jsonify('Table added successfully')
            response.status_code = 200
            return response
        else:
            return showMessage()
    except Exception as e:
        print(e)
        return jsonify('error')
    finally:
        cursor.close()
        conn.close()


@app.route("/tables")
def tables():
    try:
        conn = mysql.connect()
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        cursor.execute(
            "SELECT table_id, name, status, active_receipt_id FROM tables")
        tablesRows = cursor.fetchall()
        response = jsonify(tablesRows)
        response.status_code = 200
        return response
    except Exception as e:
        print(e)
        return jsonify(e)
    finally:
        cursor.close()
        conn.close()


@app.route('/tables/')
def emp_details(table_id):
    try:
        conn = mysql.connect()
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        cursor.execute(
            "SELECT table_id, name, status, active_receipt_id FROM tables WHERE id =%s", table_id)
        tableRow = cursor.fetchone()
        response = jsonify(tableRow)
        response.status_code = 200
        return response
    except Exception as e:
        print(e)
        return jsonify(e)
    finally:
        cursor.close()
        conn.close()


@app.route('/update', methods=['PUT'])
def update_table():
    try:
        _json = request.json
        _table_id = _json['table_id']
        _name = _json['name']
        _status = _json['status']
        _active_receipt_id = _json['active_receipt_id']
        if _table_id and _name and _status and _active_receipt_id and request.method == 'PUT':
            sqlQuery = "UPDATE tables SET table_id=%s, name=%s, status=%s, active_receipt_id=%s WHERE table_id=%s"
            bindData = (_table_id, _name, _status,
                        _active_receipt_id, _table_id)
            conn = mysql.connect()
            cursor = conn.cursor()
            cursor.execute(sqlQuery, bindData)
            conn.commit()
            response = jsonify('Tables updated successfully!')
            response.status_code = 200
            return response
        else:
            return showMessage()
    except Exception as e:
        print(e)
        return jsonify(e)
    finally:
        cursor.close()
        conn.close()


@app.route('/delete/<table_id>', methods=['DELETE'])
def delete_emp(table_id):
    try:
        conn = mysql.connect()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM tables WHERE table_id =%s",
                       (table_id,))
        conn.commit()
        response = jsonify(f'Table {table_id} deleted successfully!')
        response.status_code = 200
        return response
    except Exception as e:
        print(e)
        return jsonify(e)
    finally:
        cursor.close()
        conn.close()


@app.errorhandler(404)
def showMessage(error=None):
    message = {
        'status': 404,
        'message': 'Record not found: ' + request.url,
    }
    response = jsonify(message)
    response.status_code = 404
    return response


if __name__ == "__main__":
    app.run()
