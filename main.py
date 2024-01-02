
import os
from flask import Flask, render_template, request, redirect, url_for, send_file
app = Flask(__name__)

@app.route('/')
def list_files():
   return render_template('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0')
