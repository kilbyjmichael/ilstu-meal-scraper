#!/usr/bin/python

'''
The requests are working now! I just need requests.sessions for cookies.

>>> response = requests.post('http://dining.illinoisstate.edu/NetNutrition/123')
>>> cookies = 'response.cookies'
'''

import requests

# Just in case we need a real refer url
refer_url = 'http://dining.illinoisstate.edu/NetNutrition/123'

# Use this stuff to request spesific buildings/places
build_url = 'http://dining.illinoisstate.edu/NetNutrition/123/Unit/SelectUnitFromUnitsList'
building_arg = 'unitOid=' # For both

# For internal places only
place_url = 'http://dining.illinoisstate.edu/NetNutrition/123/Unit/SelectUnitFromChildUnitsList'

# Use this stuff to request spesific meals
meal_url = 'http://dining.illinoisstate.edu/NetNutrition/123/Menu/SelectMenu'
meal_arg = 'menuOid='

building_codes = {# these are the nums for the places
                'waterson' : '1',
                'linkins'  : '16',
                'airport'  : '29',
                'bistro'   : '38'}

watterson_places = {# places to get food
                'homestyle' : '2',
                'freshbites': '3',          
                'yogurt'    : '4', # also inclueds ice cream/waffles
                'asian'     : '5',
                'drinks'    : '6',
                'grill'     : '7',
                'pizza'     : '8',
                'cereal'    : '9',
                'salad'     : '10',
                'texmex'    : '11',
                'fruit'     : '12',
                'bakery'    : '13',
                'gluten'    : '14',
                'deli'      : '15'}

def request_menu(url, param_type, number, cookies):
    return requests.post(url, data=param_type + number, cookies=cookies)

def init_cookies():
    return requests.post(refer_url).cookies
    
def test_request():
    cookie = init_cookies()
    data = request_menu(place_url, building_arg, watterson_places['drinks'], cookie)
    print(data.text)

def main():
    test_request()
    
if __name__ == "__main__": main()
