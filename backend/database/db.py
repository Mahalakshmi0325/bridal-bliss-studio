import mysql.connector
from mysql.connector import Error
from config import Config
import os

def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host=Config.MYSQL_HOST,
            port=Config.MYSQL_PORT,
            user=Config.MYSQL_USER,
            password=Config.MYSQL_PASSWORD,
            database=Config.MYSQL_DB,
            autocommit=False
        )
        return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

def init_db():
    try:
        connection = mysql.connector.connect(
            host=Config.MYSQL_HOST,
            port=Config.MYSQL_PORT,
            user=Config.MYSQL_USER,
            password=Config.MYSQL_PASSWORD
        )
        cursor = connection.cursor()
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {Config.MYSQL_DB}")
        cursor.close()
        connection.close()
        
        connection = get_db_connection()
        if connection:
            schema_path = os.path.join(os.path.dirname(__file__), '../schema.sql')
            if os.path.exists(schema_path):
                with open(schema_path, 'r') as schema_file:
                    sql_script = schema_file.read()
                    statements = sql_script.split(';')
                    cursor = connection.cursor()
                    for statement in statements:
                        if statement.strip():
                            try:
                                cursor.execute(statement)
                            except Error as e:
                                print(f"Error executing statement: {e}")
                    connection.commit()
                    cursor.close()
            connection.close()
            print("Database initialized successfully")
    except Error as e:
        print(f"Error initializing database: {e}")

def execute_query(query, params=None, fetch=False, fetch_one=False):
    connection = get_db_connection()
    if not connection:
        return None
    
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute(query, params or ())
        
        if fetch:
            result = cursor.fetchone() if fetch_one else cursor.fetchall()
            cursor.close()
            connection.close()
            return result
        else:
            connection.commit()
            last_id = cursor.lastrowid
            cursor.close()
            connection.close()
            return last_id
    except Error as e:
        print(f"Database error: {e}")
        connection.rollback()
        connection.close()
        return None
