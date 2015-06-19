#!/usr/bin/python

'''
curl
'http://dining.illinoisstate.edu/NetNutrition/123/Unit/SelectUnitFromUnitsList'
-H 'Cookie: ASP.NET_SessionId=cpytigxe512ovl23qontshvj;'
--data 'unitOid=1'
'''

import requests
import simplejson

# Just in case we need a real refer url
refer_url = 'http://dining.illinoisstate.edu/NetNutrition/123'
TYPE = 'POST'

# Use this stuff to request spesific buildings/places
build_url = 'http://dining.illinoisstate.edu/NetNutrition/123/Unit/SelectUnitFromUnitsList'
building_arg = 'unitOid=' # For both

# For internal places only
place_url = 'http://dining.illinoisstate.edu/NetNutrition/123/Unit/SelectUnitFromChildUnitsList'

# Use this stuff to request spesific meals
meal_url = 'http://dining.illinoisstate.edu/NetNutrition/123/Menu/SelectMenu'
meal_arg = 'menuOid='

building_codes = {# these are the nums for the places
                'waterson' : 1
                'linkins'  : 16
                'airport'  : 29
                'bistro'   : 38}

waterson_places = {# places to get food
                'homestyle' : 2
                'freshbites': 3            
                'yogurt'    : 4 # also inclueds ice cream/waffles
                'asian'     : 5
                'drinks'    : 6
                'grill'     : 7
                'pizza'     : 8
                'cereal'    : 9
                'salad'     : 10
                'texmex'    : 11
                'fruit'     : 12
                'bakery'    : 13
                'gluten'    : 14
                'deli'      : 15}

def request_food(url, param_type, number)
    return requests.post(url, params=param_type + number)
