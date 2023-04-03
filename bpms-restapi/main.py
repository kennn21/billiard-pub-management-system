import pymysql
from app import app
from config import mysql
from flask import jsonify
from flask import flash, request

# TABLES


@app.route('/create/table', methods=['POST'])
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


@app.route('/tables/<table_id>')
def table_details(table_id):
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


@app.route('/update/table/<table_id>', methods=['PUT'])
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


@app.route('/delete/table/<table_id>', methods=['DELETE'])
def delete_table(table_id):
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

# Receipts


@app.route('/create/receipt', methods=['POST'])
def create_receipt():
    conn = mysql.connect()
    cursor = conn.cursor()
    try:
        _json = request.json
        _receipt_id = _json['receipt_id']
        _food_orders = _json['food_orders']
        _total_price = _json['total_price']
        _start_time = _json['start_time']
        _end_time = _json['end_time']
        if _receipt_id and _food_orders and _total_price and _start_time and _end_time and request.method == 'POST':
            conn = mysql.connect()
            cursor = conn.cursor(pymysql.cursors.DictCursor)
            sqlQuery = '''INSERT INTO receipts(receipt_id, food_orders, total_price, start_time, end_time) VALUES (%s, %s, %s, %s, %s)'''
            bindData = (_receipt_id, _food_orders,
                        _total_price, _start_time, _end_time)
            cursor.execute(sqlQuery, bindData)
            conn.commit()
            response = jsonify('Receipt added successfully')
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


@app.route("/receipts")
def receipts():
    try:
        conn = mysql.connect()
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        cursor.execute(
            "SELECT receipt_id, food_orders, total_price, start_time, end_time FROM receipts")
        receiptsRows = cursor.fetchall()
        response = jsonify(receiptsRows)
        response.status_code = 200
        return response
    except Exception as e:
        print(e)
        return jsonify(e)
    finally:
        cursor.close()
        conn.close()


@app.route('/receipt/<receipt_id>')
def receipt_details(receipt_id):
    try:
        conn = mysql.connect()
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        cursor.execute(
            "SELECT receipt_id, food_orders, total_price, start_time, end_time FROM tables WHERE id = %s", receipt_id)
        receiptRow = cursor.fetchone()
        response = jsonify(receiptRow)
        response.status_code = 200
        return response
    except Exception as e:
        print(e)
        return jsonify(e)
    finally:
        cursor.close()
        conn.close()


@app.route('/update/receipt/<receipt_id>', methods=['PUT'])
def update_receipt():
    try:
        _json = request.json
        _receipt_id = _json['receipt_id']
        _food_orders = _json['food_orders']
        _total_price = _json['total_price']
        _start_time = _json['start_time']
        _end_time = _json['end_time']
        if _receipt_id and _food_orders and _total_price and _start_time and _end_time and request.method == 'PUT':
            sqlQuery = "UPDATE receipts SET receipt_id=%s, food_orders=%s, total_price=%s, start_time=%s, end_time=%s WHERE table_id=%s"
            bindData = (_receipt_id, _food_orders, _total_price,
                        _start_time, _end_time, _receipt_id)
            conn = mysql.connect()
            cursor = conn.cursor()
            cursor.execute(sqlQuery, bindData)
            conn.commit()
            response = jsonify(f'Receipt {_receipt_id} updated successfully!')
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


@app.route('/delete/receipt/<receipt_id>', methods=['DELETE'])
def delete_receipt(receipt_id):
    try:
        conn = mysql.connect()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM receipt WHERE table_id =%s",
                       (receipt_id,))
        conn.commit()
        response = jsonify(f'Receipt {receipt_id} deleted successfully!')
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
