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


@app.route("/tables", methods=["GET"])
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
            "SELECT table_id, name, status, active_receipt_id FROM tables WHERE table_id =%s", table_id)
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


@app.route('/update/tables/<table_id>', methods=['PUT'])
def update_table(table_id):
    try:
        _json = request.json
        _table_id = _json.get('table_id')
        _name = _json.get('name')
        _status = _json.get('status')
        _active_receipt_id = _json.get('active_receipt_id')
        if request.method == 'PUT' and any((_table_id, _name, _status, _active_receipt_id)):
            sqlQuery = "UPDATE tables SET table_id = IFNULL(%s, table_id), name = IFNULL(%s, name), status = IFNULL(%s, status), active_receipt_id = IFNULL(%s, active_receipt_id) WHERE table_id=%s"
            bindData = (_table_id, _name, _status,
                        _active_receipt_id, table_id)
            conn = mysql.connect()
            cursor = conn.cursor()
            cursor.execute(sqlQuery, bindData)
            conn.commit()
            response = jsonify(f'Table {table_id} updated successfully!')
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


@app.route('/delete/tables/<table_id>', methods=['DELETE'])
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
        _receipt_id = request.json.get('receipt_id')
        _food_orders = request.json.get('food_orders')
        _total_price = request.json.get('total_price')
        _start_time = request.json.get('start_time')
        _end_time = request.json.get('end_time')
        _table_id = request.json.get('table_id')
        if _receipt_id and _food_orders and _total_price and _start_time and _end_time and request.method == 'POST':
            conn = mysql.connect()
            cursor = conn.cursor(pymysql.cursors.DictCursor)
            sqlQuery = '''INSERT INTO receipts(receipt_id, food_orders, total_price, start_time, end_time, table_id) VALUES (%s, %s, %s, %s, %s, %s)'''
            bindData = (_receipt_id, _food_orders,
                        _total_price, _start_time, _end_time, _table_id)
            cursor.execute(sqlQuery, bindData)
            conn.commit()
            cursor.close()
            conn.close()
            response = jsonify(f'Receipt {_receipt_id} added successfully')
            response.status_code = 200
            return response
        else:
            return showMessage()
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)})


@app.route("/receipts")
def receipts():
    try:
        conn = mysql.connect()
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        sqlQuery = '''SELECT receipt_id, food_orders, total_price, start_time, end_time FROM receipts'''
        cursor.execute(sqlQuery)
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


@app.route('/receipts/<receipt_id>')
def receipt_details(receipt_id):
    try:
        conn = mysql.connect()
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        cursor.execute(
            "SELECT receipt_id, food_orders, total_price, start_time, end_time, table_id FROM receipts WHERE receipt_id = %s", receipt_id)
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


@app.route('/update/receipts/<receipt_id>', methods=['PUT'])
def update_receipt(receipt_id):
    cursor = None
    conn = None
    try:
        _json = request.json
        _receipt_id = _json.get('receipt_id')
        _food_orders = _json.get('food_orders')
        _total_price = _json.get('total_price')
        _start_time = _json.get('start_time')
        _end_time = _json.get('end_time')

        if not any((_receipt_id, _food_orders, _total_price, _start_time, _end_time)):
            return showMessage()

        set_clause = []
        bindData = []

        if _receipt_id:
            set_clause.append('receipt_id=%s')
            bindData.append(_receipt_id)
        if _food_orders:
            set_clause.append('food_orders=%s')
            bindData.append(_food_orders)
        if _total_price:
            set_clause.append('total_price=%s')
            bindData.append(_total_price)
        if _start_time:
            set_clause.append('start_time=%s')
            bindData.append(_start_time)
        if _end_time:
            set_clause.append('end_time=%s')
            bindData.append(_end_time)

        set_clause = ', '.join(set_clause)

        if request.method == 'PUT':
            sqlQuery = f"UPDATE receipts SET {set_clause} WHERE receipt_id=%s"
            bindData.append(receipt_id)

            conn = mysql.connect()
            cursor = conn.cursor()
            cursor.execute(sqlQuery, tuple(bindData))
            conn.commit()

            if cursor.rowcount == 0:
                return jsonify(f"No receipt with id {receipt_id} found")

            response = jsonify(f"Receipt {receipt_id} updated successfully!")
            response.status_code = 200
            return response
        else:
            return showMessage()
    except Exception as e:
        print(e)
        return jsonify(e)
    finally:
        if cursor is not None:
            cursor.close()
        if conn is not None:
            conn.close()


@app.route('/delete/receipt/<receipt_id>', methods=['DELETE'])
def delete_receipt(receipt_id):
    try:
        conn = mysql.connect()
        cursor = conn.cursor()
        cursor.execute('''DELETE FROM receipt WHERE receipt_id =%s''',
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


# Foods


@app.route('/create/food', methods=['POST'])
def create_food():
    conn = mysql.connect()
    cursor = conn.cursor()
    try:
        _json = request.json
        _food_id = _json['food_id']
        _name = _json['name']
        _price = _json['price']
        if _food_id and _name and _price and request.method == 'POST':
            conn = mysql.connect()
            cursor = conn.cursor(pymysql.cursors.DictCursor)
            sqlQuery = '''INSERT INTO foods(food_id, name, price) VALUES (%s, %s, %s)'''
            bindData = (_food_id, _name, _price)
            cursor.execute(sqlQuery, bindData)
            conn.commit()
            response = jsonify('Food added successfully')
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


@app.route("/foods", methods=["GET"])
def foods():
    try:
        conn = mysql.connect()
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        cursor.execute(
            '''SELECT food_id, name, price FROM foods''')
        foodsRows = cursor.fetchall()
        response = jsonify(foodsRows)
        response.status_code = 200
        return response
    except Exception as e:
        print(e)
        return jsonify(e)
    finally:
        cursor.close()
        conn.close()


@app.route('/foods/<food_id>', methods=['GET'])
def food_details(food_id):
    try:
        conn = mysql.connect()
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        cursor.execute(
            '''SELECT food_id, name, price FROM foods WHERE food_id = %s''', food_id)
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


@app.route('/update/foods/<food_id>', methods=['PUT'])
def update_food(food_id):
    try:
        _json = request.json
        _food_id = _json['food_id']
        _name = _json['name']
        _price = _json['price']
        if _food_id and _name and _price and request.method == 'PUT':
            sqlQuery = '''UPDATE foods SET food_id=%s, name=%s, price=%s WHERE food_id=%s'''
            bindData = (_food_id, _name, _price, food_id)
            conn = mysql.connect()
            cursor = conn.cursor()
            cursor.execute(sqlQuery, bindData)
            conn.commit()
            response = jsonify(f'Food {food_id} updated successfully!')
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


@app.route('/delete/foods/<food_id>', methods=['DELETE'])
def delete_food(food_id):
    try:
        conn = mysql.connect()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM foods WHERE food_id =%s",
                       (food_id))
        conn.commit()
        response = jsonify(f'Food {food_id} deleted successfully!')
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
