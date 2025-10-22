from flask import Flask , render_template , jsonify , request
from dotenv import load_dotenv
import os
import requests
from helpers.clean_data import clean_data

load_dotenv()

app = Flask(__name__)

app.config['WEB_PORT'] = os.getenv('WEB_PORT')
app.config['MICROBURBS_URL'] = os.getenv('MICROBURBS_URL')

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/home')
def home():
    return render_template('index.html')

@app.route('/getHomeData/')
def getHomeData():
    try:
        microBurb_url = app.config['MICROBURBS_URL']
        subBurb_name = request.args.get('suburb')
        print(f"microburb is {microBurb_url} and pararms got is : {subBurb_name}")
        params = {
            "suburb": subBurb_name
        }
        headers = {
            "Authorization": "Bearer test",
            "Content-Type": "application/json"
        }

        response =  requests.get(microBurb_url,params=params,headers = headers)
        response.raise_for_status()

        data = response.json()
        c_data = clean_data(data)

        return jsonify(c_data)
    except:
        # handle better later
        return {}

if __name__ == '__main__':
    app.run( host='0.0.0.0' , port = app.config['WEB_PORT'], debug=True)