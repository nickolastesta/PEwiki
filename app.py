from flask import Flask, render_template
import os
app = Flask(__name__)

@app.route('/')

def home():
    return render_template('index.html')

@app.route('/bistahieversor')
def bistahieversor():
    return render_template('bistahieversor.html')

@app.route('/dacentrurus')
def dacentrurus():
    return render_template('dacentrurus.html')

@app.route('/stegosaurus')
def stegosaurus():
    return render_template('stegosaurus.html')




if __name__ == '__main__':
    # Отримуємо порт, який виділяє Render, або 5000 за замовчуванням
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)