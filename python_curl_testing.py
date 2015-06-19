import requests

'''Hypothesis: Must use sessions.'''

# Get me some actual cookies
session = requests.Session()
response = session.post('http://dining.illinoisstate.edu/NetNutrition/123/')
cookie = session.cookies.get_dict()
print("Made cookies... Mmm...")

# Now that we have cookies, request stuff WITH SESSION

# Step x-1: Request Watterson?
watterson = session.post('http://dining.illinoisstate.edu/NetNutrition/123/', data = 'unitOid=1', cookies = cookie)
print(watterson.text)

# Step x: Request Meal Station
data = session.post('http://dining.illinoisstate.edu/NetNutrition/123/Unit/SelectUnitFromChildUnitsList', data = 'unitOid=6', cookies = cookie)
print("Drinks Requested...")

print(data.text)

print("Finding 'Juice'...")
print(data.text.find('Juice'))

# Cookies now * DON'T * work.
