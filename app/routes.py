from flask import Blueprint, render_template, request, jsonify
from pytrends.request import TrendReq
import requests

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return render_template('trendspotting.html')

@main.route('/api/trends', methods=['GET'])
def get_trends():
    pytrends = TrendReq(hl='en-US', tz=360)
    keywords = request.args.get('keywords').split(',')
    pytrends.build_payload(kw_list=keywords, timeframe=f"{request.args.get('start_date')} {request.args.get('end_date')}")
    trends_data = pytrends.interest_over_time().reset_index().to_dict(orient='list')
    return jsonify(trends_data)

@main.route('/api/news', methods=['GET'])
def get_news():
    keywords = request.args.get('keywords')
    api_key = 'YOUR_NEWSAPI_KEY'
    url = f'https://newsapi.org/v2/everything?q={keywords}&apiKey={api_key}'
    response = requests.get(url)
    return jsonify(response.json())
